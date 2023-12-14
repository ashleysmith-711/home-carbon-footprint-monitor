import styles from '../styles/dashboard.module.css';

const Leaderboard = () => {
    return (
        <div className={styles.container}>
            <h2 className='text-lg text-green-700'>Leaderboard:</h2>
            <ol className='list-decimal ml-5'>
                <li>Laura Xu: ____</li>
                <li>Luis Barrueco: ____</li>
                <li>Me: ____</li>
                <li>Steve: ____</li>
            </ol>
        </div>
    )
};

export default Leaderboard;