import CarbonFootprintSummary from "./CarbonFootprintSummary";
import Leaderboard from "./Leaderboard";
import UsageChart from "./UsageChart";
import UserInfo from "./UserInfo"

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl text-green-700 mb-6">Energy Journal Dashboard</h1>
            <div className="grid-cols-3 flex gap-3">
                <UserInfo />
                <CarbonFootprintSummary />
                <Leaderboard />
            </div>
            <UsageChart />
        </div>
        
    )
}

export default Dashboard;