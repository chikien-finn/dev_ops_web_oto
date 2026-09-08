import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import '../styles/Login.css';

export default function Login() {
  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <div className="login-header">
          <h2 className="login-title">Đăng Nhập</h2>
          <p className="login-subtitle">Chào mừng bạn quay trở lại AutoPremium</p>
        </div>

        <form>
          <div className="form-group">
            <label>Email</label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />
              <input type="email" className="form-control login-input" placeholder="Nhập email của bạn" />
            </div>
          </div>

          <div className="form-group login-password-group">
            <div className="login-label-row">
              <label className="login-label">Mật khẩu</label>
              <a href="#" className="login-forgot-password">Quên mật khẩu?</a>
            </div>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input type="password" className="form-control login-input" placeholder="Nhập mật khẩu" />
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-full">
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
