# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
import logging

from starlette.exceptions import HTTPException
from starlette.responses import JSONResponse
from starlette.requests import Request
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY

logger = logging.getLogger(__name__)


async def http_422_error_handler(request: Request, exc: HTTPException) -> JSONResponse:
    errors = {"body": []}
    if isinstance(exc.detail, Iterable) and not isinstance(exc.detail, str):
        for error in exc.detail:
            error_name = '.'.join(error["loc"][1:])
            errors["body"].append({error_name: error["msg"]})
    else:
        errors["body"].append(exc.detail)
    return JSONResponse({"errors": errors}, status_code=HTTP_422_UNPROCESSABLE_ENTITY)
