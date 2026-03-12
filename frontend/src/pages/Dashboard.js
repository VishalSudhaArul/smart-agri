import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const cards = [
    { title: 'Crop Advisor', emoji: '🌱', desc: 'Personalized sowing, irrigation & fertilizer plans', link: '/crop', bg: '#f0fdf4', border: '#bbf7d0', accent: '#15803d', tag: 'AI Advisory' },
    { title: 'Soil Analyzer', emoji: '🧪', desc: 'NPK analysis, pH check & soil health scoring', link: '/soil', bg: '#fffbeb', border: '#fde68a', accent: '#b45309', tag: 'Lab Grade' },
    { title: 'Yield Predictor', emoji: '📈', desc: 'Predict harvest in quintals with confidence score', link: '/yield', bg: '#eff6ff', border: '#bfdbfe', accent: '#1d4ed8', tag: 'ML Model' },
    { title: 'Disease Detector', emoji: '🔬', desc: 'Upload crop image & describe symptoms for diagnosis', link: '/disease', bg: '#fff1f2', border: '#fecdd3', accent: '#be123c', tag: 'Image AI' },
    { title: 'Weather Advisory', emoji: '🌦️', desc: 'Live weather data with crop-specific farming advice', link: '/weather', bg: '#f0f9ff', border: '#bae6fd', accent: '#0369a1', tag: 'Live Data' },
    { title: 'Ask Experts', emoji: '💬', desc: 'AI answers + certified expert verification system', link: '/qa', bg: '#faf5ff', border: '#e9d5ff', accent: '#7e22ce', tag: 'AI + Human' },
  ];

  return (
    <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)' }}
        className="text-white px-8 py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5 rounded-full"
          style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="max-w-5xl mx-auto">
          <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-3 fade-up">
            Smart Agriculture Platform — India
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 fade-up delay-1">
            Welcome back, {user?.name}! 👨‍🌾
          </h1>
          <p className="text-green-200 text-base fade-up delay-2">
            📍 {user?.location?.district || 'Your Farm'}, {user?.location?.state || 'India'}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
            {[
              { label: 'AI Modules', value: '6', sub: 'Active' },
              { label: 'Expert Support', value: '24/7', sub: 'Available' },
              { label: 'Farmers', value: '10K+', sub: 'Helped' },
            ].map((s, i) => (
              <div key={i} className={`bg-white/10 border border-white/20 rounded-2xl p-4 text-center fade-up delay-${i + 3}`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-green-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Your Farming Tools</h2>
          <p className="text-gray-500 text-sm mt-1">6 AI-powered modules for smarter farming decisions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <Link to={card.link} key={i}
              className={`card-hover block rounded-2xl p-6 border fade-up delay-${i + 1}`}
              style={{ background: card.bg, borderColor: card.border }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: card.border, color: card.accent }}>
                  {card.tag}
                </span>
              </div>
              <h3 className="font-bold text-base mb-1.5" style={{ color: card.accent, fontFamily: 'Fraunces, serif' }}>
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
              <p className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: card.accent }}>
                Get Started <span>→</span>
              </p>
            </Link>
          ))}
        </div>

        {user?.role === 'expert' && (
          <Link to="/expert"
            className="card-hover mt-5 block rounded-2xl p-6 fade-up"
            style={{ background: 'linear-gradient(135deg, #14532d, #15803d)', color: 'white' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-xs uppercase tracking-widest mb-1">Expert Access</p>
                <h3 className="font-bold text-lg">👨‍💼 Expert Dashboard</h3>
                <p className="text-green-100 text-sm mt-1">Review questions and verify AI-generated answers</p>
              </div>
              <span className="text-4xl text-green-300">→</span>
            </div>
          </Link>
        )}

        <div className="mt-5 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm fade-up">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🌾 About Smart Agri</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Smart Agri is an AI-powered platform built for Indian farmers. Combining machine learning with
            expert agricultural knowledge, we deliver hyper-local advice on sowing, irrigation, fertilizers,
            pest control, and yield predictions in real time. Our dual AI + Expert verification system
            ensures every recommendation is accurate and trustworthy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;