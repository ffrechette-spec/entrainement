declare module "next-pwa" {
  import type { NextConfig } from "next";

  type PwaPlugin = (config: NextConfig) => NextConfig;

  export default function withPWA(options: Record<string, unknown>): PwaPlugin;
}
