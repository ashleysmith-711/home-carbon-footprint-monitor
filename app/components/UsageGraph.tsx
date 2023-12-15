import styles from '../styles/dashboard.module.css';
import { sumByDay } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle } from 'recharts';

const UsageGraph = async () => {
    // try {
        const carbonData = await fetch('/api/energy-data', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        })

        const data = await carbonData.json();
        const byDay = sumByDay(data)
        console.log('byDay??', byDay);
    // } catch (err) {
    //     console.log('Database error', err)
    // }
/**
 * 
export interface DailySum {
    date: string;
    energy_kwh: number;
    carbon_co2_lbs: number;
}
 */
    return (
        <div className={`${styles.container} mt-3`}>
            <h2 className='text-lg text-green-700'>Usage:</h2>
            <div>
            <BarChart
                width={800}
                height={500}
                data={Object.values(byDay)}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="energy_kwh" fill="#fb923c" activeBar={<Rectangle fill="#ffa042" stroke="#e18336"/>} />
                <Bar dataKey="carbon_co2_lbs" fill="#0369a1" activeBar={<Rectangle fill="#0373b1" stroke="#025e90" />} />
                </BarChart>
            </div>
        </div>
    )
}

export default UsageGraph;