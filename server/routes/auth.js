import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

function sanitizeUser(user, favorites = []) {
  const { password: _password, ...safeUser } = user;
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
    const db = await getPool();

    // Kiểm tra trùng username hoặc email
    const checkRes = await db.request()
      .input('username', sql.NVarChar, cleanUsername)
      .input('email', sql.NVarChar, cleanEmail)
      .query('SELECT username, email FROM Users WHERE LOWER(username) = @username OR LOWER(email) = @email');

    if (checkRes.recordset.length > 0) {
      const match = checkRes.recordset[0];
      if (match.username.toLowerCase() === cleanUsername) {
        return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại trên hệ thống.' });
      }
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng cho tài khoản khác.' });
    }

    const newId = `user_${Date.now()}`;
    const userRole = role || (cleanUsername === 'admin' ? 'admin' : 'user');

    const insertRes = await db.request()
      .input('id', sql.NVarChar, newId)
      .input('username', sql.NVarChar, username.trim())
      .input('password', sql.NVarChar, password)
      .input('name', sql.NVarChar, (fullname || username).trim())
      .input('email', sql.NVarChar, cleanEmail)
      .input('phone', sql.NVarChar, (phone || '').trim())
      .input('address', sql.NVarChar, (address || 'Hà Nội, Việt Nam').trim())
      .input('role', sql.NVarChar, userRole)
      .query(`
        INSERT INTO Users (id, username, password, name, email, phone, address, role)
        OUTPUT INSERTED.*
        VALUES (@id, @username, @password, @name, @email, @phone, @address, @role)
      `);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      user: sanitizeUser(insertRes.recordset[0], [])
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
    const db = await getPool();

    const result = await db.request()
      .input('identifier', sql.NVarChar, cleanIdentifier)
      .input('password', sql.NVarChar, password)
      .query(`
        SELECT * FROM Users 
        WHERE (LOWER(username) = @identifier OR LOWER(email) = @identifier)
          AND password = @password
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập/email hoặc mật khẩu không chính xác.' });
    }

    const user = result.recordset[0];

    // Lấy danh sách xe yêu thích
    const favRes = await db.request()
      .input('userId', sql.NVarChar, user.id)
      .query('SELECT carId FROM Favorites WHERE userId = @userId');
    const favorites = favRes.recordset.map(r => r.carId);

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

    const db = await getPool();
    const result = await db.request()
      .input('id', sql.NVarChar, id)
      .input('name', sql.NVarChar, name ? name.trim() : null)
      .input('phone', sql.NVarChar, phone ? phone.trim() : null)
      .input('address', sql.NVarChar, address ? address.trim() : null)
      .query(`
        UPDATE Users
        SET name = COALESCE(@name, name),
            phone = COALESCE(@phone, phone),
            address = COALESCE(@address, address),
            updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    // Lấy lại favorites
    const favRes = await db.request()
      .input('userId', sql.NVarChar, id)
      .query('SELECT carId FROM Favorites WHERE userId = @userId');
    const favorites = favRes.recordset.map(r => r.carId);

    return res.json({
      success: true,
      message: 'Cập nhật hồ sơ thành công!',
      user: sanitizeUser(result.recordset[0], favorites)
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

    const db = await getPool();
    const userRes = await db.request()
      .input('id', sql.NVarChar, id)
      .query('SELECT password FROM Users WHERE id = @id');

    if (userRes.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản.' });
    }

    if (userRes.recordset[0].password !== currentPassword) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
    }

    await db.request()
      .input('id', sql.NVarChar, id)
      .input('newPassword', sql.NVarChar, newPassword)
      .query('UPDATE Users SET password = @newPassword, updatedAt = GETDATE() WHERE id = @id');

    return res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi đổi mật khẩu.', error: err.message });
  }
});

export default router;
