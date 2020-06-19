# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
import hashlib
import logging
from pathlib import Path

from fastapi import UploadFile
from PIL import Image as PIL_Image

from .core.config import settings
from .models.image import Image, RectCoordinatePercentage


CHUNK_SIZE = 10000 # 10k
UPLOAD_IMG_DIR = settings.STATIC_DIR.joinpath('upload', 'images')
logger = logging.getLogger(__name__)


def _fobj_md5(fobj, chunk_size=CHUNK_SIZE):
    hash_md5 = hashlib.md5()
    while True:
        chunk = fobj.read(chunk_size)
        if not chunk:
            break
        hash_md5.update(chunk)
    return hash_md5.hexdigest()


def _save_file(fin, fout, chunk_size=CHUNK_SIZE):
    fin.seek(0)
    while True:
        chunk = fin.read(chunk_size)
        if not chunk:
            break
        fout.write(chunk)


def save_file(file: UploadFile):
    """
    save files and return corresponding urls
    """
    md5 = _fobj_md5(file.file)
    save_path = UPLOAD_IMG_DIR.joinpath(md5[:8], md5[8:16], md5[16:24], md5[24:] + Path(file.filename).suffix)
    if not save_path.is_file():
        save_path.parent.mkdir(parents=True, exist_ok=True)
        with open(save_path, 'wb') as fout:
            _save_file(file.file, fout)
    file_url = '/' + str(save_path.relative_to(settings.APP_DIR))
    return file_url


def check_consistent_length(*lst):
    lengths = [len(l) for l in lst]
    if len(set(lengths)) > 1:
        raise ValueError("Found input variables with inconsistent length.")


def image_loader(fname, crop_box=None):
    fname = settings.APP_DIR.joinpath(fname[1:])
    with PIL_Image.open(fname) as image:
        if crop_box is not None:
            image = image.crop(crop_box.to_pil_coord())
        image = image.convert('RGB')
    return image


def get_image_size(fname):
    image = image_loader(fname)
    return image.size


def parse_lesion_rect(lesion_rect):
    if len(lesion_rect) > 1:
        return RectCoordinatePercentage(**lesion_rect[0])
    return None


def parse_image_form(image_files, image_modalities, lesion_rects):
    try:
        check_consistent_length(image_files, image_modalities)
    except ValueError:
        return None, "The length of `image_modalities` (= {}) doesn't match the number of image files (= {}).".format(len(image_modalities), len(image_files))

    if lesion_rects is None:
        lesion_rects = [None] * len(image_files)
    else:
        try:
            check_consistent_length(image_files, lesion_rects)
        except ValueError:
            return None, "The length of `lesion_rects` (= {}) doesn't match the number of image files (= {}).".format(len(lesion_rects), len(image_files))
        lesion_rects = [parse_lesion_rect(lesion_rect) for lesion_rect in lesion_rects]

    images = []
    for im_file, im_mod, lesion_rect in zip(image_files, image_modalities, lesion_rects):
        im_url = save_file(im_file)
        width, height = get_image_size(im_url)
        if isinstance(lesion_rect, RectCoordinatePercentage):
            lesion_rect = lesion_rect.to_rect_coordinate(width, height)
        images.append(Image(url=im_url, modality=im_mod, lesion_rect=lesion_rect))
    return images, None
