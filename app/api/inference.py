# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from pathlib import Path
import logging

from mlflow import pytorch
import numpy as np
import torch
import torch.nn.functional as F
from torchvision import transforms

from ..core.config import settings
from ..models.result import MalignancyResult, MolecularSubtypeResult


MODEL = {name.name: pytorch.load_model(str(name), map_location=torch.device('cpu')) for name in settings.MODEL_DIR.iterdir()}
logger = logging.getLogger(__name__)


def transform_image(image):
    normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    transform = transforms.Compose([transforms.Resize(256), transforms.CenterCrop(224), transforms.ToTensor(), normalize])
    return transform(image)


def has_nan(x):
    return np.any(np.isnan(np.asarray(x)))


def infer_malignancy(images, features):
    index_to_class = ['benign', 'normal', 'malignant']
    num_images = len(images)
    images = torch.stack([transform_image(im) for im in images])
    outputs = MODEL['malignancy'](images)
    prob_per_im = F.softmax(outputs, dim=-1).detach().numpy()
    if has_nan(prob_per_im):
        return None, 'Found NaN values during inference.'
    prob = np.mean(prob_per_im, axis=0)

    result_per_image = []
    for idx in range(num_images):
        res = {}
        for cls_idx, cls in enumerate(index_to_class):
            if cls == 'normal':
                res['benign'] += prob_per_im[idx, cls_idx]
            else:
                res[cls] = prob_per_im[idx, cls_idx]
        result_per_image.append(MalignancyResult(**res))
    res = {}
    for cls_idx, cls in enumerate(index_to_class):
        if cls == 'normal':
            res['benign'] += prob[cls_idx]
        else:
            res[cls] = prob[cls_idx]
    result = MalignancyResult(**res)
    return {'result': result, 'result_per_image': result_per_image}, None


def _normalize(features):
    processed_ftrs = []
    for ftr in features:
        if ftr is None:
            processed_ftrs.append(0.0)
        else:
            processed_ftrs.append(float(ftr))
    return processed_ftrs


def infer_molecular_subtype(images, features):
    features = _normalize(features)
    index_to_class = ['luminal_a', 'luminal_b', 'her2_overexpressing', 'triple_negative']
    num_images = len(images)
    image_array = [np.asarray(im) for im in images]
    features = np.asarray(features[:1])
    prob = MODEL['molecular_subtype']((image_array, features))
    if has_nan(prob):
        return None, 'Found NaN values during inference.'
    
    result_per_image = []
    for idx in range(num_images):
        res = {}
        for cls_idx, cls in enumerate(index_to_class):
                res[cls] = prob[cls_idx]
        result_per_image.append(MolecularSubtypeResult(**res))
    res = {}
    for cls_idx, cls in enumerate(index_to_class):
        res[cls] = prob[cls_idx]
    result = MolecularSubtypeResult(**res)
    return {'result': result, 'result_per_image': result_per_image}, None
