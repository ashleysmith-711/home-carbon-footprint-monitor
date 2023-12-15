import bayou
import typer

from sqlalchemy import text
from db import engine
from sqlmodel import Session
from models import EnergyData

cli = typer.Typer()


@cli.command()
def load_from_bayou(customer_id: int = 2389):
    intervals = bayou.get_intervals_for_customer(customer_id=customer_id)
    utility = "BAYOU"
    with Session(engine) as session:
        for interval in intervals:
            session.execute(
                text(
                    "DELETE FROM customerinterval where customer=:customer_id",
                ),
                {"customer_id": interval.customer},
            )

            session.add(interval)
            session.execute(
                text(
                    "DELETE FROM energydata where customer_id=:customer_id and utility=:utility",
                ),
                {"customer_id": interval.customer, "utility": utility},
            )

            session.add(
                EnergyData(
                    utility=utility,
                    timestamp=interval.start,
                    customer_id=interval.customer,
                    energy_kwh=interval.electricity_consumption,
                )
            )

        session.commit()
    print("done")


if __name__ == "__main__":
    cli()
