/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,


    images: {
        unoptimized: true,

        remotePatterns: [
            {
        protocol: 'https',
        hostname: 'api.citydrivehire.com',
        port: '',
        pathname: '/**', // Allows all image paths from this host
      },
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "cdn.example.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/dxfefqgqf/image/upload/**",
            },
            
        ],
    },
};

export default nextConfig;
