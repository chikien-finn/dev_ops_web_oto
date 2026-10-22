import { Link } from 'react-router-dom';
import { Settings, Fuel, Calendar, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FALLBACK_CAR_IMAGE } from '../../data/cars';
import { formatVndPrice } from '../../utils/format';
import '../../styles/user/CarCard.css';

export default function CarCard({ 
  id, 
  name, 
  price, 
  image, 
  year, 
  type, 
  fuel,
  onTestDrive,
  car
}) {
  const { user, toggleFavorite } = useAuth();
  const { showToast } = useToast();
  
  const isFavorite = user?.favorites?.includes(id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleFavorite(id);
      showToast(
        isFavorite ? 'info' : 'success', 
        isFavorite ? `Đã bỏ "${name}" khỏi mục yêu thích.` : `Đã lưu "${name}" vào mục yêu thích! ❤️`
      );
    } else {
      showToast('info', 'Vui lòng đăng nhập để lưu xe vào mục yêu thích!');
    }
  };

  const carData = car || { id, name, price, image, year, type, fuel };

  return (
    <div className="car-card glass-card">
      <div className="car-card-top-badges">
        <span className="car-type-badge">{type}</span>
        <button 
          onClick={handleFavoriteClick}
          className={`car-favorite-btn ${isFavorite ? 'active' : ''}`}
          title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          type="button"
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#ffffff'} />
        </button>
      </div>

      <div className="car-image-container">
        <Link to={`/car/${id}`}>
          <img 
            src={image || FALLBACK_CAR_IMAGE} 
            alt={name} 
            className="car-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_CAR_IMAGE;
            }}
          />
        </Link>
        <div className="car-image-gradient"></div>
      </div>

      <div className="car-info">
        <Link to={`/car/${id}`}>
          <h3 className="car-name">{name}</h3>
        </Link>
        <div className="car-price-row">
          <span className="car-price-label">Giá niêm yết</span>
          <div style={{ textAlign: 'right' }}>
            <div className="car-price">${Number(price).toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>{formatVndPrice(price)}</div>
          </div>
        </div>

        <div className="car-specs">
          <div className="spec-item">
            <Calendar size={15} /> <span>{year}</span>
          </div>
          <div className="spec-item">
            <Settings size={15} /> <span>{type}</span>
          </div>
          <div className="spec-item">
            <Fuel size={15} /> <span>{fuel}</span>
          </div>
        </div>

        {onTestDrive ? (
          <div className="car-card-dual-actions">
            <Link to={`/car/${id}`} className="btn btn-outline">
              <span>Chi Tiết</span>
              <ArrowRight size={15} />
            </Link>
            <button 
              type="button" 
              onClick={() => onTestDrive(carData)} 
              className="btn btn-primary"
              title="Đăng ký lịch lái thử mẫu xe này"
            >
              <Calendar size={15} />
              <span>Lái Thử</span>
            </button>
          </div>
        ) : (
          <Link to={`/car/${id}`} className="btn btn-primary btn-full car-detail-btn">
            Xem Chi Tiết <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="car-card glass-card car-skeleton-card">
      <div className="car-skeleton-img"></div>
      <div className="car-skeleton-body">
        <div className="car-skeleton-line" style={{ width: '70%', height: '22px' }}></div>
        <div className="car-skeleton-line" style={{ width: '45%', height: '18px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '6px 0' }}>
          <div className="car-skeleton-line" style={{ height: '16px' }}></div>
          <div className="car-skeleton-line" style={{ height: '16px' }}></div>
          <div className="car-skeleton-line" style={{ height: '16px' }}></div>
        </div>
        <div className="car-skeleton-line" style={{ width: '100%', height: '42px', marginTop: 'auto' }}></div>
      </div>
    </div>
  );
}
