import styles from '../styles/dashboard.module.css';

const UsageGraph = () => {
    return (
        <div className={`${styles.container} mt-3`}>
            <h2 className='text-lg text-green-700'>Usage Graph:</h2>
            <p>Graph goes here</p>
        </div>
    )
}

export default UsageGraph;