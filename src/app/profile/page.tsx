"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import { Corners } from "@/components/Corners";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  CalendarIcon,
  Clock,
  Code2,
  GraduationCap,
  Target,
  Users2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NoRoadmap } from "@/components/NoRoadmap";

export default function ProfilePage() {
  const { user } = useUser();
  const userId = user?.id as string;

  const allRoadmaps = useQuery(api.roadmaps.getUserRoadmaps, { userId });
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<null | string>(null);

  const activeRoadmap = allRoadmaps?.find((roadmap) => roadmap.isActive);

  const currentRoadmap = selectedRoadmapId
    ? allRoadmaps?.find((roadmap) => roadmap._id === selectedRoadmapId)
    : activeRoadmap;

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <ProfileHeader user={user} />

      {allRoadmaps && allRoadmaps?.length > 0 ? (
        <div className="space-y-8">
          {/* ROADMAP SELECTOR */}
          <div className="relative backdrop-blur-sm border border-border p-6 rounded-lg">
            <Corners />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                <span className="text-primary">Your</span>{" "}
                <span className="text-foreground">Learning Paths</span>
              </h2>
              <div className="font-mono text-xs text-muted-foreground">
                TOTAL: {allRoadmaps.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allRoadmaps.map((roadmap) => (
                <Button
                  key={roadmap._id}
                  onClick={() => setSelectedRoadmapId(roadmap._id)}
                  className={`text-foreground border hover:text-white ${
                    selectedRoadmapId === roadmap._id
                      ? "bg-primary/20 text-primary border-primary"
                      : "bg-transparent border-border hover:border-primary/50"
                  }`}
                >
                  {roadmap.name}
                  {roadmap.isActive && (
                    <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* ROADMAP DETAILS */}
          {currentRoadmap && (
            <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
              <Corners />

              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h3 className="text-lg font-bold">
                  ROADMAP: <span className="text-primary">{currentRoadmap.name}</span>
                </h3>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 w-full grid grid-cols-2 bg-background/70 border">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <Target className="mr-2 size-4" />
                    Overview
                  </TabsTrigger>

                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Learning Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-6">
                    {/* Goal Section */}
                    <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background/50">
                      <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                        <Target className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">Learning Goal</h3>
                        <p className="text-muted-foreground">
                          {currentRoadmap.roadmapPlan.goal}
                        </p>
                      </div>
                    </div>

                    {/* Schedule & Skill Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background/50">
                        <div className="p-2 rounded-md bg-secondary/10 text-secondary mt-0.5">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">Time Commitment</h3>
                          <p className="text-muted-foreground">
                            {currentRoadmap.roadmapPlan.schedule} per week
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background/50">
                        <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">Skill Level</h3>
                          <p className="text-muted-foreground capitalize">
                            {currentRoadmap.roadmapPlan.skill}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status & Deadline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background/50">
                        <div className="p-2 rounded-md bg-secondary/10 text-secondary mt-0.5">
                          <Users2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">Current Status</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              currentRoadmap.roadmapPlan.status === 'completed' 
                                ? 'bg-green-500/20 text-green-500'
                                : currentRoadmap.roadmapPlan.status === 'in_progress'
                                ? 'bg-blue-500/20 text-blue-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {currentRoadmap.roadmapPlan.status.toUpperCase().replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background/50">
                        <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">Target Deadline</h3>
                          <p className="text-muted-foreground">
                            {currentRoadmap.roadmapPlan.deadline || 'Flexible Timeline'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="space-y-6">
                    {/* Areas of Interest */}
                    <div className="p-4 border border-border rounded-lg bg-background/50">
                      <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        Areas of Interest
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentRoadmap.roadmapPlan.interest.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary border border-primary/20"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Learning Preferences */}
                    <div className="p-4 border border-border rounded-lg bg-background/50">
                      <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Learning Preferences
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm text-muted-foreground mb-2">Preferred Styles</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentRoadmap.roadmapPlan.preferences?.style.map((style, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-secondary/10 rounded text-xs text-secondary"
                              >
                                {style}
                              </span>
                            ))}
                          </div>
                        </div>
                        {currentRoadmap.roadmapPlan.preferences?.language && (
                          <div>
                            <h4 className="text-sm text-muted-foreground mb-2">Primary Language</h4>
                            <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary border border-primary/20">
                              {currentRoadmap.roadmapPlan.preferences.language}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Constraints */}
                    {currentRoadmap.roadmapPlan.constraints && (
                      <div className="p-4 border border-border rounded-lg bg-background/50">
                        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Learning Constraints
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {currentRoadmap.roadmapPlan.constraints.map((constraint, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-background rounded text-xs text-muted-foreground border border-border"
                            >
                              {constraint}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoRoadmap />
      )}
    </section>
  );
}