import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, Users, DollarSign, Plus, Search, 
  ShieldAlert, RotateCcw, ShieldCheck, CalendarCheck,
  Shield, LogOut, ExternalLink, Activity, Server, Database, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCars } from '../../context/CarContext';
import StatCard from '../../components/admin/StatCard';
import CarTable from '../../components/admin/CarTable';
import UserTable from '../../components/admin/UserTable';
import BookingTable from '../../components/admin/BookingTable';
import CarModal from '../../components/admin/CarModal';
import api from '../../services/api';
import '../../styles/admin/Admin.css';

const SAMPLE_IMAGES = [
  { label: 'Mercedes Đen', url: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=800&q=80' },
  { label: 'Porsche Đỏ', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },
  { label: 'Audi Xám', url: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=800&q=80' },
  { label: 'BMW Xanh', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Range Rover Vàng', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ferrari Đỏ', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80' }
];

export default function Admin() {
  const { user, login, logout, getAllUsers, deleteUser } = useAuth();
  const { cars, addCar, updateCar, deleteCar, resetCars } = useCars();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('cars'); // 'cars', 'bookings', 'users', 'devops'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Bookings state
  const [bookings, setBookings] = useState([]);

  // Server Health state for DevOps inspection
  const [healthResult, setHealthResult] = useState(null);
  const [healthChecking, setHealthChecking] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [carForm, setCarForm] = useState({
    name: '',
    price: '',
    year: 2026,
    type: 'Sedan',
    fuel: 'Gasoline',
    image: ''
  });

  // Fetch bookings from backend
  const loadBookings = async () => {
    try {
      const res = await api.getBookings();
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      }
    } catch (err) {
      console.warn('Lỗi tải danh sách bookings:', err);
    }
  };

  const checkServerHealth = async () => {
    setHealthChecking(true);
    try {
      const res = await api.checkHealth();
      setHealthResult(res);
    } catch (err) {
      setHealthResult({ status: 'error', message: err.message });
    } finally {
      setHealthChecking(false);
    }
  };

  useEffect(() => {
    loadBookings();
    checkServerHealth();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Access Control: Check if user is admin
  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="admin-denied-container">
        <div className="glass-card admin-denied-card">
          <div className="admin-denied-icon">
            <ShieldAlert size={40} />
          </div>
          <h2>Khu Vực Quản Trị Viên</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '14px 0 24px' }}>
            Bạn cần đăng nhập bằng tài khoản Quản trị viên (Admin) để truy cập không gian làm việc này.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => login('admin', 'admin123')}
              className="btn btn-primary"
            >
              <ShieldCheck size={18} /> Đăng nhập nhanh bằng Admin (Mẫu)
            </button>
            <Link to="/login" className="btn btn-outline">
              Đi đến trang Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Stats
  const totalValue = cars.reduce((sum, car) => sum + (Number(car.price) || 0), 0);
  const allUsersList = getAllUsers ? getAllUsers() : [];
  const uniqueTypes = ['All', ...new Set(cars.map(c => c.type))];
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  // Filtered Cars
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || car.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handlers for modal
  const openAddModal = () => {
    setEditingCarId(null);
    setCarForm({
      name: '',
      price: '',
      year: new Date().getFullYear(),
      type: 'Sedan',
      fuel: 'Gasoline',
      image: SAMPLE_IMAGES[0].url
    });
    setIsModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCarId(car.id);
    setCarForm({
      name: car.name,
      price: car.price,
      year: car.year,
      type: car.type,
      fuel: car.fuel,
      image: car.image
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCarId(null);
  };

  const handleSaveCar = (e) => {
    e.preventDefault();
    if (editingCarId) {
      updateCar(editingCarId, carForm);
    } else {
      addCar(carForm);
    }
    closeModal();
  };

  const handleDeleteCar = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mẫu xe "${name}" khỏi kho không?`)) {
      deleteCar(id);
    }
  };

  const handleDeleteUser = (id, username) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản người dùng "${username}" không?`)) {
      const res = deleteUser(id);
      if (res && !res.success) {
        alert(res.message);
      }
    }
  };

  const handleBookingStatusChange = async (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    try {
      await api.updateBookingStatus(id, newStatus);
    } catch (err) {
      console.warn('Lỗi cập nhật booking:', err);
    }
  };

  const handleDeleteBooking = async (id, customerName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lịch hẹn của khách "${customerName}" không?`)) {
      setBookings(prev => prev.filter(b => b.id !== id));
      try {
        await api.deleteBooking(id);
      } catch (err) {
        console.warn('Lỗi xóa booking:', err);
      }
    }
  };

  return (
    <div className="admin-portal-wrapper">
      {/* =========================================================
          1. DEDICATED ADMIN TOPBAR (THAY THẾ TOÀN BỘ NAVBAR THƯỜNG)
          ========================================================= */}
      <header className="admin-portal-header">
        <div className="admin-portal-left">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <Shield size={24} />
            </div>
            <div>
              <div className="admin-brand-title">AutoPremium Admin</div>
              <div className="admin-brand-sub">Hệ Thống Quản Trị Trung Tâm</div>
            </div>
          </div>
          <div className="admin-server-badge">
            <span className="live-pulse"></span>
            <span>AWS EC2: 3.27.62.149 • Production</span>
          </div>
        </div>

        <div className="admin-portal-right">
          <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link-btn" title="Mở trang bán xe của khách hàng trong tab mới">
            <ExternalLink size={16} />
            <span>Xem Website Khách Hàng</span>
          </Link>
          
          <div className="admin-user-pill">
            <div className="admin-avatar">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user.name || user.username}</span>
              <span className="admin-role-tag">Quản Trị Viên</span>
            </div>
          </div>

          <button onClick={handleLogout} className="admin-logout-btn" title="Đăng xuất khỏi tài khoản quản trị">
            <LogOut size={16} />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </header>

      {/* =========================================================
          2. ADMIN DASHBOARD CONTENT
          ========================================================= */}
      <div className="container admin-container">
        {/* Header Action Bar */}
        <div className="admin-header">
          <div className="admin-title-area">
            <h1>Bảng Điều Khiển Quản Trị</h1>
            <p>Giám sát kho xe, xử lý lịch hẹn lái thử và quản lý tài khoản người dùng</p>
          </div>
          <div className="admin-header-actions">
            <button onClick={openAddModal} className="btn btn-primary">
              <Plus size={18} /> Thêm Mẫu Xe Mới
            </button>
            <button onClick={() => { resetCars(); loadBookings(); }} className="btn btn-outline" title="Khôi phục kho xe ban đầu">
              <RotateCcw size={16} /> Khôi Phục Dữ Liệu
            </button>
          </div>
        </div>

        {/* Stats KPI Cards */}
        <div className="admin-stats-grid">
          <StatCard icon={Car} value={cars.length} label="Tổng số xe trong kho" />
          <StatCard icon={DollarSign} value={`$${(totalValue / 1000).toFixed(0)}k`} label="Tổng giá trị kho xe" />
          <StatCard icon={Users} value={allUsersList.length} label="Thành viên đăng ký" />
          <StatCard 
            icon={CalendarCheck} 
            value={`${pendingBookingsCount} chờ`} 
            label={`Đơn lái thử (${bookings.length} tổng)`} 
          />
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            <Car size={18} /> Quản Lý Kho Xe ({cars.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <CalendarCheck size={18} /> Lịch Hẹn Lái Thử ({bookings.length})
            {pendingBookingsCount > 0 && (
              <span className="admin-badge-count">{pendingBookingsCount}</span>
            )}
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> Quản Lý Người Dùng ({allUsersList.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'devops' ? 'active' : ''}`}
            onClick={() => setActiveTab('devops')}
          >
            <Server size={18} /> Hạ Tầng DevOps & Server
          </button>
        </div>

        {/* =========================================================
            TAB 1: CARS MANAGEMENT
            ========================================================= */}
        {activeTab === 'cars' && (
          <>
            <div className="admin-controls-bar">
              <div className="admin-search-wrapper">
                <Search size={18} className="admin-search-icon" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm theo tên xe hoặc hãng sản xuất..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phân khúc:</span>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '8px 14px', background: 'rgba(0,0,0,0.3)' }}
                >
                  {uniqueTypes.map(t => (
                    <option key={t} value={t}>{t === 'All' ? 'Tất cả phân khúc' : t}</option>
                  ))}
                </select>
              </div>
            </div>

            <CarTable 
              cars={filteredCars} 
              onEdit={openEditModal} 
              onDelete={handleDeleteCar} 
            />
          </>
        )}

        {/* =========================================================
            TAB 2: BOOKINGS MANAGEMENT
            ========================================================= */}
        {activeTab === 'bookings' && (
          <BookingTable 
            bookings={bookings}
            onStatusChange={handleBookingStatusChange}
            onDeleteBooking={handleDeleteBooking}
          />
        )}

        {/* =========================================================
            TAB 3: USERS MANAGEMENT
            ========================================================= */}
        {activeTab === 'users' && (
          <UserTable 
            users={allUsersList} 
            currentUser={user} 
            onDeleteUser={handleDeleteUser} 
          />
        )}

        {/* =========================================================
            TAB 4: DEVOPS & INFRASTRUCTURE
            ========================================================= */}
        {activeTab === 'devops' && (
          <div className="admin-devops-view">
            <div className="devops-cards-grid">
              <div className="glass-card devops-card">
                <div className="devops-card-header">
                  <Server size={22} className="devops-icon" />
                  <h3>Máy Chủ AWS EC2</h3>
                  <span className="devops-badge success">Running</span>
                </div>
                <div className="devops-card-body">
                  <div className="devops-row">
                    <span className="devops-label">Instance ID:</span>
                    <span className="devops-val code">i-0758132dade5a1993</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">Public IPv4:</span>
                    <span className="devops-val code">3.27.62.149</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">Khu vực (Region):</span>
                    <span className="devops-val">ap-southeast-2 (Sydney)</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">Loại máy ảo:</span>
                    <span className="devops-val">t3.micro (Ubuntu 22.04 LTS)</span>
                  </div>
                </div>
              </div>

              <div className="glass-card devops-card">
                <div className="devops-card-header">
                  <Database size={22} className="devops-icon" />
                  <h3>Cơ Sở Dữ Liệu</h3>
                  <span className="devops-badge success">Connected</span>
                </div>
                <div className="devops-card-body">
                  <div className="devops-row">
                    <span className="devops-label">Database Engine:</span>
                    <span className="devops-val">MongoDB 7 (Mongoose ODM)</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">Cluster Cloud:</span>
                    <span className="devops-val code">web-oto.jna9ncq.mongodb.net</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">Docker Volume:</span>
                    <span className="devops-val code">dev_ops_web_oto_mongodb_data</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">Collections:</span>
                    <span className="devops-val">cars, bookings, users, favorites</span>
                  </div>
                </div>
              </div>

              <div className="glass-card devops-card">
                <div className="devops-card-header">
                  <Activity size={22} className="devops-icon" />
                  <h3>Kiến Trúc Container (Docker)</h3>
                  <span className="devops-badge info">3-Tier</span>
                </div>
                <div className="devops-card-body">
                  <div className="devops-row">
                    <span className="devops-label">Nginx Web Frontend:</span>
                    <span className="devops-val code">web_ban_oto_frontend (:8080)</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">Node.js Express API:</span>
                    <span className="devops-val code">web_ban_oto_backend (:5000)</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">CI/CD Pipeline:</span>
                    <span className="devops-val">GitHub Actions (Auto SSH Deploy)</span>
                  </div>
                  <div className="devops-row">
                    <span className="devops-label">Web Server:</span>
                    <span className="devops-val">Nginx Alpine (Gzip, Reverse Proxy)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card devops-quick-test">
              <div className="devops-test-header">
                <div>
                  <h4>Kiểm Tra Trực Tiếp Endpoint API Máy Chủ</h4>
                  <p>Gửi request kiểm tra trạng thái hoạt động thực tế của Backend</p>
                </div>
                <button onClick={checkServerHealth} className="btn btn-outline" disabled={healthChecking}>
                  <RefreshCw size={16} className={healthChecking ? 'spin' : ''} />
                  {healthChecking ? 'Đang kiểm tra...' : 'Kiểm Tra API /health'}
                </button>
              </div>
              {healthResult && (
                <pre className="devops-json-viewer">
                  {JSON.stringify(healthResult, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* MODAL: ADD OR EDIT CAR */}
        <CarModal 
          isOpen={isModalOpen}
          isEditing={Boolean(editingCarId)}
          carForm={carForm}
          setCarForm={setCarForm}
          onClose={closeModal}
          onSave={handleSaveCar}
          sampleImages={SAMPLE_IMAGES}
        />
      </div>

      {/* =========================================================
          3. DEDICATED ADMIN ENTERPRISE FOOTER
          ========================================================= */}
      <footer className="admin-portal-footer">
        <div>
          <strong>AutoPremium Enterprise Control Center</strong> • Không gian làm việc Quản Trị Viên
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Máy chủ AWS EC2: 3.27.62.149 • Triển khai tự động bởi GitHub Actions CI/CD Pipeline
        </div>
      </footer>
    </div>
  );
}
