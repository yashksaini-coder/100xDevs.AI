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
  Clock,
  Code2,
  GraduationCap,
  Target,
  Rocket,
  Timer,
  AlertCircle,
  CheckCircle2,
  Trophy,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { NoRoadmap } from "@/components/NoRoadmap";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useUser();
  const userId = user?.id as string;

  const allRoadmaps = useQuery(api.roadmaps.getUserRoadmaps, { userId });
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<null | string>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());

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

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneId)) {
        newSet.delete(milestoneId);
      } else {
        newSet.add(milestoneId);
      }
      return newSet;
    });
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

                    {/* Estimated Completion */}
                    {currentRoadmap.roadmapPlan.estimatedCompletion && (
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">Estimated Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <span className="text-sm text-muted-foreground">
                            {currentRoadmap.roadmapPlan.estimatedCompletion}
                          </span>
                        </CardContent>
                      </Card>
                    )}

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
                          <div className="flex items-center gap-2 flex-wrap">
                            <Timer className="h-4 w-4 text-muted-foreground" />
                            {Array.isArray(currentRoadmap.roadmapPlan.schedule) && currentRoadmap.roadmapPlan.schedule.length > 0 ? (
                              currentRoadmap.roadmapPlan.schedule.map((entry: string, idx: number) => (
                                <span key={idx} className="text-sm text-muted-foreground mr-2">
                                  {entry} per week
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">No schedule specified</span>
                            )}
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
                            {Array.isArray(currentRoadmap.roadmapPlan.preferences?.style) && currentRoadmap.roadmapPlan.preferences?.style.length > 0 ? (
                              currentRoadmap.roadmapPlan.preferences.style.map((style, index) => (
                                <Badge key={index} variant="outline" className="bg-secondary/10 text-secondary">
                                  {style}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No style preferences specified</span>
                            )}
                          </div>
                        </div>
                        {currentRoadmap.roadmapPlan.preferences?.language ? (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Primary Language</h4>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {currentRoadmap.roadmapPlan.preferences.language}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No language preference specified</span>
                        )}
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

                    {/* Learning Constraints */}
                    {currentRoadmap.roadmapPlan.constraints && currentRoadmap.roadmapPlan.constraints.length > 0 && (
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">Learning Constraints</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {currentRoadmap.roadmapPlan.constraints.map((constraint, index) => (
                              <Badge key={index} variant="outline" className="bg-background text-muted-foreground">
                                {constraint}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Milestones */}
                    {currentRoadmap.roadmapPlan.milestones && currentRoadmap.roadmapPlan.milestones.length > 0 ? (
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                          <Trophy className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">Learning Milestones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {currentRoadmap.roadmapPlan.milestones.map((milestone: any, index: number) => {
                            const isExpanded = expandedMilestones.has(milestone.title);
                            return (
                              <div key={index} className="border-l-2 border-primary pl-4">
                                <button
                                  onClick={() => toggleMilestone(milestone.title)}
                                  className="w-full flex items-center gap-2 hover:bg-muted/50 p-2 rounded-md transition-colors"
                                >
                                  <div className="flex-1 flex items-center gap-2">
                                    <CheckCircle2 className={cn(
                                      "h-4 w-4",
                                      milestone.status === 'completed' ? 'text-green-500' : 
                                      milestone.status === 'in_progress' ? 'text-blue-500' : 'text-muted-foreground'
                                    )} />
                                    <h4 className="font-medium">{milestone.title}</h4>
                                    <Badge variant="outline" className="ml-auto">
                                      {milestone.duration}
                                    </Badge>
                                    <Badge variant="secondary" className={getStatusColor(milestone.status) + " ml-2"}>
                                      {milestone.status.toUpperCase().replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                                {isExpanded && (
                                  <div className="mt-2 pl-6 space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                      {milestone.description || <span className="text-xs text-muted-foreground">No description</span>}
                                    </p>
                                    {milestone.resources && milestone.resources.length > 0 ? (
                                      <div>
                                        <h5 className="text-xs font-medium mb-1">Resources:</h5>
                                        <div className="flex flex-wrap gap-1">
                                          {milestone.resources.map((resource: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                              {resource}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">No resources</span>
                                    )}
                                    {milestone.checkpoints && milestone.checkpoints.length > 0 ? (
                                      <div>
                                        <h5 className="text-xs font-medium mb-1">Checkpoints:</h5>
                                        <ul className="space-y-1">
                                          {milestone.checkpoints.map((checkpoint: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2">
                                              <CheckCircle2 className="h-3 w-3 text-primary mt-1" />
                                              <span className="text-xs">{checkpoint}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">No checkpoints</span>
                                    )}
                                    {milestone.projects && milestone.projects.length > 0 ? (
                                      <div>
                                        <h5 className="text-xs font-medium mb-1">Projects:</h5>
                                        <ul className="space-y-1">
                                          {milestone.projects.map((project: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2">
                                              <Code2 className="h-3 w-3 text-primary mt-1" />
                                              <span className="text-xs">{project}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">No projects</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    ) : (
                      <span className="text-xs text-muted-foreground">No milestones specified</span>
                    )}

                    {/* Success Metrics */}
                    {currentRoadmap.roadmapPlan.successMetrics && currentRoadmap.roadmapPlan.successMetrics.length > 0 && (
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                          <Target className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">Success Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {currentRoadmap.roadmapPlan.successMetrics.map((metric: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                                <span className="text-sm">{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
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