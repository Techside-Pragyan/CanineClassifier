import React, { useState } from 'react';
import axios from 'axios';
import { Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import UploadArea from './components/UploadArea';
import ResultCard from './components/ResultCard';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      // Assuming backend is running on localhost:8000
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error || 'Failed to predict image.');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Canine Classifier AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Identify dog breeds instantly with Deep Learning
        </motion.p>
      </header>

      <main>
        {!previewUrl ? (
          <UploadArea onImageSelect={handleImageSelect} />
        ) : (
          <motion.div 
            className="preview-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img src={previewUrl} alt="Preview" className="preview-image" />
            
            {!result && (
              <div className="action-bar">
                <button 
                  className="btn btn-secondary" 
                  onClick={handleReset}
                  disabled={loading}
                >
                  <RefreshCw size={20} />
                  Choose Another
                </button>
                <button 
                  className="btn" 
                  onClick={handlePredict}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <Camera size={20} />
                      Identify Breed
                    </>
                  )}
                </button>
              </div>
            )}
            
            {error && <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</p>}
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <div style={{ marginTop: '2rem' }}>
              <div className="action-bar" style={{ marginBottom: '2rem' }}>
                <button className="btn btn-secondary" onClick={handleReset}>
                  <RefreshCw size={20} /> Analyze New Image
                </button>
              </div>
              <ResultCard result={result} />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
