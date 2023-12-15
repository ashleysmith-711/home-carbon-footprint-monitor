from fastapi import FastAPI
import pandas as pd
from sqlalchemy import text
from datetime import date
from json import dumps
from sqlmodel import Field, Session, SQLModel, create_engine, select, DateTime, Column
from .db import engine
from .models import CarbonData, EnergyData, OnboardingModel, OnboardingOut, NoteData
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
    if customer.status_code == 400:
        return customer.json()
    else:
        return OnboardingOut(
            link=customer.json()["onboarding_link"],
        )


@app.get("/api/notes")
def get_note(customer_id: str, note_date: date) -> NoteData:
    with Session(engine) as session:
        result = session.exec(select(NoteData)).one_or_none()
        if result:
            return result
        else:
            return {"customer_id": customer_id, "note_date": note_date, "note": ""}


@app.post("/api/notes")
def post_note(new_note: NoteData) -> NoteData:
    with Session(engine) as session:
        new_note.note_date = pd.to_datetime(new_note.note_date).date()
        session.execute(
            text(
                "DELETE FROM notedata where customer_id=:customer_id and note_date=:note_date",
            ),
            {"customer_id": new_note.customer_id, "note_date": new_note.note_date},
        )
        session.add(new_note)
        session.commit()
    return new_note
