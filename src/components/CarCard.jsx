import { Link } from 'react-router-dom';
import { Settings, Fuel, Calendar, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/CarCard.css';

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
    <div className="car-card glass-card" style={{ position: 'relative' }}>
      <button 
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 10,
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isFavorite ? '#ef4444' : 'white',
          transition: 'all 0.3s ease'
        }}
        title="Thêm vào yêu thích"
      >
        <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
      </button>
      <div className="car-image-container">
        <img src={image} alt={name} className="car-image" />
      </div>
      <div className="car-info">
        <h3 className="car-name">{name}</h3>
        <p className="car-price">${price.toLocaleString()}</p>
        <div className="car-specs">
          <div className="spec-item">
            <Calendar size={16} /> <span>{year}</span>
          </div>
          <div className="spec-item">
            <Settings size={16} /> <span>{type}</span>
          </div>
          <div className="spec-item">
            <Fuel size={16} /> <span>{fuel}</span>
          </div>
        </div>
        <Link to={`/car/${id}`} className="btn btn-primary btn-full">Xem Chi Tiết</Link>
      </div>
    </div>
  );
}
