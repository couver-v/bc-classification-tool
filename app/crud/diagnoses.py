# -*- codint: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from datetime import datetime, timezone
import logging
import time

from . import utils
from ..core.config import settings
from ..db.database import AsyncIOMotorClient
from ..models.diagnosis import DiagnosisInCreate, Diagnosis, DiagnosisInDB, DiagnosisType


logger = logging.getLogger(__name__)


def get_collection_name(diagnosis_type):
    if diagnosis_type is DiagnosisType.MALIGNANCY:
        collection = settings.DIAGNOSIS_COLLECTION + '_malignancy'
    elif diagnosis_type is DiagnosisType.MOLECULAR_SUBTYPE:
        collection = settings.DIAGNOSIS_COLLECTION + '_molecular_subtype'
    else:
        raise NotImplementedError()
    return collection


async def create_diagnosis(conn: AsyncIOMotorClient, diagnosis: DiagnosisInCreate, owner_id: str):
    datetime_now = utils.get_datetime_now()
    diagnosis = Diagnosis(owner_id=owner_id, created_at=datetime_now, updated_at=datetime_now, **diagnosis.dict())
    ret = await utils.insert_one(conn[settings.MONGODB_DATABASE][get_collection_name(diagnosis.diagnosis_type)], diagnosis)
    return ret


async def search_diagnoses(conn: AsyncIOMotorClient, query, diagnosis_type):
    data = await utils.find(conn[settings.MONGODB_DATABASE][get_collection_name(diagnosis_type)], query, doc_model=DiagnosisInDB)
    return data
