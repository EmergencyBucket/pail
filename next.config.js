/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ['cpu-features', 'ssh2'],
    },
}

module.exports = nextConfig
