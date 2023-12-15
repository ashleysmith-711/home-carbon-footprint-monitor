import CarbonFootprintSummary from "../components/CarbonFootprintSummary";
import Leaderboard from "../components/Leaderboard";
import UsageGraph from "../components/UsageGraph";
import UserInfo from "../components/UserInfo"

interface DashboardProps {
    customerId: number;
}
const Dashboard = ({customerId}: DashboardProps) => {
    console.log('customerId', customerId); // potentially query param
    return (
        <div>
            <h1 className="text-3xl text-green-700 mb-6">Energy Journal Dashboard</h1>
            <div className="grid-cols-3 flex gap-3">
                <UserInfo />
                <CarbonFootprintSummary />
                <Leaderboard />
            </div>
            <UsageGraph />
        </div>
        
    )
}

export default Dashboard;