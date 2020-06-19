# bc-classification-tool
Breast cancer malignancy and subtype prediction tool

## Usage:

### Environment Setup

See `environment.yml` for all prerequisites, and you can also install them using the following command.
```
conda env create -f environment.yml
```

Install pytorch and torchvision following the [official instructions](https://pytorch.org/get-started/).

### Download Models

Download trained models from [here](https://www.amazon.com/clouddrive/share/rtcwRdxFwcdHzo5hHY8LWAf0XGV4FVDsQJa39QIDO8V).


To start the service with [Uvicorn](https://www.uvicorn.org/), try the following command:
```
unzip models.zip
cd api
uvicorn main:app --host 0.0.0.0 --port 18000
```
