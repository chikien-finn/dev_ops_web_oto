import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Users, DollarSign, Layers, Plus, Search, 
  ShieldAlert, RotateCcw, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCars } from '../../context/CarContext';
import StatCard from '../../components/admin/StatCard';
import CarTable from '../../components/admin/CarTable';
import UserTable from '../../components/admin/UserTable';
import CarModal from '../../components/admin/CarModal';
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
  const { user, login, getAllUsers, deleteUser } = useAuth();
  const { cars, addCar, updateCar, deleteCar, resetCars } = useCars();

  const [activeTab, setActiveTab] = useState('cars'); // 'cars' or 'users'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

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
            Bạn cần đăng nhập bằng tài khoản có quyền Quản trị (Admin) để truy cập trang này.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => login('admin', 'admin123')}
              className="btn btn-primary"
            >
              <ShieldCheck size={18} /> Đăng nhập nhanh bằng Admin (Mẫu)
            </button>
            <Link to="/login" className="btn btn-outline">
              Đi đến trang Đăng nhập thông thường
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
    if (window.confirm(`Bạn có chắc chắn muốn xóa mẫu xe "${name}" khỏi showroom không?`)) {
      deleteCar(id);
    }
  };

  const handleDeleteUser = (id, username) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản người dùng "${username}" không?`)) {
      const res = deleteUser(id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  return (
    <div className="container admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Bảng Điều Khiển Quản Trị</h1>
          <p>Quản lý toàn bộ danh mục xe cao cấp và tài khoản người dùng hệ thống</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={18} /> Thêm Mẫu Xe Mới
          </button>
          <button onClick={() => { if (window.confirm('Khôi phục danh sách xe mặc định ban đầu?')) resetCars(); }} className="btn btn-outline" title="Khôi phục xe gốc">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <StatCard icon={Car} value={cars.length} label="Tổng số xe trong kho" />
        <StatCard icon={DollarSign} value={`$${(totalValue / 1000).toFixed(0)}k`} label="Tổng giá trị bộ sưu tập" />
        <StatCard icon={Users} value={allUsersList.length} label="Thành viên đã đăng ký" />
        <StatCard icon={Layers} value={uniqueTypes.length - 1} label="Phân khúc xe khác nhau" />
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          <Car size={18} /> Quản Lý Kho Xe ({cars.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> Danh Sách Người Dùng ({allUsersList.length})
        </button>
      </div>

      {/* TAB 1: CARS MANAGEMENT */}
      {activeTab === 'cars' && (
        <>
          <div className="admin-controls-bar">
            <div className="admin-search-wrapper">
              <Search size={18} className="admin-search-icon" />
              <input 
                type="text" 
                placeholder="Tìm tên xe, thương hiệu..." 
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

      {/* TAB 2: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <UserTable 
          users={allUsersList} 
          currentUser={user} 
          onDeleteUser={handleDeleteUser} 
        />
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
  );
}
