import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import NextAuth, { NextAuthOptions } from 'next-auth';
import prisma from '@/lib/prismadb';

const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            return {
                ...session,
                user: user,
            };
        },
    },
    session: {
        strategy: 'jwt',
    },
    //@ts-ignore
    site: process.env.NEXTAUTH_URL,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
