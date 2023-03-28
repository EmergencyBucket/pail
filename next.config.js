/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ['cpu-features', 'ssh2', 'zlib_sync', 'discord.js'],
    },
}

module.exports = nextConfig
