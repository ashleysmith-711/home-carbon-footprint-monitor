from fastapi import FastAPI
from json import dumps
from sqlmodel import Field, Session, SQLModel, create_engine, select, DateTime, Column
from .bayou import bayou_domain, bayou_api_key
from .db import engine
from .models import CarbonData, EnergyData, OnboardingModel, OnboardingOut
from .seed import load_sample_energy_data
from .seed import load_carbon_data

import os
import requests

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
def get_carbon_data():
    with Session(engine) as session:
        return session.exec(select(EnergyData)).all()


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
    json_response = customer.json()
    if customer.status_code == 400:
        return json_response
    else:
        return OnboardingOut(
            link=json_response["onboarding_link"],
            id=json_response["id"],
        )
