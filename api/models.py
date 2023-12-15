from sqlmodel import Field, Session, SQLModel, create_engine, select, DateTime, Column
from datetime import datetime
from enum import Enum, auto


class FuelSource(str, Enum):
    natural_gas = auto()
    electricity = auto()


class CarbonData(SQLModel, table=True):
    balancing_authority: str = Field(primary_key=True)
    timestamp: datetime = Field(
        sa_column=Column(DateTime(timezone=True), primary_key=True)
    )
    carbon_intensity_co2_lbs_per_kwh: float


class EnergyData(SQLModel, table=True):
    customer_id: str = Field(primary_key=True)
    timestamp: datetime = Field(
        sa_column=Column(DateTime(timezone=True), primary_key=True)
    )
    utility: str
    fuel_source: FuelSource = FuelSource.electricity
    energy_kwh: float


class OnboardingModel(SQLModel, table=False):
    utility: str
    email: str


class OnboardingOut(SQLModel, table=False):
    link: str
    id: int
