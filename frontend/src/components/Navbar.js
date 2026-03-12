import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/crop', label: 'Crop' },
    { to: '/soil', label: 'Soil' },
    { to: '/yield', label: 'Yield' },
    { to: '/weather', label: 'Weather' },
    { to: '/disease', label: 'Disease' },
    { to: '/qa', label: 'Q&A' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)' }}
      className="text-white px-6 py-3 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-green-900 font-bold text-sm">SA</div>
        <span className="brand font-bold text-lg tracking-wide">Smart Agri</span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map((link) => (
          <Link key={link.to} to={link.to}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all tracking-wide ${
              isActive(link.to)
                ? 'bg-white text-green-800 shadow-md'
                : 'text-green-100 hover:bg-white/15'
            }`}>
            {link.label}
          </Link>
        ))}
        {user?.role === 'expert' && (
          <Link to="/expert"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive('/expert') ? 'bg-white text-green-800' : 'text-green-100 hover:bg-white/15'
            }`}>
            Expert
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link to="/profile"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border border-white/20">
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-green-900 font-bold text-xs">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {user?.name}
        </Link>
        <button onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-full text-xs font-semibold transition-all">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;