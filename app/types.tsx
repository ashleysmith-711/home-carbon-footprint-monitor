export type UserInfo = {
    name: string;
    address: string;
    energyProvider: 'PG&E'
}

export interface EnergyData {
    customer_id: string;
    timestamp: string;
    fuel_source: string;
    energy_kwh: number;
    carbon_co2_lbs: number;
}

export interface DailySum {
    date: string;
    energy_kwh: number;
    carbon_co2_lbs: number;
}