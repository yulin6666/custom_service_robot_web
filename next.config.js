/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 优化部署包大小
  output: 'standalone',
  // 配置环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig
