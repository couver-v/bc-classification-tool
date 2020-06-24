# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from typing import Optional

from .basemodel import ModelBase


class MalignancyResult(ModelBase):
    benign: float
    malignant: float


class MolecularSubtypeResult(ModelBase):
    luminal_a: float
    luminal_b: float
    her2_overexpressing: float
    triple_negative: float
