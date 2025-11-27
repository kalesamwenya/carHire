/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        unoptimized: true, // optional if using <Image />
        // Merging your existing domains with the new ones to ensure Pexels images still load
        domains: [
            'images.pexels.com', 
            'images.unsplash.com', 
            'cdn.example.com', 
            'res.cloudinary.com'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dxfefqgqf/image/upload/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            }
        ],
    },
};

export default nextConfig;