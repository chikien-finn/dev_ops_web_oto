import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Settings, Fuel, Calendar, ArrowLeft, Heart, 
  Gauge, Zap, ShieldCheck, CheckCircle2, 
  Compass, PhoneCall, Share2, Award, Sparkles, Send, Lock, AlertCircle
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FALLBACK_CAR_IMAGE } from '../../data/cars';
import { formatVndPrice, formatVndInstallment } from '../../utils/format';
import CarCard from '../../components/user/CarCard';
import api from '../../services/api';
import '../../styles/user/CarDetail.css';

export default function CarDetail() {
  const { id } = useParams();
  const { cars, loading } = useCars();
  const { user, toggleFavorite } = useAuth();
  const { showToast } = useToast();
  
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || user?.username || '',
    phone: user?.phone || '',
    date: '',
    location: 'showroom',
    note: ''
  });

  const today = new Date().toISOString().split('T')[0];

  const car = cars.find(c => c.id === parseInt(id));

  if (!car) {
    if (loading) {
      return (
        <div className="container" style={{ padding: '140px 20px', textAlign: 'center', minHeight: '60vh' }}>
          <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '40px' }}>
            <h3 style={{ color: 'var(--accent-hover)', marginBottom: '12px' }}>Đang Tải Dữ Liệu Xe...</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Vui lòng đợi giây lát trong khi hệ thống nạp dữ liệu từ máy chủ.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="container" style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Không tìm thấy mẫu xe</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Xe có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</p>
        <Link to="/cars" className="btn btn-primary">
          <ArrowLeft size={18} /> Quay lại danh sách xe
        </Link>
      </div>
    );
  }

  const isFavorite = user?.favorites?.includes(car.id);

  // Read specs directly from car.specs, fallback to 'Đang cập nhật' if missing
  const specs = car.specs || {};
  const acceleration = specs.acceleration || 'Đang cập nhật';
  const topSpeed = specs.topSpeed || 'Đang cập nhật';
  const horsepower = specs.horsepower || 'Đang cập nhật';
  const transmission = specs.transmission || 'Đang cập nhật';
  const drivetrain = specs.drivetrain || 'Đang cập nhật';
  const engine = specs.engine || 'Đang cập nhật';
  const features = Array.isArray(specs.features) && specs.features.length > 0 ? specs.features : [];

  const relatedCars = cars.filter(c => c.id !== car.id).slice(0, 3);

  const handleFavoriteClick = () => {
    if (user) {
      toggleFavorite(car.id);
      showToast(
        isFavorite ? 'info' : 'success',
        isFavorite ? `Đã bỏ "${car.name}" khỏi mục yêu thích.` : `Đã lưu "${car.name}" vào mục yêu thích! ❤️`
      );
    } else {
      showToast('info', 'Vui lòng đăng nhập để lưu xe vào danh sách yêu thích!');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('success', 'Đã sao chép liên kết chi tiết xe vào bộ nhớ tạm! 📋');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!user) {
      showToast('error', 'Quý khách vui lòng đăng nhập để đặt lịch lái thử!');
      return;
    }

    if (!bookingForm.name.trim() || bookingForm.name.trim().length < 2) {
      setBookingError('Vui lòng nhập họ và tên của quý khách (tối thiểu 2 ký tự).');
      return;
    }

    const phoneClean = bookingForm.phone.trim().replace(/\s/g, '');
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phoneClean)) {
      setBookingError('Số điện thoại không hợp lệ. Vui lòng nhập số di động 10 số (Ví dụ: 0912345678).');
      return;
    }

    if (!bookingForm.date) {
      setBookingError('Vui lòng chọn ngày dự kiến lái thử.');
      return;
    }
    if (bookingForm.date < today) {
      setBookingError('Ngày hẹn lái thử không được là ngày trong quá khứ.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createBooking({
        carId: car.id,
        carName: car.name,
        userId: user.id,
        name: bookingForm.name.trim(),
        phone: phoneClean,
        date: bookingForm.date,
        location: bookingForm.location,
        note: bookingForm.note.trim()
      });
      showToast('success', 'Đã gửi yêu cầu đặt lịch hẹn lái thử thành công! 🚗');
      setBookingSent(true);
    } catch (err) {
      console.warn('Lỗi khi gửi yêu cầu lái thử lên server:', err);
      setBookingError('Có lỗi khi gửi yêu cầu lên máy chủ, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="car-detail-page">
      {/* Top Breadcrumb Header */}
      <div className="container detail-breadcrumb-container">
        <div className="breadcrumb-nav">
          <Link to="/" className="breadcrumb-link">Trang Chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/cars" className="breadcrumb-link">Danh Sách Xe</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{car.name}</span>
        </div>
        <Link to="/cars" className="back-button">
          <ArrowLeft size={16} /> Danh Sách Xe
        </Link>
      </div>

      {/* Main Hero Showcase Grid */}
      <section className="container detail-hero-section">
        <div className="showcase-grid">
          {/* Left: Cinematic Car Visual */}
          <div className="car-showcase-visual glass-card">
            <div className="visual-image-wrapper">
              <img 
                src={car.image || FALLBACK_CAR_IMAGE} 
                alt={car.name} 
                className="showcase-main-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_CAR_IMAGE;
                }}
              />
              <div className="visual-gradient-overlay"></div>
              
              <div className="visual-top-tags">
                <span className="visual-tag tag-primary">
                  <Sparkles size={14} /> Siêu Phẩm
                </span>
                <span className="visual-tag tag-secondary">{car.type}</span>
                <span className="visual-tag tag-secondary">{car.year}</span>
              </div>

              {/* Floating Quick Stats Bar */}
              <div className="visual-floating-stats">
                <div className="floating-stat-item">
                  <Zap size={18} className="stat-icon" />
                  <div>
                    <div className="stat-title">0 - 100 km/h</div>
                    <div className="stat-val">{acceleration}</div>
                  </div>
                </div>
                <div className="floating-stat-divider"></div>
                <div className="floating-stat-item">
                  <Gauge size={18} className="stat-icon" />
                  <div>
                    <div className="stat-title">Công Suất</div>
                    <div className="stat-val">{horsepower}</div>
                  </div>
                </div>
                <div className="floating-stat-divider"></div>
                <div className="floating-stat-item">
                  <Compass size={18} className="stat-icon" />
                  <div>
                    <div className="stat-title">Tốc Độ Tối Đa</div>
                    <div className="stat-val">{topSpeed}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Car Identity & Primary Actions */}
          <div className="car-showcase-identity glass-card">
            <div className="identity-header">
              <span className="identity-brand-badge">{car.type} • AutoPremium Verified</span>
              <h1 className="car-detail-title">{car.name}</h1>
              
              <div className="car-detail-price-box">
                <span className="price-label">Giá niêm yết chính hãng</span>
                <div className="price-amount-row" style={{ alignItems: 'baseline', gap: '10px' }}>
                  <span className="price-value">${Number(car.price).toLocaleString()}</span>
                  <span className="price-subtext" style={{ color: '#10b981', fontWeight: 600 }}>({formatVndPrice(car.price)})</span>
                  <span className="price-subtext">• Đã bao gồm thuế GTGT</span>
                </div>
                <div className="price-estimate">
                  Dự toán trả góp chỉ từ <strong>${Math.round(car.price * 0.015).toLocaleString()}/tháng</strong> ({formatVndInstallment(car.price * 0.015)} • Hỗ trợ vay 80%)
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="identity-actions">
              <a href="#booking-section" className="btn btn-primary btn-booking">
                <Calendar size={18} /> Đặt Lịch Lái Thử VIP
              </a>
              <button 
                onClick={handleFavoriteClick} 
                className={`btn btn-outline btn-fav-action ${isFavorite ? 'active' : ''}`}
                title="Lưu vào xe yêu thích"
              >
                <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : 'currentColor'} />
                <span>{isFavorite ? 'Đã Lưu Yêu Thích' : 'Yêu Thích'}</span>
              </button>
              <button onClick={handleShare} className="btn btn-outline btn-icon-only" title="Chia sẻ mẫu xe này">
                <Share2 size={18} />
              </button>
            </div>

            {/* AutoPremium Guarantees */}
            <div className="identity-guarantees">
              <div className="guarantee-item">
                <ShieldCheck size={20} className="guarantee-icon" />
                <span>Kiểm định 200 điểm tiêu chuẩn quốc tế</span>
              </div>
              <div className="guarantee-item">
                <Award size={20} className="guarantee-icon" />
                <span>Bảo hành chính hãng 3 năm / 100.000 km</span>
              </div>
              <div className="guarantee-item">
                <PhoneCall size={20} className="guarantee-icon" />
                <span>Hỗ trợ cứu hộ 24/7 toàn quốc</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Technical Specs & Booking Form */}
      <div className="container detail-content-wrapper">
        <div className="detail-two-column-layout">
          {/* Left Column: Specifications and Features */}
          <div className="detail-left-content">
            {/* Tech Specs Grid */}
            <div className="detail-section">
              <div className="section-title-with-pill">
                <h2>Thông Số Kỹ Thuật Đỉnh Cao</h2>
                <span className="section-pill">Hiệu Năng Vượt Trội</span>
              </div>
              <p className="section-lead-text">
                Được trang bị những công nghệ kỹ thuật và khí động học tiên tiến nhất thế giới hiện nay.
              </p>

              <div className="tech-specs-grid">
                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Zap size={20} className="spec-icon-accent" />
                    <span>Tăng Tốc 0-100</span>
                  </div>
                  <div className="spec-card-value">{acceleration}</div>
                  <div className="spec-card-sub">Thời gian đạt vận tốc cực đại</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Gauge size={20} className="spec-icon-accent" />
                    <span>Mã Lực Cực Đại</span>
                  </div>
                  <div className="spec-card-value">{horsepower}</div>
                  <div className="spec-card-sub">Công suất máy đo tại bánh</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Fuel size={20} className="spec-icon-accent" />
                    <span>Nhiên Liệu</span>
                  </div>
                  <div className="spec-card-value">{car.fuel}</div>
                  <div className="spec-card-sub">{engine}</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Settings size={20} className="spec-icon-accent" />
                    <span>Hộp Số</span>
                  </div>
                  <div className="spec-card-value">{transmission}</div>
                  <div className="spec-card-sub">Chuyển số siêu tốc mượt mà</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Compass size={20} className="spec-icon-accent" />
                    <span>Dẫn Động</span>
                  </div>
                  <div className="spec-card-value">{drivetrain}</div>
                  <div className="spec-card-sub">Bám đường & phản xạ tức thì</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Calendar size={20} className="spec-icon-accent" />
                    <span>Đời Xe</span>
                  </div>
                  <div className="spec-card-value">{car.year}</div>
                  <div className="spec-card-sub">Phiên bản mới nhất</div>
                </div>
              </div>
            </div>

            {/* Highlights & Technology */}
            <div className="detail-section" style={{ marginTop: '50px' }}>
              <div className="section-title-with-pill">
                <h2>Trang Bị & Tiện Nghi Thượng Hạng</h2>
                <span className="section-pill">Đặc Điểm Nổi Bật</span>
              </div>
              <div className="features-cards-grid">
                {features.length > 0 ? (
                  features.map((feat, idx) => {
                    const title = typeof feat === 'string' ? feat : (feat.title || 'Đang cập nhật');
                    const desc = typeof feat === 'string' ? '' : (feat.desc || '');
                    return (
                      <div key={idx} className="feature-item-card glass-card">
                        <div className="feature-check-icon">
                          <CheckCircle2 size={24} />
                        </div>
                        <div className="feature-item-text">
                          <h4>{title}</h4>
                          {desc && <p>{desc}</p>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="feature-item-card glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Thông tin trang bị và tiện nghi đang được cập nhật.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: VIP Consultation & Booking Sidebar */}
          <div className="detail-right-content" id="booking-section">
            <div className="glass-card booking-sticky-card">
              <div className="booking-card-header">
                <span className="booking-badge">Trải Nghiệm Đẳng Cấp</span>
                <h3>Đăng Ký Lái Thử VIP</h3>
                <p>Nhận xe tại Showroom hoặc phục vụ tận nhà hoàn toàn miễn phí cùng chuyên gia AutoPremium.</p>
              </div>

              {!user ? (
                <div className="booking-require-login-box" style={{ textAlign: 'center', padding: '32px 14px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <Lock size={30} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Yêu Cầu Đăng Nhập</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '22px', lineHeight: 1.5 }}>
                    Quý khách vui lòng đăng nhập tài khoản AutoPremium để đặt lịch hẹn lái thử mẫu xe <strong>{car.name}</strong>.
                  </p>
                  <Link 
                    to="/login" 
                    state={{ error: 'Vui lòng đăng nhập để đặt lịch lái thử siêu xe.' }} 
                    className="btn btn-primary btn-full"
                  >
                    Đăng Nhập Ngay
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-outline btn-full" 
                    style={{ marginTop: '10px' }}
                  >
                    Chưa có tài khoản? Đăng Ký
                  </Link>
                </div>
              ) : bookingSent ? (
                <div className="booking-success-box">
                  <CheckCircle2 size={48} className="success-icon" />
                  <h4>Đã Tiếp Nhận Thành Công!</h4>
                  <p>
                    Cảm ơn quý khách <strong>{bookingForm.name}</strong>. Đội ngũ chuyên viên AutoPremium sẽ liên hệ qua số điện thoại <strong>{bookingForm.phone}</strong> trong vòng 15 phút.
                  </p>
                  <button onClick={() => setBookingSent(false)} className="btn btn-outline" style={{ marginTop: '16px' }}>
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form className="booking-form" onSubmit={handleBookingSubmit}>
                  {bookingError && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#fca5a5',
                      fontSize: '0.88rem',
                      marginBottom: '16px'
                    }}>
                      <AlertCircle size={16} />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Họ và Tên Quý Khách *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ví dụ: Nguyễn Văn A" 
                      required 
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Số Điện Thoại Liên Hệ (10 số di động) *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="Ví dụ: 0912 345 678" 
                      required 
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày Dự Kiến Lái Thử *</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      min={today}
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Địa Điểm Tiếp Nhận Xe</label>
                    <select 
                      className="form-control"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({...bookingForm, location: e.target.value})}
                    >
                      <option value="showroom">Tại Showroom AutoPremium (Quận 1, TP. HCM)</option>
                      <option value="home">Giao xe lái thử tận nhà quý khách</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Ghi Chú Hoặc Yêu Cầu Riêng</label>
                    <textarea 
                      className="form-control" 
                      rows="2" 
                      placeholder="Quý khách có nhu cầu đặc biệt nào không?..."
                      value={bookingForm.note}
                      onChange={(e) => setBookingForm({...bookingForm, note: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-full btn-submit-booking"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Đang Gửi Yêu Cầu...</span>
                    ) : (
                      <>
                        <Send size={18} /> Gửi Yêu Cầu Lái Thử (Miễn Phí)
                      </>
                    )}
                  </button>

                  <div className="booking-hotline-footer">
                    <PhoneCall size={16} />
                    <span>Tư vấn trực tiếp 24/7: <strong>1900 1234</strong></span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Cars Section */}
      {relatedCars.length > 0 && (
        <section className="container related-cars-section">
          <div className="related-section-header">
            <div>
              <span className="section-pill">Khám Phá Thêm</span>
              <h2 className="section-title" style={{ textAlign: 'left', margin: '8px 0 0 0' }}>Mẫu Xe Tương Tự</h2>
            </div>
            <Link to="/cars" className="btn btn-outline">
              Xem Tất Cả Kho Xe
            </Link>
          </div>
          
          <div className="cars-grid" style={{ marginTop: '30px' }}>
            {relatedCars.map(relatedCar => (
              <CarCard key={relatedCar.id} {...relatedCar} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
