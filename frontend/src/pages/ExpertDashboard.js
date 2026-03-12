import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const ExpertDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, aiAnswered: 0, verified: 0 });

  const fetchQuestions = async () => {
    try {
      const { data } = await API.get('/questions/all');
      const qs = data.questions;
      setQuestions(qs);
      setStats({
        total: qs.length,
        pending: qs.filter(q => q.status === 'pending').length,
        aiAnswered: qs.filter(q => q.status === 'ai-answered').length,
        verified: qs.filter(q => q.status === 'expert-verified').length,
      });
    } catch { toast.error('Failed to load questions'); }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleVerify = async () => {
    if (!answer.trim()) return toast.error('Please enter your expert answer');
    setLoading(true);
    try {
      await API.put(`/questions/expert-answer/${selected._id}`, { expertAnswer: answer });
      toast.success('✅ Answer submitted & verified!');
      setAnswer('');
      setSelected(null);
      fetchQuestions();
    } catch { toast.error('Failed to submit answer'); }
    finally { setLoading(false); }
  };

  const statusStyle = {
    'expert-verified': { label: '✅ Verified', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    'ai-answered': { label: '🤖 AI Answered', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    'pending': { label: '⏳ Pending', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  };

  const filtered = questions.filter(q => filter === 'all' ? true : q.status === filter);

  const statCards = [
    { label: 'Total Questions', value: stats.total, color: '#6d28d9', bg: '#faf5ff', icon: '💬' },
    { label: 'Pending Review', value: stats.pending, color: '#b45309', bg: '#fffbeb', icon: '⏳' },
    { label: 'AI Answered', value: stats.aiAnswered, color: '#1d4ed8', bg: '#eff6ff', icon: '🤖' },
    { label: 'Expert Verified', value: stats.verified, color: '#15803d', bg: '#f0fdf4', icon: '✅' },
  ];

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }} className="text-white px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-200 text-xs uppercase tracking-widest mb-2">Expert Portal</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
            👨‍💼 Expert Dashboard
          </h1>
          <p className="text-green-100 text-sm">
            Review AI-generated answers and provide expert verification for farmers
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="rounded-2xl p-5 border fade-up"
              style={{ background: s.bg, borderColor: '#e5e7eb', animationDelay: `${i * 0.1}s` }}>
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'all', label: 'All Questions' },
            { key: 'ai-answered', label: '🤖 Needs Review' },
            { key: 'pending', label: '⏳ Pending' },
            { key: 'expert-verified', label: '✅ Verified' },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background: filter === tab.key ? '#14532d' : 'white',
                color: filter === tab.key ? 'white' : '#6b7280',
                border: `1.5px solid ${filter === tab.key ? '#14532d' : '#e5e7eb'}`
              }}>
              {tab.label}
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: filter === tab.key ? 'rgba(255,255,255,0.2)' : '#f3f4f6' }}>
                {tab.key === 'all' ? questions.length :
                  tab.key === 'ai-answered' ? stats.aiAnswered :
                  tab.key === 'pending' ? stats.pending : stats.verified}
              </span>
            </button>
          ))}
        </div>

        {/* Split Panel */}
        <div className="grid grid-cols-5 gap-5">

          {/* Question List */}
          <div className="col-span-2 space-y-2">
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 text-sm">No questions in this category</p>
              </div>
            )}
            {filtered.map((q) => (
              <button key={q._id} onClick={() => { setSelected(q); setAnswer(''); }}
                className="w-full text-left bg-white rounded-xl p-4 border transition hover:shadow-md"
                style={{
                  borderColor: selected?._id === q._id ? '#15803d' : '#f0f0f0',
                  borderWidth: selected?._id === q._id ? '2px' : '1px'
                }}>
                <p className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">{q.question}</p>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: statusStyle[q.status]?.bg,
                      color: statusStyle[q.status]?.color,
                      border: `1px solid ${statusStyle[q.status]?.border}`
                    }}>
                    {statusStyle[q.status]?.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: '#f3f4f6', color: '#6b7280' }}>
                    {q.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs">
                    👤 {q.userId?.name || 'Farmer'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(q.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Answer Panel */}
          <div className="col-span-3">
            {selected ? (
              <div className="space-y-4 fade-up">

                {/* Question Box */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Farmer's Question</p>
                    <span className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: statusStyle[selected.status]?.bg,
                        color: statusStyle[selected.status]?.color
                      }}>
                      {statusStyle[selected.status]?.label}
                    </span>
                  </div>
                  <p className="text-gray-800 font-semibold text-base mb-3">{selected.question}</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {selected.userId?.name?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{selected.userId?.name || 'Farmer'}</p>
                      <p className="text-xs text-gray-400">
                        📍 {selected.userId?.location?.district || 'India'} •{' '}
                        {new Date(selected.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Answer */}
                {selected.aiAnswer && (
                  <div className="rounded-2xl p-5 border border-blue-100" style={{ background: '#eff6ff' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">🤖</div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">AI Generated Answer</p>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{selected.aiAnswer}</p>
                    {selected.status === 'ai-answered' && (
                      <p className="text-blue-400 text-xs mt-3 italic">
                        ⚠️ This answer needs your expert review before it's marked as verified
                      </p>
                    )}
                  </div>
                )}

                {/* Already Verified */}
                {selected.expertAnswer && (
                  <div className="rounded-2xl p-5 border border-green-200" style={{ background: '#f0fdf4' }}>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
                      ✅ Your Expert Answer
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">{selected.expertAnswer}</p>
                  </div>
                )}

                {/* Expert Reply Box — only if not yet verified */}
                {selected.status !== 'expert-verified' && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                      ✍️ Write Your Expert Answer
                    </p>
                    <textarea rows={4}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Write a detailed, expert-verified answer for the farmer. Include specific recommendations, dosages, timing, or precautions as applicable..."
                      className="input-field resize-none mb-3" />
                    <div className="flex gap-3">
                      <button onClick={() => { setSelected(null); setAnswer(''); }}
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                        Cancel
                      </button>
                      <button onClick={handleVerify} disabled={loading}
                        className="flex-1 text-white font-semibold py-2.5 rounded-xl transition"
                        style={{ background: loading ? '#14532d' : 'linear-gradient(135deg, #15803d, #16a34a)' }}>
                        {loading ? 'Submitting...' : '✅ Submit & Verify Answer'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex items-center justify-center py-32">
                <div className="text-center">
                  <p className="text-5xl mb-4">👈</p>
                  <p className="text-gray-600 font-semibold">Select a question to review</p>
                  <p className="text-gray-400 text-xs mt-1">Click any question from the list to view and verify</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;