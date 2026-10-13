import express from 'express';
import { User, Favorite } from '../config/db.js';

const router = express.Router();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: 1 });
    return res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách người dùng từ MongoDB.', error: err.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra có phải tài khoản admin không
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    if (user.username === 'admin') {
      return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản Admin mặc định.' });
    }

    // Xóa favorites liên quan và xóa user
    await Favorite.deleteMany({ userId: id });
    await User.deleteOne({ id });

    return res.json({ success: true, message: 'Đã xóa tài khoản người dùng thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa người dùng.', error: err.message });
  }
});

export default router;
