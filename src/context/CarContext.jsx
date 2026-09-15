import { createContext, useContext, useState, useEffect } from 'react';
import { allCars as initialCars, FALLBACK_CAR_IMAGE } from '../data/cars';

const CarContext = createContext();

export function CarProvider({ children }) {
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('autopremium_cars');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Tự động sửa các link ảnh cũ bị lỗi 404 trong localStorage
          const fixedCars = parsed.map(c => {
            if (c.image && c.image.includes('1503376269389-90d20ef3571d')) {
              return { ...c, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' };
            }
            if (c.image && c.image.includes('1606016159991-d812bd2d5eb3')) {
              return { ...c, image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' };
            }
            return c;
          });
          return fixedCars;
        }
      } catch {
        // Fallback to initial
      }
    }
    localStorage.setItem('autopremium_cars', JSON.stringify(initialCars));
    return initialCars;
  });

  useEffect(() => {
    localStorage.setItem('autopremium_cars', JSON.stringify(cars));
  }, [cars]);

  const addCar = (carData) => {
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
    setCars(prev => [newCar, ...prev]);
    return newCar;
  };

  const updateCar = (id, updatedData) => {
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
  };

  const deleteCar = (id) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const resetCars = () => {
    setCars(initialCars);
    localStorage.setItem('autopremium_cars', JSON.stringify(initialCars));
  };

  const featuredCars = cars.slice(0, 3);

  return (
    <CarContext.Provider value={{ cars, featuredCars, addCar, updateCar, deleteCar, resetCars }}>
      {children}
    </CarContext.Provider>
  );
}

export const useCars = () => useContext(CarContext);
