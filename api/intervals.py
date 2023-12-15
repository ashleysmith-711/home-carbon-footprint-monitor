import bayou
import typer

from db import engine
from sqlmodel import Session

cli = typer.Typer()


@cli.command()
def load_from_bayou(customer_id: int = 2389):
    intervals = bayou.get_intervals_for_customer(customer_id=customer_id)
    with Session(engine) as session:
        for interval in intervals:
            session.add(interval)

        session.commit()
    print("done")

if __name__ == "__main__":
    cli()
