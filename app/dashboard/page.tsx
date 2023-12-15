'use client'

import { useEffect } from "react";
import CarbonFootprintSummary from "../components/CarbonFootprintSummary";
import Leaderboard from "../components/Leaderboard";
import UsageGraph from "../components/UsageGraph";
import UserInfo from "../components/UserInfo"
import { useRouter } from "next/router";

const Dashboard = () => {
    useEffect(() => {
        const id = window && window.localStorage.getItem('customerId');
        console.log('localStorage customerId in Dashboard??!', id); // potentially query param

    }, [])
    return (
        <main className="flex min-h-screen flex-col p-24">
            <h1 className="text-3xl text-green-700 mb-6">Energy Journal Dashboard</h1>
            <div className="grid-cols-3 flex gap-3">
                <UserInfo />
                <CarbonFootprintSummary />
                <Leaderboard />
            </div>
            <UsageGraph />
        </main>
    )
}

export default Dashboard;