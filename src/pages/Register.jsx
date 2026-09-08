import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      padding: '40px 20px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Tạo Tài Khoản</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gia nhập cộng đồng yêu xe đẳng cấp</p>
        </div>

        <form>
          <div className="form-group">
            <label>Họ và Tên</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="text" className="form-control" placeholder="Nhập họ và tên" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="email" className="form-control" placeholder="Nhập email của bạn" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="password" className="form-control" placeholder="Tạo mật khẩu" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label>Xác nhận Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="password" className="form-control" placeholder="Nhập lại mật khẩu" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-full">
            Đăng Ký <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
