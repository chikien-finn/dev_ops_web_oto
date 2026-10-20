import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/user/Home';
import Cars from './pages/user/Cars';
import CarDetail from './pages/user/CarDetail';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Profile from './pages/user/Profile';
import Favorites from './pages/user/Favorites';
import Admin from './pages/admin/Admin';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`app-container ${isAdmin ? 'admin-app-mode' : ''}`}>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? 'admin-main-wrapper' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
