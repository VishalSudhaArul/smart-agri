import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/analytics/summary');
        setData(res.data);
      } catch { toast.error('Failed to load analytics'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f6f1' }}>
      <div className="text-center">
        <p className="text-4xl mb-4">📊</p>
        <p className="text-gray-500">Loading your farm analytics...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Soil Reports', value: data?.summary?.totalSoilReports, icon: '🧪', color: '#b45309', bg: '#fffbeb' },
    { label: 'Yield Predictions', value: data?.summary?.totalYieldPredictions, icon: '📈', color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Disease Reports', value: data?.summary?.totalDiseaseReports, icon: '🔬', color: '#be123c', bg: '#fff1f2' },
    { label: 'Advisories', value: data?.summary?.totalAdvisories, icon: '🌱', color: '#15803d', bg: '#f0fdf4' },
    { label: 'Avg Soil Score', value: `${data?.summary?.avgSoilScore}/100`, icon: '💯', color: '#7e22ce', bg: '#faf5ff' },
    { label: 'Latest Yield', value: data?.summary?.latestYield, icon: '🌾', color: '#0369a1', bg: '#f0f9ff' },
  ];

  const soilChartData = {
    labels: data?.soilTrend?.map(s => s.date) || [],
    datasets: [{
      label: 'Soil Health Score',
      data: data?.soilTrend?.map(s => s.score) || [],
      borderColor: '#b45309',
      backgroundColor: 'rgba(180,83,9,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#b45309',
    }]
  };

  const yieldChartData = {
    labels: data?.yieldHistory?.map(y => y.crop) || [],
    datasets: [{
      label: 'Expected Yield (Quintals)',
      data: data?.yieldHistory?.map(y => y.yield) || [],
      backgroundColor: ['#15803d', '#1d4ed8', '#b45309', '#be123c', '#7e22ce', '#0369a1'],
      borderRadius: 8,
    }]
  };

  const diseaseChartData = {
    labels: data?.diseaseFreq?.map(d => d.name.substring(0, 20)) || [],
    datasets: [{
      data: data?.diseaseFreq?.map(d => d.count) || [],
      backgroundColor: ['#be123c', '#b45309', '#1d4ed8', '#15803d', '#7e22ce'],
    }]
  };

  const activityChartData = {
    labels: data?.monthlyActivity?.map(m => m.month) || [],
    datasets: [{
      label: 'Activities',
      data: data?.monthlyActivity?.map(m => m.count) || [],
      backgroundColor: 'rgba(21,128,61,0.8)',
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } }
  };

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #3730a3)' }} className="text-white px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-indigo-200 text-xs uppercase tracking-widest mb-2">Farm Intelligence</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>📊 Farm Analytics</h1>
          <p className="text-indigo-100 text-sm">Track your farm performance, soil health trends and yield history</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="rounded-2xl p-4 border fade-up text-center"
              style={{ background: s.bg, borderColor: '#e5e7eb', animationDelay: `${i * 0.1}s` }}>
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Soil Health Trend */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wide">🧪 Soil Health Trend</h3>
            <p className="text-gray-400 text-xs mb-4">Score over time (last 6 reports)</p>
            {data?.soilTrend?.length > 0
              ? <Line data={soilChartData} options={chartOptions} />
              : <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No soil reports yet</div>
            }
          </div>

          {/* Yield History */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wide">📈 Yield History</h3>
            <p className="text-gray-400 text-xs mb-4">Expected yield by crop (quintals)</p>
            {data?.yieldHistory?.length > 0
              ? <Bar data={yieldChartData} options={chartOptions} />
              : <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No yield predictions yet</div>
            }
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Disease Frequency */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wide">🔬 Disease Frequency</h3>
            <p className="text-gray-400 text-xs mb-4">Most detected diseases on your farm</p>
            {data?.diseaseFreq?.length > 0 ? (
              <div className="flex items-center justify-center">
                <div style={{ width: '280px' }}>
                  <Doughnut data={diseaseChartData}
                    options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } }} />
                </div>
              </div>
            ) : <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No disease reports yet</div>}
          </div>

          {/* Monthly Activity */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wide">📅 Monthly Activity</h3>
            <p className="text-gray-400 text-xs mb-4">Total farm activities per month</p>
            {data?.monthlyActivity?.length > 0
              ? <Bar data={activityChartData} options={chartOptions} />
              : <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No activity yet</div>
            }
          </div>
        </div>

        {/* Latest Crop Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">🌾 Latest Farm Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <p className="text-xs text-gray-500 mb-1">Latest Crop</p>
              <p className="text-xl font-bold text-green-700">{data?.summary?.latestCrop || 'N/A'}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <p className="text-xs text-gray-500 mb-1">Latest Yield Prediction</p>
              <p className="text-xl font-bold text-blue-700">{data?.summary?.latestYield || 'N/A'} Quintals</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#faf5ff', border: '1px solid #e9d5ff' }}>
              <p className="text-xs text-gray-500 mb-1">Average Soil Score</p>
              <p className="text-xl font-bold text-purple-700">{data?.summary?.avgSoilScore || 0}/100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;