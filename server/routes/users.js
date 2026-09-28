import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const db = await getPool();
    const result = await db.request().query(`
      SELECT id, username, name, email, phone, address, role, createdAt 
      FROM Users 
      ORDER BY createdAt ASC
    `);
    return res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách người dùng từ SQL Server.', error: err.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getPool();

    // Kiểm tra có phải tài khoản admin không
    const checkRes = await db.request()
      .input('id', sql.NVarChar, id)
      .query('SELECT username FROM Users WHERE id = @id');

    if (checkRes.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    if (checkRes.recordset[0].username === 'admin') {
      return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản Admin mặc định.' });
    }

    // Xóa favorites liên quan
    await db.request().input('userId', sql.NVarChar, id).query('DELETE FROM Favorites WHERE userId = @userId');

    // Xóa user
    await db.request().input('id', sql.NVarChar, id).query('DELETE FROM Users WHERE id = @id');

    return res.json({ success: true, message: 'Đã xóa tài khoản người dùng thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa người dùng.', error: err.message });
  }
});

export default router;
