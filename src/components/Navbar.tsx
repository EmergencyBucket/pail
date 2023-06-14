import { Button } from './Button';
import { getUser } from '@/lib/Utils';

const Navbar = async () => {
    const user = await getUser();

    return (
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full place-items-center mb-4">
            <Button
                variant={'subtle'}
                link="/"
                linkClassName="w-full"
                className="w-full text-center"
            >
                <code className="text-xl font-medium">Home</code>
            </Button>

            <Button
                variant={'subtle'}
                link="/challenges"
                linkClassName="w-full"
                className="w-full text-center"
            >
                <code className="text-xl font-medium">Challenges</code>
            </Button>

            <Button
                variant={'subtle'}
                link="/rankings"
                linkClassName="w-full"
                className="w-full text-center"
            >
                <code className="text-xl font-medium">Rankings</code>
            </Button>

            {user && (
                <Button
                    variant={'subtle'}
                    link="/account"
                    linkClassName="w-full"
                    className="w-full text-center"
                >
                    <code className="text-xl font-medium">
                        {user.name as string}
                    </code>
                </Button>
            )}

            {user?.admin && (
                <Button
                    variant={'subtle'}
                    link="/admin"
                    linkClassName="w-full"
                    className="w-full text-center"
                >
                    <code className="text-xl font-medium">Admin</code>
                </Button>
            )}

            <Button
                variant={'subtle'}
                linkClassName="w-full"
                className="w-full text-center"
                link={user ? '/api/auth/signout' : '/api/auth/signin'}
            >
                <code className="text-xl font-medium">
                    {user ? 'Sign out' : 'Sign in'}
                </code>
            </Button>
        </div>
    );
};

export default Navbar;
