# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from datetime import datetime, timezone
from enum import Enum, unique
from typing import List, Optional, Union

from pydantic import Field

from .basemodel import ObjectId, DateTimeModelMixin, DBModelMixin, ModelBase, ResponseModelMixin
from .image import Image
from .result import MalignancyResult, MolecularSubtypeResult


@unique
class DiagnosisType(Enum):
    MALIGNANCY = 0
    MOLECULAR_SUBTYPE = 1

    def to_json(self):
        json_encoder = {DiagnosisType.MALIGNANCY: 'Malignancy', DiagnosisType.MOLECULAR_SUBTYPE: 'Molecular subtype'}
        return json_encoder[self]


class DiagnoseInput(ModelBase):
    images: List[Image]
    age: Optional[int] = None
    lesion_diameter: Optional[float] = None
    diagnosis_type: DiagnosisType = Field(..., alias='type')


class DiagnosisPerImage(ModelBase):
    image_url: 'str'
    result: Union[MalignancyResult, MolecularSubtypeResult]


class DiagnoseResult(ModelBase):
    result: Union[MalignancyResult, MolecularSubtypeResult]
    result_per_image: List[DiagnosisPerImage]


class DiagnosisBase(DiagnoseInput, DiagnoseResult):
    pass


class Diagnosis(DateTimeModelMixin, DiagnosisBase):
    owner_id: Optional[ObjectId]


class DiagnosisInCreate(DiagnosisBase):
    pass


class DiagnosisInDB(DBModelMixin, Diagnosis):
    pass


class DiagnoseResultResponse(ResponseModelMixin):
    diagnosis_id: ObjectId
    diagnosis: DiagnoseResult
    num_files: int


class SearchDiagnosisResponse(ResponseModelMixin):
    diagnoses: List[DiagnosisInDB]
