import { Link } from 'react-router-dom';
import { Settings, Fuel, Calendar, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FALLBACK_CAR_IMAGE } from '../../data/cars';
import '../../styles/user/CarCard.css';

export default function CarCard({ id, name, price, image, year, type, fuel }) {
  const { user, toggleFavorite } = useAuth();
  
  const isFavorite = user?.favorites?.includes(id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (user) {
      toggleFavorite(id);
    } else {
      alert('Vui lòng đăng nhập để thêm vào mục yêu thích');
    }
  };

  return (
    <div className="car-card glass-card">
      <div className="car-card-top-badges">
        <span className="car-type-badge">{type}</span>
        <button 
          onClick={handleFavoriteClick}
          className={`car-favorite-btn ${isFavorite ? 'active' : ''}`}
          title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="car-image-container">
        <img 
          src={image} 
          alt={name} 
          className="car-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_CAR_IMAGE;
          }}
        />
        <div className="car-image-gradient"></div>
      </div>

      <div className="car-info">
        <h3 className="car-name">{name}</h3>
        <div className="car-price-row">
          <span className="car-price-label">Giá niêm yết</span>
          <span className="car-price">${Number(price).toLocaleString()}</span>
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

        <Link to={`/car/${id}`} className="btn btn-primary btn-full car-detail-btn">
          Xem Chi Tiết <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
