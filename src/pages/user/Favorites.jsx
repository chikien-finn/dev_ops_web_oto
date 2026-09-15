import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Car, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCars } from '../../context/CarContext';
import CarCard from '../../components/user/CarCard';
import '../../styles/user/Favorites.css';

export default function Favorites() {
  const { user } = useAuth();
  const { cars } = useCars();

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
      </div>

      {favoriteCars.length > 0 ? (
        <div className="cars-grid">
          {favoriteCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      ) : (
        <div className="glass-card favorites-empty-card">
          <div className="fav-icon-wrapper">
            <Heart size={56} className="fav-icon-empty" />
          </div>
          <h2>Danh Sách Yêu Thích Trống</h2>
          <p>
            Bạn chưa lưu mẫu xe nào. Hãy bấm vào biểu tượng trái tim trên bất kỳ chiếc xe nào để thêm vào danh sách yêu thích của bạn!
          </p>
          <Link to="/cars" className="btn btn-primary" style={{ marginTop: '24px' }}>
            <Car size={18} /> Khám Phá Kho Xe Ngay
          </Link>
        </div>
      )}
    </div>
  );
}
