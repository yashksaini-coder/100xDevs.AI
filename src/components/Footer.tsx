"use client";

import { ArrowUp, Calendar } from "lucide-react";
import Link from "next/link";
export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full md:mt-40 mt-20 bg-background/80 border-t border-l border-r backdrop-blur-sm shadow-2xl rounded-t-3xl py-16 px-4 md:px-8">
      <div className="">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold leading-none text-primary">
              100xDevs.ai
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
            One AI. Endless Possibilities – All in One Place
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-primary-background px-4 py-3 rounded-xl border">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Next Release</p>
              <p className="text-xs text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full bg-border border-dashed h-px my-3"></div>

        {/* Bottom section with socials and copyright */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} 100xDevs. All rights reserved.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="absolute md:right-8 right-5 md:top-36 top-[9.5rem] flex items-center justify-center w-14 h-14 md:rounded-lg rounded-full bg-primary-background border border-border hover:bg-muted transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-7 w-7 text-muted-foreground" />
          </button>
        </div>

        {/* Build in public credit and links */}
        <div className="md:mt-8 mt-4 text-xs md:text-sm text-muted-foreground flex md:flex-row flex-col md:gap-0 gap-2 items-center justify-between">
          <div className="space-y-2">
            <p>
              Build in public by{" "}
              <a
                href="https://x.com/yash_k_saini"
                className="text-primary font-medium hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                @yash_k_saini
              </a>
            </p>
            <div className="flex items-center gap-2">
              {[
                {
                  href: "#",
                  name: "Contact",
                },
                {
                  href: "#",
                  name: "Refund & Cancellation",
                },
                {
                  href: "#",
                  name: "Terms",
                },
                {
                  href: "#",
                  name: "Privacy",
                },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="border-b border-dashed text-muted-foreground hover:text-foreground transition-colors duration-150 hover:border-foreground text-xs"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 md:ml-8">
            <span className="font-medium">Connect:</span>
            {[
              { href: "https://github.com/yashksaini-coder", name: "GitHub" },
              { href: "https://twitter.com/yash_k_saini", name: "Twitter" },
              { href: "https://linkedin.com/in/yashksaini-coder", name: "LinkedIn" },
              { href: "https://instagram.com/yashksaini.codes", name: "Instagram" },
            ].map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span>{social.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
