import { signIn, signOut, useSession } from 'next-auth/react';
import Button from './Button';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <div className="flex gap-4 w-full place-items-center">
            <Button link="/">{<>Home</>}</Button>

            <Button link="/challenges">{<>Challenges</>}</Button>

            <Button link="/rankings">{<>Rankings</>}</Button>

            {session && (
                <Button link="/account">{<>{session?.user?.name}</>}</Button>
            )}

            <Button onClick={() => (session ? signOut() : signIn('github'))}>
                {session ? 'Sign out' : 'Sign in'}
            </Button>
        </div>
    );
};

export default Navbar;
