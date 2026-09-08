import { Link } from 'react-router-dom';
import { Settings, Fuel, Calendar } from 'lucide-react';
import '../styles/CarCard.css';

export default function CarCard({ id, name, price, image, year, type, fuel }) {
  return (
    <div className="car-card glass-card">
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
