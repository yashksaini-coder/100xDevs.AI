"use client";

import * as React from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, UserIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = React.useState(false);

  const NavLinks = () => (
    <React.Fragment>
      <Link
        href="/pricing"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Guide
      </Link>
      <Link
        href="/contact"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Pricing
      </Link>
    </React.Fragment>
  );

  return (
    <header className="fixed top-5 left-10 right-10 z-50 border-b border-border/5 bg-background/50 backdrop-blur-lg rounded-full">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between h-16 px-4 sm:px-6">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-semibold">
            100xDevs<span className="text-primary">.ai</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        {/* <nav className="hidden md:flex items-center justify-end-safe gap-8">
          <NavLinks />
        </nav> */}

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              >
                <Link href="/generate-roadmap">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
              >
                <Link href="/profile" className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
              >
                <Link href="/guide">Guide</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  Login
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start free →
                </Button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="md:hidden flex items-center gap-4">
          {isSignedIn && <UserButton />}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
                {isSignedIn ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                    >
                      <Link href="/generate-roadmap" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start text-muted-foreground hover:text-primary"
                    >
                      <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5">
                        <UserIcon className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <SignInButton>
                      <Button
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-primary justify-start"
                      >
                        Login
                      </Button>
                    </SignInButton>

                    <SignUpButton>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Start free →
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};