/** @type {import('next').NextConfig} */

/**
 * reverse proxy configurations
 * nextjs server will rewrite incoming requests from and proxy it to the API server
 */
const nextConfig = {
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
};

export default nextConfig;
