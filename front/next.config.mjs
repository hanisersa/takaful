/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
  },
  // Ensure serverless compatibility
  serverExternalPackages: ['mongoose', 'bcryptjs'],
};

export default nextConfig;
