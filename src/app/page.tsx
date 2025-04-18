// import TerminalOverlay from "@/components/TerminalOverlay";
import { Button } from "@/components/ui/button";
import UserRoadmaps from "@/components/UserRoadmaps";
import { ArrowRightIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { ContainerTextFlipDemo } from "@/components/Acerternity/TextFlip";
const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4">
          {/* Background Gradient Effects */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center relative">
            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-8 relative z-10">
              {/* Gradient Text Effect */}
              <h1 className="font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-transparent">
                <div className="text-3xl md:text-4xl lg:text-5xl">
                  Learn to Code
                </div>
                <div className="text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  <ContainerTextFlipDemo />
                </div>
              </h1>

              {/* Glowing Separator */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl">
                Talk to our 100xDevs AI assistant and get personalized coding roadmaps & 
                exercises designed just for you, to help you get started in your coding journey.
              </p>

              {/* Enhanced Stats Section */}
              <div className="flex items-center gap-10 py-6 font-mono">
                <div className="flex flex-col">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">500+</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">xDevs</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">5 min</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Generation</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">100%</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Personalized</div>
                </div>
              </div>

              {/* Enhanced CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  asChild
                  className="relative group overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-4 md:py-6 text-lg font-medium rounded-xl"
                >
                  <Link href={"/generate-roadmap"} className="flex items-center font-mono">
                    Build Your Roadmap
                    <ArrowRightIcon className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-5 relative">
              {/* Enhanced Corner Pieces with Gradient */}
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/30" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/30" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30" />
              </div>

              {/* IMAGE CONTAINER */}
              <div className="relative aspect-square max-w-md md:max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-2xl bg-background/5 backdrop-blur-sm border border-primary/10">
                  <img
                    src="/ai_hero1.png"
                    alt="AI Learning Assistant"
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Enhanced Decorations */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full animate-pulse" />
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-gradient-to-t from-transparent via-primary/50 to-transparent" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <UserRoadmaps />
    </div>
  );
};
export default HomePage;