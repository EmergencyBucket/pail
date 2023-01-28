import ChallengeContainer from "@/components/ChallengeContainer";
import Page from "@/components/Page";
import { Challenge } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home() {

    const [ challenges, setChallenges ] = useState<Challenge[]>();

    async function getChallenges() {
        let req = await fetch(`/api/challenges`, {
            method: 'GET',
        })

        let res = await req.json();

        setChallenges(res);
    }

    useEffect(() => {
        getChallenges();
    }, [])

    return (
        <>
            <Page>
                {
                    challenges?.map((challenge) => (
                        <ChallengeContainer challenge={challenge} />
                    ))
                }
            </Page>
        </>
    )
}
