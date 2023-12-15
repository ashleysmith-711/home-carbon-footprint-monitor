from sqlmodel import (
    Field,
    Session,
    SQLModel,
    create_engine,
    select,
    DateTime,
    Column,
    Date,
)
from datetime import date
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


class NoteData(SQLModel, table=True):
    customer_id: str = Field(primary_key=True)
    note_date: date = Field(sa_column=Column(Date, primary_key=True))
    note: str
