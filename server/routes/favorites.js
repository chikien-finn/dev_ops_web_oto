import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

// POST /api/favorites/toggle
router.post('/toggle', async (req, res) => {
  try {
    const { userId, carId } = req.body;

    if (!userId || carId === undefined) {
      return res.status(400).json({ success: false, message: 'Thiếu userId hoặc carId.' });
    }

    const numericCarId = parseInt(carId, 10);
    const db = await getPool();

    // Kiểm tra xem đã thích chưa
    const checkRes = await db.request()
      .input('userId', sql.NVarChar, userId)
      .input('carId', sql.Int, numericCarId)
      .query('SELECT * FROM Favorites WHERE userId = @userId AND carId = @carId');

    let isFavorite = false;

    if (checkRes.recordset.length > 0) {
      // Đã có -> Xóa khỏi danh sách yêu thích
      await db.request()
        .input('userId', sql.NVarChar, userId)
        .input('carId', sql.Int, numericCarId)
        .query('DELETE FROM Favorites WHERE userId = @userId AND carId = @carId');
      isFavorite = false;
    } else {
      // Chưa có -> Thêm vào
      await db.request()
        .input('userId', sql.NVarChar, userId)
        .input('carId', sql.Int, numericCarId)
        .query('INSERT INTO Favorites (userId, carId) VALUES (@userId, @carId)');
      isFavorite = true;
    }

    // Lấy toàn bộ danh sách favorites mới
    const allFavRes = await db.request()
      .input('userId', sql.NVarChar, userId)
      .query('SELECT carId FROM Favorites WHERE userId = @userId');

    const favorites = allFavRes.recordset.map(r => r.carId);

    return res.json({
      success: true,
      isFavorite,
      message: isFavorite ? 'Đã thêm xe vào danh sách yêu thích!' : 'Đã xóa xe khỏi danh sách yêu thích!',
      favorites
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi toggle yêu thích trong SQL Server.', error: err.message });
  }
});

// GET /api/favorites/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await getPool();

    const result = await db.request()
      .input('userId', sql.NVarChar, userId)
      .query('SELECT carId FROM Favorites WHERE userId = @userId');

    const favorites = result.recordset.map(r => r.carId);
    return res.json({ success: true, favorites });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách yêu thích từ SQL Server.', error: err.message });
  }
});

export default router;
