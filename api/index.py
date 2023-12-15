from fastapi import FastAPI
import pandas as pd
from sqlalchemy import text
from datetime import date
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
    NoteData,
)

from .seed import load_sample_energy_data
from .seed import load_carbon_data

import os
import requests
import logging

logging.basicConfig(level=logging.INFO)

bayou_domain = "staging.bayou.energy"
bayou_api_key = "test_194_5d6127446862110acaaf13d8779a594bb2f49012b34d59a46d00214c956bf1c4"

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
def get_carbon_data(
    customer_id: str = "123", balancing_authority: str = "CISO"
) -> list[CarbonEnergyData]:
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
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
                    EnergyData.timestamp >= seven_days_ago,
                    EnergyData.timestamp == CarbonData.timestamp,
                ),
            )
            .filter_by(balancing_authority=balancing_authority)
            .filter(EnergyData.customer_id == customer_id)
            .all()
        )
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
    json_response = customer.json()
    if customer.status_code == 400:
        return json_response
    else:
        return OnboardingOut(
            link=json_response["onboarding_link"],
            id=json_response["id"],
        )

# result = session.exec(
        #     select(NoteData).where(
        #         NoteData.customer_id == customer_id,
        #         NoteData.note_date == note_date
        #     )
        # ).one_or_none()
        # if result:
        #     return result
        # else:
        #     return {"customer_id": customer_id, "note_date": note_date, "note": ""}
@app.get("/api/notes")
def get_note(customer_id: str, note_date: date) -> NoteData:
    with Session(engine) as session:
        # Create the select statement
        stmt = select(NoteData).where(
            NoteData.customer_id == customer_id,
            NoteData.note_date == note_date
        )

        # Execute the statement and fetch one or none
        result = session.execute(stmt).scalar_one_or_none()
        if result:
            return result
        else:
            return {"customer_id": customer_id, "note_date": note_date, "note": ""}


@app.post("/api/notes")
def post_note(new_note: NoteData) -> NoteData:
    logging.info(f"_____Received note data_____: {new_note}")
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
