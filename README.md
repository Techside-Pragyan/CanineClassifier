# Canine Classifier AI 🐶🤖

A full-stack intelligent web application that identifies dog breeds from images using Deep Learning. Built with a modern tech stack and providing detailed insights about the predicted breed.

## 🌟 Features

- **Deep Learning Inference**: Uses a pre-trained PyTorch MobileNetV2 model for efficient and accurate dog breed classification.
- **Top 3 Predictions**: Not just the top result, but the top 3 most likely breeds with confidence scores.
- **Breed Information System**: Detailed insights about the predicted breed, including Origin, Temperament, Life Span, and Care Tips.
- **Modern UI/UX**: Built with React and Framer Motion, featuring drag-and-drop file uploading, smooth animations, and a responsive dark theme.
- **Confidence Graph**: Visual representation of prediction confidence using Recharts.

## 🛠️ Tech Stack

**Frontend**:
- React (Vite)
- Axios (API Communication)
- React Dropzone (File Upload)
- Framer Motion (Animations)
- Recharts (Data Visualization)

**Backend**:
- FastAPI (High-performance API)
- PyTorch & Torchvision (Deep Learning)
- Pillow (Image Processing)
- Uvicorn (ASGI Server)

## 📁 Project Structure

```
CanineClassifier/
│
├── backend/               # FastAPI Backend & Model Inference
│   ├── main.py            # API endpoints & Model loading
│   ├── breed_info.json    # Knowledge base for dog breeds
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # React UI
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── App.jsx        # Main Application
│   │   └── index.css      # Custom styling
│   └── package.json       # Node.js dependencies
│
├── notebooks/             # Data Science / Training 
│   └── train.py           # Example script for Transfer Learning (Stanford Dogs Dataset)
│
└── model/                 # Directory to store locally trained models
```

## 🚀 Installation & Usage

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

Install the Python dependencies:
```bash
pip install -r requirements.txt
```

Run the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
The backend API will be available at `http://localhost:8000`. It may take a moment on the first run to download the PyTorch model weights.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install the Node dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will be running at `http://localhost:5173`. Open this URL in your browser to start classifying!

## 🧠 Model Training (Optional)

If you want to train your own custom model on the Stanford Dogs Dataset instead of using the default ImageNet weights:
1. Download the Stanford Dogs Dataset and extract it into `data/dog_breeds`.
2. Run the training script in `notebooks/train.py`.
3. Update `backend/main.py` to load your custom `.pth` weights.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📜 License

This project is licensed under the MIT License.