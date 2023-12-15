import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';
import { sumByDay } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle } from 'recharts';
import { DailySum } from '../types';
import NotesModal from './NotesModal';

interface UsageGraphProps {
    customerId: number;
}

const UsageGraph = ({ customerId }: UsageGraphProps) => {
    const [data, setData] = useState<DailySum[]>([]);
    const [clickedDate, setClickedDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

    // const [notes, setNotes] = useState<string>([]);
    useEffect(() => {
        const getCustomerEnergyData = async () => {
            console.log('Fetching data for customer:', customerId);
            const url = `/api/energy-data`;
            // TODO: If we get real data for each customer in the DB returning values we can use this URL:
            // const url = `/api/energy-data?customer_id=${customerId}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const carbonData = await res.json();
            setData(Object.values(sumByDay(carbonData)));
        };

        getCustomerEnergyData();
    }, [customerId]); // Dependency array with customerId ensures this runs only when customerId changes

    const handleBarClick = (data: DailySum, index: number) => {
        console.log("Bar clicked:", data, "at index", index);
        setClickedDate(data.date);
        setIsModalOpen(true);
    };

    const handleShowNotes = (data: any, index: number) => {
        console.log("IN handleShowNotes - Date clicked??:", data, "at index", index);
        // setClickedDate(data.value);
        // setIsModalOpen(true);
    }

    return (
        <div className={`${styles.container} mt-3 w-fit`}>
            <NotesModal isOpen={isModalOpen} setOpen={setIsModalOpen} date={clickedDate} customerId={customerId}/>
            <h2 className='text-lg text-green-700 mb-3'>Energy Usage and CO2 Emissions over the last week:</h2>
            <div>
                <BarChart
                    width={800}
                    height={400}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" onClick={handleShowNotes} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="energy_kwh" fill="#fb923c" activeBar={<Rectangle fill="#ffa042" stroke="#e18336" />} onClick={handleBarClick} />
                    <Bar dataKey="carbon_co2_lbs" fill="#0369a1" activeBar={<Rectangle fill="#0373b1" stroke="#025e90" />} onClick={handleBarClick} />
                </BarChart>
            </div>
        </div>
    );
};

export default UsageGraph;
