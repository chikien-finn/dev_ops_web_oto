import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      padding: '40px 20px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Đăng Nhập</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Chào mừng bạn quay trở lại AutoPremium</p>
        </div>

        <form>
          <div className="form-group">
            <label>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="email" className="form-control" placeholder="Nhập email của bạn" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ margin: 0 }}>Mật khẩu</label>
              <a href="#" style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>Quên mật khẩu?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="password" className="form-control" placeholder="Nhập mật khẩu" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-full">
            Đăng Nhập <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
