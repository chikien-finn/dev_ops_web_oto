import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  Car, Users, DollarSign, Plus, Search, 
  RotateCcw, CalendarCheck,
  Shield, LogOut, Activity, Server, Database, RefreshCw, Zap, CheckCircle2,
  LayoutGrid, Table, ArrowUpDown, Filter, Fuel
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCars } from '../../context/CarContext';
import StatCard from '../../components/admin/StatCard';
import CarTable from '../../components/admin/CarTable';
import CarGrid from '../../components/admin/CarGrid';
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
  { label: 'Ferrari Đỏ', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lamborghini Cam', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rolls-Royce Bạc', url: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bentley Xanh', url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mercedes G63', url: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80' },
  { label: 'McLaren Vàng', url: 'https://images.unsplash.com/photo-1622322062602-536444855598?auto=format&fit=crop&w=800&q=80' },
  { label: 'Porsche Taycan', url: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=800&q=80' },
  { label: 'Aston Martin SUV', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Escalade-V', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' }
];

export default function Admin() {
  const { user, logout, getAllUsers, deleteUser } = useAuth();
  const { cars, addCar, updateCar, deleteCar, resetCars } = useCars();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('cars'); // 'cars', 'bookings', 'users', 'devops'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterFuel, setFilterFuel] = useState('All');
  const [sortBy, setSortBy] = useState('default');

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
    image: '',
    horsepower: '',
    acceleration: '',
    topSpeed: ''
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
    navigate('/');
  };

  // Access Control: Check if user is admin, else redirect to shared /login
  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ error: 'Vui lòng đăng nhập bằng tài khoản Quản trị viên (admin) để truy cập trang Quản Trị.' }} />;
  }

  // Dashboard Stats Calculations
  const totalValue = cars.reduce((sum, car) => sum + (Number(car.price) || 0), 0);
  const allUsersList = getAllUsers ? getAllUsers() : [];
  const uniqueTypes = ['All', ...new Set(cars.map(c => c.type))];
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;
  const evHybridCount = cars.filter(c => c.fuel === 'Electric' || c.fuel === 'Hybrid').length;
  const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;
  const completionRate = bookings.length > 0 
    ? `${Math.round((completedBookingsCount / bookings.length) * 100)}%`
    : '100%';
  const totalFormattedValue = totalValue >= 1000000 
    ? `$${(totalValue / 1000000).toFixed(2)}M` 
    : `$${(totalValue / 1000).toLocaleString()}k`;

  // Filtered & Sorted Cars
  const filteredCars = cars
    .filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || car.type === filterType;
      const matchesFuel = filterFuel === 'All' || car.fuel === filterFuel;
      return matchesSearch && matchesType && matchesFuel;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortBy === 'year-desc') return (Number(b.year) || 0) - (Number(a.year) || 0);
      if (sortBy === 'hp-desc') {
        const hpA = parseInt(a.specs?.horsepower || '0', 10);
        const hpB = parseInt(b.specs?.horsepower || '0', 10);
        return hpB - hpA;
      }
      return (Number(b.id) || 0) - (Number(a.id) || 0);
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
      image: SAMPLE_IMAGES[0].url,
      horsepower: '650 HP',
      acceleration: '3.0 giây',
      topSpeed: '310 km/h'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCarId(car.id);
    setCarForm({
      id: car.id,
      name: car.name,
      price: car.price,
      year: car.year,
      type: car.type,
      fuel: car.fuel,
      image: car.image,
      horsepower: car.specs?.horsepower || '',
      acceleration: car.specs?.acceleration || '',
      topSpeed: car.specs?.topSpeed || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCarId(null);
  };

  const handleSaveCar = (e) => {
    e.preventDefault();
    const payload = {
      ...carForm,
      price: Number(carForm.price) || 0,
      year: Number(carForm.year) || new Date().getFullYear(),
      specs: {
        horsepower: carForm.horsepower || '600 HP',
        acceleration: carForm.acceleration || '3.2 giây',
        topSpeed: carForm.topSpeed || '300 km/h',
        transmission: 'Tự động thể thao',
        drivetrain: 'AWD Toàn thời gian',
        engine: `${carForm.fuel} High-Performance`,
        features: [
          { title: 'Nội thất sang trọng xa xỉ', desc: 'Chất liệu da Nappa và gỗ quý thủ công tinh xảo' },
          { title: 'Hệ thống an toàn chủ động', desc: 'Camera toàn cảnh 360 độ và phanh khẩn cấp tự động' }
        ]
      }
    };

    if (editingCarId) {
      updateCar(editingCarId, payload);
    } else {
      addCar(payload);
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
          1. DEDICATED ADMIN TOPBAR (FULL-WIDTH LUXURY HEADER)
          ========================================================= */}
      <header className="admin-portal-header">
        <div className="admin-portal-left">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <Shield size={24} />
            </div>
            <div>
              <div className="admin-brand-title">AutoPremium Control Center</div>
              <div className="admin-brand-sub">Hệ Thống Quản Trị Siêu Xe & Showroom</div>
            </div>
          </div>
          <div className="admin-server-badge">
            <span className="live-pulse"></span>
            <span>AWS EC2: 3.27.62.149 • Sydney Production</span>
          </div>
        </div>

        <div className="admin-portal-right">
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
          2. ADMIN DASHBOARD CONTENT (EXPANDED WIDESCREEN CONTAINER)
          ========================================================= */}
      <div className="admin-container">
        {/* Header Action Bar */}
        <div className="admin-header">
          <div className="admin-title-area">
            <h1>Trung Tâm Điều Hành Quản Trị</h1>
            <p>Giám sát tổng quan {cars.length} siêu xe đẳng cấp, điều phối đơn lái thử và phân quyền khách hàng</p>
          </div>
          <div className="admin-header-actions">
            <button onClick={openAddModal} className="btn btn-primary">
              <Plus size={18} /> Thêm Siêu Xe Mới
            </button>
            <button onClick={() => { resetCars(); loadBookings(); }} className="btn btn-outline" title="Khôi phục toàn bộ kho 16 siêu xe ban đầu">
              <RotateCcw size={16} /> Khôi Phục Kho Xe (16 Xe)
            </button>
          </div>
        </div>

        {/* Stats KPI Cards (6 Widescreen Cards) */}
        <div className="admin-stats-grid">
          <StatCard 
            icon={Car} 
            value={cars.length} 
            label="Tổng siêu xe trong kho" 
            sub="Kho xe đa phân khúc"
          />
          <StatCard 
            icon={DollarSign} 
            value={totalFormattedValue} 
            label="Tổng giá trị kho xe" 
            sub="Niêm yết showroom"
          />
          <StatCard 
            icon={Zap} 
            value={evHybridCount} 
            label="Xe Thuần Điện & Hybrid" 
            sub="Xu hướng xanh 2026"
          />
          <StatCard 
            icon={Users} 
            value={allUsersList.length} 
            label="Thành viên đã đăng ký" 
            sub="Dữ liệu khách hàng"
          />
          <StatCard 
            icon={CalendarCheck} 
            value={`${pendingBookingsCount} chờ`} 
            label={`Đơn lái thử (${bookings.length} tổng)`} 
            sub="Cần xử lý tư vấn"
          />
          <StatCard 
            icon={CheckCircle2} 
            value={completionRate} 
            label="Tỷ lệ hoàn tất lái thử" 
            sub="Đánh giá hài lòng"
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
            TAB 1: CARS MANAGEMENT (EXPANDED CONTROLS & DUAL VIEWS)
            ========================================================= */}
        {activeTab === 'cars' && (
          <div className="admin-cars-section">
            {/* Quick Filter Segment Chips */}
            <div className="admin-filter-chips-row">
              <span className="chips-label">Lọc nhanh:</span>
              <button 
                className={`filter-chip ${filterType === 'All' && filterFuel === 'All' ? 'active' : ''}`}
                onClick={() => { setFilterType('All'); setFilterFuel('All'); }}
              >
                Tất cả ({cars.length})
              </button>
              <button 
                className={`filter-chip ${filterFuel === 'Electric' ? 'active' : ''}`}
                onClick={() => { setFilterFuel(filterFuel === 'Electric' ? 'All' : 'Electric'); }}
              >
                ⚡ Xe Thuần Điện ({cars.filter(c => c.fuel === 'Electric').length})
              </button>
              <button 
                className={`filter-chip ${filterFuel === 'Hybrid' ? 'active' : ''}`}
                onClick={() => { setFilterFuel(filterFuel === 'Hybrid' ? 'All' : 'Hybrid'); }}
              >
                🌿 Xe Hybrid ({cars.filter(c => c.fuel === 'Hybrid').length})
              </button>
              <button 
                className={`filter-chip ${filterType === 'Hypercar' ? 'active' : ''}`}
                onClick={() => { setFilterType(filterType === 'Hypercar' ? 'All' : 'Hypercar'); }}
              >
                🔥 Hypercar ({cars.filter(c => c.type === 'Hypercar').length})
              </button>
              <button 
                className={`filter-chip ${filterType === 'SUV' ? 'active' : ''}`}
                onClick={() => { setFilterType(filterType === 'SUV' ? 'All' : 'SUV'); }}
              >
                🚙 SUV Gầm Cao ({cars.filter(c => c.type === 'SUV').length})
              </button>
              <button 
                className={`filter-chip ${filterType === 'Coupe' ? 'active' : ''}`}
                onClick={() => { setFilterType(filterType === 'Coupe' ? 'All' : 'Coupe'); }}
              >
                🏎️ Coupe Thể Thao ({cars.filter(c => c.type === 'Coupe').length})
              </button>
            </div>

            {/* Main Controls Bar */}
            <div className="admin-controls-bar">
              <div className="admin-search-wrapper">
                <Search size={18} className="admin-search-icon" />
                <input 
                  type="text" 
                  placeholder="Tìm theo tên xe (Ferrari, Porsche, Mercedes, Rolls-Royce...)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="admin-search-clear"
                    title="Xóa tìm kiếm"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="admin-filters-group">
                {/* Phân khúc */}
                <div className="filter-select-item">
                  <Filter size={15} className="filter-icon" />
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="admin-select"
                  >
                    {uniqueTypes.map(t => (
                      <option key={t} value={t}>{t === 'All' ? 'Tất cả phân khúc' : t}</option>
                    ))}
                  </select>
                </div>

                {/* Nhiên liệu */}
                <div className="filter-select-item">
                  <Fuel size={15} className="filter-icon" />
                  <select 
                    value={filterFuel} 
                    onChange={(e) => setFilterFuel(e.target.value)}
                    className="admin-select"
                  >
                    <option value="All">Tất cả động cơ</option>
                    <option value="Gasoline">Xăng (Gasoline)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Thuần Điện (EV)</option>
                  </select>
                </div>

                {/* Sắp xếp */}
                <div className="filter-select-item">
                  <ArrowUpDown size={15} className="filter-icon" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="admin-select"
                  >
                    <option value="default">Mới nhất (ID)</option>
                    <option value="price-desc">Giá cao nhất</option>
                    <option value="price-asc">Giá thấp nhất</option>
                    <option value="hp-desc">Mã lực mạnh nhất</option>
                    <option value="year-desc">Năm sản xuất mới</option>
                  </select>
                </div>

                {/* View Mode Toggle Button Group */}
                <div className="admin-view-toggle">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    title="Xem dạng thẻ lưới hình ảnh (Grid)"
                  >
                    <LayoutGrid size={16} />
                    <span>Lưới</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                    title="Xem dạng bảng chi tiết (Table)"
                  >
                    <Table size={16} />
                    <span>Bảng</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Results count pill */}
            <div className="admin-results-info">
              <span>Đang hiển thị <strong>{filteredCars.length}</strong> / {cars.length} mẫu siêu xe trong showroom</span>
            </div>

            {/* Render Selected View */}
            {viewMode === 'grid' ? (
              <CarGrid 
                cars={filteredCars}
                onEdit={openEditModal}
                onDelete={handleDeleteCar}
              />
            ) : (
              <CarTable 
                cars={filteredCars} 
                onEdit={openEditModal} 
                onDelete={handleDeleteCar} 
              />
            )}
          </div>
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
                    <span className="devops-val">cars (16 models), bookings, users, favorites</span>
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
          <strong>AutoPremium Enterprise Control Center</strong> • Không gian làm việc Quản Trị Viên Showroom
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Máy chủ AWS EC2: 3.27.62.149 • 16 Mẫu Siêu Xe Sẵn Sàng • Triển khai tự động bởi GitHub Actions CI/CD Pipeline
        </div>
      </footer>
    </div>
  );
}
