import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!city) return toast.error('Enter a city name');
    setLoading(true);
    try {
      const res = await API.get(`/weather/${city}`);
      setData(res.data);
      toast.success('✅ Weather data loaded!');
    } catch { toast.error('City not found or API error'); }
    finally { setLoading(false); }
  };

  const cities = ['Amritsar', 'Ludhiana', 'Delhi', 'Jaipur', 'Pune', 'Nagpur'];

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e, #0369a1)' }} className="text-white px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-sky-200 text-xs uppercase tracking-widest mb-2">Live Data</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>🌦️ Weather Advisory</h1>
          <p className="text-sky-100 text-sm">Live weather + AI-powered farming advice for your city</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">City Name</label>
          <div className="flex gap-3">
            <input value={city} onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Amritsar, Ludhiana, Delhi..."
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              className="input-field flex-1" />
            <button onClick={handleFetch} disabled={loading}
              className="text-white font-semibold px-6 py-2.5 rounded-xl whitespace-nowrap flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0369a1, #0284c7)' }}>
              {loading ? '...' : '🔍 Get Weather'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {cities.map(c => (
              <button key={c} onClick={() => { setCity(c); }}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition hover:scale-105"
                style={{ background: '#eff6ff', color: '#0369a1', border: '1px solid #bae6fd' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {data && (
          <div className="space-y-4 fade-up">
            {/* Main Weather Card */}
            <div className="rounded-2xl p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #0c4a6e, #0369a1)' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sky-200 text-xs uppercase tracking-widest mb-1">Current Weather</p>
                  <h2 className="text-3xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
                    {data.weather?.city || city}
                  </h2>
                  <p className="text-sky-200 text-sm mt-1">{data.weather?.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-6xl font-bold">{data.weather?.temperature}°C</p>
                  <p className="text-sky-200 text-sm">Feels like {data.weather?.feelsLike}°C</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                {[
                  { label: 'Humidity', value: `${data.weather?.humidity}%` },
                  { label: 'Wind Speed', value: `${data.weather?.windSpeed} km/h` },
                  { label: 'Visibility', value: `${data.weather?.visibility} km` },
                  { label: 'Condition', value: data.weather?.main },
                ].map((w, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold">{w.value}</p>
                    <p className="text-sky-200 text-xs mt-1">{w.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Farming Advisory */}
            {data.farmingAdvice && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">
                  🌾 Farming Advisory for Today
                </h3>
                <div className="space-y-3">
                  {data.farmingAdvice.map((advice, i) => (
                    <div key={i} className="flex gap-3 items-start rounded-xl p-3"
                      style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <span className="text-green-500 font-bold text-sm mt-0.5">✓</span>
                      <p className="text-gray-700 text-sm">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;