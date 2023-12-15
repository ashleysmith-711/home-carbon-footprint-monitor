import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';
import { reformatDate, sumByDay } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle } from 'recharts';
import { DailySum } from '../types';
import NotesModal from './NotesModal';

interface UsageGraphProps {
    customerId: number;
}

const UsageVisualizations = ({ customerId }: UsageGraphProps) => {
    const [data, setData] = useState<DailySum[]>([]);
    const [emissionsPastWeek, setEmissionsPastWeek] = useState<number | null>(null);

    const [notesModalDate, setNotesModalDate] = useState('');
    const [notesDate, setNotesDate] = useState('');
    const [notes, setNotes] = useState(''); // TODO: Get notes from DB for date [notesDate
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leaderboard, buildLeaderboard]  = useState([]);

    useEffect(() => {
        const getCustomerEnergyData = async () => {
            console.log('Fetching data for customer:', customerId);
            const url = `/api/energy-data`;
            // const url = `/api/energy-data?customer_id=${customerId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // TODO: Send param if we get real data for each customer in the DB returning values
                // body: JSON.stringify({ customer_id: customerId }),
            });
            const carbonData = await response.json();
            setData(Object.values(sumByDay(carbonData)));
        };

        getCustomerEnergyData();
    }, [customerId]);

    useEffect(() => {
        const last7DayEmissions = data.reduce((prev, curr) => {
            return prev + curr.carbon_co2_lbs;
        }, 0)
        console.log({ last7DayEmissions })
        setEmissionsPastWeek(last7DayEmissions);
    }, [data]);

    useEffect(() => {
        const getNotesData = async () => {
            setNotes('');
            if (!notesDate) return;
            console.log('Fetching notes for date:', notesDate);
            try {
                const url = `/api/notes?customer_id=${customerId}&note_date=${notesDate}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const result = await response.json();
                setNotes(result.note)
                console.log('___GetNOtesData result', result.note);
            } catch (err) {
                console.error('Error fetching note:', err);
            }

        };

        getNotesData();
    }, [notesDate]);

    const handleBarClick = (data: DailySum, index: number) => {
        console.log("Bar clicked:", data, "at index", index);
        setNotesModalDate(data.date);
        setIsModalOpen(true);
    };

    const handleShowNotes = (...props: any[]) => {
        const date = props[0].value as string; // i.e. "2023-12-11"
        setNotesDate(date);
    }

    return (
        <div className={`${styles.container} mt-3 w-fit`}>
            <NotesModal isOpen={isModalOpen} setOpen={setIsModalOpen} date={notesModalDate} customerId={customerId} />
            <h2 className='text-xl text-green-700 mb-3 mt-3'>Energy Usage and CO2 Emissions over the last week:</h2>

            <div className='grid-cols-2'>

                <div className="flex">
                    <div className="flex-1 text-gray-100 text-center bg-pink-800 px-4 py-2 m-2 rounded-lg">
                        <p><b>My total Emissions (last 7 days):</b></p>
                        <p className='text-6xl mt-10'>{emissionsPastWeek ? emissionsPastWeek.toFixed(3) : 'Loading...'} lbs CO2</p>
                    </div>
                    <div className="flex-1 text-gray-100 bg-green-700 px-4 py-2 m-2 ml-8 rounded-lg">
                        <p className='mb-2'><b>LEADERBOARD</b></p>
                        <ol className='list-decimal  border-solid border-2 border-text-gray-100 p-2 pl-8'>
                            <li>Laura Xu (8.22 lbs CO2)</li>
                            <li>Luis Barrueco (9.15 lbs CO2)</li>
                            <li>James Gordey (9.99 lbs CO2)</li>
                            <li>Steve Jackson (10.5 lbs CO2)</li>
                            <li>Ashley Smith (11.11 lbs CO2)</li>
                        </ol>
                        <p className="mt-2 text-grey-100">You didn't made the leaderboard with CO2 emissions of {emissionsPastWeek?.toFixed(3)}. <a href="#" target='_blank' className='text-yellow-300'>Click here</a> to read tips on how to lower your emissions without sacrificing quality of life</p>
                    </div>

                </div>
            </div>
            <div>
                <h3 className='text-lg text-green-700 mb-3 mt-3'>Chart showing CO2 lbs and kwh consumed per day:</h3>
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
                {notesDate && (<div className="bg-gray-200 p-8 rounded-lg">
                    <p><b>Notes for {reformatDate(notesDate)}</b></p>
                    <p>{notes ? notes : 'No notes saved for this date'}</p>
                </div>)}
            </div>
        </div>
    );
};

export default UsageVisualizations;
