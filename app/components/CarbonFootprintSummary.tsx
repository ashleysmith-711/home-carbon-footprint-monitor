import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';
interface CarbonFootprintSummaryProps {
    customerId: number | null;
}
const CarbonFootprintSummary = ({ customerId }: CarbonFootprintSummaryProps) => {
    const [summary, setSummary] = useState({ week: 'Loading...', month: 'Loading...', year: 'Loading...' });

    return (
        <div className={styles.container}>
            <h2 className='text-lg text-green-700'>My Carbon Footprint</h2>
            <p>This week: {summary.week} lbs</p>
            <p>This month: {summary.month} lbs</p>
            <p>This year: {summary.year} lbs</p>
        </div>
    );
};

export default CarbonFootprintSummary;
