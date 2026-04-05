/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Agar sahifalar yuklanishida 404 muammosi bo'lsa, buni yoqib ko'r:
    trailingSlash: false, 
};

export default nextConfig;