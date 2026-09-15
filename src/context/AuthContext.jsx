import { createContext, useState, useContext } from 'react';

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
    favorites: []
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
    favorites: []
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const getRegisteredUsers = () => {
    const stored = localStorage.getItem('registered_users');
    if (!stored) {
      localStorage.setItem('registered_users', JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem('registered_users', JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      // Đảm bảo tài khoản admin luôn có trong danh sách
      const hasAdmin = parsed.some(u => u.username === 'admin');
      if (!hasAdmin) {
        const merged = [DEFAULT_USERS[0], ...parsed];
        localStorage.setItem('registered_users', JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      localStorage.setItem('registered_users', JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
  };

  const register = (userData) => {
    const users = getRegisteredUsers();
    const cleanUsername = userData.username?.trim().toLowerCase();
    const cleanEmail = userData.email?.trim().toLowerCase();

    // Kiểm tra trùng username
    const usernameExists = users.some(u => u.username?.toLowerCase() === cleanUsername);
    if (usernameExists) {
      return { success: false, message: 'Tên đăng nhập đã tồn tại trên hệ thống.' };
    }

    // Kiểm tra trùng email
    const emailExists = users.some(u => u.email?.toLowerCase() === cleanEmail);
    if (emailExists) {
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

    const updatedUsers = [...users, newUser];
    localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
    return { success: true, user: newUser };
  };

  const login = (usernameOrData, password) => {
    // Trường hợp gọi với object trực tiếp
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

    // Trường hợp đăng nhập với username/email và password
    const users = getRegisteredUsers();
    const identifier = usernameOrData?.trim().toLowerCase();

    const matchedUser = users.find(u => 
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

  const getAllUsers = () => {
    return getRegisteredUsers();
  };

  const deleteUser = (userId) => {
    const users = getRegisteredUsers();
    const targetUser = users.find(u => u.id === userId);
    if (targetUser && targetUser.username === 'admin') {
      return { success: false, message: 'Không thể xóa tài khoản Admin mặc định.' };
    }
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem('registered_users', JSON.stringify(filtered));
    return { success: true };
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

    // Đồng bộ vào danh sách registered_users nếu có
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.username?.toLowerCase() === user.username?.toLowerCase());
    if (userIndex !== -1) {
      users[userIndex].favorites = updatedFavorites;
      localStorage.setItem('registered_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, toggleFavorite, getAllUsers, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
