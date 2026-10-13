import express from 'express';
import { Car } from '../config/db.js';
import { INITIAL_CARS } from '../storage/db.js';

const router = express.Router();
const FALLBACK_CAR_IMAGE = 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=800&q=80';

// GET /api/cars
router.get('/', async (req, res) => {
  try {
    const { search, type, fuel, sort } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    if (type && type !== 'All') {
      filter.type = type;
    }

    if (fuel && fuel !== 'All') {
      filter.fuel = fuel;
    }

    let sortOptions = { id: -1 };
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'year-desc') {
      sortOptions = { year: -1 };
    }

    const cars = await Car.find(filter).sort(sortOptions);
    return res.json({ success: true, count: cars.length, data: cars });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách xe từ MongoDB.', error: err.message });
  }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Mã ID xe không hợp lệ.' });
    }

    const car = await Car.findOne({ id });
    if (!car) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mẫu xe này.' });
    }

    return res.json({ success: true, data: car });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin xe.', error: err.message });
  }
});

// POST /api/cars
router.post('/', async (req, res) => {
  try {
    const { name, price, year, type, fuel, image, specs } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Tên xe và giá xe là bắt buộc.' });
    }

    // Tự sinh ID số tăng dần tiếp theo
    const lastCar = await Car.findOne().sort({ id: -1 });
    const nextId = lastCar && typeof lastCar.id === 'number' ? lastCar.id + 1 : 1;

    const defaultSpecs = {
      acceleration: '3.5 giây',
      topSpeed: '280 km/h',
      horsepower: '450 HP',
      transmission: 'Tự động 8 cấp',
      drivetrain: 'AWD Toàn thời gian',
      engine: `${fuel || 'Gasoline'} V6 Twin-Turbo`,
      features: [
        { title: 'Nội thất da cao cấp', desc: 'Không gian tĩnh lặng và tiện nghi công nghệ cao' },
        { title: 'Hệ thống an toàn chủ động', desc: 'Camera toàn cảnh 360 độ và phanh khẩn cấp tự động' }
      ]
    };

    const newCar = await Car.create({
      id: nextId,
      name: name.trim(),
      price: Number(price) || 0,
      year: Number(year) || new Date().getFullYear(),
      type: type || 'Sedan',
      fuel: fuel || 'Gasoline',
      image: image?.trim() || FALLBACK_CAR_IMAGE,
      specs: specs || defaultSpecs
    });

    return res.status(201).json({ success: true, message: 'Thêm xe mới thành công!', data: newCar });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm xe mới vào MongoDB.', error: err.message });
  }
});

// PUT /api/cars/:id
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Mã ID xe không hợp lệ.' });
    }

    const { name, price, year, type, fuel, image, specs } = req.body;
    const car = await Car.findOne({ id });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mẫu xe để cập nhật.' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (price !== undefined) updateFields.price = Number(price);
    if (year !== undefined) updateFields.year = Number(year);
    if (type !== undefined) updateFields.type = type;
    if (fuel !== undefined) updateFields.fuel = fuel;
    if (image !== undefined) updateFields.image = image.trim();
    if (specs !== undefined) updateFields.specs = specs;

    const updated = await Car.findOneAndUpdate({ id }, { $set: updateFields }, { new: true });
    return res.json({ success: true, message: 'Cập nhật xe thành công!', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật xe.', error: err.message });
  }
});

// DELETE /api/cars/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Mã ID xe không hợp lệ.' });
    }

    const result = await Car.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xe để xóa.' });
    }

    return res.json({ success: true, message: 'Đã xóa xe khỏi MongoDB thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa xe.', error: err.message });
  }
});

// POST /api/cars/reset
router.post('/reset', async (req, res) => {
  try {
    await Car.deleteMany({});
    await Car.insertMany(INITIAL_CARS);
    const cars = await Car.find().sort({ id: 1 });
    return res.json({ success: true, message: 'Đã khôi phục dữ liệu xe mẫu vào MongoDB!', data: cars });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khôi phục xe.', error: err.message });
  }
});

export default router;
