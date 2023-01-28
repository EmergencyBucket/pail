import { signIn, useSession } from "next-auth/react"
import Button from "./Button"

const Navbar = () => {
    
    const { data: session } = useSession()

    return (
        <>
            <Button link="/challenges">
                {
                    <>
                        Challenges
                    </>
                }
            </Button>

            <Button link="/account">
                {
                    <>
                        {session?.user?.name}
                    </>
                }
            </Button>

            <Button onClick={() => signIn()}>
                {
                    session ? 'Sign out' : 'Sign in'
                }
            </Button>
        </>
    )
}

export default Navbar