import './Footer.css';
import { Car, Globe, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Car size={32} className="logo-icon" />
            <span>AutoPremium</span>
          </div>
          <p>Nâng tầm phong cách, khẳng định đẳng cấp với những mẫu xe siêu sang, hiệu năng cao hàng đầu thế giới.</p>
          <div className="social-links">
            <a href="#" className="social-icon"><Globe size={20} /></a>
            <a href="#" className="social-icon"><MessageCircle size={20} /></a>
            <a href="#" className="social-icon"><Mail size={20} /></a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Về Chúng Tôi</h4>
          <ul>
            <li><a href="#">Giới Thiệu</a></li>
            <li><a href="#">Dịch Vụ</a></li>
            <li><a href="#">Showroom</a></li>
            <li><a href="#">Tuyển Dụng</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Chính Sách</h4>
          <ul>
            <li><a href="#">Bảo Hành</a></li>
            <li><a href="#">Thanh Toán</a></li>
            <li><a href="#">Bảo Mật Thông Tin</a></li>
            <li><a href="#">Điều Khoản Dịch Vụ</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Liên Hệ</h4>
          <p>Email: contact@autopremium.com</p>
          <p>Hotline: +84 1900 1234</p>
          <p>Địa chỉ: 123 Đường Tốc Độ, Quận 1, TP. HCM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 AutoPremium. All rights reserved.</p>
      </div>
    </footer>
  );
}
