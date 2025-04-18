import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  Code2,
  Sparkles,
  Users,
  Clock,
  GraduationCap,
  Target,
  Calendar,
} from "lucide-react";
import { USER_ROADMAPS } from "@/lib/constant";

const UserPrograms = () => {
  return (
    <div className="w-full pb-24 pt-16 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* HEADER- PROGRAM GALLERY */}
        {/* <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden mb-16">
          {/* HEADER BAR 
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="text-sm text-primary font-medium">Learning Paths</span>
            </div>
            <div className="text-sm text-muted-foreground">Featured Roadmaps</div>
          </div>

          {/* HEADER CONTENT 
          <div className="p-8 text-center">
          </div>
        </div> */}

        {/* Program cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {USER_ROADMAPS.map((program) => (
            <Card
              key={program.userId}
              className="group bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-border bg-background/70">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs md:text-sm text-primary">USER.{program.userId}</span>
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {program.roadmapPlan.skill.toUpperCase()}
                </div>
              </div>
              <CardHeader className="pt-4 md:pt-6 px-3 md:px-5">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="h-12 md:h-16 w-12 md:w-16 rounded-full overflow-hidden border border-border bg-primary/5 flex items-center justify-center">
                    <Code2 className="h-6 md:h-8 w-6 md:w-8 text-primary/60" />
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl text-foreground">
                      {program.name}
                      <span className="text-primary">.dev</span>
                    </CardTitle>
                    <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1 md:gap-2 mt-1">
                      <Clock className="h-3 md:h-4 w-3 md:w-4" />
                      {program.roadmapPlan.schedule}/week
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-2 md:gap-4">
                  <div className="px-2 md:px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs md:text-sm text-primary flex items-center gap-1 md:gap-2">
                    <Target className="h-3 md:h-4 w-3 md:w-4" />
                    {program.roadmapPlan.interest[0]}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1 md:gap-2">
                    <Calendar className="h-3 md:h-4 w-3 md:w-4" />
                    {program.roadmapPlan.deadline ? new Date(program.roadmapPlan.deadline).getFullYear() : 'Flexible'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 md:px-5">
                <div className="space-y-3 md:space-y-5 pt-2">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="p-1 md:p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      <GraduationCap className="h-4 md:h-5 w-4 md:w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-foreground">Learning Goal</h3>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        {program.roadmapPlan.goal}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="p-1 md:p-2 rounded-md bg-secondary/10 text-secondary mt-0.5">
                      <Users className="h-4 md:h-5 w-4 md:w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-foreground">Learning Style</h3>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        {program.roadmapPlan.preferences.style.join(" • ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="p-1 md:p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      <Code2 className="h-4 md:h-5 w-4 md:w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-foreground">Primary Language</h3>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        {program.roadmapPlan.preferences.language}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-border">
                  <div className="flex gap-1 md:gap-2 flex-wrap">
                    {program.roadmapPlan.constraints.map((constraint, index) => (
                      <span
                        key={index}
                        className="px-1 md:px-2 py-0.5 md:py-1 bg-background rounded-md text-xs text-muted-foreground border border-border"
                      >
                        {constraint}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-3 md:px-5 py-3 md:py-4 border-t border-border">
                <Link href={`/roadmap/${program.userId}`} className="w-full">
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:shadow-lg transition-all duration-300"
                  >
                    View Learning Path
                    <ChevronRight className="ml-1 md:ml-2 h-3 md:h-4 w-3 md:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <Link href="/generate-roadmap">
            <Button
              size="lg"
              className="relative group overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium rounded-xl"
            >
              Generate Your Learning Path
              <Sparkles className="ml-2 h-5 w-5" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4">
            Join 500+ developers with AI-customized learning paths
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPrograms;