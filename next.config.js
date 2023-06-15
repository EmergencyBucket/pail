/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
            pathname: '/u/**',
        }]
    },
    reactStrictMode: false,
    experimental: {
        appDir: true,
        serverActions: true,
        serverComponentsExternalPackages: ['cpu-features', 'ssh2', 'zlib_sync', 'discord.js'],
    },
}

module.exports = nextConfig
