# Required because webhook events use a field called 'object', so it needs to be overriden
from pydantic import BaseModel, Field as PydanticField
from sqlmodel import Field, Session, SQLModel, create_engine, select, DateTime, Column
from typing import Optional

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
    utility: str = Field(primary_key=True)
    fuel_source: FuelSource = FuelSource.electricity
    energy_kwh: float


class CarbonEnergyData(SQLModel, table=False):
    customer_id: str = Field(primary_key=True)
    timestamp: datetime = Field(
        sa_column=Column(DateTime(timezone=True), primary_key=True)
    )
    fuel_source: FuelSource = FuelSource.electricity
    energy_kwh: float
    carbon_co2_lbs: float


class OnboardingModel(SQLModel, table=False):
    utility: str
    email: str


class OnboardingOut(SQLModel, table=False):
    link: str
    id: int



class Interval(SQLModel, table=False):
    start: datetime = Field(primary_key=True)
    end: datetime = Field(primary_key=True)
    electricity_consumption: int = Field(nullable=False)
    net_electricity_consumption: Optional[int]
    electricity_demand: Optional[int]
    gas_consumption: Optional[float]


# These are the interval data points that we're going to be storing in the database.
# They have all the same elements as the Interval objects defined above, but also
# include the ID of a customer so we can tell them apart.
class CustomerInterval(Interval, table=True):
    customer: int = Field(primary_key=True)


class Meter(SQLModel, table=False):
    id: int
    intervals: list[Interval]


# This is one of the objects we get as a response from the endpoint
# https://docs.bayou.energy/docs/interval-data#interval-data-explained
# Notice that the sub-element 'meters' contains instances of Meter as defined above
class IntervalsResponse(SQLModel, table=False):
    first_interval_discovered: datetime
    last_interval_discovered: datetime
    granularities: list[int]
    meters: list[Meter]


# Webhook related types
class WebhookEventType(str, Enum):
    filled_credentials = 'customer_has_filled_credentials'
    intervals_ready = 'intervals_ready'


class Webhook(BaseModel):
    event: WebhookEventType
    object_alias: dict = PydanticField(serialization_alias="object", validation_alias="object")


class NoteData(SQLModel, table=True):
    customer_id: str = Field(primary_key=True)
    note_date: date = Field(sa_column=Column(Date, primary_key=True))
    note: str

