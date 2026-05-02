import json
import os
from io import BytesIO
import urllib.request

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

import torch
import torchvision.transforms as transforms
import torchvision.models as models

app = FastAPI(title="Dog Breed Identifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load breed info
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, "breed_info.json"), "r") as f:
    BREED_INFO = json.load(f)

# Load pre-trained model (MobileNetV2)
print("Loading model...")
# Using default weights which corresponds to ImageNet
weights = models.MobileNet_V2_Weights.DEFAULT
model = models.mobilenet_v2(weights=weights)
model.eval()
print("Model loaded.")

# Define transforms
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Fetch ImageNet labels
LABELS_URL = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
labels = []
try:
    with urllib.request.urlopen(LABELS_URL) as response:
        labels = [line.decode("utf-8").strip() for line in response.readlines()]
except Exception as e:
    print(f"Error loading labels: {e}")

def format_breed_name(name):
    # ImageNet labels might be like "golden_retriever" or "pug"
    parts = name.replace("_", " ").split(",")
    return parts[0].title()

def get_breed_info(breed_name):
    # Try exact match
    if breed_name in BREED_INFO:
        return BREED_INFO[breed_name]
    
    # Try partial match
    for known_breed, info in BREED_INFO.items():
        if known_breed.lower() in breed_name.lower() or breed_name.lower() in known_breed.lower():
            return info
            
    return BREED_INFO["Unknown"]

@app.get("/")
def read_root():
    return {"message": "Dog Breed Identifier API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert("RGB")
        
        input_tensor = preprocess(image)
        input_batch = input_tensor.unsqueeze(0)
        
        with torch.no_grad():
            output = model(input_batch)
            
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        
        # Get top 3 predictions
        top3_prob, top3_catid = torch.topk(probabilities, 3)
        
        predictions = []
        for i in range(top3_prob.size(0)):
            score = top3_prob[i].item() * 100
            if labels:
                breed_raw = labels[top3_catid[i]]
                breed = format_breed_name(breed_raw)
            else:
                breed = f"Class {top3_catid[i].item()}"
            predictions.append({
                "breed": breed,
                "confidence": round(score, 2)
            })
            
        top_breed = predictions[0]["breed"]
        info = get_breed_info(top_breed)
        
        return {
            "success": True,
            "predictions": predictions,
            "top_breed": top_breed,
            "breed_info": info
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/breed-info/{breed_name}")
def breed_info(breed_name: str):
    return get_breed_info(breed_name)
