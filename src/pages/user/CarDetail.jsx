import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Settings, Fuel, Calendar, ArrowLeft, Heart, 
  Gauge, Zap, ShieldCheck, CheckCircle2, 
  Compass, PhoneCall, Share2, Award, Sparkles, Send
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import { FALLBACK_CAR_IMAGE } from '../../data/cars';
import CarCard from '../../components/user/CarCard';
import '../../styles/user/CarDetail.css';

const CAR_SPEC_DETAILS = {
  1: {
    acceleration: '4.4 giây',
    topSpeed: '250 km/h',
    horsepower: '429 HP',
    transmission: '9G-TRONIC 9 cấp',
    drivetrain: '4MATIC Toàn thời gian',
    engine: '3.0L Turbo Hybrid MHEV',
    features: [
      { title: 'Hệ thống treo khí nén AIRMATIC', desc: 'Tự động thích ứng giảm xóc theo từng điều kiện mặt đường' },
      { title: 'Nội thất Da Nappa & Gỗ quý', desc: 'Không gian tĩnh lặng tuyệt đối với kính cách âm nhiều lớp' },
      { title: 'Âm thanh Burmester® 3D High-End', desc: 'Hệ thống 15 loa vòm công suất 710 Watt sống động' },
      { title: 'Hỗ trợ lái bán tự động Cấp 3', desc: 'Tự động giữ làn, chuyển làn và bám đuôi an toàn' }
    ]
  },
  2: {
    acceleration: '2.7 giây',
    topSpeed: '330 km/h',
    horsepower: '650 HP',
    transmission: '8 cấp PDK ly hợp kép',
    drivetrain: 'AWD 4 bánh chủ động',
    engine: '3.8L Boxer Twin-Turbo',
    features: [
      { title: 'Phanh Gốm Carbon Porsche (PCCB)', desc: 'Hiệu suất phanh đỉnh cao với kẹp phanh 10 piston phía trước' },
      { title: 'Kiểm soát khung gầm PDCC', desc: 'Hạn chế tối đa độ nghiêng thân xe khi vào cua tốc độ cao' },
      { title: 'Ghế thể thao Adaptive 18 hướng', desc: 'Bọc da cao cấp với đường chỉ may thủ công thể thao độc quyền' },
      { title: 'Hệ thống treo chủ động PASM', desc: 'Hạ thấp trọng tâm 10mm mang lại trải nghiệm xe đua thuần túy' }
    ]
  },
  3: {
    acceleration: '3.1 giây',
    topSpeed: '250 km/h',
    horsepower: '637 HP',
    transmission: '2 cấp thể thao điện tử',
    drivetrain: 'quattro điện tử siêu nhạy',
    engine: 'Dual Electric Motors (800V)',
    features: [
      { title: 'Công nghệ sạc siêu nhanh 800V', desc: 'Sạc từ 5% lên 80% chỉ trong 22.5 phút với trạm sạc DC 270kW' },
      { title: 'Đèn pha Matrix LED & Laser Audi', desc: 'Tầm chiếu sáng vượt trội gấp đôi so với đèn thông thường' },
      { title: 'Hệ thống đánh lái 4 bánh', desc: 'Bán kính quay vòng linh hoạt và ổn định tuyệt đối ở tốc độ cao' },
      { title: 'Nội thất thuần chay sinh thái', desc: 'Chất liệu tái chế siêu cao cấp Dinamica & sợi Kaskade hiện đại' }
    ]
  },
  4: {
    acceleration: '3.0 giây',
    topSpeed: '305 km/h',
    horsepower: '617 HP',
    transmission: '8 cấp M Steptronic',
    drivetrain: 'M xDrive thể thao 3 chế độ',
    engine: '4.4L V8 M TwinPower Turbo',
    features: [
      { title: 'M xDrive với chế độ 2WD', desc: 'Tự do chuyển đổi giữa dẫn động 4 bánh và dẫn động cầu sau drift' },
      { title: 'Mui xe sợi Carbon gia cường (CFRP)', desc: 'Cắt giảm trọng lượng và tối ưu hóa trọng tâm xe thể thao' },
      { title: 'Hệ thống xả thể thao M Sport', desc: 'Âm thanh gầm rú uy lực với van bướm điều khiển điện tử' },
      { title: 'Bảng đồng hồ Live Cockpit Pro', desc: 'Màn hình 12.3 inch đồ họa thể thao chuyên biệt trường đua' }
    ]
  },
  5: {
    acceleration: '4.6 giây',
    topSpeed: '261 km/h',
    horsepower: '523 HP',
    transmission: '8 cấp ZF tự động',
    drivetrain: 'AWD Địa hình All-Terrain',
    engine: '4.4L Twin-Turbo V8 Hybrid',
    features: [
      { title: 'Hệ thống Terrain Response 2', desc: 'Tự động nhận diện và thích ứng mọi địa hình tuyết, bùn, đá, cát' },
      { title: 'Ghế thương gia Hạng Nhất SV', desc: 'Massage đá nóng, chỉnh điện 24 hướng và đệm đỡ bắp chân thư giãn' },
      { title: 'Khử tiếng ồn chủ động thế hệ 3', desc: 'Loa gắn tại tựa đầu tạo vùng tĩnh lặng riêng tư tối đa' },
      { title: 'Cửa mở tự động điều khiển điện', desc: 'Tích hợp cảm biến chống kẹt và tự hít cửa êm ái sang trọng' }
    ]
  },
  6: {
    acceleration: '3.5 giây',
    topSpeed: '325 km/h',
    horsepower: '671 HP',
    transmission: '8 cấp tự động thể thao',
    drivetrain: 'Cầu sau RWD vi sai điện tử E-Diff',
    engine: '4.0L Twin-Turbo V8',
    features: [
      { title: 'Siêu xe Super Tourer đầu tiên thế giới', desc: 'Sự kết hợp hoàn mỹ giữa sức mạnh mãnh thú và sự êm ái xa xỉ' },
      { title: 'Nội thất da Bridge of Weir thủ công', desc: 'Chế tác thủ công tại Vương Quốc Anh chuẩn hoàng gia' },
      { title: 'Hệ thống vi sai điện tử thông minh', desc: 'Phân bổ lực kéo theo mili-giây giúp ôm cua chuẩn xác tuyệt đối' },
      { title: 'Hệ thống giải trí thế hệ mới', desc: 'Màn hình cảm ứng điện dung sắc nét, Apple CarPlay không dây' }
    ]
  }
};

export default function CarDetail() {
  const { id } = useParams();
  const { cars } = useCars();
  const { user, toggleFavorite } = useAuth();
  
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    date: '',
    location: 'showroom',
    note: ''
  });

  const car = cars.find(c => c.id === parseInt(id));

  if (!car) {
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
  const carSpecs = CAR_SPEC_DETAILS[car.id] || {
    acceleration: '3.8 giây',
    topSpeed: '280 km/h',
    horsepower: '500 HP',
    transmission: 'Tự động thể thao',
    drivetrain: 'AWD Toàn thời gian',
    engine: `${car.fuel} High Performance`,
    features: [
      { title: 'Thiết kế ngoại thất khí động học', desc: 'Đường nét sang trọng, hệ số cản gió tối ưu vượt trội' },
      { title: 'Nội thất da cao cấp thượng hạng', desc: 'Ghế chỉnh điện đa hướng nhớ vị trí và sưởi/làm mát' },
      { title: 'Hệ thống an toàn chủ động 360°', desc: 'Cảnh báo điểm mù, phanh khẩn cấp tự động và camera toàn cảnh' },
      { title: 'Màn hình thông tin giải trí đa phương tiện', desc: 'Hỗ trợ kết nối thông minh không dây và định vị vệ tinh' }
    ]
  };

  const relatedCars = cars.filter(c => c.id !== car.id).slice(0, 3);

  const handleFavoriteClick = () => {
    if (user) {
      toggleFavorite(car.id);
    } else {
      alert('Vui lòng đăng nhập để lưu vào danh sách xe yêu thích!');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép liên kết chi tiết xe vào bộ nhớ tạm!');
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSent(true);
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
                    <div className="stat-val">{carSpecs.acceleration}</div>
                  </div>
                </div>
                <div className="floating-stat-divider"></div>
                <div className="floating-stat-item">
                  <Gauge size={18} className="stat-icon" />
                  <div>
                    <div className="stat-title">Công Suất</div>
                    <div className="stat-val">{carSpecs.horsepower}</div>
                  </div>
                </div>
                <div className="floating-stat-divider"></div>
                <div className="floating-stat-item">
                  <Compass size={18} className="stat-icon" />
                  <div>
                    <div className="stat-title">Tốc Độ Tối Đa</div>
                    <div className="stat-val">{carSpecs.topSpeed}</div>
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
                <div className="price-amount-row">
                  <span className="price-value">${Number(car.price).toLocaleString()}</span>
                  <span className="price-subtext">Đã bao gồm thuế GTGT</span>
                </div>
                <div className="price-estimate">
                  Dự toán trả góp chỉ từ <strong>${Math.round(car.price * 0.015).toLocaleString()}/tháng</strong> (Hỗ trợ vay 80%)
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
                  <div className="spec-card-value">{carSpecs.acceleration}</div>
                  <div className="spec-card-sub">Thời gian đạt vận tốc cực đại</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Gauge size={20} className="spec-icon-accent" />
                    <span>Mã Lực Cực Đại</span>
                  </div>
                  <div className="spec-card-value">{carSpecs.horsepower}</div>
                  <div className="spec-card-sub">Công suất máy đo tại bánh</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Fuel size={20} className="spec-icon-accent" />
                    <span>Nhiên Liệu</span>
                  </div>
                  <div className="spec-card-value">{car.fuel}</div>
                  <div className="spec-card-sub">{carSpecs.engine}</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Settings size={20} className="spec-icon-accent" />
                    <span>Hộp Số</span>
                  </div>
                  <div className="spec-card-value">{carSpecs.transmission}</div>
                  <div className="spec-card-sub">Chuyển số siêu tốc mượt mà</div>
                </div>

                <div className="tech-spec-card glass-card">
                  <div className="spec-card-header">
                    <Compass size={20} className="spec-icon-accent" />
                    <span>Dẫn Động</span>
                  </div>
                  <div className="spec-card-value">{carSpecs.drivetrain}</div>
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
                {carSpecs.features.map((feat, idx) => (
                  <div key={idx} className="feature-item-card glass-card">
                    <div className="feature-check-icon">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="feature-item-text">
                      <h4>{feat.title}</h4>
                      <p>{feat.desc}</p>
                    </div>
                  </div>
                ))}
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

              {bookingSent ? (
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
                    <label>Số Điện Thoại Liên Hệ *</label>
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
                    <label>Ngày Dự Kiến Lái Thử</label>
                    <input 
                      type="date" 
                      className="form-control" 
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

                  <button type="submit" className="btn btn-primary btn-full btn-submit-booking">
                    <Send size={18} /> Gửi Yêu Cầu Lái Thử (Miễn Phí)
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
