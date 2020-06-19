# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
import json
import logging

from fastapi import Request
import httpx

from ..models.basemodel import ObjectId


AMINER_API_URL = "https://apiv2.aminer.cn/magic?"
logger = logging.getLogger(__name__)


async def get_current_user(request: Request):
    authorization = request.headers.get('Authorization')
    if authorization is None:
        return None
    async with httpx.AsyncClient() as client:
        aminer_headers = {'Authorization': authorization}
        request_data = [{"action": "user.GetMe"}]
        response = await client.post(AMINER_API_URL, data=json.dumps(request_data), headers=aminer_headers)
    content = json.loads(response.content)
    try:
        return ObjectId(content['data'][0]['items'][0]['id'])
    except KeyError:
        return None
