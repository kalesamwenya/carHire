/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // The 'appDir' experimental flag is removed as it is now the default standard.
    images: {
        domains: ['images.pexels.com', 'images.unsplash.com', 'cdn.example.com']
    },
    eslint: {
        ignoreDuringBuilds: true
    }
};

export default nextConfig;