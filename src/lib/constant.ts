export const USER_ROADMAPS = [
  {
    userId: "100xDevs",
    name: "100xDevs",
    roadmapPlan: {
      goal: "Transitioning into tech for better career flexibility.",
      skill: "beginner",
      schedule: "2-5h",
      interest: ["Web Development", "UI/UX Design"],
      deadline: "2025-08-01", // ISO format
      constraints: ["Free", "Beginner Friendly"],
      preferences: {
        style: ["Video-based", "Project-based"],
        language: "JavaScript",
      },
      status: "in_progress",
    },
    isActive: true,
  },
  {
    userId: "Rahul",
    name: "Rahul",
    roadmapPlan: {
      goal: "Build portfolio projects to land a full-stack role.",
      skill: "intermediate",
      schedule: "5-10h",
      interest: ["Full Stack Development", "Backend APIs", "Cloud Deployment"],
      deadline: "2025-06-30",
      constraints: ["Paid", "No Prerequisites"],
      preferences: {
        style: ["Project-based", "Interactive"],
        language: "TypeScript",
      },
      status: "in_progress",
    },
    isActive: true,
  },
  {
    userId: "Ankita",
    name: "Ankita",
    roadmapPlan: {
      goal: "Stay up to date and sharpen dev skills while working.",
      skill: "intermediate",
      schedule: "<2h",
      interest: ["AI & Machine Learning", "Data Science"],
      deadline: undefined,
      constraints: ["Free", "Low Bandwidth"],
      preferences: {
        style: ["Text-based", "Bootcamp Style"],
        language: "Python",
      },
      status: "new",
    },
    isActive: false,
  },
];
