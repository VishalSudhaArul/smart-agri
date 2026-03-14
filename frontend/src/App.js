import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SoilAnalyzer from './pages/SoilAnalyzer';
import CropAdvisor from './pages/CropAdvisor';
import YieldPredictor from './pages/YieldPredictor';
import Navbar from './components/Navbar';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import QandA from './pages/QandA';
import ExpertDashboard from './pages/ExpertDashboard';
import DiseaseDetector from './pages/DiseaseDetector';
import Analytics from './pages/Analytics';
import MarketPrice from './pages/MarketPrice';
import CropCalendar from './pages/CropCalendar';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <PrivateRoute><Navbar /><Dashboard /></PrivateRoute>
        } />
        <Route path="/soil" element={
          <PrivateRoute><Navbar /><SoilAnalyzer /></PrivateRoute>
        } />
        <Route path="/crop" element={
          <PrivateRoute><Navbar /><CropAdvisor /></PrivateRoute>
        } />
        <Route path="/yield" element={
          <PrivateRoute><Navbar /><YieldPredictor /></PrivateRoute>
        } />
        <Route path="/weather" element={
          <PrivateRoute><Navbar /><Weather /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><Navbar /><Profile /></PrivateRoute>
        } />
        <Route path="/qa" element={
          <PrivateRoute><Navbar /><QandA /></PrivateRoute>
        } />
        <Route path="/expert" element={
          <PrivateRoute><Navbar /><ExpertDashboard /></PrivateRoute>
        } />
        <Route path="/disease" element={
          <PrivateRoute><Navbar /><DiseaseDetector /></PrivateRoute>
        } />
        <Route path="/analytics" element={
          <PrivateRoute><Navbar /><Analytics /></PrivateRoute>
        } />
        <Route path="/market" element={
          <PrivateRoute><Navbar /><MarketPrice /></PrivateRoute>
        } />
        <Route path="/calendar" element={
          <PrivateRoute><Navbar /><CropCalendar /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;