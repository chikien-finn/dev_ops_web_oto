import { Edit2, Trash2 } from 'lucide-react';
import { FALLBACK_CAR_IMAGE } from '../../data/cars';

export default function CarTable({ cars, onEdit, onDelete }) {
  return (
    <div className="glass-card admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Mẫu Xe</th>
            <th>Phân Khúc</th>
            <th>Năm</th>
            <th>Nhiên Liệu</th>
            <th>Giá Bán</th>
            <th style={{ textAlign: 'right' }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {cars.length > 0 ? (
            cars.map(car => (
              <tr key={car.id}>
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
                    />
                    <span className="car-name-text">{car.name}</span>
                  </div>
                </td>
                <td>
                  <span className="admin-badge badge-type">{car.type}</span>
                </td>
                <td>{car.year}</td>
                <td>
                  <span className="admin-badge badge-fuel">{car.fuel}</span>
                </td>
                <td className="car-price-cell">
                  ${Number(car.price).toLocaleString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => onEdit(car)} 
                      className="btn-action-icon"
                      title="Chỉnh sửa xe"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(car.id, car.name)} 
                      className="btn-action-icon delete"
                      title="Xóa xe"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                Không tìm thấy mẫu xe nào phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
