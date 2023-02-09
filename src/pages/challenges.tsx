import ChallengeContainer from '@/components/ChallengeContainer';
import Page from '@/components/Page';
import { Challenge } from '@prisma/client';
import useSWR, { Fetcher } from 'swr';

const getChallenges: Fetcher<Challenge[]> = (url: string) =>
    fetch(url).then((r) => r.json());

export default function Home() {
    const challenges = useSWR(`/api/challenges`, getChallenges).data;

    return (
        <>
            <Page title="Challenges">
                <div className="grid grid-cols-4 gap-4 mt-8">
                    {challenges?.map((challenge) => (
                        <ChallengeContainer
                            challenge={challenge}
                            key={Math.random()}
                        />
                    ))}
                </div>
            </Page>
        </>
    );
}
