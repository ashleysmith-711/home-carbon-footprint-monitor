import pandas as pd
from sqlmodel import Session, delete
from sqlalchemy import text

from db import engine
from models import CarbonData
import typer

cli = typer.Typer()


@cli.command()
def load_sample_energy_data(customer_id: str = "123"):
    with Session(engine) as session:
        session.execute(
            text(
                "DELETE FROM energydata where customer_id=:customer_id",
            ),
            {"customer_id": customer_id},
        )
        session.commit()
        upgrade = "1"
        state = "CA"
        building_id = 281
        base_url_1_1 = "https://oedi-data-lake.s3.amazonaws.com/nrel-pds-building-stock/end-use-load-profiles-for-us-building-stock/2022/resstock_amy2018_release_1.1/"
        building_url = f"{base_url_1_1}timeseries_individual_buildings/by_state/upgrade={upgrade}/state={state}/{building_id}-{upgrade}.parquet"
        df_loadshape = pd.read_parquet(building_url)
        breakpoint()


@cli.command()
def load_carbon_data(balancing_authority: str = "CISO"):
    balancing_authority = "CISO"

    with Session(engine) as session:
        session.execute(
            text(
                "DELETE FROM carbondata where balancing_authority=:balancing_authority",
            ),
            {"balancing_authority": balancing_authority},
        )
        session.commit()
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


if __name__ == "__main__":
    cli()
