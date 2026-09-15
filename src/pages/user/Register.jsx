import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, AtSign, Mail, Phone, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import '../../styles/user/Register.css';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Kiểm tra tính hợp lệ
    if (!fullname.trim()) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername || trimmedUsername.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự.');
      return;
    }

    if (/\s/.test(trimmedUsername)) {
      setError('Tên đăng nhập không được chứa khoảng trắng.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Định dạng email không hợp lệ.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có độ dài ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    const result = register({
      fullname: fullname.trim(),
      username: trimmedUsername,
      email: email.trim(),
      phone: phone.trim(),
      password
    });

    if (!result.success) {
      setIsLoading(false);
      setError(result.message || 'Đăng ký không thành công. Vui lòng thử lại.');
      return;
    }

    setIsLoading(false);
    setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...');

    setTimeout(() => {
      navigate('/login', { state: { registeredUsername: trimmedUsername } });
    }, 1500);
  };

  return (
    <div className="register-container">
      <div className="glass-card register-card">
        <div className="register-header">
          <h2 className="register-title">Đăng Ký</h2>
          <p className="register-subtitle">Gia nhập cộng đồng yêu xe đẳng cấp AutoPremium</p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={20} className="auth-alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle2 size={20} className="auth-alert-icon" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Họ và Tên <span style={{ color: '#ff6b6b' }}>*</span></label>
            <div className="register-input-wrapper">
              <User size={18} className="register-input-icon" />
              <input 
                type="text" 
                className="form-control register-input" 
                placeholder="Ví dụ: Nguyễn Văn An" 
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                disabled={isLoading || !!successMsg}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tên đăng nhập <span style={{ color: '#ff6b6b' }}>*</span></label>
            <div className="register-input-wrapper">
              <AtSign size={18} className="register-input-icon" />
              <input 
                type="text" 
                className="form-control register-input" 
                placeholder="Ví dụ: vanan123 (không dấu, không khoảng trắng)" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading || !!successMsg}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email <span style={{ color: '#ff6b6b' }}>*</span></label>
            <div className="register-input-wrapper">
              <Mail size={18} className="register-input-icon" />
              <input 
                type="email" 
                className="form-control register-input" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || !!successMsg}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Số điện thoại (tùy chọn)</label>
            <div className="register-input-wrapper">
              <Phone size={18} className="register-input-icon" />
              <input 
                type="tel" 
                className="form-control register-input" 
                placeholder="Ví dụ: 0912 345 678" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading || !!successMsg}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu <span style={{ color: '#ff6b6b' }}>*</span></label>
            <div className="register-input-wrapper">
              <Lock size={18} className="register-input-icon" />
              <input 
                type="password" 
                className="form-control register-input" 
                placeholder="Tối thiểu 6 ký tự" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || !!successMsg}
              />
            </div>
          </div>

          <div className="form-group register-password-group">
            <label>Xác nhận Mật khẩu <span style={{ color: '#ff6b6b' }}>*</span></label>
            <div className="register-input-wrapper">
              <Lock size={18} className="register-input-icon" />
              <input 
                type="password" 
                className="form-control register-input" 
                placeholder="Nhập lại chính xác mật khẩu trên" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading || !!successMsg}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading || !!successMsg}
          >
            {isLoading ? 'Đang xử lý...' : (
              <>Đăng Ký Tài Khoản <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="register-footer-text">
          Đã có tài khoản? <Link to="/login" className="register-login-link">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}
