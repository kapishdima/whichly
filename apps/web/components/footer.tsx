import { siteConfig } from "@/lib/config";
import { Github, Twitter } from "lucide-react";

const footerLinks = [
  { name: "How it works", href: "#how-it-works" },
  { name: "FAQ", href: "#faq" },
  { name: "GitHub", href: siteConfig.links.github },
];

export const SiteFooter = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <p className="text-base font-semibold tracking-tight">Whichly</p>
          <p className="text-sm text-muted-foreground">MIT licensed. Open source.</p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <nav className="flex items-center gap-5">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Whichly on Twitter"
              className="relative text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="size-5" />
              <span
                className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                aria-hidden="true"
              />
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Whichly on GitHub"
              className="relative text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="size-5" />
              <span
                className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
