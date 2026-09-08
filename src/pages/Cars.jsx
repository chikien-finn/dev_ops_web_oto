import { useState, useMemo } from 'react';
import CarCard from '../components/CarCard';
import { allCars } from '../data/cars';
import { Search, Filter } from 'lucide-react';

export default function Cars() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || car.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  const uniqueTypes = ['All', ...new Set(allCars.map(car => car.type))];

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="section-title">Danh Sách Xe</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '30px' }}>
          Khám phá bộ sưu tập xe sang trọng và đẳng cấp của chúng tôi.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Tìm kiếm xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px 12px 45px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={20} style={{ color: 'var(--text-secondary)' }} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'Tất cả các loại' : type}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="cars-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '40px'
      }}>
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>Không tìm thấy mẫu xe nào phù hợp với tìm kiếm của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
}
