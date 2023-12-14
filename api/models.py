from sqlmodel import Field, Session, SQLModel, create_engine, select, DateTime, Column
from datetime import datetime


class CarbonData(SQLModel, table=True):
    balancing_authority: str = Field(primary_key=True)
    timestamp: datetime = Field(
        sa_column=Column(DateTime(timezone=True), primary_key=True)
    )
    value: float


class OnboardingModel(SQLModel, table=False):
    utility: str
    email: str