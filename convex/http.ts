import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";

const http = httpRouter();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } = evt.data;

      const email = email_addresses[0].email_address;

      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.updateUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
      } catch (error) {
        console.log("Error updating user:", error);
        return new Response("Error updating user", { status: 500 });
      }
    }

    return new Response("Webhooks processed successfully", { status: 200 });
  }),
});


// validate and fix workout plan to ensure it has proper numeric types
function validateRoadmapPlan(roadmap: any) {
  const validatedRoadmap = {
    goal: typeof roadmap.goal === "string" ? roadmap.goal : "",
    skill: ["beginner", "intermediate", "advanced"].includes(roadmap.skill) ? roadmap.skill : "beginner",
    schedule: ["<2h", "2-5h", "5-10h", "10+h"].includes(roadmap.schedule) ? roadmap.schedule : "<2h",
    interest: Array.isArray(roadmap.interest) ? roadmap.interest.filter((i: any) => typeof i === "string") : [],
    deadline: typeof roadmap.deadline === "string" ? roadmap.deadline : undefined,
    constraints: Array.isArray(roadmap.constraints) ? roadmap.constraints.filter((c: any) => typeof c === "string") : undefined,
    preferences: roadmap.preferences ? {
      style: Array.isArray(roadmap.preferences.style) ? roadmap.preferences.style.filter((s: any) => typeof s === "string") : [],
      language: typeof roadmap.preferences.language === "string" ? roadmap.preferences.language : undefined,
    } : undefined,
    status: ["new", "in_progress", "completed"].includes(roadmap.status) ? roadmap.status : "new",
  };
  return validatedRoadmap;
}

http.route({
  path: "/vapi/generate-roadmap",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();

      const {
        user_id,
        goal,
        skill,
        schedule,
        interest,
        deadline,
        constraints,
        preferences,
      } = payload;

      console.log("Payload is here:", payload);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001", // use the latest model
        generationConfig: {
          temperature: 0.4, // lower temperature for more predictable outputs
          topP: 0.9, // use topP for more diverse outputs
          responseMimeType: "application/json",
        },
      });

      const roadmapPrompt = `You are a 100xDevs AI Assistant. You are tasked with creating a personalized roadmap based on:
      Goal: ${goal}
      Skill level: ${skill}
      Available schedule: ${schedule}
      Interests: ${interest.join(", ")}
      Deadline: ${deadline || "No deadline specified"}
      Constraints: ${constraints ? constraints.join(", ") : "None"}
      Preferences: ${preferences ? JSON.stringify(preferences) : "None"}
      
      As a professional planner:
      - Design a roadmap that aligns with the user's goal and skill level
      - Consider the user's schedule and interests to make the roadmap engaging
      - Respect any constraints and preferences provided by the user
      - Ensure the roadmap is achievable and realistic within the given constraints
      - Include a mix of technical and non-technical topics to keep the learning experience balanced
      - Provide clear milestones and checkpoints to track progress
      - Offer resources and references for further learning
      
      CRITICAL SCHEMA INSTRUCTIONS:
      - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
      - Ensure all fields are correctly typed and structured
      - The roadmap should be a list of topics or resources that the user can learn
      - Each topic should have a name, description, and a link to a resource
      - NEVER include strings for numerical fields
      - NEVER add extra fields not shown in the example below
      
      Return a JSON object with this EXACT structure:
      {
        "goal": "${goal}",
        "skill": "${skill}",
        "schedule": "${schedule}",
        "interest": ["Interest1", "Interest2"],
        "deadline": "${deadline}",
        "constraints": ["Constraint1", "Constraint2"],
        "preferences": {
          "style": ["Style1", "Style2"],
          "language": "Language"
        },
        "status": "new"
      }
      
      DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

      const roadmapResult = await model.generateContent(roadmapPrompt);
      const roadmapText = roadmapResult.response.text();

      // VALIDATE THE INPUT COMING FROM AI
      let roadmap = JSON.parse(roadmapText);
      roadmap = validateRoadmapPlan(roadmap);

      // save to our DB: CONVEX
      const roadmapId = await ctx.runMutation(api.roadmaps.createRoadmap, {
        userId: user_id,
        roadmapPlan: roadmap,
        isActive: true,
        name: `${goal} Roadmap - ${new Date().toLocaleDateString()}`,
      });

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            roadmapId,
            roadmap,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error generating roadmap:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});



export default http;