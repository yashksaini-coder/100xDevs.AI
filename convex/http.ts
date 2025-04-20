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
  // Helper function to safely convert to array and clean values
  const safeArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .filter(item => typeof item === "string" && item.trim() !== "")
        .map(item => item.trim());
    }
    if (typeof value === "string") {
      return value
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");
    }
    return [];
  };

  // Helper function to validate and normalize skill level
  const validateSkill = (skill: string): "beginner" | "intermediate" | "advanced" => {
    const normalizedSkill = (skill || "").toLowerCase();
    if (["beginner", "intermediate", "advanced"].includes(normalizedSkill)) {
      return normalizedSkill as "beginner" | "intermediate" | "advanced";
    }
    return "beginner";
  };

  // Helper function to validate and normalize schedule
  const validateSchedule = (schedule: string): "<2h" | "2-5h" | "5-10h" | "10+h" => {
    const normalizedSchedule = (schedule || "").toLowerCase();
    if (["<2h", "2-5h", "5-10h", "10+h"].includes(normalizedSchedule)) {
      return normalizedSchedule as "<2h" | "2-5h" | "5-10h" | "10+h";
    }
    return "<2h";
  };

  // Helper function to validate and normalize status
  const validateStatus = (status: string): "new" | "in_progress" | "completed" => {
    const normalizedStatus = (status || "").toLowerCase();
    if (["new", "in_progress", "completed"].includes(normalizedStatus)) {
      return normalizedStatus as "new" | "in_progress" | "completed";
    }
    return "new";
  };

  const validatedRoadmap = {
    goal: typeof roadmap.Goal === "string" && roadmap.Goal.trim() !== "" 
      ? roadmap.Goal.trim() 
      : "Learn and master new skills",
    skill: validateSkill(roadmap.Skill),
    schedule: validateSchedule(roadmap.Time),
    interest: safeArray(roadmap.Interests).length > 0 
      ? safeArray(roadmap.Interests) 
      : ["General Learning"],
    deadline: typeof roadmap.Deadline === "string" && roadmap.Deadline.trim() !== "" 
      ? roadmap.Deadline.trim() 
      : undefined,
    constraints: safeArray(roadmap.Constraints),
    preferences: {
      style: safeArray(roadmap.Preferences).length > 0 
        ? safeArray(roadmap.Preferences) 
        : ["Self-paced", "Hands-on"],
      language: typeof roadmap.Language === "string" && roadmap.Language.trim() !== "" 
        ? roadmap.Language.trim() 
        : "English"
    },
    status: validateStatus(roadmap.Status)
  };

  return validatedRoadmap;
}

http.route({
  path: "/vapi/generate-roadmap",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();
      console.log("Payload is here:", payload);

      // Validate and transform the input data
      const validatedData = validateRoadmapPlan(payload);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001",
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          responseMimeType: "application/json",
        },
      });

      const roadmapPrompt = `You are a 100xDevs AI Assistant, an expert in creating personalized learning roadmaps. Create a detailed roadmap based on:

LEARNER PROFILE:
- Goal: ${validatedData.goal}
- Current Skill Level: ${validatedData.skill}
- Available Time: ${validatedData.schedule} per week
- Areas of Interest: ${validatedData.interest.join(", ")}
- Target Deadline: ${validatedData.deadline || "Flexible"}
- Learning Constraints: ${validatedData.constraints.length > 0 ? validatedData.constraints.join(", ") : "None"}
- Learning Preferences: ${validatedData.preferences.style.join(", ")}
- Preferred Language: ${validatedData.preferences.language}

ROADMAP REQUIREMENTS:
1. Create a structured learning path with clear milestones
2. Include both theoretical and practical components
3. Provide specific resources and learning materials
4. Set realistic timeframes for each milestone
5. Include assessment checkpoints
6. Suggest projects or exercises for hands-on learning
7. Consider the learner's constraints and preferences
8. Include alternative resources for different learning styles

CRITICAL SCHEMA INSTRUCTIONS:
- Your output MUST follow this EXACT structure
- All fields must be properly typed and validated
- Include specific, actionable items
- Provide concrete resources and references
- Set clear, measurable milestones

Return a JSON object with this structure:
{
  "goal": "${validatedData.goal}",
  "skill": "${validatedData.skill}",
  "schedule": "${validatedData.schedule}",
  "interest": ${JSON.stringify(validatedData.interest)},
  "deadline": "${validatedData.deadline || ""}",
  "constraints": ${JSON.stringify(validatedData.constraints)},
  "preferences": {
    "style": ${JSON.stringify(validatedData.preferences.style)},
    "language": "${validatedData.preferences.language}"
  },
  "status": "${validatedData.status}",
  "milestones": [
    {
      "title": "string",
      "description": "string",
      "duration": "string",
      "resources": ["string"],
      "checkpoints": ["string"],
      "projects": ["string"]
    }
  ],
  "estimatedCompletion": "string",
  "successMetrics": ["string"]
}

DO NOT add any fields outside this structure. Your response must be a valid JSON object.`;

      const roadmapResult = await model.generateContent(roadmapPrompt);
      const roadmapText = roadmapResult.response.text();
      console.log("Roadmap text is here:", roadmapText);
      // VALIDATE THE INPUT COMING FROM AI
      let roadmap = JSON.parse(roadmapText);
      roadmap = validateRoadmapPlan(roadmap);
      console.log("Roadmap is here:", roadmap);
      // save to our DB: CONVEX
      const roadmapId = await ctx.runMutation(api.roadmaps.createRoadmap, {
        userId: payload.user_id,
        roadmapPlan: roadmap,
        isActive: true,
        name: `${validatedData.goal} Roadmap - ${new Date().toLocaleDateString()}`,
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