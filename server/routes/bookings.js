import express from 'express';
import { Booking } from '../config/db.js';

const router = express.Router();

// GET /api/bookings (Admin list all, or User filter by userId / phone)
router.get('/', async (req, res) => {
  try {
    const { userId, phone } = req.query;
    const filter = {};
    if (userId) {
      filter.$or = [{ userId }, { phone: phone ? phone.trim() : '__none__' }];
    } else if (phone) {
      filter.phone = phone.trim();
    }
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách lịch hẹn từ MongoDB.', error: err.message });
  }
});

// POST /api/bookings (User submit)
router.post('/', async (req, res) => {
  try {
    const { carId, carName, name, phone, date, location, note, userId } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Họ tên và số điện thoại là bắt buộc.' });
    }

    const bookingId = `booking_${Date.now()}`;
    const bookingDate = date || new Date().toISOString().split('T')[0];
    const bookingLocation = location || 'showroom';

    const newBooking = await Booking.create({
      id: bookingId,
      userId: userId || null,
      carId: carId ? Number(carId) : null,
      carName: carName || 'Xe tư vấn chung',
      name: name.trim(),
      phone: phone.trim(),
      date: bookingDate,
      location: bookingLocation,
      note: (note || '').trim(),
      status: 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Đặt lịch hẹn lái thử thành công! Chuyên viên AutoPremium sẽ liên hệ với bạn trong ít phút.',
      data: newBooking
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

    const booking = await Booking.findOneAndUpdate(
      { id },
      { $set: { status } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu lái thử.' });
    }

    return res.json({ success: true, message: 'Cập nhật trạng thái thành công!', data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái.', error: err.message });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Booking.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu để xóa.' });
    }

    return res.json({ success: true, message: 'Đã xóa yêu cầu lái thử thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa yêu cầu.', error: err.message });
  }
});

export default router;
