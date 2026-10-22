import { useState } from 'react';
import { Trash2, Phone, Calendar, MapPin, Search } from 'lucide-react';

const STATUS_MAP = {
  pending: { label: 'Chờ xử lý', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  contacted: { label: 'Đã liên hệ', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  completed: { label: 'Đã hoàn tất', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  cancelled: { label: 'Đã hủy', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' }
};

export default function BookingTable({ bookings, onStatusChange, onDeleteBooking }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = (bookings || []).filter(b => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchSearch = 
      (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.phone || '').includes(searchQuery) ||
      (b.carName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getCountByStatus = (status) => {
    if (!bookings) return 0;
    if (status === 'all') return bookings.length;
    return bookings.filter(b => b.status === status).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Booking Filter Controls */}
      <div className="admin-controls-bar">
        <div className="admin-search-wrapper">
          <Search size={18} className="admin-search-icon" />
          <input 
            type="text" 
            placeholder="Tìm theo tên khách, SĐT hoặc mẫu xe..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'pending', label: 'Chờ xử lý' },
            { key: 'contacted', label: 'Đã liên hệ' },
            { key: 'completed', label: 'Đã hoàn tất' },
            { key: 'cancelled', label: 'Đã hủy' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: filterStatus === tab.key ? 'rgba(102, 252, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: filterStatus === tab.key ? '#66fcf1' : 'rgba(255, 255, 255, 0.1)',
                color: filterStatus === tab.key ? '#66fcf1' : 'var(--text-secondary)'
              }}
            >
              {tab.label} ({getCountByStatus(tab.key)})
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khách Hàng</th>
              <th>Số Điện Thoại</th>
              <th>Mẫu Xe Đăng Ký</th>
              <th>Lịch Hẹn & Địa Điểm</th>
              <th>Ghi Chú Nhu Cầu</th>
              <th>Trạng Thái Xử Lý</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(b => {
                const statusConfig = STATUS_MAP[b.status] || STATUS_MAP.pending;
                return (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(69, 162, 158, 0.2)',
                          color: '#66fcf1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          border: '1px solid rgba(102, 252, 241, 0.3)'
                        }}>
                          {(b.name || 'K')[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600', color: '#fff' }}>{b.name}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`tel:${b.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#66fcf1', textDecoration: 'none', fontWeight: '500' }}>
                        <Phone size={14} /> {b.phone}
                      </a>
                    </td>
                    <td style={{ fontWeight: '600', color: '#fff' }}>{b.carName}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={13} style={{ color: '#45a29e' }} /> {b.date || 'Linh hoạt'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <MapPin size={13} /> {b.location === 'showroom' ? 'Showroom AutoPremium' : 'Lái thử tại nhà'}
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {b.note || 'Không có ghi chú thêm'}
                    </td>
                    <td>
                      <select 
                        value={b.status} 
                        onChange={(e) => onStatusChange(b.id, e.target.value)}
                        className="form-control"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.85rem',
                          width: 'auto',
                          fontWeight: '600',
                          color: statusConfig.color,
                          backgroundColor: statusConfig.bg,
                          borderColor: statusConfig.color,
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending" style={{ color: '#000' }}>🟡 Chờ xử lý</option>
                        <option value="contacted" style={{ color: '#000' }}>🔵 Đã liên hệ</option>
                        <option value="completed" style={{ color: '#000' }}>🟢 Đã hoàn tất</option>
                        <option value="cancelled" style={{ color: '#000' }}>🔴 Đã hủy</option>
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
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                  Không tìm thấy lịch hẹn lái thử nào phù hợp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
