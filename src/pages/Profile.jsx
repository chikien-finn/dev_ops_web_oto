import { User, Mail, Phone, MapPin, Key, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="profile-page container">
      <div className="profile-grid">
        <div className="glass-card profile-sidebar">
          <div className="avatar-container">
            <User size={64} />
          </div>
          <h2>{user.name || user.username}</h2>
          <p>Thành viên AutoPremium</p>
          
          <ul className="profile-menu">
            <li>
              <button className="active">
                <User size={18} /> Thông tin cá nhân
              </button>
            </li>
            <li>
              <button>
                <Heart size={18} /> Xe yêu thích
              </button>
            </li>
            <li>
              <button>
                <Key size={18} /> Đổi mật khẩu
              </button>
            </li>
          </ul>
        </div>

        <div className="glass-card profile-content">
          <h3>Hồ Sơ Của Tôi</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Họ và Tên</label>
              <input type="text" defaultValue={user.name || ''} readOnly />
            </div>
            <div className="info-item">
              <label>Tên đăng nhập</label>
              <input type="text" defaultValue={user.username} readOnly />
            </div>
            <div className="info-item">
              <label>Email</label>
              <input type="email" defaultValue={`${user.username}@gmail.com`} readOnly />
            </div>
            <div className="info-item">
              <label>Số điện thoại</label>
              <input type="text" defaultValue="0123 456 789" readOnly />
            </div>
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <label>Địa chỉ</label>
              <input type="text" defaultValue="Hà Nội, Việt Nam" readOnly />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '32px' }}>Cập nhật thông tin</button>
        </div>
      </div>
    </div>
  );
}
