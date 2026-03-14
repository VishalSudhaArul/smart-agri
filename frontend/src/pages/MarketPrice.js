import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip);

const MarketPrice = () => {
  const [prices, setPrices]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]     = useState(null);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/market/prices');
        setPrices(res.data.prices);
      } catch { toast.error('Failed to load prices'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSelect = async (crop) => {
    setSelected(crop.name);
    try {
      const res = await API.get(`/market/prices/${crop.name.toLowerCase()}`);
      setDetail(res.data.crop);
    } catch { toast.error('Failed to load crop detail'); }
  };

  const filtered = prices.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const trendStyle = {
    up: { color: '#15803d', bg: '#f0fdf4', icon: '↑' },
    down: { color: '#be123c', bg: '#fff1f2', icon: '↓' },
    stable: { color: '#b45309', bg: '#fffbeb', icon: '→' },
  };

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }} className="text-white px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-200 text-xs uppercase tracking-widest mb-2">Live Mandi Rates</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>💰 Market Prices</h1>
          <p className="text-green-100 text-sm">Today's crop prices from major mandis across India</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search crop — wheat, rice, cotton..."
            className="input-field" />
        </div>

        <div className="grid grid-cols-5 gap-5">
          {/* Price List */}
          <div className="col-span-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              All Crops ({filtered.length})
            </p>
            <div className="space-y-2">
              {filtered.map((crop, i) => (
                <button key={i} onClick={() => handleSelect(crop)}
                  className="w-full bg-white rounded-xl p-4 border text-left transition hover:shadow-md"
                  style={{
                    borderColor: selected === crop.name ? '#15803d' : '#f0f0f0',
                    borderWidth: selected === crop.name ? '2px' : '1px'
                  }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: '#f0fdf4' }}>
                        🌾
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{crop.name}</p>
                        <p className="text-gray-400 text-xs">{crop.state} Mandi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-lg">₹{crop.price}</p>
                      <p className="text-xs text-gray-400">per {crop.unit}</p>
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: trendStyle[crop.trend]?.bg,
                          color: trendStyle[crop.trend]?.color
                        }}>
                        {trendStyle[crop.trend]?.icon} {crop.change}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="col-span-2">
            {detail ? (
              <div className="space-y-4 fade-up">
                {/* Price Card */}
                <div className="rounded-2xl p-5 text-white"
                  style={{ background: 'linear-gradient(135deg, #14532d, #15803d)' }}>
                  <p className="text-green-200 text-xs uppercase tracking-wide mb-1">{detail.state} Mandi</p>
                  <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                    {detail.name}
                  </h2>
                  <p className="text-5xl font-bold mt-3">₹{detail.price}</p>
                  <p className="text-green-200 text-sm">per {detail.unit}</p>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20">
                    <div>
                      <p className="text-green-200 text-xs">Week High</p>
                      <p className="font-bold">₹{detail.weekHigh}</p>
                    </div>
                    <div>
                      <p className="text-green-200 text-xs">Week Low</p>
                      <p className="font-bold">₹{detail.weekLow}</p>
                    </div>
                    <div>
                      <p className="text-green-200 text-xs">MSP</p>
                      <p className="font-bold">₹{detail.msp}</p>
                    </div>
                    <div>
                      <p className="text-green-200 text-xs">Change</p>
                      <p className="font-bold">{detail.change}</p>
                    </div>
                  </div>
                </div>

                {/* 7 Day Chart */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    📈 7-Day Price Trend
                  </p>
                  <Line
                    data={{
                      labels: detail.history?.map(h => h.day),
                      datasets: [{
                        data: detail.history?.map(h => h.price),
                        borderColor: '#15803d',
                        backgroundColor: 'rgba(21,128,61,0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#15803d',
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: false, grid: { color: '#f0f0f0' } },
                        x: { grid: { display: false } }
                      }
                    }}
                  />
                </div>

                {/* Recommendation */}
                <div className="rounded-2xl p-4 border"
                  style={{
                    background: trendStyle[detail.trend]?.bg,
                    borderColor: '#e5e7eb'
                  }}>
                  <p className="text-sm font-semibold" style={{ color: trendStyle[detail.trend]?.color }}>
                    {detail.recommendation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-3">💰</p>
                  <p className="text-gray-500 text-sm">Select a crop to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPrice;