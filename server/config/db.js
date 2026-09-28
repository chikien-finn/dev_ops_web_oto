import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_CARS, INITIAL_USERS, INITIAL_BOOKINGS } from '../storage/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbUser = process.env.DB_USER || 'sa';
const dbPassword = process.env.DB_PASSWORD || '123456';
const dbServer = process.env.DB_SERVER || 'localhost';
const dbName = process.env.DB_DATABASE || 'db_web_oto';
const dbPort = parseInt(process.env.DB_PORT || '1433', 10);
const dbInstance = process.env.DB_INSTANCE || undefined;

const baseConfig = {
  user: dbUser,
  password: dbPassword,
  server: dbServer,
  port: dbPort,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 8000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

if (dbInstance) {
  baseConfig.options.instanceName = dbInstance;
}

let pool = null;

// Hàm chờ đợi (delay)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Kết nối với cơ chế Retry (rất quan trọng khi chạy trong Docker)
export async function getPool(retries = 12, delayMs = 3000) {
  if (pool) return pool;

  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[Database] Đang kết nối SQL Server (lần ${i}/${retries}) tới ${dbServer}:${dbPort}...`);
      
      // Bước 1: Kết nối master để đảm bảo database tồn tại
      const masterConfig = { ...baseConfig, database: 'master' };
      const masterConn = await sql.connect(masterConfig);
      
      await masterConn.request().query(`
        IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'${dbName}')
        BEGIN
            CREATE DATABASE [${dbName}];
        END
      `);
      await masterConn.close();

      // Bước 2: Kết nối chính thức vào database chỉ định
      const targetConfig = { ...baseConfig, database: dbName };
      pool = await sql.connect(targetConfig);
      console.log(`✅ Kết nối thành công SQL Server: ${dbServer} [Database: ${dbName}]`);
      return pool;
    } catch (err) {
      console.warn(`[Database] Chưa sẵn sàng (${err.message}). Đang đợi ${delayMs / 1000}s thử lại...`);
      if (i === retries) {
        console.error('❌ Đã hết số lần thử kết nối SQL Server.');
        throw err;
      }
      await delay(delayMs);
    }
  }
}

// Tự động tạo bảng và nạp dữ liệu mẫu
export async function initializeDatabase() {
  try {
    const db = await getPool();

    // 1. Tạo bảng Users
    await db.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        id NVARCHAR(100) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        phone NVARCHAR(20),
        address NVARCHAR(255),
        role NVARCHAR(20) DEFAULT 'user',
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME
      );
    `);

    // 2. Tạo bảng Cars
    await db.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cars' AND xtype='U')
      CREATE TABLE Cars (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(150) NOT NULL,
        price FLOAT NOT NULL,
        year INT NOT NULL,
        type NVARCHAR(50) NOT NULL,
        fuel NVARCHAR(50) NOT NULL,
        image NVARCHAR(500),
        specsJson NVARCHAR(MAX),
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME
      );
    `);

    // 3. Tạo bảng Bookings
    await db.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Bookings' AND xtype='U')
      CREATE TABLE Bookings (
        id NVARCHAR(100) PRIMARY KEY,
        carId INT,
        carName NVARCHAR(150),
        name NVARCHAR(100) NOT NULL,
        phone NVARCHAR(20) NOT NULL,
        date NVARCHAR(50),
        location NVARCHAR(50) DEFAULT 'showroom',
        note NVARCHAR(MAX),
        status NVARCHAR(30) DEFAULT 'pending',
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME
      );
    `);

    // 4. Tạo bảng Favorites
    await db.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Favorites' AND xtype='U')
      CREATE TABLE Favorites (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId NVARCHAR(100) NOT NULL,
        carId INT NOT NULL,
        createdAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT UQ_User_Car UNIQUE (userId, carId)
      );
    `);

    // Seed Users nếu rỗng
    const usersCountRes = await db.request().query('SELECT COUNT(*) as count FROM Users');
    if (usersCountRes.recordset[0].count === 0) {
      console.log('🌱 Đang nạp tài khoản mẫu vào bảng Users...');
      for (const u of INITIAL_USERS) {
        await db.request()
          .input('id', sql.NVarChar, u.id)
          .input('username', sql.NVarChar, u.username)
          .input('password', sql.NVarChar, u.password)
          .input('name', sql.NVarChar, u.name)
          .input('email', sql.NVarChar, u.email)
          .input('phone', sql.NVarChar, u.phone)
          .input('address', sql.NVarChar, u.address)
          .input('role', sql.NVarChar, u.role)
          .query(`
            INSERT INTO Users (id, username, password, name, email, phone, address, role)
            VALUES (@id, @username, @password, @name, @email, @phone, @address, @role)
          `);
      }
    }

    // Seed Cars nếu rỗng
    const carsCountRes = await db.request().query('SELECT COUNT(*) as count FROM Cars');
    if (carsCountRes.recordset[0].count === 0) {
      console.log('🌱 Đang nạp danh mục xe mẫu vào bảng Cars...');
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
    }

    // Seed Bookings nếu rỗng
    const bookingsCountRes = await db.request().query('SELECT COUNT(*) as count FROM Bookings');
    if (bookingsCountRes.recordset[0].count === 0) {
      console.log('🌱 Đang nạp đơn lái thử mẫu vào bảng Bookings...');
      for (const b of INITIAL_BOOKINGS) {
        await db.request()
          .input('id', sql.NVarChar, b.id)
          .input('carId', sql.Int, b.carId)
          .input('carName', sql.NVarChar, b.carName)
          .input('name', sql.NVarChar, b.name)
          .input('phone', sql.NVarChar, b.phone)
          .input('date', sql.NVarChar, b.date)
          .input('location', sql.NVarChar, b.location)
          .input('note', sql.NVarChar, b.note)
          .input('status', sql.NVarChar, b.status)
          .query(`
            INSERT INTO Bookings (id, carId, carName, name, phone, date, location, note, status)
            VALUES (@id, @carId, @carName, @name, @phone, @date, @location, @note, @status)
          `);
      }
    }

    console.log('✅ Hệ thống bảng và dữ liệu SQL Server đã sẵn sàng 100%!');
  } catch (err) {
    console.error('❌ Lỗi khởi tạo cấu trúc SQL Server:', err);
  }
}

export { sql };
export default { getPool, initializeDatabase, sql };
