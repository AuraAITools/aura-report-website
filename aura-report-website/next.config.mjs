/** @type {import('next').NextConfig} */

/**
 * reverse proxy configurations
 * nextjs server will rewrite incoming requests from and proxy it to the API server
 */
const nextConfig = {
  output: "standalone", // creates minimal server during build (server.js) and only includes required deps. everything needed to run is in .next/standalone directory
  async rewrites() {
    return {
      // if request does not match any existing routes provided by nextjs, send request to external backend
      fallback: [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_REPORT_SERVICE_URL}/api/v1/:path*`,
        },
      ],
    };
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
