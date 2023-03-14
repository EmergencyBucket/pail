import styles from '@/styles/Glitch.module.css';

interface Props {
    text: string;
}

const Glitch = ({ text }: Props) => {
    return (
        <div className={styles.stack}>
            <code
                className={styles.glitch + ' text-white text-xl font-medium'}
                id={text}
            >
                {text}
            </code>
        </div>
    );
};

export default Glitch;
