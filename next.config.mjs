/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true
    },
    images: {
        domains: ['images.pexels.com', 'images.unsplash.com', 'cdn.example.com']
    },
    eslint: {
        ignoreDuringBuilds: true
    }
};

export default nextConfig;
