# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
import logging
import json
import time
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import Response
from pydantic import Json

from ...deps import get_current_user
from ....crud.medical_records import create_medical_record, search_medical_records
from ....db.database import AsyncIOMotorClient, get_database
from ....models.basemodel import ObjectId, ReturnCode, ErrorResponse
from ....models.medical_record import Pathology, IHCResult, MedicalRecordInCreate, UploadMedicalRecordResponse, SearchMedicalRecordResponse
from ....utils import parse_image_form


logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/upload")
async def create_new_medical_record(image_files: List[UploadFile]=File(...), image_modalities: Json[List] = Form(...), lesion_rects: Json[List] = Form(None), age: Optional[int] = Form(None), lesion_diameter: Optional[float] = Form(None), location: Optional[int] = Form(None), grade: Optional[int] = Form(None), residual_carcinoma_presence: Optional[int] = Form(None), invasive_carcinoma_presence: Optional[int] = Form(None), chronic_inflammation_presence: Optional[int] = Form(None), er: Optional[int] = Form(None), pr: Optional[int] = Form(None), her2: Optional[int] = Form(None), ki67: Optional[float] = Form(None), molecular_subtype: Optional[int] = Form(None), current_user: Optional[ObjectId]=Depends(get_current_user), db: AsyncIOMotorClient = Depends(get_database)):
    """
    Upload medical records by user
    """
    start = time.perf_counter()
    # verify request parameters
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    images, error_msg = parse_image_form(image_files, image_modalities, lesion_rects)
    if images is None:
        time_used = int((time.perf_counter() - start) * 1000)
        response = ErrorResponse(error_message=error_msg, time_used=time_used, return_code=ReturnCode.FAIL)
        return Response(content=response.json(), media_type="application/json")

    # save images
    pathology = Pathology(grade=grade, residual_carcinoma_presence=residual_carcinoma_presence, invasive_carcinoma_presence=invasive_carcinoma_presence, chronic_inflammation_presence=chronic_inflammation_presence)
    ihc_result = IHCResult(er=er, pr=pr, her2=her2, ki67=ki67)
    medical_record = MedicalRecordInCreate(images=images, age=age, location=location, lesion_diameter=lesion_diameter, pathology=pathology, ihc_result=ihc_result, molecular_subtype=molecular_subtype)
    ret = await create_medical_record(db, medical_record, owner_id=current_user)
    time_used = int((time.perf_counter() - start) * 1000)
    response = UploadMedicalRecordResponse(medical_record_id=ret.inserted_id, time_used=time_used, return_code=ReturnCode.SUCCESS)
    return Response(content=response.json(), media_type="application/json")


@router.get("")
async def get_medical_records(current_user: Optional[ObjectId]=Depends(get_current_user), db: AsyncIOMotorClient = Depends(get_database)):
    """
    Get medical records by owner
    """
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    start = time.perf_counter()
    data = await search_medical_records(db, {'owner_id': current_user})
    time_used = int((time.perf_counter() - start) * 1000)
    response = SearchMedicalRecordResponse(medical_records=data, time_used=time_used, return_code=ReturnCode.SUCCESS)
    return Response(content=response.json(), media_type="application/json")
