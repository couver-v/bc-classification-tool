# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
import logging
import time
from typing import List, Optional

from fastapi import APIRouter, Body, Depends, Header, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import Response
from pydantic import Json

from ...deps import get_current_user
from ...inference import infer_malignancy, infer_molecular_subtype
from ....core.config import settings
from ....crud.diagnoses import create_diagnosis, search_diagnoses
from ....crud.medical_records import create_medical_record, search_medical_records
from ....crud.utils import generate_new_objectid
from ....db.database import AsyncIOMotorClient, get_database
from ....models.basemodel import ObjectId, ReturnCode
from ....models.diagnosis import DiagnosisPerImage, DiagnoseInput, DiagnoseResult, DiagnosisInCreate, DiagnoseResultResponse, DiagnosisType, SearchDiagnosisResponse
from ....models.image import Image, ImageModality, RectCoordinatePercentage
from ....models.medical_record import MedicalRecordInCreate
from ....utils import parse_image_form, image_loader


logger = logging.getLogger(__name__)
router = APIRouter()


def parse_result(result, images):
    result_per_image = []
    for im, res in zip(images, result['result_per_image']):
        result_per_image.append(DiagnosisPerImage(image_url=im.url, result=res))
    result = result['result']
    return result, result_per_image


@router.post("/malignancy")
async def diagnose_malignancy(image_files: List[UploadFile] = File(...), image_modalities: Json[List] = Form(...), lesion_rects: Optional[Json[List]] = Form(None), age: Optional[int] = Form(None), lesion_diameter: Optional[float] = Form(None), current_user: Optional[ObjectId]=Depends(get_current_user), db: AsyncIOMotorClient = Depends(get_database)):
    start = time.perf_counter()
    # verify request parameters
    images, error_msg = parse_image_form(image_files, image_modalities, lesion_rects)
    if images is None:
        time_used = int((time.perf_counter() - start) * 1000)
        response = ErrorResponse(error_message=error_msg, time_used=time_used, return_code=ReturnCode.FAIL)
        return Response(content=response.json(), media_type="application/json")

    # make predictions
    image_data = [image_loader(im.url, im.lesion_rect) for im in images]
    features = [age, lesion_diameter]
    result = infer_malignancy(image_data, features)
    result, result_per_image = parse_result(result, images)

    # insert to database
    diagnose_input = DiagnoseInput(images=images, age=age, lesion_diameter=lesion_diameter, diagnosis_type=DiagnosisType.MALIGNANCY)
    diagnose_result = DiagnoseResult(result=result, result_per_image=result_per_image)
    kwargs = diagnose_input.dict()
    kwargs.update(diagnose_result.dict())
    diagnosis = DiagnosisInCreate(**kwargs)
    ret = await create_diagnosis(db, diagnosis, owner_id=current_user)
    time_used = int((time.perf_counter() - start) * 1000)
    response = DiagnoseResultResponse(diagnosis_id=ret.inserted_id, diagnosis=diagnose_result, num_files=len(image_files), time_used=time_used, return_code=ReturnCode.SUCCESS)
    return Response(content=response.json(), media_type="application/json")


@router.post("/molecular_subtype")
async def diagnose_molecular_subtype(image_files: List[UploadFile]=File(...), image_modalities: Json[List] = Form(...), lesion_rects: Json[List] = Form(None), age: Optional[int] = Form(None), lesion_diameter: Optional[float] = Form(None), current_user: Optional[ObjectId]=Depends(get_current_user), db: AsyncIOMotorClient = Depends(get_database)):
    start = time.perf_counter()
    # verify request parameters
    images, error_msg = parse_image_form(image_files, image_modalities, lesion_rects)
    if images is None:
        time_used = int((time.perf_counter() - start) * 1000)
        return {"time_used": time_used, "error_message": error_msg, "return_code": 1}

    # make predication
    image_data = [image_loader(im.url, im.lesion_rect) for im in images]
    features = [age, lesion_diameter]
    result = infer_molecular_subtype(image_data, features)
    result, result_per_image = parse_result(result, images)

    # insert to database
    diagnose_input = DiagnoseInput(images=images, age=age, lesion_diameter=lesion_diameter, diagnosis_type=DiagnosisType.MOLECULAR_SUBTYPE)
    diagnose_result = DiagnoseResult(result=result, result_per_image=result_per_image)
    kwargs = diagnose_input.dict()
    kwargs.update(diagnose_result.dict())
    diagnosis = DiagnosisInCreate(**kwargs)
    ret = await create_diagnosis(db, diagnosis, owner_id=current_user)
    time_used = int((time.perf_counter() - start) * 1000)
    response = DiagnoseResultResponse(diagnosis_id=ret.inserted_id, diagnosis=diagnose_result, num_files=len(image_files), time_used=time_used, return_code=ReturnCode.SUCCESS)
    return Response(content=response.json(), media_type="application/json")


@router.get("")
async def get_diagnoses(diagnosis_type: int = Query(..., ge=0, lt=len(DiagnosisType), alias='type'), current_user: Optional[ObjectId]=Depends(get_current_user), db: AsyncIOMotorClient = Depends(get_database)):
    """
    Get diagnoses by owner
    """
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    start = time.perf_counter()
    data = await search_diagnoses(db, {'owner_id': current_user}, DiagnosisType(diagnosis_type))
    time_used = int((time.perf_counter() - start) * 1000)
    response = SearchDiagnosisResponse(diagnoses=data, time_used=time_used, return_code=ReturnCode.SUCCESS)
    return Response(content=response.json(), media_type="application/json")
