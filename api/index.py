from fastapi import FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine, select, DateTime, Column
from .models import CarbonData, EnergyData
from .db import engine
from .seed import load_sample_energy_data
from .seed import load_carbon_data

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
