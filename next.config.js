/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ['cpu-features', 'ssh2', 'zlib_sync', 'discord.js'],
    },
    env: {
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        DISCORD_TOKEN: process.env.DISCORD_TOKEN,
        DOCKER_USERNAME: process.env.DOCKER_USERNAME,
        DOCKER_PASSWORD: process.env.DOCKER_PASSWORD,
        DATABASE_URL: process.env.DATABASE_URL,
        PORT: 80,
    }
}

module.exports = nextConfig
