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
            schedule: v.union(
                v.literal("<2h"),
                v.literal("2-5h"),
                v.literal("5-10h"),
                v.literal("10+h")
            ),
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
        }),
        isActive: v.boolean(),
    }).index("by_user_id", ["userId"]).index("by_active", ["isActive"]),
});


