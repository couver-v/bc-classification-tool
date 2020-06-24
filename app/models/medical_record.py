# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from datetime import datetime, timezone
from enum import Enum, unique
from typing import List, Optional

from .basemodel import ObjectId, DateTimeModelMixin, DBModelMixin, ModelBase, ResponseModelMixin
from .image import Image


@unique
class Location(Enum):
    LEFT = 0
    RIGHT = 1

    def to_json(self):
        json_encoder = {Location.LEFT: 'Left', Location.RIGHT: 'Right'}
        return json_encoder[self]


@unique
class GradeType(Enum):
    WELL_DIFFERENTIATED = 0
    MODERATELY_DIFFERENTIATED = 1
    LOW_DIFFERENTIATED = 2

    def to_json(self):
        json_encoder = {
            GradeType.WELL_DIFFERENTIATED: 'Well differentiated', 
            GradeType.MODERATELY_DIFFERENTIATED: 'Moderately differentiated',
            GradeType.LOW_DIFFERENTIATED: 'LOW differentiated'
        }
        return json_encoder[self]


@unique
class PresenceStatus(Enum):
    ABSENCE = 0
    PRESENCE = 1

    def to_json(self):
        json_encoder = {PresenceStatus.ABSENCE: 'Absence', PresenceStatus.PRESENCE: 'Presence'}
        return json_encoder[self]

    
@unique
class PositiveStatus(Enum):
    NEGATIVE = 0
    POSITIVE = 1

    def to_json(self):
        json_encoder = {PositiveStatus.NEGATIVE: 'Negative', PositiveStatus.POSITIVE: 'Positive'}
        return json_encoder[self]

@unique
class MolecularSubtype(Enum):
    LUMINAL_A = 0
    LUMINAL_B = 1
    HER2_OVEREXPRESSING = 2
    TRIPLE_NEGATIVE = 3

    def to_json(self):
        json_encoder = {
            MolecularSubtype.LUMINAL_A: 'Luminal A',
            MolecularSubtype.LUMINAL_B: 'Luminal B',
            MolecularSubtype.HER2_OVEREXPRESSING: 'HER2 Overexpressing',
            MolecularSubtype.TRIPLE_NEGATIVE: 'Triple Negative',
        }
        return json_encoder[self]


class Pathology(ModelBase):

    grade: Optional[GradeType]
    residual_carcinoma_presence: Optional[PresenceStatus]
    invasive_carcinoma_presence: Optional[PresenceStatus]
    chronic_inflammation_presence: Optional[PresenceStatus]


class IHCResult(ModelBase):

    er: Optional[PositiveStatus]
    pr: Optional[PositiveStatus]
    her2: Optional[PositiveStatus]
    ki67: Optional[float]


class MedicalRecordBase(ModelBase):

    images: List[Image]
    age: Optional[int] = None
    lesion_diameter: Optional[float] = None
    location: Optional[Location] = None
    ihc_result: Optional[IHCResult] = None
    pathology: Optional[Pathology] = None
    molecular_subtype: Optional[MolecularSubtype] = None


class MedicalRecord(DateTimeModelMixin, MedicalRecordBase):
    owner_id: ObjectId


class MedicalRecordInCreate(MedicalRecordBase):
    pass


class MedicalRecordInDB(DBModelMixin, MedicalRecord):
    pass


class UploadMedicalRecordResponse(ResponseModelMixin):
    medical_record_id: ObjectId


class SearchMedicalRecordResponse(ResponseModelMixin):
    medical_records: List[MedicalRecordInDB]
