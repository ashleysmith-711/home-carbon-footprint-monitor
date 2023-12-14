from fastapi import FastAPI
from json import dumps
from sqlmodel import Field, Session, SQLModel, create_engine, select, DateTime, Column
from .models import CarbonData, OnboardingModel

import requests

bayou_domain = "staging.bayou.energy"
bayou_api_key = "test_197_xxxxxxf" # DO NOT COMMIT THISSSS!

app = FastAPI()

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


@app.get("/api/carbon-data")
def get_carbon_data():
    with Session(engine) as session:
        return session.exec(select(CarbonData)).all()


@app.post("/onboarding")
def onboarding(onboarding: OnboardingModel):
    customer = requests.post(f"https://{bayou_domain}/api/v2/customers", json={
        "utility": OnboardingModel.utility,
        "email" : OnboardingModel.email,
    }, auth=(bayou_api_key, '')).json()

    response = {
        'link': customer['onboarding_link'],
    }

    return dumps(response)
