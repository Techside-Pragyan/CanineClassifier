import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadArea = ({ onImageSelect }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  return (
    <motion.div 
      {...getRootProps()} 
      className={`upload-container ${isDragActive ? 'active' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input {...getInputProps()} />
      <UploadCloud className="upload-icon" />
      <p className="upload-text">
        {isDragActive ? "Drop the image here..." : "Drag & Drop a dog image here"}
      </p>
      <p className="upload-hint">or click to browse from your device</p>
    </motion.div>
  );
};

export default UploadArea;
