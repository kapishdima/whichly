import "server-only";
import { type Highlighter, createHighlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  highlighterPromise ||= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "html"],
  });
  return highlighterPromise;
}

export async function highlight(code: string, lang: "tsx" | "html") {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
