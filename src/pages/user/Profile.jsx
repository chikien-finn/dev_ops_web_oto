import { User, Key, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCars } from '../../context/CarContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CarCard from '../../components/user/CarCard';
import api from '../../services/api';
import '../../styles/user/Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { cars } = useCars();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'favorites', 'password'

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [profileMsg, setProfileMsg] = useState(null);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, navigate]);

  if (!user) return null;

  const favoriteCars = user.favorites ? cars.filter(car => user.favorites.includes(car.id)) : [];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    const res = await updateProfile(profileForm);
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'Cập nhật thất bại.' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    const res = await api.changePassword(user.id, passwordForm.currentPassword, passwordForm.newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordMsg({ type: 'error', text: res.message || 'Đổi mật khẩu thất bại.' });
    }
  };

  return (
    <div className="profile-page container">
      <div className="profile-grid">
        <div className="glass-card profile-sidebar">
          <div className="avatar-container">
            <User size={64} />
          </div>
          <h2>{user.name || user.username}</h2>
          <p>{user.role === 'admin' ? 'Quản Trị Viên AutoPremium' : 'Thành viên AutoPremium'}</p>
          
          <ul className="profile-menu">
            <li>
              <button 
                className={activeTab === 'profile' ? 'active' : ''} 
                onClick={() => { setActiveTab('profile'); setProfileMsg(null); }}
              >
                <User size={18} /> Thông tin cá nhân
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'favorites' ? 'active' : ''} 
                onClick={() => setActiveTab('favorites')}
              >
                <Heart size={18} /> Xe yêu thích ({favoriteCars.length})
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'password' ? 'active' : ''} 
                onClick={() => { setActiveTab('password'); setPasswordMsg(null); }}
              >
                <Key size={18} /> Đổi mật khẩu
              </button>
            </li>
          </ul>
        </div>

        <div className="glass-card profile-content">
          {activeTab === 'profile' && (
            <>
              <h3>Hồ Sơ Của Tôi</h3>
              {profileMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: profileMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: profileMsg.type === 'success' ? '#4ade80' : '#f87171',
                  border: `1px solid ${profileMsg.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  {profileMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{profileMsg.text}</span>
                </div>
              )}
              <form onSubmit={handleUpdateProfile}>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Họ và Tên</label>
                    <input 
                      type="text" 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="info-item">
                    <label>Tên đăng nhập (Cố định)</label>
                    <input type="text" value={user.username || ''} readOnly style={{ opacity: 0.7 }} />
                  </div>
                  <div className="info-item">
                    <label>Email (Cố định)</label>
                    <input type="email" value={user.email || `${user.username}@gmail.com`} readOnly style={{ opacity: 0.7 }} />
                  </div>
                  <div className="info-item">
                    <label>Số điện thoại</label>
                    <input 
                      type="text" 
                      value={profileForm.phone} 
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} 
                      placeholder="Nhập số điện thoại..."
                    />
                  </div>
                  <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                    <label>Địa chỉ</label>
                    <input 
                      type="text" 
                      value={profileForm.address} 
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} 
                      placeholder="Nhập địa chỉ của bạn..."
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '32px' }}>
                  Lưu thay đổi thông tin
                </button>
              </form>
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

          {activeTab === 'password' && (
            <>
              <h3>Đổi Mật Khẩu</h3>
              {passwordMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: passwordMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: passwordMsg.type === 'success' ? '#4ade80' : '#f87171',
                  border: `1px solid ${passwordMsg.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  {passwordMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}
              <form onSubmit={handleChangePassword} style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="info-item">
                  <label>Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} 
                    required 
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div className="info-item">
                  <label>Mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} 
                    required 
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
                <div className="info-item">
                  <label>Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} 
                    required 
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', width: 'fit-content' }}>
                  Xác nhận đổi mật khẩu
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
