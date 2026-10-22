import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Fuel, 
  CheckCircle2, AlertCircle, X, Lock, Send
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CarCard, { CarCardSkeleton } from '../../components/user/CarCard';
import api from '../../services/api';
import '../../styles/user/Home.css';

export default function Home() {
  const { cars, loading } = useCars();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Booking Modal State
  const [bookingCar, setBookingCar] = useState(null);
  const [requireLoginCar, setRequireLoginCar] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    location: 'showroom',
    note: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Today for date input min
  const today = new Date().toISOString().split('T')[0];

  // Available Filter Options
  const carTypes = useMemo(() => ['All', ...new Set(cars.map(c => c.type))], [cars]);
  const fuelTypes = useMemo(() => ['All', ...new Set(cars.map(c => c.fuel))], [cars]);

  // Filter & Sort cars
  const filteredCars = useMemo(() => {
    return cars
      .filter(car => {
        const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || car.type === selectedType;
        const matchesFuel = selectedFuel === 'All' || car.fuel === selectedFuel;
        return matchesSearch && matchesType && matchesFuel;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === 'year-desc') return (Number(b.year) || 0) - (Number(a.year) || 0);
        return 0;
      });
  }, [cars, searchTerm, selectedType, selectedFuel, sortBy]);

  // Open Test Drive Flow
  const handleTestDriveClick = (car) => {
    if (!user) {
      // User must be logged in to book test drive
      setRequireLoginCar(car);
      return;
    }

    setBookingCar(car);
    setBookingError('');
    setBookingSuccess(false);
    setBookingForm({
      name: user.name || user.username || '',
      phone: user.phone || '',
      date: '',
      location: 'showroom',
      note: ''
    });
  };

  // Submit Test Drive Booking with full field validation
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    // 1. Validate Họ và Tên
    if (!bookingForm.name.trim() || bookingForm.name.trim().length < 2) {
      setBookingError('Vui lòng nhập họ và tên của quý khách (tối thiểu 2 ký tự).');
      return;
    }

    // 2. Validate Số điện thoại Việt Nam (10 số)
    const phoneClean = bookingForm.phone.trim().replace(/\s/g, '');
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phoneClean)) {
      setBookingError('Số điện thoại không hợp lệ. Vui lòng nhập số di động 10 số (Ví dụ: 0912345678).');
      return;
    }

    // 3. Validate Ngày hẹn
    if (!bookingForm.date) {
      setBookingError('Vui lòng chọn ngày dự kiến lái thử.');
      return;
    }
    if (bookingForm.date < today) {
      setBookingError('Ngày hẹn lái thử không được là ngày trong quá khứ.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await api.createBooking({
        carId: bookingCar.id,
        carName: bookingCar.name,
        userId: user?.id || null,
        name: bookingForm.name.trim(),
        phone: phoneClean,
        date: bookingForm.date,
        location: bookingForm.location,
        note: bookingForm.note.trim()
      });

      if (res.success || !res.isNetworkError) {
        setBookingSuccess(true);
        showToast('success', `Đã đặt lịch hẹn lái thử mẫu xe ${bookingCar.name} thành công! 🚗`);
      } else {
        setBookingError(res.message || 'Có lỗi khi gửi yêu cầu. Vui lòng thử lại sau.');
      }
    } catch {
      setBookingError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const closeBookingModal = () => {
    setBookingCar(null);
    setBookingSuccess(false);
    setBookingError('');
  };

  return (
    <div className="user-home-container">
      {/* 1. Showroom Top Hero Header */}
      <section className="showroom-hero-bar">
        <div className="container">
          <div className="showroom-hero-text">
            <span className="showroom-pill">AutoPremium Showroom • 2026 Fleet</span>
            <h1 className="showroom-main-title">Kho Siêu Xe Thượng Hạng</h1>
            <p className="showroom-main-desc">
              Trải nghiệm bộ sưu tập siêu xe thể thao, sedan hạng sang và SUV địa hình đỉnh cao. Đăng ký lái thử trực tiếp hoặc giao xe tận nhà.
            </p>
          </div>

          {/* Quick Search & Filters Tool */}
          <div className="showroom-filter-card glass-card">
            <div className="showroom-search-row">
              <div className="showroom-search-input-wrap">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm siêu xe theo tên (Ferrari, Porsche, Rolls-Royce, Audi...)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="showroom-search-field"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="search-clear-btn" title="Xóa tìm kiếm">
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="showroom-sort-wrap">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="showroom-select"
                >
                  <option value="default">Sắp xếp: Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="year-desc">Đời xe: Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Category and Fuel Filter Pills */}
            <div className="showroom-filter-pills-row">
              <div className="filter-group-wrap">
                <span className="filter-group-title"><Filter size={14} /> Kiểu dáng:</span>
                <div className="pills-list">
                  {carTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`pill-btn ${selectedType === type ? 'active' : ''}`}
                    >
                      {type === 'All' ? 'Tất Cả' : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group-wrap">
                <span className="filter-group-title"><Fuel size={14} /> Nhiên liệu:</span>
                <div className="pills-list">
                  {fuelTypes.map(fuel => (
                    <button
                      key={fuel}
                      onClick={() => setSelectedFuel(fuel)}
                      className={`pill-btn ${selectedFuel === fuel ? 'active' : ''}`}
                    >
                      {fuel === 'All' ? 'Tất Cả' : fuel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cars Grid Section */}
      <section className="showroom-cars-section container">
        <div className="showroom-results-header">
          <div className="results-count">
            Đang hiển thị <strong>{filteredCars.length}</strong> mẫu siêu xe
            {selectedType !== 'All' && ` • Phân khúc: ${selectedType}`}
            {selectedFuel !== 'All' && ` • Nhiên liệu: ${selectedFuel}`}
          </div>
          {(searchTerm || selectedType !== 'All' || selectedFuel !== 'All') && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedType('All'); setSelectedFuel('All'); setSortBy('default'); }}
              className="reset-filters-btn"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {loading ? (
          <div className="showroom-cars-grid">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <CarCardSkeleton key={n} />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="glass-card showroom-empty-box">
            <AlertCircle size={44} className="empty-icon" />
            <h3>Không tìm thấy mẫu xe nào</h3>
            <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc phân khúc.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedType('All'); setSelectedFuel('All'); setSortBy('default'); }}
              className="btn btn-outline"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="showroom-cars-grid">
            {filteredCars.map(car => (
              <CarCard
                key={car.id}
                {...car}
                car={car}
                onTestDrive={handleTestDriveClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          3. LOGIN REQUIRED MODAL (WHEN GUEST CLICKS TEST DRIVE)
          ========================================================= */}
      {requireLoginCar && (
        <div className="modal-backdrop" onClick={() => setRequireLoginCar(null)}>
          <div className="modal-dialog glass-card require-login-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setRequireLoginCar(null)}>
              <X size={20} />
            </button>
            <div className="require-login-icon">
              <Lock size={40} />
            </div>
            <h3 className="require-login-title">Yêu Cầu Đăng Nhập</h3>
            <p className="require-login-desc">
              Để đảm bảo bảo mật và sắp xếp xe lái thử chu đáo nhất cho mẫu xe <strong>{requireLoginCar.name}</strong>, quý khách vui lòng đăng nhập tài khoản trước khi đăng ký.
            </p>
            <div className="require-login-actions">
              <button 
                onClick={() => {
                  setRequireLoginCar(null);
                  navigate('/login', { state: { error: 'Vui lòng đăng nhập để tiếp tục đăng ký lái thử xe.' } });
                }} 
                className="btn btn-primary btn-full"
              >
                Đăng Nhập Ngay
              </button>
              <button 
                onClick={() => {
                  setRequireLoginCar(null);
                  navigate('/register');
                }} 
                className="btn btn-outline btn-full"
              >
                Chưa có tài khoản? Đăng Ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          4. TEST DRIVE BOOKING MODAL (FOR LOGGED-IN USERS)
          ========================================================= */}
      {bookingCar && (
        <div className="modal-backdrop" onClick={closeBookingModal}>
          <div className="modal-dialog glass-card test-drive-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeBookingModal}>
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="booking-modal-success">
                <CheckCircle2 size={56} className="success-icon" />
                <h3>Đã Đặt Lịch Lái Thử Thành Công!</h3>
                <p>
                  Cảm ơn quý khách <strong>{bookingForm.name}</strong>. AutoPremium đã tiếp nhận yêu cầu lái thử mẫu xe <strong>{bookingCar.name}</strong>.
                </p>
                <div className="success-details-box">
                  <div><strong>Ngày lái thử:</strong> {bookingForm.date}</div>
                  <div><strong>Địa điểm:</strong> {bookingForm.location === 'showroom' ? 'Tại Showroom AutoPremium' : 'Giao xe lái thử tận nhà'}</div>
                  <div><strong>Điện thoại:</strong> {bookingForm.phone}</div>
                </div>
                <p className="success-note">
                  Chuyên viên tư vấn sẽ liên hệ với quý khách trong vòng 15 phút để xác nhận thủ tục.
                </p>
                <button onClick={closeBookingModal} className="btn btn-primary btn-full">
                  Hoàn Tất
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header-booking">
                  <span className="modal-badge-car">VIP Test Drive</span>
                  <h3 className="modal-booking-title">Đăng Ký Lái Thử Siêu Xe</h3>
                  <div className="modal-selected-car">
                    <img 
                      src={bookingCar.image || FALLBACK_CAR_IMAGE} 
                      alt={bookingCar.name} 
                      className="modal-car-thumb"
                    />
                    <div>
                      <div className="modal-car-name">{bookingCar.name}</div>
                      <div className="modal-car-price">${Number(bookingCar.price).toLocaleString()} • {bookingCar.type}</div>
                    </div>
                  </div>
                </div>

                {bookingError && (
                  <div className="modal-alert-error">
                    <AlertCircle size={18} />
                    <span>{bookingError}</span>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="modal-booking-form">
                  <div className="form-group">
                    <label>Họ và Tên Quý Khách *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Số Điện Thoại Liên Hệ (10 số di động) *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="Ví dụ: 0912345678"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày Dự Kiến Lái Thử *</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      min={today}
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Địa Điểm Tiếp Nhận Xe *</label>
                    <select 
                      className="form-control"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                    >
                      <option value="showroom">Tại Showroom AutoPremium (Quận 1, TP. HCM)</option>
                      <option value="home">Giao xe tận nhà quý khách để lái thử</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Ghi Chú Hoặc Yêu Cầu Riêng</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      placeholder="Khung giờ thuận tiện hoặc yêu cầu thêm..."
                      value={bookingForm.note}
                      onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="modal-booking-actions">
                    <button type="button" onClick={closeBookingModal} className="btn btn-outline" disabled={isSubmittingBooking}>
                      Hủy Bỏ
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmittingBooking}>
                      {isSubmittingBooking ? (
                        <span>Đang Gửi...</span>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Gửi Đăng Ký Lái Thử</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
