import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { scheduler } from "timers/promises";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        clerkId: v.string(),
    }).index("by_clerk_id", ["clerkId"]),

    roadmaps: defineTable({
        userId: v.string(),
        name: v.string(),
        roadmapPlan: v.object({
            goal: v.string(),              // Why they're learning to code
            skill: v.union(
                v.literal("beginner"),
                v.literal("intermediate"),
                v.literal("advanced")
            ),
            schedule: v.array(v.string()),
            interest: v.array(v.string()), // Areas like web, mobile, AI, etc.
            deadline: v.optional(v.string()), // e.g. "3 months", ISO date, etc.
            constraints: v.optional(v.array(v.string())), // Free/Paid, Accessibility, etc.
            preferences: v.optional(
                v.object({
                    style: v.array(v.string()), // e.g. video, project-based
                    language: v.optional(v.string()), // preferred programming language
                })
            ),
            status: v.union(
                v.literal("new"),
                v.literal("in_progress"),
                v.literal("completed")
            ),
            milestones: v.optional(
                v.array(
                    v.object({
                        title: v.string(),
                        description: v.string(),
                        duration: v.string(),
                        resources: v.array(v.string()),
                        checkpoints: v.array(v.string()),
                        projects: v.array(v.string()),
                        status: v.union(
                            v.literal("pending"),
                            v.literal("in_progress"),
                            v.literal("completed")
                        ),
                    })
                )
            ),
            estimatedCompletion: v.optional(v.string()),
            successMetrics: v.optional(v.array(v.string())),
        }),
        isActive: v.boolean(),
    }).index("by_user_id", ["userId"]).index("by_active", ["isActive"]),
});


