import { Challenge } from "@prisma/client";
import Button from "./Button";

interface Props {
    challenge: Challenge;
}

const Challenge = ({challenge}: Props) => {
    return (
        <Button>
            {challenge.name}
        </Button>
    )
}

export default Challenge