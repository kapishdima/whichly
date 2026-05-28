import { CopyButton } from "./copy-button";

const INSTALL = "npm i @whichly/react";

export function InstallationCode() {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-card bg-card/40 px-3 py-1.5 font-mono text-xs">
      <span className="text-muted-foreground">$</span>
      <span>{INSTALL}</span>
      <CopyButton text={INSTALL} size="icon-xs" variant="ghost" />
    </div>
  );
}
