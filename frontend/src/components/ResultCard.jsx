import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, HeartPulse, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ResultCard = ({ result }) => {
  if (!result) return null;

  const { predictions, top_breed, breed_info } = result;

  // Prepare data for the chart
  const chartData = predictions.map(p => ({
    name: p.breed.length > 15 ? p.breed.substring(0, 15) + '...' : p.breed,
    confidence: p.confidence
  }));

  return (
    <motion.div 
      className="results-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Predictions Card */}
      <div className="card">
        <h2>
          <ShieldCheck size={24} color="var(--accent)" />
          Prediction Results
        </h2>
        
        {predictions.map((pred, index) => (
          <div key={index} className={`prediction-item ${index === 0 ? 'top' : ''}`}>
            <span className="breed-name">{index + 1}. {pred.breed}</span>
            <span className="confidence-score">{pred.confidence}%</span>
          </div>
        ))}

        <div style={{ height: '200px', marginTop: '2rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" width={120} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--card-bg)', border: 'none' }} />
              <Bar dataKey="confidence" fill="var(--primary-color)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breed Info Card */}
      <div className="card">
        <h2>
          <Info size={24} color="var(--primary-color)" />
          About {top_breed}
        </h2>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">
              <MapPin size={16} /> Origin
            </span>
            <div className="info-value">{breed_info.origin}</div>
          </div>
          
          <div className="info-item">
            <span className="info-label">
              <HeartPulse size={16} /> Temperament
            </span>
            <div className="info-value">{breed_info.temperament}</div>
          </div>
          
          <div className="info-item">
            <span className="info-label">
              <Info size={16} /> Life Span
            </span>
            <div className="info-value">{breed_info.life_span}</div>
          </div>
          
          <div className="info-item">
            <span className="info-label">
              <ShieldCheck size={16} /> Care Tips
            </span>
            <div className="info-value">{breed_info.care_tips}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
