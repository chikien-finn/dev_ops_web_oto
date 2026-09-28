import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    id: 'user_admin_1',
    username: 'admin',
    password: 'admin123',
    name: 'Quản Trị Viên',
    email: 'admin@autopremium.com',
    phone: '0999 888 777',
    address: 'Trụ sở AutoPremium, Hà Nội',
    role: 'admin',
    favorites: [1, 2]
  },
  {
    id: 'user_default_1',
    username: 'user123',
    password: '123456',
    name: 'Nguyễn Văn A',
    email: 'user123@gmail.com',
    phone: '0123 456 789',
    address: 'Hà Nội, Việt Nam',
    role: 'user',
    favorites: [3]
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [usersList, setUsersList] = useState(() => {
    const stored = localStorage.getItem('registered_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_USERS;
  });

  // Sync users list from backend
  const fetchAllUsers = async () => {
    try {
      const res = await api.getUsers();
      if (res.success && Array.isArray(res.data)) {
        setUsersList(res.data);
        localStorage.setItem('registered_users', JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.warn('Không thể tải users từ backend:', err);
    }
    return usersList;
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const register = async (userData) => {
    // 1. Try Backend API first
    try {
      const res = await api.register(userData);
      if (res.success && res.user) {
        fetchAllUsers();
        return { success: true, user: res.user };
      }
      if (res.message && !res.isNetworkError) {
        return { success: false, message: res.message };
      }
    } catch {
      // Fallback to local
    }

    // 2. Offline fallback
    const cleanUsername = userData.username?.trim().toLowerCase();
    const cleanEmail = userData.email?.trim().toLowerCase();

    if (usersList.some(u => u.username?.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Tên đăng nhập đã tồn tại trên hệ thống.' };
    }
    if (usersList.some(u => u.email?.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email này đã được sử dụng cho tài khoản khác.' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      username: userData.username.trim(),
      name: userData.fullname?.trim() || userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
      phone: userData.phone?.trim() || '',
      address: userData.address?.trim() || 'Hà Nội, Việt Nam',
      role: userData.role || (cleanUsername === 'admin' ? 'admin' : 'user'),
      favorites: []
    };

    const updated = [...usersList, newUser];
    setUsersList(updated);
    localStorage.setItem('registered_users', JSON.stringify(updated));
    return { success: true, user: newUser };
  };

  const login = async (usernameOrData, password) => {
    // Direct user object bypass
    if (typeof usernameOrData === 'object' && usernameOrData !== null) {
      const userToSave = { 
        ...usernameOrData, 
        role: usernameOrData.role || (usernameOrData.username === 'admin' ? 'admin' : 'user'),
        favorites: usernameOrData.favorites || [] 
      };
      setUser(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));
      return { success: true, user: userToSave };
    }

    // 1. Try Backend API
    try {
      const res = await api.login(usernameOrData, password);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      if (res.message && !res.isNetworkError) {
        return { success: false, message: res.message };
      }
    } catch {
      // Fallback
    }

    // 2. Offline fallback
    const identifier = usernameOrData?.trim().toLowerCase();
    const matchedUser = usersList.find(u => 
      (u.username?.toLowerCase() === identifier || u.email?.toLowerCase() === identifier) &&
      u.password === password
    );

    if (!matchedUser) {
      return { success: false, message: 'Tên đăng nhập/email hoặc mật khẩu không chính xác.' };
    }

    const userToSave = {
      id: matchedUser.id,
      username: matchedUser.username,
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone,
      address: matchedUser.address,
      role: matchedUser.role || (matchedUser.username === 'admin' ? 'admin' : 'user'),
      favorites: matchedUser.favorites || []
    };

    setUser(userToSave);
    localStorage.setItem('user', JSON.stringify(userToSave));
    return { success: true, user: userToSave };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    if (!user) return { success: false, message: 'Chưa đăng nhập' };

    const updatedUser = {
      ...user,
      name: profileData.name !== undefined ? profileData.name : user.name,
      phone: profileData.phone !== undefined ? profileData.phone : user.phone,
      address: profileData.address !== undefined ? profileData.address : user.address
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Backend sync
    try {
      await api.updateProfile({ id: user.id, ...profileData });
    } catch (err) {
      console.warn('Lỗi đồng bộ hồ sơ lên backend:', err);
    }

    return { success: true, user: updatedUser };
  };

  const getAllUsers = () => {
    return usersList;
  };

  const deleteUser = async (userId) => {
    const targetUser = usersList.find(u => u.id === userId);
    if (targetUser && targetUser.username === 'admin') {
      return { success: false, message: 'Không thể xóa tài khoản Admin mặc định.' };
    }

    const filtered = usersList.filter(u => u.id !== userId);
    setUsersList(filtered);
    localStorage.setItem('registered_users', JSON.stringify(filtered));

    try {
      await api.deleteUser(userId);
    } catch (err) {
      console.warn('Lỗi xóa user trên backend:', err);
    }

    return { success: true };
  };

  const toggleFavorite = async (carId) => {
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

    // Backend sync
    try {
      await api.toggleFavorite(user.id, carId);
    } catch (err) {
      console.warn('Lỗi toggle favorite lên backend:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      register, 
      login, 
      logout, 
      updateProfile, 
      toggleFavorite, 
      getAllUsers, 
      fetchAllUsers, 
      deleteUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
