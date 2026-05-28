import { join } from "node:path";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Pin the workspace root: a stray lockfile in a parent directory otherwise
  // makes Next infer the wrong root in this monorepo.
  turbopack: {
    root: join(import.meta.dirname, "..", ".."),
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
