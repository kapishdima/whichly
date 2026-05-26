"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@optio/ui/components/tabs";
import type { ReactNode } from "react";

interface SettingsTabsProps {
  mainContent: ReactNode;
  embedContent: ReactNode;
}

export function SettingsTabs({ mainContent, embedContent }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="main" className="gap-6">
      <TabsList variant="line" className="border-b">
        <TabsTrigger value="main">Main</TabsTrigger>
        <TabsTrigger value="embed">Embed</TabsTrigger>
      </TabsList>
      <TabsContent value="main" className="flex flex-col gap-6">
        {mainContent}
      </TabsContent>
      <TabsContent value="embed" className="flex flex-col gap-6">
        {embedContent}
      </TabsContent>
    </Tabs>
  );
}
