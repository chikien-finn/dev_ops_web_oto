import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import CarCard from '../components/CarCard';
import './Home.css';

export default function Home() {
  const featuredCars = [
    {
      id: 1,
      name: 'Mercedes-Benz S-Class 2026',
      price: 120000,
      image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=800&q=80',
      year: 2026,
      type: 'Sedan',
      fuel: 'Hybrid'
    },
    {
      id: 2,
      name: 'Porsche 911 Turbo S',
      price: 205000,
      image: 'https://images.unsplash.com/photo-1503376269389-90d20ef3571d?auto=format&fit=crop&w=800&q=80',
      year: 2025,
      type: 'Coupe',
      fuel: 'Gasoline'
    },
    {
      id: 3,
      name: 'Audi RS e-tron GT',
      price: 140000,
      image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=800&q=80',
      year: 2025,
      type: 'Sedan',
      fuel: 'Electric'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">Khởi Nguồn Đam Mê<br/><span>Tốc Độ & Đẳng Cấp</span></h1>
          <p className="hero-subtitle">
            Khám phá bộ sưu tập những mẫu siêu xe sang trọng và mạnh mẽ nhất hành tinh. Trải nghiệm cảm giác lái đỉnh cao cùng AutoPremium.
          </p>
          <div className="hero-actions">
            <Link to="/cars" className="btn btn-primary btn-lg">
              Khám Phá Ngay <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Tạo Tài Khoản
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="featured-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Bộ Sưu Tập Nổi Bật</h2>
            <p className="section-desc">Những kiệt tác thiết kế và kỹ thuật được săn đón nhiều nhất.</p>
          </div>
          <Link to="/cars" className="btn btn-outline">Xem Tất Cả</Link>
        </div>
        
        <div className="cars-grid">
          {featuredCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tại Sao Chọn AutoPremium?</h2>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon"><Star size={32} /></div>
              <h3>Chất Lượng Thượng Hạng</h3>
              <p>Mọi chiếc xe đều trải qua quy trình kiểm định nghiêm ngặt 200 điểm để đảm bảo hoàn hảo tuyệt đối.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><Star size={32} /></div>
              <h3>Dịch Vụ Đẳng Cấp</h3>
              <p>Trải nghiệm mua sắm cá nhân hóa với chuyên viên tư vấn riêng và dịch vụ giao xe tận nhà.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><Star size={32} /></div>
              <h3>Bảo Hành Toàn Cầu</h3>
              <p>Chính sách bảo hành mở rộng, hỗ trợ kỹ thuật 24/7 ở bất kỳ đâu trên thế giới.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
