import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase Server Actions body size limit to allow larger uploads from server actions
  serverActions: {
    // Accept values like '50mb' — adjust as needed.
    bodySizeLimit: '50mb',
  },
};

export default nextConfig;
