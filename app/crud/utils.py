# -*- codint: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from datetime import datetime, timezone
from enum import Enum
import logging
from typing import Any

from bson.objectid import ObjectId


logger = logging.getLogger(__name__)


def get_datetime_now(tz=timezone.utc):
    return datetime.now(tz)


def generate_new_objectid():
    return ObjectId()


def doc_result_to_model(doc, doc_model):
    return doc_model(**doc)


def mongodb_encode(obj: Any):
    if isinstance(obj, Enum):
        return obj.value
    if isinstance(obj, (str, int, float, type(None), datetime, ObjectId)):
        return obj
    if isinstance(obj, dict):
        encoded_dict = {}
        for key, value in obj.items():
            encoded_key = mongodb_encode(key)
            encoded_value = mongodb_encode(value)
            encoded_dict[encoded_key] = encoded_value
        return encoded_dict
    if isinstance(obj, (list, set, frozenset, tuple)):
        encoded_list = []
        for item in obj:
            encoded_list.append(mongodb_encode(item))
        return encoded_list


async def insert_one(collection, model):
    doc = mongodb_encode(model.dict(by_alias=True, exclude_none=True))
    ret = await collection.insert_one(doc)
    return ret


async def find(collection, query, doc_model):
    cursor = collection.find(query)
    data = []
    async for doc in cursor:
        data.append(doc_result_to_model(doc, doc_model))
    return data
