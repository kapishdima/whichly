import { Github, Twitter } from "lucide-react";

const GITHUB_URL = "https://github.com/kapishdima/whichly";
const TWITTER_URL = "https://twitter.com/whichly";

const footerLinks = [
  { name: "How it works", href: "#how-it-works" },
  { name: "FAQ", href: "#faq" },
  { name: "GitHub", href: GITHUB_URL },
];

export const SiteFooter = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-md bg-gradient-to-br from-sky-400 to-violet-500" />
          <span className="text-base font-semibold tracking-tight">Whichly</span>
          <span className="text-muted-foreground ml-3 text-sm">MIT licensed. Open source.</span>
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
              href={TWITTER_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Whichly on Twitter"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="size-5" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Whichly on GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
