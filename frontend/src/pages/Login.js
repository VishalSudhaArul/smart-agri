import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data, data.token);
      toast.success(`Welcome back, ${data.name}! 🌾`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f6f1' }}>
      {/* Left */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center px-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #14532d 0%, #166534 50%, #365314 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-green-900 font-bold text-xl mb-8">SA</div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Fraunces, serif' }}>
            Smart Agri
          </h1>
          <p className="text-green-200 text-base leading-relaxed mb-10">
            AI-powered farming advisory for Indian farmers. Get expert-verified advice on crops, soil, weather and more.
          </p>
          <div className="space-y-4">
            {[
              ['🌱', 'Crop Advisory', 'Personalized sowing & fertilizer plans'],
              ['🧪', 'Soil Analysis', 'NPK, pH and health scoring'],
              ['🔬', 'Disease Detection', 'Image-based crop diagnosis'],
              ['👨‍💼', 'Expert Network', '24/7 verified advisory'],
            ].map(([emoji, title, desc], i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">{emoji}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-green-300 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                Welcome back
              </h2>
              <p className="text-gray-500 text-sm">Sign in to your Smart Agri account</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <input type="password" placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="input-field" />
              </div>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary mt-2">
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                New to Smart Agri?{' '}
                <Link to="/register" className="text-green-600 font-semibold hover:underline">
                  Create free account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;