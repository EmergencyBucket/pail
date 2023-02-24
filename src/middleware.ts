export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/challenges', '/account', '/admin', '/rankings'],
};
