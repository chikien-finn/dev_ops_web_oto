import { User, Key, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { allCars } from '../data/cars';
import CarCard from '../components/CarCard';
import '../styles/Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'favorites'

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const favoriteCars = user.favorites ? allCars.filter(car => user.favorites.includes(car.id)) : [];

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
              <button 
                className={activeTab === 'profile' ? 'active' : ''} 
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} /> Thông tin cá nhân
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'favorites' ? 'active' : ''}
                onClick={() => setActiveTab('favorites')}
              >
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
          {activeTab === 'profile' && (
            <>
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
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              <h3>Danh Sách Xe Yêu Thích</h3>
              {favoriteCars.length > 0 ? (
                <div className="cars-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '20px',
                  marginTop: '20px'
                }}>
                  {favoriteCars.map(car => (
                    <CarCard key={car.id} {...car} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  <p>Bạn chưa thêm xe nào vào danh sách yêu thích.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
