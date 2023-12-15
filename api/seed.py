import pandas as pd
from sqlmodel import Session, delete
from sqlalchemy import text

from .db import engine
from .models import CarbonData, EnergyData


def load_sample_energy_data(customer_id: str = "123", utility: str = "PGE"):
    with Session(engine) as session:
        session.execute(
            text(
                "DELETE FROM energydata where customer_id=:customer_id and utility=:utility",
            ),
            {"customer_id": customer_id, "utility": utility},
        )
        """
        building_url = "https://oedi-data-lake.s3.amazonaws.com/nrel-pds-building-stock/end-use-load-profiles-for-us-building-stock/2022/resstock_amy2018_release_1.1/timeseries_aggregates/by_state/upgrade=0/state=CA/up00-ca-single-family_detached.csv"
        df_loadshape[['timestamp','out.electricity.total.energy_consumption.kwh']].to_csv('sample_energy.csv',index=False)
        """
        df_loadshape = pd.read_csv("sample_energy.csv")
        df_loadshape["utc_time"] = (
            pd.to_datetime(df_loadshape["timestamp"])
            .dt.tz_localize("Etc/GMT+5")
            .dt.tz_convert("UTC")
        )
        for row in (
            df_loadshape[["utc_time", "out.electricity.total.energy_consumption.kwh"]]
            .dropna()
            .to_dict("records")
        ):
            new_record = EnergyData(
                customer_id=customer_id,
                utility=utility,
                timestamp=row["utc_time"],
                energy_kwh=row["out.electricity.total.energy_consumption.kwh"],
            )
            session.add(new_record)

        # Commit the transaction
        session.commit()


def load_carbon_data(balancing_authority: str = "CISO"):
    balancing_authority = "CISO"

    with Session(engine) as session:
        session.execute(
            text(
                "DELETE FROM carbondata where balancing_authority=:balancing_authority",
            ),
            {"balancing_authority": balancing_authority},
        )
        """
        df_ba = pd.read_excel(
            f"https://www.eia.gov/electricity/gridmonitor/knownissues/xls/{balancing_authority}.xlsx"
        )
        """
        df_ba = pd.read_csv("ciso.csv")
        df_ba["UTC time"] = pd.to_datetime(df_ba["UTC time"])
        for row in (
            df_ba[["UTC time", "CO2 Emissions Intensity for Consumed Electricity"]]
            .dropna()
            .to_dict("records")
        ):
            new_record = CarbonData(
                balancing_authority=balancing_authority,
                timestamp=row["UTC time"],
                carbon_intensity_co2_lbs_per_kwh=row[
                    "CO2 Emissions Intensity for Consumed Electricity"
                ],
            )
            session.add(new_record)

        # Commit the transaction
        session.commit()
