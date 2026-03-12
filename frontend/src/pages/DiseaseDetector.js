import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const DiseaseDetector = () => {
  const [cropName, setCropName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    if (!cropName || !symptoms) return toast.error('Crop name and symptoms are required');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cropName', cropName);
      formData.append('symptoms', symptoms);
      if (image) formData.append('image', image);
      const { data } = await API.post('/disease/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data.report.result);
      toast.success('✅ Disease detection complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Detection failed');
    } finally { setLoading(false); }
  };

  const sevStyle = {
    High: { color: '#be123c', bg: '#fff1f2', border: '#fecdd3', label: 'High Risk' },
    Moderate: { color: '#b45309', bg: '#fffbeb', border: '#fde68a', label: 'Moderate' },
    Low: { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', label: 'Low Risk' },
    Unknown: { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', label: 'Unknown' },
  };

  const tags = ['yellow spots', 'white powder', 'brown lesions', 'wilting', 'stem borer', 'aphids', 'yellow stripes', 'black spots', 'leaf curl'];

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #b91c1c)' }} className="text-white px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-red-200 text-xs uppercase tracking-widest mb-2">AI Diagnosis</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>🔬 Disease Detector</h1>
          <p className="text-red-100 text-sm">Upload crop image + describe symptoms for instant AI diagnosis</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">

          {/* Top Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Name</label>
              <input
                type="text" placeholder="e.g. Wheat, Rice, Maize"
                value={cropName} onChange={(e) => setCropName(e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Upload Leaf Image</label>
              <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-red-300 transition">
                <span className="text-gray-400 text-sm">📷 {image ? image.name : 'Choose image...'}</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mb-4 relative">
              <img src={preview} alt="Preview"
                className="w-full h-48 object-cover rounded-xl border border-gray-200" />
              <button onClick={() => { setPreview(null); setImage(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">✕</button>
            </div>
          )}

          {/* Symptoms */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Describe Symptoms</label>
            <textarea rows={3}
              placeholder="e.g. Yellow stripes on leaves, white powder on stem, brown spots spreading fast..."
              value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
              className="input-field resize-none" />
          </div>

          {/* Quick Tags */}
          <div className="mb-5">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Quick Add Symptoms</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag}
                  onClick={() => setSymptoms(prev => prev ? `${prev}, ${tag}` : tag)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition hover:scale-105"
                  style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}>
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-xl transition"
            style={{ background: loading ? '#7f1d1d' : 'linear-gradient(135deg, #b91c1c, #dc2626)' }}>
            {loading ? '🔍 Detecting Disease...' : '🔬 Detect Disease'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4 fade-up">
            {/* Disease Banner */}
            <div className="rounded-2xl p-6 border-2"
              style={{ background: sevStyle[result.severity]?.bg, borderColor: sevStyle[result.severity]?.border }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Detected Disease</p>
                  <h2 className="text-2xl font-bold" style={{ color: sevStyle[result.severity]?.color, fontFamily: 'Fraunces, serif' }}>
                    {result.diseaseName}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">AI Confidence: <strong>{result.confidence}</strong></p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-bold border-2"
                    style={{ background: 'white', color: sevStyle[result.severity]?.color, borderColor: sevStyle[result.severity]?.border }}>
                    {sevStyle[result.severity]?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Column Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-red-700 mb-3 text-sm flex items-center gap-2">
                  💊 Chemical Treatment
                </h3>
                <ul className="space-y-2">
                  {result.treatment.map((t, i) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-2 items-start">
                      <span className="text-red-400 font-bold mt-0.5">{i + 1}.</span>{t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl p-5 border border-green-100 shadow-sm" style={{ background: '#f0fdf4' }}>
                <h3 className="font-bold text-green-700 mb-3 text-sm flex items-center gap-2">
                  🌿 Organic Treatment
                </h3>
                <ul className="space-y-2">
                  {result.organicTreatment.map((t, i) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-2 items-start">
                      <span className="text-green-500 font-bold mt-0.5">{i + 1}.</span>{t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl p-5 border border-blue-100 shadow-sm" style={{ background: '#eff6ff' }}>
                <h3 className="font-bold text-blue-700 mb-3 text-sm flex items-center gap-2">
                  🛡️ Prevention
                </h3>
                <ul className="space-y-2">
                  {result.prevention.map((p, i) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-2 items-start">
                      <span className="text-blue-500 font-bold mt-0.5">{i + 1}.</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetector;