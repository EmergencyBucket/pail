import { getServerSession } from 'next-auth';
import { Button } from './Button';

const Navbar = async () => {
    const session = await getServerSession();

    return (
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full place-items-center mb-4">
            <Button variant={'subtle'} link="/" className="w-full text-center">
                <code className="text-xl font-medium">Home</code>
            </Button>

            <Button
                variant={'subtle'}
                link="/challenges"
                className="w-full text-center"
            >
                <code className="text-xl font-medium">Challenges</code>
            </Button>

            <Button
                variant={'subtle'}
                link="/rankings"
                className="w-full text-center"
            >
                <code className="text-xl font-medium">Rankings</code>
            </Button>

            {session && (
                <Button
                    variant={'subtle'}
                    link="/account"
                    className="w-full text-center"
                >
                    <code className="text-xl font-medium">
                        {session.user?.name as string}
                    </code>
                </Button>
            )}

            <Button
                variant={'subtle'}
                className="w-full text-center"
                link={session ? '/api/auth/signout' : '/api/auth/signin'}
            >
                <code className="text-xl font-medium">
                    {session ? 'Sign out' : 'Sign in'}
                </code>
            </Button>
        </div>
    );
};

export default Navbar;
