# -*- codint: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
import logging
import time

from . import utils
from ..core.config import settings
from ..db.database import AsyncIOMotorClient
from ..models.medical_record import MedicalRecordInCreate, MedicalRecord, MedicalRecordInDB


logger = logging.getLogger(__name__)


async def create_medical_record(conn: AsyncIOMotorClient, medical_record: MedicalRecordInCreate, owner_id: str):
    datetime_now = utils.get_datetime_now()
    medical_record = MedicalRecord(owner_id=owner_id, created_at=datetime_now, updated_at=datetime_now, **medical_record.dict())
    ret = await utils.insert_one(conn[settings.MONGODB_DATABASE][settings.MEDICAL_RECORD_COLLECTION], medical_record)
    return ret


async def search_medical_records(conn: AsyncIOMotorClient, query):
    data = await utils.find(conn[settings.MONGODB_DATABASE][settings.MEDICAL_RECORD_COLLECTION], query, doc_model=MedicalRecordInDB)
    return data
