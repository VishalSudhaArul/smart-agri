import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const CropAdvisor = () => {
  const [form, setForm] = useState({ cropName: '', season: '', soilType: '', region: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/advisory/generate', form);
      setResult(data.result.advisory);
      toast.success('✅ Advisory generated!');
    } catch (error) {
      toast.error('Failed to generate advisory');
    } finally { setLoading(false); }
  };

  const sections = result ? [
    { title: 'Sowing Advice', items: result.sowingAdvice, bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', emoji: '🌱' },
    { title: 'Irrigation Advice', items: result.irrigationAdvice, bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', emoji: '💧' },
    { title: 'Fertilizer Advice', items: result.fertilizerAdvice, bg: '#fffbeb', border: '#fde68a', color: '#b45309', emoji: '🧪' },
    { title: 'Pest & Disease', items: result.pestAdvice, bg: '#fff1f2', border: '#fecdd3', color: '#be123c', emoji: '🐛' },
    { title: 'Harvest Advice', items: result.harvestAdvice, bg: '#fff7ed', border: '#fed7aa', color: '#c2410c', emoji: '🌾' },
    { title: 'General Tips', items: result.generalTips, bg: '#faf5ff', border: '#e9d5ff', color: '#7e22ce', emoji: '📋' },
  ] : [];

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #14532d, #15803d)' }} className="text-white px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-200 text-xs uppercase tracking-widest mb-2">AI Advisory</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>🌱 Crop Advisor</h1>
          <p className="text-green-100 text-sm">Complete AI-generated farming advisory for your crop</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Name</label>
              <input placeholder="Wheat, Rice, Maize..." onChange={(e) => setForm({ ...form, cropName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Season</label>
              <select onChange={(e) => setForm({ ...form, season: e.target.value })} className="input-field">
                <option value="">Select Season</option>
                <option value="kharif">Kharif (June-Oct)</option>
                <option value="rabi">Rabi (Nov-Apr)</option>
                <option value="zaid">Zaid (Mar-Jun)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Soil Type</label>
              <select onChange={(e) => setForm({ ...form, soilType: e.target.value })} className="input-field">
                <option value="">Select Soil Type</option>
                {['loamy', 'sandy', 'clay', 'silty'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Region / District</label>
              <input placeholder="e.g. Amritsar" onChange={(e) => setForm({ ...form, region: e.target.value })} className="input-field" />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="mt-6 w-full text-white font-semibold py-3 rounded-xl"
            style={{ background: loading ? '#14532d' : 'linear-gradient(135deg, #15803d, #16a34a)' }}>
            {loading ? 'Generating Advisory...' : '🤖 Generate AI Advisory'}
          </button>
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-up">
            {sections.map((section, i) => (
              <div key={i} className="rounded-2xl p-5 border"
                style={{ background: section.bg, borderColor: section.border }}>
                <h3 className="font-bold mb-3 text-sm" style={{ color: section.color }}>
                  {section.emoji} {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-sm text-gray-700 flex gap-2 items-start">
                      <span style={{ color: section.color }} className="mt-0.5 text-xs">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropAdvisor;