import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * Static build. `next build` writes a plain folder of HTML, CSS, JS and
   * images to /out — no Node server, no API routes, nothing to keep running.
   * Upload that folder to any web host, or serve it locally with
   * `npx serve out`.
   */
  output: "export",

  /**
   * sharp is used by lib/og.tsx to square the portraits on the About share
   * card. It is a native module: bundling it into the build output breaks
   * it, so it is required at run time from node_modules instead. Harmless
   * locally, where the bundler resolves it either way; it is the hosted
   * build that minds.
   */
  serverExternalPackages: ["sharp"],

  /** Every page becomes its own folder with an index.html inside. */
  trailingSlash: true,

  images: {
    /**
     * Image optimisation is a server feature, so a static build serves the
     * files in /public as they are. Keep source images sensibly sized.
     */
    unoptimized: true,
  },
};

export default nextConfig;
