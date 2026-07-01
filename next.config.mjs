import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'res.cloudinary.com'
            },
            {
                protocol:'https',
                hostname:'images.unsplash.com'
            }
        ]
    },
    experimental:{
        serverActions: {
            bodySizeLimit: '20mb' // Set desired value here
        }
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            'mongoose': path.resolve(process.cwd(), './lib/mock-mongoose.ts'),
            '@clerk/nextjs/server': path.resolve(process.cwd(), './lib/mock-clerk-server.ts'),
            '@clerk/nextjs': path.resolve(process.cwd(), './lib/mock-clerk-client.tsx'),
        };
        return config;
    }
};

export default nextConfig;
