import { useParams, Link } from 'react-router-dom';
import { Settings, Fuel, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { allCars } from '../data/cars';
import '../styles/CarDetail.css';

export default function CarDetail() {
  const { id } = useParams();
  const car = allCars.find(c => c.id === parseInt(id));

  if (!car) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Không tìm thấy xe</h2>
        <Link to="/cars" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="car-detail-page">
      {/* Hero Header */}
      <div className="detail-hero" style={{ backgroundImage: `url(${car.image})` }}>
        <div className="detail-hero-overlay">
          <div className="container" style={{ width: '100%' }}>
            <Link to="/cars" className="back-link">
              <ArrowLeft size={20} /> Quay lại
            </Link>
            <h1 className="detail-title">{car.name}</h1>
            <p className="detail-price">${car.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="container detail-content">
        <div className="detail-grid">
          {/* Main Info */}
          <div className="detail-main">
            <h2 className="section-title">Thông số kỹ thuật</h2>
            <div className="specs-grid">
              <div className="spec-card glass-card">
                <Calendar className="spec-icon" size={24} />
                <div className="spec-info">
                  <span className="spec-label">Năm sản xuất</span>
                  <span className="spec-value">{car.year}</span>
                </div>
              </div>
              <div className="spec-card glass-card">
                <Settings className="spec-icon" size={24} />
                <div className="spec-info">
                  <span className="spec-label">Loại xe</span>
                  <span className="spec-value">{car.type}</span>
                </div>
              </div>
              <div className="spec-card glass-card">
                <Fuel className="spec-icon" size={24} />
                <div className="spec-info">
                  <span className="spec-label">Nhiên liệu</span>
                  <span className="spec-value">{car.fuel}</span>
                </div>
              </div>
            </div>

            <h2 className="section-title" style={{ marginTop: '40px' }}>Đặc điểm nổi bật</h2>
            <ul className="features-list">
              <li><CheckCircle2 size={20} className="feature-icon" /> Thiết kế ngoại thất sang trọng, đẳng cấp vượt thời gian</li>
              <li><CheckCircle2 size={20} className="feature-icon" /> Nội thất bọc da cao cấp, tiện nghi và không gian mở</li>
              <li><CheckCircle2 size={20} className="feature-icon" /> Hệ thống giải trí và âm thanh vòm đỉnh cao</li>
              <li><CheckCircle2 size={20} className="feature-icon" /> Các tính năng an toàn chủ động tiên tiến nhất</li>
            </ul>
          </div>

          {/* Sidebar / CTA */}
          <div className="detail-sidebar">
            <div className="glass-card contact-card">
              <h3>Bạn quan tâm mẫu xe này?</h3>
              <p>Để lại thông tin để nhận báo giá và tư vấn chi tiết từ chuyên gia của AutoPremium.</p>
              <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Đã gửi yêu cầu tư vấn!'); }}>
                <input type="text" className="form-control" placeholder="Họ và tên" required />
                <input type="text" className="form-control" placeholder="Số điện thoại" required />
                <button type="submit" className="btn btn-primary btn-full">Yêu cầu tư vấn</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
