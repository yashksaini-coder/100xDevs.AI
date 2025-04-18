"use client"

import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function ContainerTextFlipDemo() {
  const words = ["Better", "Smarter", "Faster",]
  return (
    <motion.h1
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      className={cn(
        "relative mb-4 max-w-2xl text-left text-3xl leading-normal font-bold tracking-tight text-zinc-300 md:text-7xl dark:text-zinc-100",
      )}
      layout
    >
      <div className="inline-block">
        100x <ContainerTextFlip words={words} textClassName="mb-2 text-4xl md:text-5xl lg:text-6xl text-primary" />
      </div>
    </motion.h1>
  );
}
