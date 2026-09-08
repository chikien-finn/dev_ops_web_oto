import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import '../styles/Login.css'; // Reusing login styles

export default function Register() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }
    // Simulate successful registration
    alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <h2 className="login-title">Đăng Ký</h2>
          <p className="login-subtitle">Gia nhập cộng đồng yêu xe đẳng cấp</p>
        </div>

        <form onSubmit={handleRegister}>
          {error && (
            <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Họ và Tên</label>
            <div className="login-input-wrapper">
              <User size={18} className="login-input-icon" />
              <input 
                type="text" 
                className="form-control login-input" 
                placeholder="Nhập họ và tên" 
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />
              <input 
                type="email" 
                className="form-control login-input" 
                placeholder="Nhập email của bạn" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input 
                type="password" 
                className="form-control login-input" 
                placeholder="Tạo mật khẩu" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group login-password-group">
            <label>Xác nhận Mật khẩu</label>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input 
                type="password" 
                className="form-control login-input" 
                placeholder="Nhập lại mật khẩu" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Đăng Ký <ArrowRight size={18} />
          </button>
        </form>

        <p className="login-footer-text">
          Đã có tài khoản? <Link to="/login" className="login-register-link">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
