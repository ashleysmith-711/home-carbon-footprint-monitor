from fastapi import FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine, select, DateTime, Column
from .models import CarbonData
from .db import engine

app = FastAPI()


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


@app.get("/api/carbon-data")
def get_carbon_data():
    with Session(engine) as session:
        return session.exec(select(CarbonData)).all()
