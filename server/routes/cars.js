import express from 'express';
import { getPool, sql } from '../config/db.js';
import { INITIAL_CARS } from '../storage/db.js';

const router = express.Router();
const FALLBACK_CAR_IMAGE = 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=800&q=80';

// Helper to format car record from SQL Server
function formatCar(row) {
  let specs = {};
  if (row.specsJson) {
    try {
      specs = JSON.parse(row.specsJson);
    } catch {
      specs = {};
    }
  }
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    year: row.year,
    type: row.type,
    fuel: row.fuel,
    image: row.image || FALLBACK_CAR_IMAGE,
    specs,
    createdAt: row.createdAt
  };
}

// GET /api/cars
router.get('/', async (req, res) => {
  try {
    const { search, type, fuel, sort } = req.query;
    const db = await getPool();
    const request = db.request();

    let query = 'SELECT * FROM Cars WHERE 1=1';

    if (search) {
      request.input('search', sql.NVarChar, `%${search.trim()}%`);
      query += ' AND name LIKE @search';
    }

    if (type && type !== 'All') {
      request.input('type', sql.NVarChar, type);
      query += ' AND type = @type';
    }

    if (fuel && fuel !== 'All') {
      request.input('fuel', sql.NVarChar, fuel);
      query += ' AND fuel = @fuel';
    }

    if (sort === 'price-asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price-desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'year-desc') {
      query += ' ORDER BY year DESC';
    } else {
      query += ' ORDER BY id DESC';
    }

    const result = await request.query(query);
    const cars = result.recordset.map(formatCar);

    return res.json({ success: true, count: cars.length, data: cars });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách xe từ SQL Server.', error: err.message });
  }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = await getPool();
    const result = await db.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Cars WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mẫu xe này.' });
    }

    return res.json({ success: true, data: formatCar(result.recordset[0]) });
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

    const db = await getPool();
    const specsJson = JSON.stringify(specs || {
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
    });

    const result = await db.request()
      .input('name', sql.NVarChar, name.trim())
      .input('price', sql.Float, Number(price) || 0)
      .input('year', sql.Int, Number(year) || new Date().getFullYear())
      .input('type', sql.NVarChar, type || 'Sedan')
      .input('fuel', sql.NVarChar, fuel || 'Gasoline')
      .input('image', sql.NVarChar, image?.trim() || FALLBACK_CAR_IMAGE)
      .input('specsJson', sql.NVarChar, specsJson)
      .query(`
        INSERT INTO Cars (name, price, year, type, fuel, image, specsJson)
        OUTPUT INSERTED.*
        VALUES (@name, @price, @year, @type, @fuel, @image, @specsJson)
      `);

    const newCar = formatCar(result.recordset[0]);
    return res.status(201).json({ success: true, message: 'Thêm xe mới thành công!', data: newCar });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm xe mới vào SQL Server.', error: err.message });
  }
});

// PUT /api/cars/:id
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, price, year, type, fuel, image, specs } = req.body;

    const db = await getPool();
    const existing = await db.request().input('id', sql.Int, id).query('SELECT * FROM Cars WHERE id = @id');
    if (existing.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mẫu xe để cập nhật.' });
    }

    const current = existing.recordset[0];
    const updatedName = name !== undefined ? name.trim() : current.name;
    const updatedPrice = price !== undefined ? Number(price) : current.price;
    const updatedYear = year !== undefined ? Number(year) : current.year;
    const updatedType = type !== undefined ? type : current.type;
    const updatedFuel = fuel !== undefined ? fuel : current.fuel;
    const updatedImage = image !== undefined ? image.trim() : current.image;
    const updatedSpecs = specs !== undefined ? JSON.stringify(specs) : current.specsJson;

    const result = await db.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, updatedName)
      .input('price', sql.Float, updatedPrice)
      .input('year', sql.Int, updatedYear)
      .input('type', sql.NVarChar, updatedType)
      .input('fuel', sql.NVarChar, updatedFuel)
      .input('image', sql.NVarChar, updatedImage)
      .input('specsJson', sql.NVarChar, updatedSpecs)
      .query(`
        UPDATE Cars
        SET name = @name, price = @price, year = @year, type = @type, 
            fuel = @fuel, image = @image, specsJson = @specsJson, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    const updated = formatCar(result.recordset[0]);
    return res.json({ success: true, message: 'Cập nhật xe thành công!', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật xe.', error: err.message });
  }
});

// DELETE /api/cars/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = await getPool();
    const result = await db.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Cars WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xe để xóa.' });
    }

    return res.json({ success: true, message: 'Đã xóa xe khỏi SQL Server thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa xe.', error: err.message });
  }
});

// POST /api/cars/reset
router.post('/reset', async (req, res) => {
  try {
    const db = await getPool();
    await db.request().query('DELETE FROM Cars; DBCC CHECKIDENT (Cars, RESEED, 0);');

    for (const c of INITIAL_CARS) {
      await db.request()
        .input('name', sql.NVarChar, c.name)
        .input('price', sql.Float, c.price)
        .input('year', sql.Int, c.year)
        .input('type', sql.NVarChar, c.type)
        .input('fuel', sql.NVarChar, c.fuel)
        .input('image', sql.NVarChar, c.image)
        .input('specsJson', sql.NVarChar, JSON.stringify(c.specs || {}))
        .query(`
          INSERT INTO Cars (name, price, year, type, fuel, image, specsJson)
          VALUES (@name, @price, @year, @type, @fuel, @image, @specsJson)
        `);
    }

    const result = await db.request().query('SELECT * FROM Cars ORDER BY id ASC');
    return res.json({ success: true, message: 'Đã khôi phục dữ liệu xe mẫu vào SQL Server!', data: result.recordset.map(formatCar) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi khôi phục xe.', error: err.message });
  }
});

export default router;
