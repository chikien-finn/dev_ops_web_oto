import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    // Đảm bảo user có mảng favorites khi đăng nhập
    const userToSave = { ...userData, favorites: userData.favorites || [] };
    setUser(userToSave);
    localStorage.setItem('user', JSON.stringify(userToSave));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleFavorite = (carId) => {
    if (!user) return;
    
    let updatedFavorites;
    const currentFavorites = user.favorites || [];
    if (currentFavorites.includes(carId)) {
      updatedFavorites = currentFavorites.filter(id => id !== carId);
    } else {
      updatedFavorites = [...currentFavorites, carId];
    }

    const updatedUser = { ...user, favorites: updatedFavorites };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
