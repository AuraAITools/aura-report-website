/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return {
      // if request does not match any existing routes provided by nextjs, send request to external backend
      fallback: [
        {
          source: "/api/:path*",
          destination: `${process.env.REPORT_SERVICE_URL}/api/v1/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
