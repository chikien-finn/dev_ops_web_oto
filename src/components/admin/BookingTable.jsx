import { Trash2, Phone, Calendar, MapPin } from 'lucide-react';

const STATUS_MAP = {
  pending: { label: 'Chờ xử lý', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  contacted: { label: 'Đã liên hệ', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  completed: { label: 'Đã hoàn tất', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  cancelled: { label: 'Đã hủy', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' }
};

export default function BookingTable({ bookings, onStatusChange, onDeleteBooking }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="glass-card admin-table-container" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Hiện chưa có yêu cầu lái thử nào từ khách hàng.</p>
      </div>
    );
  }

  return (
    <div className="glass-card admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Khách Hàng</th>
            <th>Liên Hệ</th>
            <th>Mẫu Xe Quan Tâm</th>
            <th>Lịch Hẹn & Địa Điểm</th>
            <th>Ghi Chú</th>
            <th>Trạng Thái</th>
            <th style={{ textAlign: 'right' }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const statusConfig = STATUS_MAP[b.status] || STATUS_MAP.pending;
            return (
              <tr key={b.id}>
                <td style={{ fontWeight: '600' }}>{b.name}</td>
                <td>
                  <a href={`tel:${b.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                    <Phone size={14} /> {b.phone}
                  </a>
                </td>
                <td style={{ fontWeight: '500' }}>{b.carName}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} style={{ color: 'var(--text-secondary)' }} /> {b.date || 'Linh hoạt'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                      <MapPin size={13} /> {b.location === 'showroom' ? 'Showroom' : 'Tận nhà'}
                    </span>
                  </div>
                </td>
                <td style={{ maxWidth: '220px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {b.note || 'Không có ghi chú'}
                </td>
                <td>
                  <select 
                    value={b.status} 
                    onChange={(e) => onStatusChange(b.id, e.target.value)}
                    className="form-control"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.82rem',
                      width: 'auto',
                      fontWeight: '500',
                      color: statusConfig.color,
                      backgroundColor: statusConfig.bg,
                      borderColor: statusConfig.color,
                      borderRadius: '6px'
                    }}
                  >
                    <option value="pending" style={{ color: '#000' }}>Chờ xử lý</option>
                    <option value="contacted" style={{ color: '#000' }}>Đã liên hệ</option>
                    <option value="completed" style={{ color: '#000' }}>Đã hoàn tất</option>
                    <option value="cancelled" style={{ color: '#000' }}>Đã hủy</option>
                  </select>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => onDeleteBooking(b.id, b.name)}
                    className="btn-action-icon delete"
                    style={{ marginLeft: 'auto' }}
                    title="Xóa yêu cầu"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
