/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // optional: if deploying under a subpath like /myapp
  // basePath: '',

  // exposes API base URL to client (so axios can use process.env.NEXT_PUBLIC_API_BASE_URL)
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  },

  // enables SCSS imports globally (Next supports it natively)
  sassOptions: {
    includePaths: ['./styles'],
  },

  // optional: modern output and compression optimizations
  compress: true,
  swcMinify: true,
};

module.exports = nextConfig;
