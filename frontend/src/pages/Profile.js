import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [newCrop, setNewCrop] = useState({ cropName: '', season: '', landSize: '', soilType: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, cropsRes] = await Promise.all([
          API.get('/auth/profile'),
          API.get('/crop/my-crops')
        ]);
        setUser(profileRes.data);
        setCrops(cropsRes.data.crops || []);
      } catch { toast.error('Failed to load profile'); }
    };
    fetchData();
  }, []);

  const handleAddCrop = async () => {
    if (!newCrop.cropName) return toast.error('Crop name required');
    setLoading(true);
    try {
      await API.post('/crop/add', newCrop);
      toast.success('✅ Crop added!');
      setNewCrop({ cropName: '', season: '', landSize: '', soilType: '' });
      const res = await API.get('/crop/my-crops');
      setCrops(res.data.crops || []);
    } catch { toast.error('Failed to add crop'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #14532d, #15803d)' }} className="text-white px-8 py-10">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-green-900 text-3xl font-bold flex-shrink-0"
            style={{ background: '#fbbf24' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'V'}
          </div>
          <div>
            <p className="text-green-200 text-xs uppercase tracking-widest mb-1">Farmer Profile</p>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>{user?.name || 'Loading...'}</h1>
            <p className="text-green-100 text-sm mt-1">
              📍 {user?.location?.village}, {user?.location?.district}, {user?.location?.state}
            </p>
          </div>
          <div className="ml-auto">
            <span className="px-4 py-2 rounded-full text-sm font-bold capitalize"
              style={{ background: user?.role === 'expert' ? '#fbbf24' : '#ffffff', color: '#14532d' }}>
              {user?.role === 'expert' ? '👨‍💼 Expert' : '👨‍🌾 Farmer'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[
            { label: 'Total Crops', value: crops.length, icon: '🌱', color: '#f0fdf4', accent: '#15803d' },
            { label: 'Phone', value: user?.phone || 'Not set', icon: '📱', color: '#eff6ff', accent: '#1d4ed8' },
            { label: 'Account Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '-', icon: '📅', color: '#faf5ff', accent: '#7e22ce' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-5 border"
              style={{ background: s.color, borderColor: '#e5e7eb' }}>
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="text-2xl font-bold" style={{ color: s.accent }}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">👤 Personal Information</h3>
            <div className="space-y-3">
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Email', value: user?.email },
                { label: 'Phone', value: user?.phone },
                { label: 'Role', value: user?.role },
                { label: 'State', value: user?.location?.state },
                { label: 'District', value: user?.location?.district },
                { label: 'Village', value: user?.location?.village },
              ].map((f, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">{f.label}</span>
                  <span className="text-sm font-semibold text-gray-700 capitalize">{f.value || '-'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Crops */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">🌱 My Crops</h3>

            {/* Add Crop */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 mb-2 font-semibold">Add New Crop</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input placeholder="Crop name" value={newCrop.cropName}
                  onChange={(e) => setNewCrop({ ...newCrop, cropName: e.target.value })}
                  className="input-field text-xs py-2" />
                <input placeholder="Season" value={newCrop.season}
                  onChange={(e) => setNewCrop({ ...newCrop, season: e.target.value })}
                  className="input-field text-xs py-2" />
              </div>
              <button onClick={handleAddCrop} disabled={loading}
                className="w-full text-white text-xs font-semibold py-2 rounded-lg"
                style={{ background: '#15803d' }}>
                {loading ? 'Adding...' : '+ Add Crop'}
              </button>
            </div>

            {/* Crop List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {crops.map((crop, i) => (
                <div key={i} className="flex justify-between items-center bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-green-800">{crop.cropName}</p>
                    <p className="text-xs text-green-500">{crop.season} • {crop.soilType}</p>
                  </div>
                  <span className="text-xs text-green-600 font-semibold">{crop.landSize} ac</span>
                </div>
              ))}
              {crops.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No crops added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;