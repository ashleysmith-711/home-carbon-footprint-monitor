from fastapi import FastAPI
from datetime import datetime, timedelta
from json import dumps
from sqlmodel import (
    Field,
    func,
    Session,
    SQLModel,
    create_engine,
    select,
    DateTime,
    Column,
    and_,
)
from .db import engine
from .models import (
    CarbonData,
    EnergyData,
    OnboardingModel,
    OnboardingOut,
    CarbonEnergyData,
)
from .seed import load_sample_energy_data
from .seed import load_carbon_data

import os
import requests

bayou_domain = "staging.bayou.energy"
bayou_api_key = "test_194_xxx"  # DO NOT COMMIT THISSSS!

app = FastAPI()


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    SQLModel.metadata.create_all(engine)
    load_sample_energy_data(customer_id="123", utility="PGE")
    load_carbon_data(balancing_authority="CISO")


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


@app.get("/api/carbon-data")
def get_carbon_data():
    with Session(engine) as session:
        return session.exec(select(CarbonData)).all()


@app.get("/api/energy-data")
def get_carbon_data(
    customer_id: str = "123", balancing_authority: str = "CISO"
) -> list[CarbonEnergyData]:
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    with Session(engine) as session:
        result = (
            session.query(
                EnergyData.customer_id,
                EnergyData.timestamp,
                EnergyData.energy_kwh,
                (
                    EnergyData.energy_kwh * CarbonData.carbon_intensity_co2_lbs_per_kwh
                ).label("carbon_co2_lbs"),
            )
            .join(
                CarbonData,
                and_(
                    EnergyData.timestamp >= thirty_days_ago,
                    EnergyData.timestamp == CarbonData.timestamp,
                ),
            )
            .filter_by(balancing_authority=balancing_authority)
            .filter(EnergyData.customer_id == customer_id)
            .all()
        )
        breakpoint()
        return [
            CarbonEnergyData(
                timestamp=row.timestamp,
                customer_id=row.customer_id,
                energy_kwh=row.energy_kwh,
                carbon_co2_lbs=row.carbon_co2_lbs,
            )
            for row in result
        ]


@app.post("/api/onboarding")
def onboarding(onboarding: OnboardingModel):
    customer = requests.post(
        f"https://{bayou_domain}/api/v2/customers",
        json={
            "utility": onboarding.utility,
            "email": onboarding.email,
        },
        auth=(bayou_api_key, ""),
    )
    if customer.status_code == 400:
        return customer.json()
    else:
        return OnboardingOut(
            link=customer.json()["onboarding_link"],
        )
