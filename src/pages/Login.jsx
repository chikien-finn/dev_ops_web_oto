import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import '../styles/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'user123' && password === '123456') {
      navigate('/');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <div className="login-header">
          <h2 className="login-title">Đăng Nhập</h2>
          <p className="login-subtitle">Chào mừng bạn quay trở lại AutoPremium</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Tên đăng nhập</label>
            <div className="login-input-wrapper">
              <User size={18} className="login-input-icon" />
              <input 
                type="text" 
                className="form-control login-input" 
                placeholder="Nhập tên đăng nhập" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group login-password-group">
            <div className="login-label-row">
              <label className="login-label">Mật khẩu</label>
              <a href="#" className="login-forgot-password">Quên mật khẩu?</a>
            </div>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input 
                type="password" 
                className="form-control login-input" 
                placeholder="Nhập mật khẩu" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Đăng Nhập <ArrowRight size={18} />
          </button>
        </form>

        <p className="login-footer-text">
          Chưa có tài khoản? <Link to="/register" className="login-register-link">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
