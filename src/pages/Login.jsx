import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/Login.css';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.registeredUsername || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState(() => 
    location.state?.registeredUsername
      ? `Đăng ký thành công! Vui lòng nhập mật khẩu cho tài khoản "${location.state.registeredUsername}" để tiếp tục.`
      : ''
  );
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    const result = login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <div className="login-header">
          <h2 className="login-title">Đăng Nhập</h2>
          <p className="login-subtitle">Chào mừng bạn quay trở lại AutoPremium</p>
        </div>

        {infoMsg && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle2 size={20} className="auth-alert-icon" />
            <span>{infoMsg}</span>
          </div>
        )}

        {error && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={20} className="auth-alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Tên đăng nhập hoặc Email</label>
            <div className="login-input-wrapper">
              <User size={18} className="login-input-icon" />
              <input 
                type="text" 
                className="form-control login-input" 
                placeholder="Nhập tên đăng nhập hoặc email" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group login-password-group">
            <div className="login-label-row">
              <label className="login-label">Mật khẩu</label>
              <a href="#" className="login-forgot-password" onClick={(e) => { e.preventDefault(); alert('Vui lòng liên hệ quản trị viên hoặc sử dụng tài khoản mẫu: user123 / 123456'); }}>Quên mật khẩu?</a>
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
