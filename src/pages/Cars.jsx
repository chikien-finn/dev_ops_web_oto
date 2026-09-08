import CarCard from '../components/CarCard';
import { allCars } from '../data/cars';

export default function Cars() {

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="section-title">Danh Sách Xe</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Khám phá bộ sưu tập xe sang trọng và đẳng cấp của chúng tôi.
        </p>
      </div>
      
      <div className="cars-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '40px'
      }}>
        {allCars.map(car => (
          <CarCard key={car.id} {...car} />
        ))}
      </div>
    </div>
  );
}
