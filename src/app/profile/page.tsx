"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CalendarIcon,
  Clock,
  Code2,
  GraduationCap,
  Target,
  Users2,
  Sparkles,
  Bookmark,
  Trophy,
  Lightbulb,
  BrainCircuit,
  Rocket,
  Timer,
  CheckCircle2,
  AlertCircle,
  Clock4
} from "lucide-react";
import { NoRoadmap } from "@/components/NoRoadmap";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useUser();
  const userId = user?.id;

  const allRoadmaps = useQuery(api.roadmaps.getUserRoadmaps, { userId: userId as Id<"users"> });
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<null | string>(null);

  const activeRoadmap = allRoadmaps?.find((roadmap) => roadmap.isActive);
  const currentRoadmap = selectedRoadmapId
    ? allRoadmaps?.find((roadmap) => roadmap._id === selectedRoadmapId)
    : activeRoadmap;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  const getSkillLevelColor = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'beginner':
        return 'bg-blue-500/20 text-blue-500';
      case 'intermediate':
        return 'bg-purple-500/20 text-purple-500';
      case 'advanced':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <ProfileHeader user={user} />

      {allRoadmaps && allRoadmaps?.length > 0 ? (
        <div className="space-y-8">
          {/* ROADMAP SELECTOR */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold tracking-tight">
                  <span className="text-primary">Your</span>{" "}
                  <span className="text-foreground">Learning Paths</span>
                </CardTitle>
                <Badge variant="outline" className="font-mono">
                  TOTAL: {allRoadmaps.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allRoadmaps.map((roadmap) => (
                  <Button
                    key={roadmap._id}
                    onClick={() => setSelectedRoadmapId(roadmap._id)}
                    variant={selectedRoadmapId === roadmap._id ? "default" : "outline"}
                    className={cn(
                      "relative group",
                      roadmap.isActive && "border-green-500/50"
                    )}
                  >
                    {roadmap.name}
                    {roadmap.isActive && (
                      <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-500">
                        ACTIVE
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ROADMAP DETAILS */}
          {currentRoadmap && (
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <CardTitle className="text-lg">
                    ROADMAP: <span className="text-primary">{currentRoadmap.name}</span>
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="details" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Learning Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Progress Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Rocket className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Learning Progress</span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(currentRoadmap.roadmapPlan.status)}>
                          {currentRoadmap.roadmapPlan.status.toUpperCase().replace('_', ' ')}
                        </Badge>
                      </div>
                      <Progress value={currentRoadmap.roadmapPlan.status === 'completed' ? 100 : currentRoadmap.roadmapPlan.status === 'in_progress' ? 50 : 0} />
                    </div>

                    {/* Goal Section */}
                    <Card>
                      <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">Learning Goal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {currentRoadmap.roadmapPlan.goal}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Schedule & Skill Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">Time Commitment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {currentRoadmap.roadmapPlan.schedule} per week
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">Skill Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className={getSkillLevelColor(currentRoadmap.roadmapPlan.skill)}>
                            {currentRoadmap.roadmapPlan.skill.toUpperCase()}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Deadline */}
                    <Card>
                      <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">Target Deadline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Clock4 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {currentRoadmap.roadmapPlan.deadline || 'Flexible Timeline'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6">
                    {/* Areas of Interest */}
                    <Card>
                      <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">Areas of Interest</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {currentRoadmap.roadmapPlan.interest.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Learning Preferences */}
                    <Card>
                      <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">Learning Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Preferred Styles</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentRoadmap.roadmapPlan.preferences?.style.map((style, index) => (
                              <Badge key={index} variant="outline" className="bg-secondary/10 text-secondary">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {currentRoadmap.roadmapPlan.preferences?.language && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Primary Language</h4>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {currentRoadmap.roadmapPlan.preferences.language}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Constraints */}
                    <Card>
                      <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">Learning Constraints</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {currentRoadmap.roadmapPlan.constraints?.map((constraint, index) => (
                            <Badge key={index} variant="outline" className="bg-background text-muted-foreground">
                              {constraint}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <NoRoadmap />
      )}
    </section>
  );
}