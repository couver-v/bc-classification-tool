# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals

from motor.motor_asyncio import AsyncIOMotorClient

from ..core.config import settings


class Database:

    client: AsyncIOMotorClient = None


db = Database()


async def connect_to_mongo():
    db.client = AsyncIOMotorClient(host=settings.MONGODB_HOST, port=settings.MONGODB_PORT, username=settings.MONGODB_USER, password=settings.MONGODB_PASSWORD, authSource=settings.MONGODB_DATABASE)


async def close_mongo_connection():
    db.client.close()


async def get_database() -> AsyncIOMotorClient:
    return db.client
