# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from enum import Enum
from datetime import datetime, timezone
from typing import Optional

from bson.objectid import ObjectId as BSONObjectId
from pydantic import BaseModel, BaseConfig, Field, PydanticValueError


class BSONObjectIdError(PydanticValueError):
    msg_template = 'value is not a valid BSON ObjectId'


class ObjectId(BSONObjectId):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        try:
            return BSONObjectId(v)
        except ValueError:
            raise BSONObjectIdError()


class ModelBase(BaseModel):
    class Config(BaseConfig):
        extra = 'forbid'
        allow_population_by_field_name = True
        json_encoders = {Enum: lambda x: x.to_json() if hasattr(x, 'to_json') else x.value, BSONObjectId: lambda oid: str(oid), datetime: lambda dt: dt.replace(tzinfo=timezone.utc).isoformat()}


class DateTimeModelMixin(BaseModel):
    created_at: datetime
    updated_at: datetime


class DBModelMixin(BaseModel):
    oid: Optional[ObjectId] = Field(..., alias='_id')


class ReturnCode(Enum):
    SUCCESS = 0
    FAIL = 1


class ResponseModelMixin(ModelBase):
    time_used: int
    return_code: ReturnCode


class ErrorResponse(ResponseModelMixin):
    error_message: str
