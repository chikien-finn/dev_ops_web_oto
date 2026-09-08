import { Link } from 'react-router-dom';
import { Car, User, LogIn } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar() {
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
          <Link to="/login" className="btn btn-outline">
            <LogIn size={18} />
            Đăng Nhập
          </Link>
          <Link to="/register" className="btn btn-primary">
            <User size={18} />
            Đăng Ký
          </Link>
        </div>
      </div>
    </nav>
  );
}
