/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  compiler: { removeConsole: false },
  output: "standalone",
  env: { NEXT_DISABLE_LIGHTNINGCSS: "1" },
};

export default nextConfig;
