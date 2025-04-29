import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
    
export const createRoadmap = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    roadmapPlan: v.object({
      goal: v.string(),
      skill: v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced")
      ),
      schedule: v.array(v.string()),
      interest: v.array(v.string()),
      deadline: v.optional(v.string()),
      constraints: v.optional(v.array(v.string())),
      preferences: v.optional(
        v.object({
          style: v.array(v.string()),
          language: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const activePlans = await ctx.db
      .query("roadmaps")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    const planId = await ctx.db.insert("roadmaps", args);

    return planId;
  },
});

export const getUserRoadmaps = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const roadmaps = await ctx.db
      .query("roadmaps")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return roadmaps;
  },
});