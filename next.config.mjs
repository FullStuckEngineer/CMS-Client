/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost'],
    },
    env: {
        NEXT_PUBLIC_BACKEND_PATH: process.env.NEXT_PUBLIC_BACKEND_PATH,
    },
};

export default nextConfig;  