"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Github, Menu, Twitter, X } from "lucide-react";
import Link from "next/link";
import React from "react";

const menuItems = [
  { name: "How it works", href: "#how-it-works" },
  { name: "FAQ", href: "#faq" },
];

export const SiteHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className={cn(
          "fixed z-50 w-full transition-all duration-300",
          isScrolled && "bg-background/75 border-b border-white/10 backdrop-blur-lg",
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0 lg:py-3">
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              <Link
                href="/"
                aria-label="Homepage"
                className="flex items-center text-lg font-semibold tracking-tight"
              >
                Whichly
              </Link>

              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close menu" : "Open menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="m-auto hidden size-fit lg:block">
                <ul className="flex gap-1" role="list">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        render={<Link href={item.href} className="text-base" />}
                        nativeButton={false}
                      >
                        <span>{item.name}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-2 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base" role="list">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Whichly on Twitter"
                  render={<Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer" />}
                  nativeButton={false}
                >
                  <Twitter />
                  <span
                    className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Whichly on GitHub"
                  render={<Link href={siteConfig.links.github} target="_blank" rel="noreferrer" />}
                  nativeButton={false}
                >
                  <Github />
                  <span
                    className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  size="sm"
                  render={<Link href={siteConfig.links.docs} target="_blank" rel="noreferrer" />}
                  nativeButton={false}
                >
                  <span>Get started</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
