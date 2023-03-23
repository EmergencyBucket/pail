import { getServerSession } from 'next-auth';
import Button from './Button';

const Navbar = async () => {
    const session = await getServerSession();

    return (
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full place-items-center">
            <Button className="w-full text-center" link="/">
                <code className="text-xl font-medium">Home</code>
            </Button>

            <Button className="w-full text-center" link="/challenges">
                <code className="text-xl font-medium">Challenges</code>
            </Button>

            <Button className="w-full text-center" link="/rankings">
                <code className="text-xl font-medium">Rankings</code>
            </Button>

            {session && (
                <Button className="w-full text-center" link="/account">
                    <code className="text-xl font-medium">
                        {session.user?.name as string}
                    </code>
                </Button>
            )}

            <Button className="w-full text-center" link="/api/auth/signin">
                <code className="text-xl font-medium">
                    {session ? 'Sign out' : 'Sign in'}
                </code>
            </Button>
        </div>
    );
};

export default Navbar;
