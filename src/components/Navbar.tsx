import { getServerSession } from 'next-auth';
import Button from './Button';
import Glitch from './Glitch';

const Navbar = async () => {
    const session = await getServerSession();

    return (
        <div className="flex gap-4 w-full place-items-center">
            <Button className='w-full text-center' link="/">{<Glitch text="Home" />}</Button>

            <Button className='w-full text-center' link="/challenges">{<Glitch text="Challenges" />}</Button>

            <Button className='w-full text-center' link="/rankings">{<Glitch text="Rankings" />}</Button>

            {session && (
                <Button className='w-full text-center' link="/account">
                    {<Glitch text={session.user?.name as string} />}
                </Button>
            )}

            <Button className='w-full text-center' link="/api/auth/signin">
                <Glitch text={session ? 'Sign out' : 'Sign in'} />
            </Button>
        </div>
    );
};

export default Navbar;
