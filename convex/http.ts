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

// Simplified validation: accept AI output, ensure arrays, minimal coercion
function validateRoadmapPlan(roadmap: any) {
  // Helper to ensure value is array of strings
  const ensureStringArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(String);
    if (typeof val === "string") return [val];
    return [];
  };

  // Preferences
  let preferences = undefined;
  if (roadmap.preferences) {
    preferences = {
      style: ensureStringArray(roadmap.preferences.style),
      language: typeof roadmap.preferences.language === "string" ? roadmap.preferences.language : undefined,
    };
  }

  // Milestones
  let milestones = undefined;
  if (Array.isArray(roadmap.milestones)) {
    milestones = roadmap.milestones.map((m: any) => ({
      title: m.title ?? "",
      description: m.description ?? "",
      duration: m.duration ?? "",
      resources: ensureStringArray(m.resources),
      checkpoints: ensureStringArray(m.checkpoints),
      projects: ensureStringArray(m.projects),
      status: m.status ?? "pending",
    }));
  }

  return {
    goal: roadmap.goal ?? "",
    skill: roadmap.skill ?? "beginner",
    schedule: ensureStringArray(roadmap.schedule),
    interest: ensureStringArray(roadmap.interest),
    deadline: roadmap.deadline ?? undefined,
    constraints: ensureStringArray(roadmap.constraints),
    preferences,
    status: roadmap.status ?? "new",
    milestones,
    estimatedCompletion: roadmap.estimatedCompletion ?? undefined,
    successMetrics: ensureStringArray(roadmap.successMetrics),
  };
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

      const roadmapPrompt = `You are a 100xDevs AI Assistant, an expert in creating personalized learning roadmaps. Your task is to generate a JSON object for a learning roadmap that strictly follows the schema below.\n\nLEARNER PROFILE:\n- Goal: ${validatedData.goal}\n- Current Skill Level: ${validatedData.skill}\n- Available Time: ${validatedData.schedule.join(", ")} per week\n- Areas of Interest: ${validatedData.interest.join(", ")}\n- Target Deadline: ${validatedData.deadline || "Flexible"}\n- Learning Constraints: ${validatedData.constraints.length > 0 ? validatedData.constraints.join(", ") : "None"}\n- Learning Preferences: ${validatedData.preferences?.style?.join(", ") || ""}\n- Preferred Language: ${validatedData.preferences?.language || "English"}\n\nREQUIREMENTS:\n1. Create a structured learning path with clear, measurable milestones.\n2. Each milestone must include: title, description, duration, resources (array), checkpoints (array), projects (array), and status (pending, in_progress, or completed).\n3. Include both theoretical and practical components.\n4. Provide specific resources and learning materials.\n5. Set realistic timeframes for each milestone.\n6. Include assessment checkpoints.\n7. Suggest projects or exercises for hands-on learning.\n8. Consider the learner's constraints and preferences.\n9. Include alternative resources for different learning styles.\n10. Set an estimatedCompletion (string, e.g. '3 months', or ISO date).\n11. Provide a successMetrics array (strings) for how the learner will know they've succeeded.\n\nCRITICAL SCHEMA INSTRUCTIONS:\n- Your output MUST follow this EXACT structure.\n- All fields must be present and properly typed.\n- Do NOT add any extra fields.\n- Provide concrete, actionable, and specific items.\n- Use valid JSON.\n\nReturn a JSON object with this structure:\n{\n  "goal": "${validatedData.goal}",\n  "skill": "${validatedData.skill}",\n  "schedule": "${validatedData.schedule.join(", ")}",\n  "interest": ${JSON.stringify(validatedData.interest)},\n  "deadline": "${validatedData.deadline || ""}",\n  "constraints": ${JSON.stringify(validatedData.constraints)},\n  "preferences": {\n    "style": ${JSON.stringify(validatedData.preferences?.style || [])},\n    "language": "${validatedData.preferences?.language || "English"}"\n  },\n  "status": "new",\n  "milestones": [\n    {\n      "title": "string",\n      "description": "string",\n      "duration": "string",\n      "resources": ["string"],\n      "checkpoints": ["string"],\n      "projects": ["string"],\n      "status": "pending"\n    }\n  ],\n  "estimatedCompletion": "string",\n  "successMetrics": ["string"]\n}\n\nDO NOT add any fields outside this structure. Your response must be a valid JSON object.`;

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