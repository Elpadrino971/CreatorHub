/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com', // YouTube thumbnails
      },
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net', // Twitch
      },
      {
        protocol: 'https',
        hostname: '**.tiktokcdn.com', // TikTok
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com', // Instagram
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Clerk avatars
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
