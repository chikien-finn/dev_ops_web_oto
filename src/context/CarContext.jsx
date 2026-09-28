import { createContext, useContext, useState, useEffect } from 'react';
import { allCars as initialCars, FALLBACK_CAR_IMAGE } from '../data/cars';
import api from '../services/api';

const CarContext = createContext();

export function CarProvider({ children }) {
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('autopremium_cars');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return initialCars;
  });

  const [loading, setLoading] = useState(false);

  // Sync with Backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCarsFromApi() {
      setLoading(true);
      try {
        const res = await api.getCars();
        if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCars(res.data);
          localStorage.setItem('autopremium_cars', JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn('Sử dụng dữ liệu offline cho danh sách xe:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCarsFromApi();
    return () => { isMounted = false; };
  }, []);

  const addCar = async (carData) => {
    const newCar = {
      ...carData,
      id: Date.now(),
      price: Number(carData.price) || 0,
      year: Number(carData.year) || new Date().getFullYear(),
      name: carData.name.trim(),
      type: carData.type || 'Sedan',
      fuel: carData.fuel || 'Gasoline',
      image: carData.image?.trim() || FALLBACK_CAR_IMAGE
    };

    // Optimistic UI update
    setCars(prev => [newCar, ...prev]);

    // Backend sync
    try {
      const res = await api.createCar(newCar);
      if (res.success && res.data) {
        setCars(prev => prev.map(c => c.id === newCar.id ? res.data : c));
      }
    } catch (err) {
      console.warn('Lỗi đồng bộ thêm xe lên backend:', err);
    }

    return newCar;
  };

  const updateCar = async (id, updatedData) => {
    setCars(prev => prev.map(car => {
      if (car.id === id) {
        return {
          ...car,
          ...updatedData,
          price: Number(updatedData.price) || car.price,
          year: Number(updatedData.year) || car.year,
          name: updatedData.name?.trim() || car.name,
          type: updatedData.type || car.type,
          fuel: updatedData.fuel || car.fuel,
          image: updatedData.image?.trim() || car.image
        };
      }
      return car;
    }));

    try {
      await api.updateCar(id, updatedData);
    } catch (err) {
      console.warn('Lỗi đồng bộ cập nhật xe lên backend:', err);
    }
  };

  const deleteCar = async (id) => {
    setCars(prev => prev.filter(car => car.id !== id));
    try {
      await api.deleteCar(id);
    } catch (err) {
      console.warn('Lỗi đồng bộ xóa xe lên backend:', err);
    }
  };

  const resetCars = async () => {
    setCars(initialCars);
    localStorage.setItem('autopremium_cars', JSON.stringify(initialCars));
    try {
      await api.resetCars();
    } catch (err) {
      console.warn('Lỗi reset xe trên backend:', err);
    }
  };

  const featuredCars = cars.slice(0, 3);

  return (
    <CarContext.Provider value={{ cars, featuredCars, loading, addCar, updateCar, deleteCar, resetCars }}>
      {children}
    </CarContext.Provider>
  );
}

export const useCars = () => useContext(CarContext);
