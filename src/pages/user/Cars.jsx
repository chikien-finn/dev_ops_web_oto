import { useState, useMemo } from 'react';
import CarCard from '../../components/user/CarCard';
import { useCars } from '../../context/CarContext';
import { Search, Filter } from 'lucide-react';
import '../../styles/user/Cars.css';

export default function Cars() {
  const { cars } = useCars();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || car.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [cars, searchTerm, filterType]);

  const uniqueTypes = ['All', ...new Set(cars.map(car => car.type))];

  return (
    <div className="container cars-page-container">
      <div className="cars-header">
        <h1 className="section-title">Danh Sách Xe</h1>
        <p className="cars-header-desc">
          Khám phá bộ sưu tập xe sang trọng và đẳng cấp của chúng tôi.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="cars-filter-bar">
        <div className="cars-search-box">
          <Search size={20} className="cars-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cars-search-input"
          />
        </div>

        <div className="cars-select-wrapper">
          <Filter size={20} className="cars-select-icon" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="cars-select"
          >
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'Tất cả các loại' : type}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="cars-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))
        ) : (
          <div className="cars-empty">
            <p>Không tìm thấy mẫu xe nào phù hợp với tìm kiếm của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
}
