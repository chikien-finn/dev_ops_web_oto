import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '100px 20px', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '560px', width: '100%', textAlign: 'center', padding: '48px 32px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(102, 252, 241, 0.12)',
          color: 'var(--accent-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '1px solid rgba(102, 252, 241, 0.25)'
        }}>
          <Compass size={36} />
        </div>

        <span style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: '20px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          marginBottom: '16px'
        }}>
          LỖI 404
        </span>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>
          Không Tìm Thấy Trang
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển. Hãy kiểm tra lại URL hoặc quay về trang chủ để khám phá showroom.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ minWidth: '160px' }}>
            <Home size={18} /> Về Trang Chủ
          </Link>
          <Link to="/cars" className="btn btn-outline" style={{ minWidth: '160px' }}>
            <ArrowLeft size={18} /> Xem Danh Sách Xe
          </Link>
        </div>
      </div>
    </div>
  );
}
