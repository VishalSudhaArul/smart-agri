import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const QandA = () => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'general' });
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      const { data } = await API.get('/questions/my-questions');
      setQuestions(data.questions);
    } catch { toast.error('Failed to load questions'); }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleAsk = async () => {
    if (!form.title) return toast.error('Please enter a question');
    setLoading(true);
    try {
      await API.post('/questions/ask', {
        title: form.title,
        description: form.title,
        category: form.category
      });
      toast.success('✅ Question submitted! AI has answered!');
      setShowForm(false);
      setForm({ title: '', category: 'general' });
      fetchQuestions();
    } catch { toast.error('Failed to submit question'); }
    finally { setLoading(false); }
  };

  const statusStyle = {
    'expert-verified': { label: '✅ Expert Verified', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    'ai-answered':     { label: '🤖 AI Answered',     bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    'pending':         { label: '⏳ Pending',          bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  };

  const categories = ['general', 'pest', 'soil', 'weather', 'crop', 'fertilizer'];

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4c1d95, #6d28d9)' }} className="text-white px-8 py-10">
        <div className="max-w-5xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-purple-200 text-xs uppercase tracking-widest mb-2">AI + Expert System</p>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>💬 Ask a Question</h1>
            <p className="text-purple-100 text-sm">Get instant AI answers verified by certified agricultural experts</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-white text-purple-700 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-purple-50 transition flex-shrink-0">
            {showForm ? '✕ Cancel' : '+ Ask New Question'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Ask Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-6 fade-up">
            <h3 className="font-bold text-gray-800 mb-4">Ask Your Question</h3>
            <textarea rows={3}
              placeholder="e.g. My wheat crop has yellow spots on leaves, what disease is this?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field resize-none mb-3" />
            <div className="flex gap-3">
              <select value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field" style={{ width: '200px' }}>
                {categories.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
              <button onClick={handleAsk} disabled={loading}
                className="flex-1 text-white font-semibold py-2.5 rounded-xl transition"
                style={{ background: loading ? '#4c1d95' : 'linear-gradient(135deg, #6d28d9, #7c3aed)' }}>
                {loading ? 'Submitting...' : '🤖 Submit & Get AI Answer'}
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { step: '1', title: 'Ask Question',        desc: 'Describe your farming problem',          color: '#6d28d9', bg: '#faf5ff' },
            { step: '2', title: 'AI Answers Instantly', desc: 'Our AI engine analyzes and responds',    color: '#1d4ed8', bg: '#eff6ff' },
            { step: '3', title: 'Expert Verifies',      desc: 'Certified experts review the answer',   color: '#15803d', bg: '#f0fdf4' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4 border text-center"
              style={{ background: s.bg, borderColor: '#e5e7eb' }}>
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold"
                style={{ background: s.color }}>
                {s.step}
              </div>
              <p className="font-bold text-sm text-gray-800">{s.title}</p>
              <p className="text-gray-500 text-xs mt-1">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Q&A Split Layout */}
        <div className="grid grid-cols-5 gap-5">

          {/* Question List */}
          <div className="col-span-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              My Questions ({questions.length})
            </p>
            <div className="space-y-2">
              {questions.map((q) => (
                <button key={q._id} onClick={() => setSelected(q)}
                  className="w-full text-left bg-white rounded-xl p-4 border transition hover:shadow-md"
                  style={{
                    borderColor: selected?._id === q._id ? '#6d28d9' : '#f0f0f0',
                    borderWidth: selected?._id === q._id ? '2px' : '1px'
                  }}>
                  <p className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                    {q.title || q.question}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
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
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(q.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </button>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="text-gray-500 text-sm">No questions yet</p>
                  <button onClick={() => setShowForm(true)}
                    className="mt-3 text-purple-600 text-sm font-semibold">
                    Ask your first question →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Answer Panel */}
          <div className="col-span-3">
            {selected ? (
              <div className="space-y-4 fade-up">

                {/* Question Box */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Question</p>
                  <p className="text-gray-800 font-semibold text-base">
                    {selected.title || selected.question}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: statusStyle[selected.status]?.bg,
                        color: statusStyle[selected.status]?.color
                      }}>
                      {statusStyle[selected.status]?.label}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                      {selected.category}
                    </span>
                  </div>
                </div>

                {/* AI Answer */}
                {selected.aiAnswer && (
                  <div className="rounded-2xl p-5 border border-blue-100" style={{ background: '#eff6ff' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">🤖</div>
                      <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">AI Answer</p>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {selected.aiAnswer}
                    </p>
                  </div>
                )}

                {/* Expert Answer */}
                {selected.expertAnswer && (
                  <div className="rounded-2xl p-5 border border-green-100" style={{ background: '#f0fdf4' }}>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
                      ✅ Expert Verified Answer
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">{selected.expertAnswer}</p>
                    {selected.expertId && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-100">
                        <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {selected.expertId?.name?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-green-700">
                            {selected.expertId?.name || 'Agricultural Expert'}
                          </p>
                          <p className="text-xs text-green-500">Certified Expert</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex items-center justify-center py-24">
                <div className="text-center">
                  <p className="text-5xl mb-4">👈</p>
                  <p className="text-gray-500 text-sm font-medium">Select a question to view answers</p>
                  <p className="text-gray-400 text-xs mt-1">Your questions and expert answers appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QandA;