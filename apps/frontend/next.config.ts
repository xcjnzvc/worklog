import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  compiler: {
    // 모던 브라우저만 타겟
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@sentry/nextjs"],
  },
};

const sentryConfig = withSentryConfig(nextConfig, {
  org: "worklog-project",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,

  sourcemaps: {
    disable: false,
  },

  webpack: {
    automaticVercelMonitors: false,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

export default withBundleAnalyzer(sentryConfig);
