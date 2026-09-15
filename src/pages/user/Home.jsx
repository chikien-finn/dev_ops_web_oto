import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Star, ShieldCheck, Award, Zap, 
  Car, Sparkles, PhoneCall, ArrowRight, Calendar
} from 'lucide-react';
import CarCard from '../../components/user/CarCard';
import '../../styles/user/Home.css';
import { useCars } from '../../context/CarContext';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Nguyễn Tuấn Anh',
    role: 'Chủ Tịch Tập Đoàn Bất Động Sản',
    car: 'Porsche 911 Turbo S',
    content: 'Dịch vụ tại AutoPremium thực sự vượt ngoài mong đợi. Đội ngũ tư vấn giao xe tận biệt thự rất chu đáo, xe kiểm định hoàn hảo đến từng chi tiết.',
    rating: 5
  },
  {
    id: 2,
    name: 'Hoàng Minh Đức',
    role: 'CEO Công Nghệ',
    car: 'Mercedes-Benz S-Class 2026',
    content: 'Thủ tục bàn giao xe và hỗ trợ tài chính cực kỳ nhanh gọn. Tôi rất ấn tượng với chính sách bảo hành 3 năm và đội cứu hộ 24/7 chuyên nghiệp.',
    rating: 5
  },
  {
    id: 3,
    name: 'Lê Thảo Trang',
    role: 'Doanh Nhân & Nhà Sáng Lập',
    car: 'Range Rover SV Autobiography',
    content: 'Cảm giác lái thử xe trước khi quyết định mua rất thoải mái. AutoPremium là địa chỉ tin cậy số một cho những ai đam mê siêu xe tại Việt Nam.',
    rating: 5
  }
];

export default function Home() {
  const { cars } = useCars();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFeaturedCars = selectedCategory === 'All' 
    ? cars.slice(0, 3) 
    : cars.filter(c => c.type === selectedCategory).slice(0, 3);

  return (
    <div className="home-page">
      {/* 1. Hero Showcase Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="hero-badge-icon" />
            <span>Showroom Siêu Xe Thượng Hạng AutoPremium</span>
          </div>

          <h1 className="hero-title">
            Khởi Nguồn Đam Mê<br />
            <span className="hero-title-highlight">Tốc Độ & Đẳng Cấp</span>
          </h1>

          <p className="hero-subtitle">
            Khám phá bộ sưu tập những mẫu siêu xe sang trọng và mạnh mẽ nhất hành tinh. Trải nghiệm cảm giác lái thuần khiết cùng chuẩn mực phục vụ chuẩn Hoàng gia.
          </p>

          <div className="hero-actions">
            <Link to="/cars" className="btn btn-primary btn-hero">
              <span>Khám Phá Kho Xe</span>
              <ChevronRight size={20} />
            </Link>
            <Link to="/favorites" className="btn btn-outline btn-hero">
              <span>Mục Yêu Thích</span>
            </Link>
          </div>

          {/* Floating Key Metrics */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-number">500+</span>
              <span className="metric-label">Siêu Xe Đã Giao</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Chính Hãng Nhập Khẩu</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">200+</span>
              <span className="metric-label">Điểm Kiểm Định Kỹ Thuật</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">24/7</span>
              <span className="metric-label">Hỗ Trợ VIP Tận Nơi</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Cars Section with Filter Tabs */}
      <section className="featured-section container">
        <div className="section-header-modern">
          <div className="section-title-wrap">
            <span className="section-sub-pill">Tuyển Chọn Đỉnh Cao</span>
            <h2 className="section-title-modern">Bộ Sưu Tập Nổi Bật</h2>
            <p className="section-desc-modern">Những kiệt tác thiết kế và kỹ thuật khí động học được săn đón nhiều nhất.</p>
          </div>

          {/* Category Tabs */}
          <div className="home-category-tabs">
            {['All', 'Coupe', 'Sedan', 'SUV'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat === 'All' ? 'Tất Cả Mẫu' : cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="cars-grid">
          {filteredFeaturedCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>

        <div className="view-all-bottom">
          <Link to="/cars" className="btn btn-outline btn-view-all">
            Xem Toàn Bộ {cars.length} Mẫu Xe <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="why-us-section">
        <div className="container">
          <div className="section-center-header">
            <span className="section-sub-pill">Giá Trị Cốt Lõi</span>
            <h2 className="section-title-modern">Đặc Quyền Khách Hàng AutoPremium</h2>
            <p className="section-desc-modern" style={{ maxWidth: '640px', margin: '0 auto' }}>
              Chúng tôi không chỉ trao chìa khóa một chiếc xe, mà còn mở ra phong cách sống thượng lưu với những dịch vụ chu toàn nhất.
            </p>
          </div>

          <div className="why-us-grid">
            <div className="why-us-card glass-card">
              <div className="why-card-number">01</div>
              <div className="why-icon-box">
                <ShieldCheck size={28} />
              </div>
              <h3>Kiểm Định 200 Điểm Khắt Khe</h3>
              <p>Mỗi chiếc xe đều vượt qua quy trình kiểm tra nghiêm ngặt từ động cơ, hệ thống khung gầm đến từng chi tiết nội thất thủ công.</p>
            </div>

            <div className="why-us-card glass-card">
              <div className="why-card-number">02</div>
              <div className="why-icon-box">
                <Car size={28} />
              </div>
              <h3>Lái Thử Tận Nhà Miễn Phí</h3>
              <p>Trải nghiệm cảm giác lái phấn khích ngay tại cung đường yêu thích của quý khách cùng chuyên viên hướng dẫn chuyên nghiệp.</p>
            </div>

            <div className="why-us-card glass-card">
              <div className="why-card-number">03</div>
              <div className="why-icon-box">
                <Award size={28} />
              </div>
              <h3>Bảo Hành 3 Năm Quốc Tế</h3>
              <p>Chính sách bảo dưỡng toàn diện, cung cấp phụ tùng chính hãng nhập khẩu trực tiếp từ các xưởng chế tác châu Âu.</p>
            </div>

            <div className="why-us-card glass-card">
              <div className="why-card-number">04</div>
              <div className="why-icon-box">
                <Zap size={28} />
              </div>
              <h3>Hỗ Trợ Tài Chính Linh Hoạt</h3>
              <p>Hợp tác cùng các ngân hàng quốc tế hàng đầu, cung cấp gói hỗ trợ trả góp lên đến 80% giá trị xe với lãi suất ưu đãi độc quyền.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VIP Call To Action Banner */}
      <section className="container vip-cta-section">
        <div className="vip-cta-card glass-card">
          <div className="vip-cta-content">
            <span className="vip-cta-pill">
              <Sparkles size={14} /> Trải Nghiệm Thực Tế
            </span>
            <h2>Sẵn Sàng Trải Nghiệm Tiếng Gầm Của Những Siêu Phẩm?</h2>
            <p>
              Đặt lịch hẹn ngay hôm nay để trở thành một trong những người đầu tiên cầm lái những mẫu xe danh giá nhất tại showroom của chúng tôi.
            </p>
            <div className="vip-cta-actions">
              <Link to="/cars" className="btn btn-primary btn-cta-lg">
                <Calendar size={18} /> Đặt Lịch Lái Thử VIP
              </Link>
              <a href="tel:19001234" className="btn btn-outline btn-cta-lg">
                <PhoneCall size={18} /> Hotline: 1900 1234
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="container testimonials-section">
        <div className="section-center-header">
          <span className="section-sub-pill">Khách Hàng Nói Gì Về Chúng Tôi</span>
          <h2 className="section-title-modern">Trải Nghiệm Từ Những Chủ Nhân</h2>
          <p className="section-desc-modern" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Sự hài lòng và niềm kiêu hãnh của quý khách hàng chính là bảo chứng giá trị nhất cho thương hiệu AutoPremium.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(item => (
            <div key={item.id} className="testimonial-card glass-card">
              <div className="testimonial-stars">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#eab308" color="#eab308" />
                ))}
              </div>
              <p className="testimonial-quote">"{item.content}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {item.name.charAt(0)}
                </div>
                <div className="author-info">
                  <h4>{item.name}</h4>
                  <span className="author-role">{item.role}</span>
                  <span className="author-car">• Sở hữu: {item.car}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
