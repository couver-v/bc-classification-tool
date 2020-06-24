# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from enum import Enum, unique
from typing import Optional, Union
import json

from .basemodel import ModelBase


@unique
class ImageModality(Enum):
    GRAYSCALE = 0
    COLOR_DOPPLER = 1

    def to_json(self):
        json_encoder = {ImageModality.GRAYSCALE: 'Grayscale', ImageModality.COLOR_DOPPLER: 'Color doppler'}
        return json_encoder[self]


class RectCoordinate(ModelBase):

    left: int
    upper: int
    right: int
    lower: int

    def to_pil_coord(self):
        return (self.left, self.upper, self.right, self.lower)


class RectCoordinatePercentage(ModelBase):
    x: str
    y: str
    x1: str
    y1: str

    @staticmethod
    def str_to_percentage(s):
        return float(s.rstrip('%')) / 100

    def to_rect_coordinate(self, width, height):
        left = int(width * self.str_to_percentage(self.x))
        upper = int(width * self.str_to_percentage(self.y))
        right = int(width * self.str_to_percentage(self.x1))
        lower = int(width * self.str_to_percentage(self.y1))
        return RectCoordinate(left=left, upper=upper, right=right, lower=lower)


class ImageBase(ModelBase):

    url: str
    modality: ImageModality
    lesion_rect: Optional[RectCoordinate] = None


class Image(ImageBase):
    pass
