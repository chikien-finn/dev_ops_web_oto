import { Edit2, Trash2, Zap, Fuel, Gauge } from 'lucide-react';
import { FALLBACK_CAR_IMAGE } from '../../data/cars';

export default function CarTable({ cars, onEdit, onDelete }) {
  const getFuelBadge = (fuel) => {
    switch (fuel) {
      case 'Electric':
        return <span className="admin-badge badge-electric"><Zap size={11} /> Thuần Điện</span>;
      case 'Hybrid':
        return <span className="admin-badge badge-hybrid"><Zap size={11} /> Hybrid</span>;
      default:
        return <span className="admin-badge badge-gasoline"><Fuel size={11} /> Xăng</span>;
    }
  };

  const getTypeBadge = (type) => {
    const typeClass = type?.toLowerCase() || 'sedan';
    return <span className={`admin-badge badge-type badge-type-${typeClass}`}>{type}</span>;
  };

  return (
    <div className="glass-card admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '70px', textAlign: 'center' }}>Mã ID</th>
            <th>Mẫu Siêu Xe</th>
            <th>Phân Khúc</th>
            <th>Năm SX</th>
            <th>Động Cơ & Nhiên Liệu</th>
            <th>Hiệu Năng (Specs)</th>
            <th>Giá Niêm Yết</th>
            <th style={{ textAlign: 'right' }}>Thao Tác Quản Trị</th>
          </tr>
        </thead>
        <tbody>
          {cars.length > 0 ? (
            cars.map(car => (
              <tr key={car.id}>
                <td style={{ textAlign: 'center' }}>
                  <span className="admin-table-id-pill">#{car.id}</span>
                </td>
                <td>
                  <div className="car-thumb-container">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="car-thumb-img" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_CAR_IMAGE;
                      }}
                      loading="lazy"
                    />
                    <div className="car-thumb-info">
                      <span className="car-name-text">{car.name}</span>
                      <span className="car-engine-text">
                        {car.specs?.engine || `${car.type} Premium Edition`}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  {getTypeBadge(car.type)}
                </td>
                <td style={{ fontWeight: '600', color: '#e5e7eb' }}>{car.year}</td>
                <td>
                  {getFuelBadge(car.fuel)}
                </td>
                <td>
                  <div className="table-specs-pill">
                    <span className="spec-val"><Gauge size={12} /> {car.specs?.horsepower || '—'}</span>
                    <span className="spec-sep">•</span>
                    <span className="spec-val">{car.specs?.acceleration || '—'}</span>
                  </div>
                </td>
                <td className="car-price-cell">
                  ${Number(car.price).toLocaleString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="admin-actions-cell" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      onClick={() => onEdit(car)} 
                      className="btn-action-icon"
                      title="Chỉnh sửa thông số xe"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(car.id, car.name)} 
                      className="btn-action-icon delete"
                      title="Xóa mẫu xe này"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '54px 20px', color: 'var(--text-secondary)' }}>
                Không tìm thấy mẫu xe nào phù hợp với bộ lọc hiện tại.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
