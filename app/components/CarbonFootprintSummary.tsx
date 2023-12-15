import styles from '../styles/dashboard.module.css';

const CarbonFootprintSummary = () => {
    return (
        <div className={styles.container}>
            <h2 className='text-lg text-green-700'>My Carbon Footprint</h2>
            <p>This week: ____ </p>
            <p>This month: ____ </p>
            <p>This year: ____ </p>
        </div>
    )
};

export default CarbonFootprintSummary;