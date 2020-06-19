# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from pathlib import Path
from typing import List

from pydantic import AnyHttpUrl, BaseSettings, DirectoryPath


class Settings(BaseSettings):
    API_V1_STR: str = ""
    # TODO
    #  BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["*"]
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    PROJECT_NAME: str = "SonoBreast API"
    APP_DIR: DirectoryPath = Path(__file__).resolve().parent.parent.parent
    STATIC_DIR: DirectoryPath = APP_DIR.joinpath("static")
    MODEL_DIR: DirectoryPath = APP_DIR.joinpath("models")
    # MongoDB configurations
    MONGODB_HOST='HOST'
    MONGODB_PORT=27017
    MONGODB_USER='USER'
    MONGODB_PASSWORD='PASSWORD'
    MONGODB_DATABASE='DATABASE'
    MEDICAL_RECORD_COLLECTION='medical_records'
    DIAGNOSIS_COLLECTION='diagnoses'


settings = Settings()
