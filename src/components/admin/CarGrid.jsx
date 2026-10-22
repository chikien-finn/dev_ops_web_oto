import { Edit2, Trash2, Gauge, Zap, Calendar, Fuel } from 'lucide-react';
import { FALLBACK_CAR_IMAGE } from '../../data/cars';

export default function CarGrid({ cars, onEdit, onDelete }) {
  if (!cars || cars.length === 0) {
    return (
      <div className="glass-card admin-empty-state">
        <p>Không tìm thấy mẫu xe nào phù hợp với bộ lọc hiện tại.</p>
      </div>
    );
  }

  const getFuelBadge = (fuel) => {
    switch (fuel) {
      case 'Electric':
        return <span className="admin-badge badge-electric"><Zap size={12} /> Thuần Điện</span>;
      case 'Hybrid':
        return <span className="admin-badge badge-hybrid"><Zap size={12} /> Hybrid</span>;
      default:
        return <span className="admin-badge badge-gasoline"><Fuel size={12} /> Xăng</span>;
    }
  };

  const getTypeBadge = (type) => {
    const typeClass = type?.toLowerCase() || 'sedan';
    return <span className={`admin-badge badge-type badge-type-${typeClass}`}>{type}</span>;
  };

  return (
    <div className="admin-cars-grid-view">
      {cars.map((car) => {
        const hp = car.specs?.horsepower || '—';
        const accel = car.specs?.acceleration || '—';
        const topSpeed = car.specs?.topSpeed || '';

        return (
          <div key={car.id} className="glass-card admin-car-card">
            <div className="admin-car-card-media">
              <img 
                src={car.image} 
                alt={car.name} 
                className="admin-car-card-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_CAR_IMAGE;
                }}
                loading="lazy"
              />
              <div className="admin-car-card-badges">
                {getTypeBadge(car.type)}
                {getFuelBadge(car.fuel)}
              </div>
              <span className="admin-car-id-tag">#{car.id}</span>
            </div>

            <div className="admin-car-card-content">
              <div className="admin-car-card-header">
                <h4 className="admin-car-card-title" title={car.name}>{car.name}</h4>
                <div className="admin-car-card-price">
                  ${Number(car.price).toLocaleString()}
                </div>
              </div>

              <div className="admin-car-specs-chips">
                <div className="spec-chip" title="Mã lực động cơ">
                  <Gauge size={13} />
                  <span>{hp}</span>
                </div>
                <div className="spec-chip" title="Thời gian tăng tốc 0-100 km/h">
                  <Zap size={13} />
                  <span>{accel}</span>
                </div>
                <div className="spec-chip" title="Năm sản xuất">
                  <Calendar size={13} />
                  <span>{car.year}</span>
                </div>
                {topSpeed && (
                  <div className="spec-chip" title="Tốc độ tối đa">
                    <span>⚡ {topSpeed}</span>
                  </div>
                )}
              </div>

              <div className="admin-car-card-footer">
                <button 
                  onClick={() => onEdit(car)} 
                  className="btn-card-action edit"
                  title="Chỉnh sửa thông số mẫu xe này"
                >
                  <Edit2 size={15} /> Sửa
                </button>
                <button 
                  onClick={() => onDelete(car.id, car.name)} 
                  className="btn-card-action delete"
                  title="Xóa mẫu xe khỏi kho"
                >
                  <Trash2 size={15} /> Xóa
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
