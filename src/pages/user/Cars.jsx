import { useState, useMemo } from 'react';
import CarCard, { CarCardSkeleton } from '../../components/user/CarCard';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Search, Filter, Heart, ArrowUpDown, Tag, DollarSign } from 'lucide-react';
import '../../styles/user/Cars.css';

function getCarBrand(name) {
  if (!name) return 'Khác';
  if (name.startsWith('Mercedes')) return 'Mercedes-Benz';
  if (name.startsWith('Aston')) return 'Aston Martin';
  if (name.startsWith('Range')) return 'Range Rover';
  if (name.startsWith('Porsche')) return 'Porsche';
  if (name.startsWith('Audi')) return 'Audi';
  if (name.startsWith('BMW')) return 'BMW';
  return name.split(' ')[0];
}

export default function Cars() {
  const { cars, loading } = useCars();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const favCount = user?.favorites?.length || 0;

  // Extract unique brands and types
  const uniqueBrands = ['All', ...new Set(cars.map(c => getCarBrand(c.name)))];
  const uniqueTypes = ['All', ...new Set(cars.map(car => car.type))];

  const filteredCars = useMemo(() => {
    let result = cars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || car.type === filterType;
      const matchesBrand = filterBrand === 'All' || getCarBrand(car.name) === filterBrand;
      
      let matchesPrice = true;
      const p = Number(car.price);
      if (filterPrice === 'under_150k') matchesPrice = p < 150000;
      else if (filterPrice === '150k_200k') matchesPrice = p >= 150000 && p <= 200000;
      else if (filterPrice === 'above_200k') matchesPrice = p > 200000;

      const matchesFav = !onlyFavorites || (user?.favorites && user.favorites.includes(car.id));

      return matchesSearch && matchesType && matchesBrand && matchesPrice && matchesFav;
    });

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'year_desc') {
      result.sort((a, b) => Number(b.year) - Number(a.year));
    }

    return result;
  }, [cars, searchTerm, filterType, filterBrand, filterPrice, sortBy, onlyFavorites, user]);

  return (
    <div className="container cars-page-container">
      <div className="cars-header">
        <h1 className="section-title">Danh Sách Xe</h1>
        <p className="cars-header-desc">
          Khám phá bộ sưu tập xe sang trọng và đẳng cấp của chúng tôi ({filteredCars.length} mẫu xe).
        </p>
      </div>

      {/* Search and Multi-Filter Section */}
      <div className="cars-filter-bar">
        {/* Search */}
        <div className="cars-search-box">
          <Search size={20} className="cars-search-icon" />
          <input
            type="text"
            placeholder="Tìm theo tên xe hoặc từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cars-search-input"
          />
        </div>

        {/* Filter by Brand */}
        <div className="cars-select-wrapper">
          <Tag size={18} className="cars-select-icon" />
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="cars-select"
            title="Lọc theo thương hiệu"
          >
            {uniqueBrands.map(brand => (
              <option key={brand} value={brand}>{brand === 'All' ? 'Tất cả hãng xe' : brand}</option>
            ))}
          </select>
        </div>

        {/* Filter by Body Type */}
        <div className="cars-select-wrapper">
          <Filter size={18} className="cars-select-icon" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="cars-select"
            title="Lọc theo kiểu dáng"
          >
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'Tất cả kiểu dáng' : type}</option>
            ))}
          </select>
        </div>

        {/* Filter by Price Range */}
        <div className="cars-select-wrapper">
          <DollarSign size={18} className="cars-select-icon" />
          <select
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="cars-select"
            title="Lọc theo mức giá"
          >
            <option value="All">Mọi mức giá</option>
            <option value="under_150k">Dưới $150,000 (&lt; 3.8 tỷ VNĐ)</option>
            <option value="150k_200k">$150,000 - $200,000 (3.8 - 5 tỷ VNĐ)</option>
            <option value="above_200k">Trên $200,000 (&gt; 5 tỷ VNĐ)</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="cars-select-wrapper">
          <ArrowUpDown size={18} className="cars-select-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cars-select"
            title="Sắp xếp danh sách xe"
          >
            <option value="default">Sắp xếp: Mặc định</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="year_desc">Năm sản xuất: Mới nhất</option>
          </select>
        </div>

        {/* Favorite toggle button */}
        <button 
          onClick={() => {
            if (!user && !onlyFavorites) {
              showToast('info', 'Vui lòng đăng nhập để lọc các xe bạn đã bấm tim yêu thích!');
              return;
            }
            setOnlyFavorites(!onlyFavorites);
          }}
          className={`cars-fav-toggle-btn ${onlyFavorites ? 'active' : ''}`}
          title="Lọc các xe bạn đã bấm tim yêu thích"
        >
          <Heart size={18} fill={onlyFavorites ? '#ef4444' : 'none'} color={onlyFavorites ? '#ef4444' : 'currentColor'} />
          <span>Mục Yêu Thích {favCount > 0 ? `(${favCount})` : ''}</span>
        </button>
      </div>
      
      {loading ? (
        <div className="cars-grid">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <CarCardSkeleton key={n} />
          ))}
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="cars-grid">
          {filteredCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      ) : (
        <div className="cars-empty glass-card" style={{ textAlign: 'center', padding: '48px 24px', gridColumn: '1 / -1' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Không tìm thấy mẫu xe nào phù hợp với bộ lọc tìm kiếm của bạn.</p>
          <button 
            type="button"
            onClick={() => {
              setSearchTerm('');
              setFilterType('All');
              setFilterBrand('All');
              setFilterPrice('All');
              setSortBy('default');
              setOnlyFavorites(false);
            }}
            className="btn btn-outline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
