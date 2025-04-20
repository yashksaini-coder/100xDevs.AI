import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Corners } from "./Corners";

export const NoRoadmap = () => {
  return (
    <div className="relative backdrop-blur-sm border border-border rounded-lg p-10 text-center">
      <Corners />

      <h2 className="text-2xl font-bold mb-4 font-mono">
        <span className="text-primary">No</span> Roadmaps yet
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start by creating a personalized roadmap tailored to your specific goals and
        needs
      </p>
      <Button
        size="lg"
        asChild
        className="relative overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
      >
        <Link href="/generate-roadmap">
          <span className="relative flex items-center">
            Create Your First Roadmap
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </span>
        </Link>
      </Button>
    </div>
  );
};