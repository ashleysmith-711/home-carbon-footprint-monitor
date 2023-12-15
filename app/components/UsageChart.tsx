import styles from '../styles/dashboard.module.css';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Friday',
        emissions: 4000,
        cost: 56,
    },
    {
        name: 'Saturday',
        emissions: 3200,
        cost: 40,
    },
    {
        name: 'Sunday',
        emissions: 4800,
        cost: 66,
    },
    {
        name: 'Monday',
        emissions: 3500,
        cost: 45,
    },
    {
        name: 'Tuesday',
        emissions: 2500,
        cost: 30,
    },
    {
        name: 'Wednesday',
        emissions: 3000,
        cost: 38,
    },
    {
        name: 'Thursday',
        emissions: 3500,
        cost: 45,
    },
];

const CustomTooltip = (props: any) => {
    
    const { active, payload, label } = props;
    console.log({ active, payload, label })
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${payload[0].value}`}</p>
                <p className="desc">Anything you want can be displayed here.</p>
            </div>
        );
    }

    return null;

}

const UsageChart = () => {

    return (
        <div className={`${styles.container} mt-3`}>
            <h2 className='text-lg text-green-700 mb-4'>Usage Chart:</h2>
            <div>
                <BarChart
                    width={800}
                    height={500}
                    data={data}
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
                    {/* <Tooltip content={<CustomTooltip />} /> */}
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="emissions" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                    <Bar dataKey="cost" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                </BarChart>
            </div>
        </div>
    )
}

export default UsageChart;