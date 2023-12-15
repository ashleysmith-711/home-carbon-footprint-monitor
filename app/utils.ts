import { DailySum, EnergyData } from "./types";


export const sumByDay = (data: EnergyData[]): Record<string, DailySum> => {
    const sumByDate: Record<string, DailySum> = {};

    data.forEach(item => {
        // Extract the date part from the timestamp
        const date = item.timestamp.split('T')[0];

        // Initialize the object for this date if it doesn't exist
        if (!sumByDate[date]) {
            sumByDate[date] = { date, energy_kwh: 0, carbon_co2_lbs: 0 };
        }

        // Add the current item's values to the sum
        sumByDate[date].energy_kwh += item.energy_kwh;
        sumByDate[date].carbon_co2_lbs += item.carbon_co2_lbs;
    });

    return sumByDate;
}

export const reformatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}
