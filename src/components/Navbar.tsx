import { signIn, useSession } from 'next-auth/react';
import Button from './Button';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <div className="flex gap-4 w-full place-items-center">
            <Button link="/">{<>Home</>}</Button>

            <Button link="/challenges">{<>Challenges</>}</Button>

            <Button link="/rankings">{<>Rankings</>}</Button>

            <Button link="/account">{<>{session?.user?.name}</>}</Button>

            <Button onClick={() => signIn()}>
                {session ? 'Sign out' : 'Sign in'}
            </Button>
        </div>
    );
};

export default Navbar;
