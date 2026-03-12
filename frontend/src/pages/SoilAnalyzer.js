import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const SoilAnalyzer = () => {
  const [form, setForm] = useState({ nitrogen: '', phosphorus: '', potassium: '', pH: '', moisture: '', organicMatter: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/soil/analyze', form);
      setResult(data.report);
      toast.success('✅ Analysis complete!');
    } catch (error) {
      toast.error('Analysis failed');
    } finally { setLoading(false); }
  };

  const scoreColor = (score) => {
    if (score >= 80) return { color: '#15803d', bg: '#f0fdf4', label: 'Excellent' };
    if (score >= 60) return { color: '#b45309', bg: '#fffbeb', label: 'Good' };
    if (score >= 40) return { color: '#c2410c', bg: '#fff7ed', label: 'Moderate' };
    return { color: '#be123c', bg: '#fff1f2', label: 'Poor' };
  };

  const fields = [
    { name: 'nitrogen', label: 'Nitrogen', unit: 'kg/ha', placeholder: '250' },
    { name: 'phosphorus', label: 'Phosphorus', unit: 'kg/ha', placeholder: '12' },
    { name: 'potassium', label: 'Potassium', unit: 'kg/ha', placeholder: '150' },
    { name: 'pH', label: 'Soil pH', unit: '', placeholder: '6.5' },
    { name: 'moisture', label: 'Moisture', unit: '%', placeholder: '45' },
    { name: 'organicMatter', label: 'Organic Matter', unit: '%', placeholder: '2.5' },
  ];

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #78350f, #b45309)' }} className="text-white px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-200 text-xs uppercase tracking-widest mb-2">Smart Analysis</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>🧪 Soil Analyzer</h1>
          <p className="text-amber-100 text-sm">Enter your soil nutrient values for AI-powered health analysis</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Soil Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  {f.label} {f.unit && <span className="text-gray-400 normal-case">({f.unit})</span>}
                </label>
                <input type="number" name={f.name} placeholder={f.placeholder}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className="input-field" />
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="mt-6 w-full text-white font-semibold py-3 rounded-xl transition"
            style={{ background: loading ? '#92400e' : 'linear-gradient(135deg, #b45309, #d97706)' }}>
            {loading ? 'Analyzing...' : '🔍 Analyze Soil Health'}
          </button>
        </div>

        {result && (
          <div className="space-y-4 fade-up">
            {/* Score Card */}
            <div className="result-card" style={{ background: scoreColor(result.recommendation.soilHealthScore).bg }}>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-6xl font-bold" style={{ color: scoreColor(result.recommendation.soilHealthScore).color }}>
                    {result.recommendation.soilHealthScore}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">out of 100</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Soil Health Score</p>
                  <p className="text-2xl font-bold capitalize" style={{ color: scoreColor(result.recommendation.soilHealthScore).color }}>
                    {scoreColor(result.recommendation.soilHealthScore).label}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{result.recommendation.suggestions.length} improvement areas found</p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">💡 Improvement Suggestions</h3>
              <div className="space-y-2">
                {result.recommendation.suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3 items-start bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <span className="text-amber-500 font-bold text-sm">{i + 1}</span>
                    <p className="text-gray-700 text-sm">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Crops */}
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">🌱 Best Crops for Your Soil</h3>
              <div className="flex flex-wrap gap-2">
                {result.recommendation.bestCrops.map((crop, i) => (
                  <span key={i} className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilAnalyzer;