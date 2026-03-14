import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const CropCalendar = () => {
  const [calendars, setCalendars] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cropName: '', sowingDate: '', season: '', landSize: '' });
  const [loading, setLoading] = useState(false);

  const fetchCalendars = async () => {
    try {
      const res = await API.get('/calendar/my-calendars');
      setCalendars(res.data.calendars);
      if (res.data.calendars.length > 0) setSelected(res.data.calendars[0]);
    } catch { toast.error('Failed to load calendars'); }
  };

  useEffect(() => { fetchCalendars(); }, []);

  const handleAdd = async () => {
    if (!form.cropName || !form.sowingDate) return toast.error('Crop name and sowing date required');
    setLoading(true);
    try {
      await API.post('/calendar/add', form);
      toast.success('✅ Crop calendar created!');
      setShowForm(false);
      fetchCalendars();
    } catch { toast.error('Failed to create calendar'); }
    finally { setLoading(false); }
  };

  const handleMarkDone = async (calendarId, eventIndex) => {
    try {
      const res = await API.put(`/calendar/mark-done/${calendarId}/${eventIndex}`);
      setSelected(res.data.calendar);
      fetchCalendars();
      toast.success('✅ Marked as done!');
    } catch { toast.error('Failed to update'); }
  };

  const typeStyle = {
    sowing: { color: '#15803d', bg: '#f0fdf4', icon: '🌱' },
    fertilizer: { color: '#b45309', bg: '#fffbeb', icon: '🧪' },
    irrigation: { color: '#0369a1', bg: '#f0f9ff', icon: '💧' },
    pesticide: { color: '#be123c', bg: '#fff1f2', icon: '🐛' },
    harvest: { color: '#7e22ce', bg: '#faf5ff', icon: '🌾' },
  };

  const today = new Date();
  const getStatus = (date) => {
    const d = new Date(date);
    const diff = Math.ceil((d - today) / 86400000);
    if (diff < 0) return { label: 'Overdue', color: '#be123c' };
    if (diff === 0) return { label: 'Today!', color: '#b45309' };
    if (diff <= 3) return { label: `In ${diff} days`, color: '#d97706' };
    return { label: `In ${diff} days`, color: '#6b7280' };
  };

  const upcoming = selected?.events?.filter(e =>
    !e.done && new Date(e.date) >= today
  ).slice(0, 3) || [];

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #14532d, #365314)' }} className="text-white px-8 py-10">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-green-200 text-xs uppercase tracking-widest mb-2">Farm Planner</p>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>🌱 Crop Calendar</h1>
            <p className="text-green-100 text-sm">Auto-generated crop schedule with smart activity reminders</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-white text-green-800 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-green-50 transition">
            {showForm ? '✕ Cancel' : '+ Add Crop'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 fade-up">
            <h3 className="font-bold text-gray-800 mb-4">Add New Crop Schedule</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Name</label>
                <input placeholder="Wheat, Rice..."
                  onChange={e => setForm({ ...form, cropName: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Sowing Date</label>
                <input type="date"
                  onChange={e => setForm({ ...form, sowingDate: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Season</label>
                <select onChange={e => setForm({ ...form, season: e.target.value })} className="input-field">
                  <option value="">Select</option>
                  <option value="kharif">Kharif</option>
                  <option value="rabi">Rabi</option>
                  <option value="zaid">Zaid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Land Size (acres)</label>
                <input type="number" placeholder="5"
                  onChange={e => setForm({ ...form, landSize: e.target.value })}
                  className="input-field" />
              </div>
            </div>
            <button onClick={handleAdd} disabled={loading}
              className="mt-4 w-full text-white font-semibold py-3 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}>
              {loading ? 'Creating Calendar...' : '🌱 Generate Crop Calendar'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-5">
          {/* Crop List */}
          <div className="col-span-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              My Crops ({calendars.length})
            </p>
            <div className="space-y-2">
              {calendars.map((cal, i) => {
                const done = cal.events?.filter(e => e.done).length || 0;
                const total = cal.events?.length || 1;
                const pct = Math.round((done / total) * 100);
                return (
                  <button key={i} onClick={() => setSelected(cal)}
                    className="w-full text-left bg-white rounded-xl p-4 border transition hover:shadow-md"
                    style={{
                      borderColor: selected?._id === cal._id ? '#15803d' : '#f0f0f0',
                      borderWidth: selected?._id === cal._id ? '2px' : '1px'
                    }}>
                    <p className="font-bold text-gray-800 capitalize">{cal.cropName}</p>
                    <p className="text-gray-400 text-xs mt-1">{cal.season} • {cal.landSize} acres</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-semibold text-green-700">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 bg-green-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
              {calendars.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-3xl mb-2">🌱</p>
                  <p className="text-gray-400 text-xs">No crops added</p>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Detail */}
          <div className="col-span-3">
            {selected ? (
              <div className="space-y-4 fade-up">
                {/* Upcoming */}
                {upcoming.length > 0 && (
                  <div className="rounded-2xl p-5 border border-yellow-200" style={{ background: '#fffbeb' }}>
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">
                      ⏰ Upcoming Activities
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {upcoming.map((e, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 border border-yellow-100">
                          <p className="text-lg">{typeStyle[e.type]?.icon}</p>
                          <p className="font-semibold text-gray-800 text-sm mt-1">{e.title}</p>
                          <p className="text-xs mt-1" style={{ color: getStatus(e.date).color }}>
                            {getStatus(e.date).label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Events */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      📅 {selected.cropName} — Full Schedule
                    </h3>
                    <p className="text-xs text-gray-400">
                      Sowed: {new Date(selected.sowingDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {selected.events?.map((event, i) => (
                      <div key={i}
                        className="flex items-center gap-4 p-3 rounded-xl border transition"
                        style={{
                          background: event.done ? '#f9fafb' : typeStyle[event.type]?.bg,
                          borderColor: event.done ? '#e5e7eb' : '#e5e7eb',
                          opacity: event.done ? 0.7 : 1
                        }}>
                        <span className="text-xl">{typeStyle[event.type]?.icon}</span>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${event.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {!event.done && (
                            <p className="text-xs font-semibold" style={{ color: getStatus(event.date).color }}>
                              {getStatus(event.date).label}
                            </p>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize`}
                            style={{
                              background: typeStyle[event.type]?.bg,
                              color: typeStyle[event.type]?.color
                            }}>
                            {event.type}
                          </span>
                          {!event.done ? (
                            <button onClick={() => handleMarkDone(selected._id, i)}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition">
                              Mark Done
                            </button>
                          ) : (
                            <span className="text-xs text-green-600 font-semibold">✅ Done</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl mb-3">📅</p>
                  <p className="text-gray-500 text-sm font-medium">Add a crop to generate its calendar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;
