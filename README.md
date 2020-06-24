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


### Deployment

This project is based on [FastAPI](https://fastapi.tiangolo.com/).
To start the application with [Uvicorn](https://www.uvicorn.org/), try the following command:
```
unzip models.zip
cd api
uvicorn app.main:app --host 0.0.0.0 --port 18000
```

You can also follow this [documentation](https://fastapi.tiangolo.com/deployment/) to deploy the application.
