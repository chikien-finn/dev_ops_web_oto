import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

// GET /api/bookings (Admin)
router.get('/', async (req, res) => {
  try {
    const db = await getPool();
    const result = await db.request().query('SELECT * FROM Bookings ORDER BY createdAt DESC');
    return res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách lịch hẹn từ SQL Server.', error: err.message });
  }
});

// POST /api/bookings (User submit)
router.post('/', async (req, res) => {
  try {
    const { carId, carName, name, phone, date, location, note } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Họ tên và số điện thoại là bắt buộc.' });
    }

    const db = await getPool();
    const bookingId = `booking_${Date.now()}`;
    const bookingDate = date || new Date().toISOString().split('T')[0];
    const bookingLocation = location || 'showroom';

    const result = await db.request()
      .input('id', sql.NVarChar, bookingId)
      .input('carId', sql.Int, carId ? Number(carId) : null)
      .input('carName', sql.NVarChar, carName || 'Xe tư vấn chung')
      .input('name', sql.NVarChar, name.trim())
      .input('phone', sql.NVarChar, phone.trim())
      .input('date', sql.NVarChar, bookingDate)
      .input('location', sql.NVarChar, bookingLocation)
      .input('note', sql.NVarChar, (note || '').trim())
      .input('status', sql.NVarChar, 'pending')
      .query(`
        INSERT INTO Bookings (id, carId, carName, name, phone, date, location, note, status)
        OUTPUT INSERTED.*
        VALUES (@id, @carId, @carName, @name, @phone, @date, @location, @note, @status)
      `);

    return res.status(201).json({
      success: true,
      message: 'Đặt lịch hẹn lái thử thành công! Chuyên viên AutoPremium sẽ liên hệ với bạn trong ít phút.',
      data: result.recordset[0]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi gửi yêu cầu lái thử.', error: err.message });
  }
});

// PATCH /api/bookings/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'contacted', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }

    const db = await getPool();
    const result = await db.request()
      .input('id', sql.NVarChar, id)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE Bookings
        SET status = @status, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu lái thử.' });
    }

    return res.json({ success: true, message: 'Cập nhật trạng thái thành công!', data: result.recordset[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái.', error: err.message });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getPool();
    const result = await db.request()
      .input('id', sql.NVarChar, id)
      .query('DELETE FROM Bookings WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu để xóa.' });
    }

    return res.json({ success: true, message: 'Đã xóa yêu cầu lái thử thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa yêu cầu.', error: err.message });
  }
});

export default router;
