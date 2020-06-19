# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY

from .api.api_v1.api import api_router
from .core.config import settings
from .core.errors import http_422_error_handler
from .db.database import close_mongo_connection, connect_to_mongo


app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# TODO: change origins to real domain to reject requests from elsewhere
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)
app.add_exception_handler(HTTP_422_UNPROCESSABLE_ENTITY, http_422_error_handler)

app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")
app.include_router(api_router, prefix=settings.API_V1_STR)
