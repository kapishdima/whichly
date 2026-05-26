import { highlight } from "@/lib/shiki";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@optio/ui/components/tabs";
import { CodeBlock } from "./code-block";

interface EmbedSnippetsProps {
  projectId: string;
}

export async function EmbedSnippets({ projectId }: EmbedSnippetsProps) {
  const reactCode = `import { OptioProvider } from "@optio/react";

export default function Layout({ children }) {
  return (
    <OptioProvider projectId="${projectId}">
      {children}
    </OptioProvider>
  );
}`;

  const htmlCode = `<script
  src="https://cdn.optio.dev/optio.js"
  data-project-id="${projectId}"
  async
></script>`;

  const [reactHtml, htmlHtml] = await Promise.all([
    highlight(reactCode, "tsx"),
    highlight(htmlCode, "html"),
  ]);

  return (
    <Tabs defaultValue="react" className="gap-3">
      <TabsList>
        <TabsTrigger value="react">React</TabsTrigger>
        <TabsTrigger value="html">HTML</TabsTrigger>
      </TabsList>
      <TabsContent value="react">
        <CodeBlock code={reactCode} html={reactHtml} label="React" />
      </TabsContent>
      <TabsContent value="html">
        <CodeBlock code={htmlCode} html={htmlHtml} label="HTML" />
      </TabsContent>
    </Tabs>
  );
}
