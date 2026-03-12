import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const YieldPredictor = () => {
  const [form, setForm] = useState({ cropName: '', landSize: '', soilType: '', season: '', rainfall: '', fertilizer: '', irrigation: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/yield/predict', form);
      setResult(data.result.prediction);
      toast.success('✅ Prediction complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Prediction failed');
    } finally { setLoading(false); }
  };

  const confColor = { High: { color: '#15803d', bg: '#f0fdf4' }, Medium: { color: '#b45309', bg: '#fffbeb' }, Low: { color: '#be123c', bg: '#fff1f2' } };

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)' }} className="text-white px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-200 text-xs uppercase tracking-widest mb-2">ML Prediction</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>📈 Yield Predictor</h1>
          <p className="text-blue-100 text-sm">AI-powered harvest estimation based on your farm conditions</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'cropName', label: 'Crop Name', type: 'input', placeholder: 'Wheat, Rice, Maize...' },
              { name: 'landSize', label: 'Land Size (acres)', type: 'input', placeholder: '5' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                <input name={f.name} placeholder={f.placeholder} type={f.name === 'landSize' ? 'number' : 'text'}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className="input-field" />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Soil Type</label>
              <select onChange={(e) => setForm({ ...form, soilType: e.target.value })} className="input-field">
                <option value="">Select</option>
                {['loamy', 'sandy', 'clay', 'silty'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Season</label>
              <select onChange={(e) => setForm({ ...form, season: e.target.value })} className="input-field">
                <option value="">Select</option>
                <option value="kharif">Kharif (Jun-Oct)</option>
                <option value="rabi">Rabi (Nov-Apr)</option>
                <option value="zaid">Zaid (Mar-Jun)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Annual Rainfall (mm)</label>
              <input type="number" placeholder="800" onChange={(e) => setForm({ ...form, rainfall: e.target.value })} className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Fertilizer (kg/acre)</label>
              <input type="number" placeholder="75" onChange={(e) => setForm({ ...form, fertilizer: e.target.value })} className="input-field" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Irrigation Type</label>
              <select onChange={(e) => setForm({ ...form, irrigation: e.target.value })} className="input-field">
                <option value="">Select</option>
                {['drip', 'sprinkler', 'flood', 'rainfed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="mt-6 w-full text-white font-semibold py-3 rounded-xl"
            style={{ background: loading ? '#1e3a5f' : 'linear-gradient(135deg, #1e40af, #2563eb)' }}>
            {loading ? 'Predicting...' : '📈 Predict Yield'}
          </button>
        </div>

        {result && (
          <div className="space-y-4 fade-up">
            <div className="result-card" style={{ background: confColor[result.confidence]?.bg || '#f8f8f8' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Expected Yield</p>
                  <p className="text-6xl font-bold" style={{ color: confColor[result.confidence]?.color }}>
                    {result.expectedYield}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{result.unit}</p>
                </div>
                <div className="text-center">
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-bold"
                    style={{ background: confColor[result.confidence]?.bg, color: confColor[result.confidence]?.color, border: `1.5px solid ${confColor[result.confidence]?.color}` }}>
                    {result.confidence} Confidence
                  </span>
                </div>
              </div>
            </div>

            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">💡 Tips to Improve Yield</h3>
              <div className="space-y-2">
                {result.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start rounded-xl p-3"
                    style={{ background: tip.includes('✅') ? '#f0fdf4' : '#fff7ed', border: `1px solid ${tip.includes('✅') ? '#bbf7d0' : '#fed7aa'}` }}>
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldPredictor;