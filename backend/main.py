from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

from pathlib import Path

MODEL_PATH_H5 = Path(__file__).resolve().parent.parent / "model" / "model.h5"
MODEL_PATH_KERAS = Path(__file__).resolve().parent.parent / "model" / "model.keras"

model = None
model_load_error = None

# Try loading .h5 format first (older format), then .keras
if MODEL_PATH_H5.exists():
    try:
        with open(MODEL_PATH_H5, "rb") as f:
            signature = f.read(8)
        if signature != b"\x89HDF\r\n\x1a\n":
            raise ValueError(
                f"Invalid model file format: expected HDF5 signature, got {signature!r}. "
                "If using .keras format, rename to model.keras instead of model.h5"
            )
        model = tf.keras.models.load_model(str(MODEL_PATH_H5))
        print(f"Model loaded from: {MODEL_PATH_H5}")
    except Exception as e:
        model_load_error = str(e)
        print(f"Error loading model from {MODEL_PATH_H5}: {model_load_error}")
elif MODEL_PATH_KERAS.exists():
    try:
        model = tf.keras.models.load_model(str(MODEL_PATH_KERAS))
        print(f"Model loaded from: {MODEL_PATH_KERAS}")
    except Exception as e:
        model_load_error = str(e)
        print(f"Error loading model from {MODEL_PATH_KERAS}: {model_load_error}")
else:
    model_load_error = f"No model found. Expected either {MODEL_PATH_KERAS} or {MODEL_PATH_H5}"
    print(model_load_error)


def preprocess_image(image):
    image = image.resize((224, 224))
    img = np.array(image) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_error": model_load_error,
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return {"error": f"Model not loaded. {model_load_error}"}
    
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    img = preprocess_image(image)
    pred = model.predict(img)[0][0]

    if pred > 0.5:
        return {
            "damage": "Yes",
            "confidence": float(pred)
        }
    else:
        return {
            "damage": "No",
            "confidence": float(1 - pred)
        }