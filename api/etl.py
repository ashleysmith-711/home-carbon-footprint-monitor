import seed
import typer

cli = typer.Typer()


@cli.command()
def load_sample_energy_data(customer_id: str = "123", utility: str = "PGE"):
    seed.load_sample_energy_data(customer_id=customer_id, utility=utility)


@cli.command()
def load_carbon_data(balancing_authority: str = "CISO"):
    seed.load_carbon_data(balancing_authority=balancing_authority)


if __name__ == "__main__":
    cli()
