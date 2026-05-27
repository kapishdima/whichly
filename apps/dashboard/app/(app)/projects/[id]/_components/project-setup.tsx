import { highlight } from "@/lib/shiki";
import { Card, CardContent } from "@optio/ui/components/card";
import type { ReactNode } from "react";
import { CodeBlockCommand } from "../../../_components/code-block-command";
import { CodeBlock } from "../settings/_components/code-block";

interface ProjectSetupProps {
  projectId: string;
  projectName: string;
}

export async function ProjectSetup({ projectId, projectName }: ProjectSetupProps) {
  const providerCode = `import { OptioProvider } from "@optio/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <OptioProvider projectId="${projectId}">
      {children}
    </OptioProvider>
  );
}`;

  const blockCode = `import { Block, Variant } from "@optio/react";

export function Hero() {
  return (
    <Block name="hero">
      <Variant name="default">
        <h1>Build better with Optio</h1>
      </Variant>
      <Variant name="bold">
        <h1>Ship the right variant</h1>
      </Variant>
    </Block>
  );
}`;

  const [providerHtml, blockHtml] = await Promise.all([
    highlight(providerCode, "tsx"),
    highlight(blockCode, "tsx"),
  ]);

  const steps: { title: string; description: string; content: ReactNode }[] = [
    {
      title: "Install the React SDK",
      description: "Add @optio/react to your app.",
      content: <CodeBlockCommand packageName="@optio/react" />,
    },
    {
      title: "Wrap your app with OptioProvider",
      description: "Drop the provider into your root layout — it wires this project's variants.",
      content: <CodeBlock code={providerCode} html={providerHtml} label="Provider snippet" />,
    },
    {
      title: "Mark blocks and their variants",
      description:
        "Wrap any section you want to A/B preview in <Block>. Each <Variant> becomes a toggle in the live picker your client sees.",
      content: <CodeBlock code={blockCode} html={blockHtml} label="Block usage" />,
    },
  ];

  return (
    <section className="flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-balance text-2xl font-semibold tracking-tight">Set up {projectName}</h2>
        <p className="max-w-[60ch] text-pretty text-sm text-muted-foreground">
          Three steps to start collecting feedback. Once your client submits a review, it lands
          here.
        </p>
      </header>

      <ol role="list" className="flex flex-col gap-8">
        {steps.map((step, idx) => (
          <li key={step.title}>
            <div className="flex items-start gap-4">
              <div
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-sm font-semibold tabular-nums text-primary"
              >
                {idx + 1}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-pretty text-base font-medium">{step.title}</h3>
                <p className="max-w-[60ch] text-pretty text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            <div className="sm:pl-12 mt-4">{step.content}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
