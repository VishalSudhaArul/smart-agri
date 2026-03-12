import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', role: 'farmer',
    location: { state: '', district: '', village: '' }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleLocation = (e) => setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      toast.success('Registration successful! 🌾');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4" style={{ background: '#f8f6f1' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-green-900 font-bold text-xl"
            style={{ background: '#fbbf24' }}>SA</div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces, serif' }}>
            Join Smart Agri
          </h1>
          <p className="text-gray-500 text-sm mt-2">Create your free farmer account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input name="name" placeholder="Vishal Singh" onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone</label>
                <input name="phone" placeholder="9999999999" onChange={handleChange} className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
              <input name="email" type="email" placeholder="you@example.com" onChange={handleChange} className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
              <input name="password" type="password" placeholder="••••••••" onChange={handleChange} className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Role</label>
              <select name="role" onChange={handleChange} className="input-field">
                <option value="farmer">👨‍🌾 Farmer</option>
                <option value="expert">👨‍💼 Agricultural Expert</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">📍 Location</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">State</label>
                  <input name="state" placeholder="Punjab" onChange={handleLocation} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">District</label>
                  <input name="district" placeholder="Amritsar" onChange={handleLocation} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Village</label>
                  <input name="village" placeholder="Village" onChange={handleLocation} className="input-field" />
                </div>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="btn-primary">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;