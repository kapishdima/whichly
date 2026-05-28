import { codeToHtml } from "shiki";

export function highlight(code: string, lang = "tsx") {
  return codeToHtml(code, {
    lang,
    theme: "github-dark-default",
  });
}
