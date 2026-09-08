import CarCard from '../components/CarCard';

export default function Cars() {
  const allCars = [
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
    },
    {
      id: 4,
      name: 'BMW M8 Competition',
      price: 135000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      year: 2024,
      type: 'Coupe',
      fuel: 'Gasoline'
    },
    {
      id: 5,
      name: 'Range Rover SV Autobiography',
      price: 215000,
      image: 'https://images.unsplash.com/photo-1606016159991-d812bd2d5eb3?auto=format&fit=crop&w=800&q=80',
      year: 2025,
      type: 'SUV',
      fuel: 'Hybrid'
    },
    {
      id: 6,
      name: 'Aston Martin DB12',
      price: 245000,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
      year: 2024,
      type: 'Coupe',
      fuel: 'Gasoline'
    }
  ];

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
