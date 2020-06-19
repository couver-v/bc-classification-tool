# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals

from fastapi import APIRouter
from .endpoints import diagnoses, medical_records


api_router = APIRouter()
api_router.include_router(diagnoses.router, prefix="/diagnose", tags=["diagnose"])
#  api_router.include_router(images.router, prefix="/images", tags=["images"])
api_router.include_router(medical_records.router, prefix="/medical_records", tags=["medical_records"])
