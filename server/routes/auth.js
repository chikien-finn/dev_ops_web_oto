import express from 'express';
import { User, Favorite } from '../config/db.js';

const router = express.Router();

function sanitizeUser(user, favorites = []) {
  const safeUser = user && user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser._id;
  delete safeUser.__v;
  return {
    ...safeUser,
    favorites
  };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullname, email, phone, address, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ tên đăng nhập, mật khẩu và email.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Kiểm tra trùng username hoặc email
    const existing = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }]
    });

    if (existing) {
      if (existing.username.toLowerCase() === cleanUsername) {
        return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại trên hệ thống.' });
      }
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng cho tài khoản khác.' });
    }

    const newId = `user_${Date.now()}`;
    const userRole = role || (cleanUsername === 'admin' ? 'admin' : 'user');

    const newUser = await User.create({
      id: newId,
      username: cleanUsername,
      password,
      name: (fullname || username).trim(),
      email: cleanEmail,
      phone: (phone || '').trim(),
      address: (address || 'Hà Nội, Việt Nam').trim(),
      role: userRole
    });

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      user: sanitizeUser(newUser, [])
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký.', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    const cleanIdentifier = username.trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ username: cleanIdentifier }, { email: cleanIdentifier }],
      password
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập/email hoặc mật khẩu không chính xác.' });
    }

    // Lấy danh sách xe yêu thích
    const favDocs = await Favorite.find({ userId: user.id });
    const favorites = favDocs.map(f => f.carId);

    return res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: sanitizeUser(user, favorites)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập.', error: err.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', async (req, res) => {
  try {
    const { id, name, phone, address } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin User ID.' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (address !== undefined) updateFields.address = address.trim();

    const updatedUser = await User.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    // Lấy lại danh sách favorites
    const favDocs = await Favorite.find({ userId: id });
    const favorites = favDocs.map(f => f.carId);

    return res.json({
      success: true,
      message: 'Cập nhật hồ sơ thành công!',
      user: sanitizeUser(updatedUser, favorites)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật hồ sơ.', error: err.message });
  }
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;

    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu cũ và mới.' });
    }

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản.' });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi đổi mật khẩu.', error: err.message });
  }
});

export default router;
