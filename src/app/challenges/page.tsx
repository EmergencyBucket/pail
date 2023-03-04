import ChallengeContainer from '@/components/ChallengeContainer';
import prisma from '@/lib/prismadb';

export const metadata = {
    title: 'EBucket | Challenges',
};

function exclude<Challenge, Key extends keyof Challenge>(
    challenge: Challenge,
    keys: Key[]
): Omit<Challenge, Key> {
    for (let key of keys) {
        delete challenge[key];
    }
    return challenge;
}

export default async function Home() {
    let challenges = await prisma.challenge.findMany();

    let challengesWithoutFlag = challenges.map((chall) =>
        exclude(chall, ['flag'])
    );

    return (
        <div className="grid grid-cols-4 gap-4 mt-8">
            {challengesWithoutFlag.map((challenge) => (
                <ChallengeContainer key={Math.random()} challenge={challenge} />
            ))}
        </div>
    );
}
