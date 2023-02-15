import Image from 'next/image';

enum Statuses {
    Unsubmitted,
    Loading,
    Correct,
    Incorrect,
}

interface Props {
    status: Statuses;
}

const Status = ({ status }: Props) => {
    switch (status) {
        case Statuses.Unsubmitted: {
            return <></>;
        }
        case Statuses.Loading: {
            return (
                <Image
                    src="loading.svg"
                    alt="Loading"
                    className="mx-auto"
                    height={20}
                    width={20}
                />
            );
        }
        case Statuses.Correct: {
            return (
                <Image
                    src="correct.svg"
                    alt="Correct"
                    className="mx-auto"
                    height={20}
                    width={20}
                />
            );
        }
        case Statuses.Incorrect: {
            return (
                <Image
                    src="incorrect.svg"
                    alt="Incorrect"
                    className="mx-auto"
                    height={20}
                    width={20}
                />
            );
        }
    }
};

export { Status, Statuses };
