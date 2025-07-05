"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { guideContent } from "@/data/guideContent";
import Image from "next/image";
import { 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Code, 
  Target, 
  Users, 
  Shield,
  Brain,
  Zap,
  TrendingUp,
  Clock,
  Heart,
  Lightbulb,
  Award,
  X
} from "lucide-react";

interface GuideProps {
  title?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

// Feature icons mapping
const featureIcons = {
  "AI-Powered Learning Assistant": Brain,
  "Interactive Roadmap Generation": Target,
  "Real-time Code Analysis": Code,
  "Progress Tracking": TrendingUp,
  "Personalized Study Plans": Clock,
  "Community Integration": Users,
  "Practice Problem Generator": Lightbulb,
  "Resource Recommendations": BookOpen,
  "Career Guidance": Award,
  "24/7 Learning Support": Heart
};

export default function Guide({ title = "Guide", size }: GuideProps) {
  const [guideData] = React.useState(guideContent);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="relative overflow-hidden group bg-gradient-to-r from-[var(--metallic-blue)]/10 to-[var(--neon-cyan)]/10 border-[var(--metallic-blue)]/20 text-[var(--neon-cyan)] hover:text-[var(--neon-blue)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--neon-cyan)]/25 hover:bg-gradient-to-r hover:from-[var(--metallic-blue)]/20 hover:to-[var(--neon-cyan)]/20" 
          variant="outline" 
          size={size}
        >
          <BookOpen className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          {title}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--metallic-blue)]/20 to-[var(--neon-cyan)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[33vw] min-w-[700px] max-w-[1200px] overflow-y-auto bg-gradient-to-b from-[var(--metal-darker)]/95 to-[var(--metal-gray)]/95 backdrop-blur-xl border-[var(--cyber-line-color)] [&>button]:hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--metallic-blue)]/5 via-[var(--neon-cyan)]/5 to-[var(--neon-blue)]/5 animate-pulse" />
        
        {/* Header Section */}
        <SheetHeader className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <SheetTitle>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--metallic-blue)] to-[var(--neon-cyan)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--neon-cyan)]/25">
                    <Sparkles className="w-6 h-6 text-[var(--neon-white)] animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-blue)] rounded-full animate-bounce" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--metallic-blue)] to-[var(--neon-blue)] bg-clip-text text-transparent">
                    100xDevs AI
                  </h1>
                  <SheetDescription className="text-[var(--cyber-text-muted)] font-medium text-sm">
                    Modern AI TA for 100xDevs, to help get started in your coding journey.
                  </SheetDescription>
                </div>
              </div>
            </SheetTitle>
            
            {/* Close Button */}
            <SheetClose asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="group relative h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--metal-gray)]/80 to-[var(--metal-darker)]/80 border border-[var(--cyber-line-color)] hover:border-[var(--neon-cyan)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--neon-cyan)]/25 hover:bg-gradient-to-br hover:from-[var(--metallic-blue)]/10 hover:to-[var(--neon-cyan)]/10"
              >
                <X className="w-5 h-5 text-[var(--cyber-text-muted)] group-hover:text-[var(--neon-cyan)] transition-colors duration-300" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-8 relative z-10">
          {/* Features Section */}
          <Section 
            title={guideData.features.title} 
            icon={<Zap className="w-5 h-5" />}
            gradient="from-[var(--metallic-blue)]/20 to-[var(--neon-cyan)]/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guideData.features.content.map((item, index) => {
                const IconComponent = featureIcons[item.feature as keyof typeof featureIcons] || Code;
                return (
                  <FeatureCard 
                    key={index} 
                    feature={item.feature}
                    description={item.description}
                    icon={<IconComponent className="w-5 h-5" />}
                    delay={index * 100}
                  />
                );
              })}
            </div>
          </Section>

          {/* Step by Step Guide */}
          <Section 
            title={guideData.stepByStepGuide.title}
            icon={<Target className="w-5 h-5" />}
            gradient="from-[var(--neon-cyan)]/20 to-[var(--neon-blue)]/20"
          >
            <div className="space-y-6">
              {guideData.stepByStepGuide.steps.map((item, index) => (
                <StepCard 
                  key={index}
                  step={item.step}
                  description={item.description}
                  details={item.details}
                  stepNumber={index + 1}
                  delay={index * 150}
                />
              ))}
            </div>
            
            {/* Image Gallery */}
            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold text-[var(--cyber-text-bright)] flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-[var(--neon-cyan)]" />
                Visual Guide
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ImageCard
                  title="Learning Page"
                  src={guideData.stepByStepGuide.landingPage}
                  alt="Learning Page"
                />
                <ImageCard
                  title="AI Call interface"
                  src={guideData.stepByStepGuide.callAssistant}
                  alt="AI Call Interface"
                />
              </div>
            </div>
          </Section>

          {/* FAQ Section */}
          <Section 
            title={guideData.securityFaq.title}
            icon={<Shield className="w-5 h-5" />}
            gradient="from-[var(--metallic-blue)]/20 to-[var(--metallic-steel)]/20"
          >
            <div className="space-y-3">
              {guideData.securityFaq.faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  question={faq.question} 
                  answer={faq.answer}
                  delay={index * 100}
                />
              ))}
            </div>
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Enhanced Section Component
function Section({
  title,
  children,
  icon,
  gradient
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-30`} />
      
      <div className="relative bg-[var(--cyber-terminal-bg)] backdrop-blur-sm rounded-2xl border border-[var(--cyber-line-color)] p-6 shadow-2xl">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-[var(--metallic-blue)]/20 to-[var(--neon-cyan)]/20 rounded-lg border border-[var(--metallic-blue)]/30">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-[var(--cyber-text-bright)]">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

// Enhanced Feature Card Component
function FeatureCard({ 
  feature, 
  description, 
  icon, 
  delay 
}: { 
  feature: string; 
  description: string; 
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--metal-gray)]/80 to-[var(--metal-darker)]/80 backdrop-blur-sm border border-[var(--cyber-line-color)] p-4 hover:border-[var(--neon-cyan)]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[var(--neon-cyan)]/25 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--metallic-blue)]/10 to-[var(--neon-cyan)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start space-x-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-[var(--metallic-blue)]/20 to-[var(--neon-cyan)]/20 rounded-lg border border-[var(--metallic-blue)]/30 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="font-semibold text-[var(--cyber-text-bright)] group-hover:text-[var(--neon-cyan)] transition-colors duration-300">
            {feature}
          </h3>
        </div>
        <p className="text-sm text-[var(--cyber-text-muted)] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// Enhanced Step Card Component
function StepCard({ 
  step, 
  description, 
  details, 
  stepNumber,
  delay 
}: { 
  step: string; 
  description: string; 
  details: string; 
  stepNumber: number;
  delay: number;
}) {
  return (
    <div 
      className="group flex gap-4 p-4 rounded-xl bg-gradient-to-r from-[var(--metal-gray)]/60 to-[var(--metal-darker)]/60 backdrop-blur-sm border border-[var(--cyber-line-color)] hover:border-[var(--neon-blue)]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[var(--neon-blue)]/25"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--metallic-blue)] text-[var(--metal-dark)] rounded-full flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
            {stepNumber}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-blue)] rounded-full opacity-0 group-hover:opacity-20 scale-150 transition-all duration-300" />
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-[var(--cyber-text-bright)] group-hover:text-[var(--neon-cyan)] transition-colors duration-300">
          {step}
        </h3>
        <p className="text-sm text-[var(--cyber-text-muted)]">
          {description}
        </p>
        <p className="text-xs text-[var(--cyber-text-dim)] leading-relaxed">
          {details}
        </p>
      </div>
    </div>
  );
}

// Enhanced Image Card Component
function ImageCard({
  title,
  src,
  alt
}: {
  title: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-[var(--cyber-terminal-bg)] backdrop-blur-sm border border-[var(--cyber-line-color)] p-4 hover:border-[var(--neon-cyan)]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[var(--neon-cyan)]/25">
      <h4 className="font-semibold text-[var(--cyber-text-bright)] mb-3 group-hover:text-[var(--neon-cyan)] transition-colors duration-300">
        {title}
      </h4>
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--metal-darker)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}

// Enhanced FAQ Item Component
function FAQItem({ 
  question, 
  answer, 
  delay 
}: { 
  question: string; 
  answer: string;
  delay: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="group border border-[var(--cyber-line-color)] rounded-xl bg-gradient-to-r from-[var(--metal-gray)]/60 to-[var(--metal-darker)]/60 backdrop-blur-sm hover:border-[var(--neon-cyan)]/50 transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        className="w-full p-4 text-left flex items-center justify-between hover:bg-[var(--metallic-steel)]/30 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-sm md:text-base text-[var(--cyber-text-bright)] group-hover:text-[var(--neon-cyan)] transition-colors duration-300">
          {question}
        </span>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-[var(--neon-cyan)] transform transition-transform duration-300" />
          ) : (
            <ChevronRight className="h-5 w-5 text-[var(--cyber-text-muted)] group-hover:text-[var(--neon-cyan)] transition-colors duration-300" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm md:text-base text-[var(--cyber-text-muted)] animate-in slide-in-from-top-2 duration-300">
          <div 
            dangerouslySetInnerHTML={{ __html: answer }} 
            className="prose prose-invert prose-sm max-w-none [&>strong]:text-[var(--neon-cyan)] [&>strong]:font-semibold"
          />
        </div>
      )}
    </div>
  );
}