'use client'

import { useEffect, useState } from "react";
import CarbonFootprintSummary from "../components/CarbonFootprintSummary";
import Leaderboard from "../components/Leaderboard";
import UsageGraph from "../components/UsageGraph";

const Dashboard = () => {
    const [customerId, setCustomerId] = useState<number | null>(null);

    useEffect(() => {
        const id = window && window.localStorage.getItem('customerId');
        console.log('localStorage customerId in Dashboard??!', id); // potentially query param
        setCustomerId(Number(id));
    }, [])
    return (
        <main className="flex min-h-screen flex-col p-24">
            <h1 className="text-3xl text-green-700 mb-6">Energy Journal Dashboard</h1>
            <div className="grid-cols-2 flex gap-3">
                <CarbonFootprintSummary />
                <Leaderboard />
            </div>
            {customerId && <UsageGraph customerId={customerId}/>}
        </main>
    )
}

export default Dashboard;