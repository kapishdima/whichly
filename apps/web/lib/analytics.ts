"use client";

import { useOpenPanel } from "@openpanel/nextjs";
import { useCallback } from "react";

type AnalyticsEvents = {
  install_copied: { command: string };
};

export function useTrackEvent() {
  const op = useOpenPanel();

  return useCallback(
    <E extends keyof AnalyticsEvents>(
      event: E,
      ...args: AnalyticsEvents[E] extends Record<string, never>
        ? []
        : [AnalyticsEvents[E]]
    ) => {
      op.track(event, args[0] as Record<string, unknown> | undefined);
    },
    [op],
  );
}
