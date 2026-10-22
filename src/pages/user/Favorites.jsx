import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Car, LogIn, Search, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCars } from '../../context/CarContext';
import CarCard, { CarCardSkeleton } from '../../components/user/CarCard';
import '../../styles/user/Favorites.css';

export default function Favorites() {
  const { user } = useAuth();
  const { cars, loading } = useCars();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return (
      <div className="container favorites-page">
        <div className="glass-card favorites-empty-card">
          <div className="fav-icon-wrapper">
            <Heart size={56} className="fav-icon-empty" />
          </div>
          <h2>Bạn Chưa Đăng Nhập</h2>
          <p>
            Vui lòng đăng nhập để lưu trữ và xem danh sách các mẫu xe siêu sang mà bạn yêu thích.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '24px' }}>
            <Link to="/login" className="btn btn-primary">
              <LogIn size={18} /> Đăng Nhập Ngay
            </Link>
            <Link to="/cars" className="btn btn-outline">
              <Car size={18} /> Xem Danh Sách Xe
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const favoriteCars = user.favorites ? cars.filter(car => user.favorites.includes(car.id)) : [];
  const filteredFavorites = favoriteCars.filter(car => 
    car.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container favorites-page">
      <div className="favorites-header">
        <Link to="/cars" className="back-link">
          <ArrowLeft size={18} /> Tiếp tục xem xe
        </Link>
        <div className="favorites-title-row">
          <div className="title-with-badge">
            <h1 className="section-title" style={{ margin: 0 }}>Mục Xe Yêu Thích</h1>
            <span className="fav-count-pill">{favoriteCars.length} mẫu xe</span>
          </div>
          <p className="favorites-subtitle">
            Bộ sưu tập những mẫu xe bạn đã lưu lại để tham khảo và đặt lịch lái thử.
          </p>
        </div>

        {favoriteCars.length > 0 && (
          <div style={{ marginTop: '16px', maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 14px', gap: '10px' }}>
              <Search size={18} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Tìm trong danh sách yêu thích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="cars-grid">
          {[1, 2, 3].map(n => (
            <CarCardSkeleton key={n} />
          ))}
        </div>
      ) : favoriteCars.length === 0 ? (
        <div className="glass-card favorites-empty-card">
          <div className="fav-icon-wrapper">
            <Heart size={56} className="fav-icon-empty" />
          </div>
          <h2>Danh Sách Yêu Thích Trống</h2>
          <p>
            Bạn chưa lưu mẫu xe nào. Hãy bấm vào biểu tượng trái tim trên bất kỳ chiếc xe nào để thêm vào danh sách yêu thích của bạn!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <Link to="/cars" className="btn btn-outline">
              Xóa bộ lọc
            </Link>
            <Link to="/cars" className="btn btn-primary">
              <Car size={18} /> Khám Phá Kho Xe Ngay
            </Link>
          </div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="glass-card favorites-empty-card">
          <div className="fav-icon-wrapper">
            <AlertCircle size={48} className="fav-icon-empty" />
          </div>
          <h2>Không Tìm Thấy Mẫu Xe</h2>
          <p>Không có mẫu xe yêu thích nào khớp với từ khóa tìm kiếm "{searchTerm}".</p>
          <button 
            type="button" 
            onClick={() => setSearchTerm('')} 
            className="btn btn-outline"
            style={{ marginTop: '24px' }}
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="cars-grid">
          {filteredFavorites.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      )}
    </div>
  );
}
