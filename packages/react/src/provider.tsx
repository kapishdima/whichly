import type { ReactNode } from "react";

const DEFAULT_CDN_URL = "https://cdn.optio.dev/optio.js";

export interface OptioProviderProps {
  projectId: string;
  cdnUrl?: string;
  children?: ReactNode;
}

export function OptioProvider({
  projectId,
  cdnUrl = DEFAULT_CDN_URL,
  children,
}: OptioProviderProps) {
  return (
    <>
      <script src={cdnUrl} data-project-id={projectId} async />
      {children}
    </>
  );
}
