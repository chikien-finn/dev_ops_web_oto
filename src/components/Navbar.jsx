import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogIn, LogOut } from 'lucide-react';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Car size={32} className="logo-icon" />
          <span>AutoPremium</span>
        </Link>
        <ul className="navbar-links">
          <li><Link to="/">Trang Chủ</Link></li>
          <li><Link to="/cars">Sản Phẩm</Link></li>
        </ul>
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={18} />
                <span style={{ fontWeight: '500' }}>{user.name || user.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut size={18} />
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                <LogIn size={18} />
                Đăng Nhập
              </Link>
              <Link to="/register" className="btn btn-primary">
                <User size={18} />
                Đăng Ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
