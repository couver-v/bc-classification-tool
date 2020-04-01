# -*- coding: utf-8 -*-

from __future__ import division, absolute_import, print_function, unicode_literals
from collections import OrderedDict
import time
from typing import List, Optional

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from mlflow import pytorch as mf_torch
from PIL import Image
from pydantic import BaseModel, Field
import torch
import torch.nn.functional as F
from torchvision import transforms


# TODO: load models from uri
MODEL_PATH = {'malignancy': '../models/malignancy_model'}
MODEL = {}
for name, path in MODEL_PATH.items():
    MODEL[name] = mf_torch.load_model(path, map_location=torch.device('cpu'))

# TODO: patient profile
class PatientProfile(BaseModel):
    uid: str = Field(None, title="a unique identifier of the patient")
    age: int = Field(None, title="age of the patient", gt=0)


def image_loader(f):
    image = Image.open(f)
    return image.convert('RGB')


def transform_image(image):
    normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    transform = transforms.Compose([transforms.Resize(256), transforms.CenterCrop(224), transforms.ToTensor(), normalize])
    return transform(image)


app = FastAPI()

# TODO: change origins to real domain to reject requests from elsewhere
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello world!"}


@app.post("/diagnose/malignancy")
def diagnose_malignancy(image_files: List[UploadFile]=File(...), age: int = Form(None), bbox: str = Form(None)):
    start = time.perf_counter()
    index_to_class = ['benign', 'normal', 'malignant']
    images = [transform_image(image_loader(imfile.file)) for imfile in image_files]
    images = torch.stack(images)
    outputs = MODEL['malignancy'](images)
    prob = F.softmax(outputs, dim=-1).tolist()
    res = {}
    for idx, imfile in enumerate(image_files):
        res_per_im = OrderedDict()
        for cls_idx, cls in enumerate(index_to_class):
            res_per_im[cls] = prob[idx][cls_idx]
        res[imfile.filename] = res_per_im
    time_used = int((time.perf_counter() - start) * 1000)
    return {"request_id": 0, "num_files": len(image_files), "result": res, "time_used": time_used}


@app.post("/diagnose/subtype")
async def diagnose_subtype(image_files: List[UploadFile]=File(...), profile: int = None):
    return {"filenames": [f.filename for f in image_files], "num_files": len(image_files), "profile": profile}
