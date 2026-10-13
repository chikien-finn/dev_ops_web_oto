import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_CARS, INITIAL_USERS, INITIAL_BOOKINGS } from '../storage/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuration options for JSON serialization
const schemaOptions = {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: (_doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};

// ==========================================
// 1. MONGOOSE SCHEMAS & MODELS
// ==========================================

// Car Model
const carSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  type: { type: String, required: true, trim: true },
  fuel: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  specs: { type: mongoose.Schema.Types.Mixed, default: {} }
}, schemaOptions);

export const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

// User Model
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  address: { type: String, default: 'Hà Nội, Việt Nam' },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }
}, schemaOptions);

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Booking Model
const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, default: null },
  carId: { type: Number, default: null },
  carName: { type: String, default: 'Xe tư vấn chung' },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  date: { type: String },
  location: { type: String, default: 'showroom' },
  note: { type: String, default: '' },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'contacted', 'completed', 'cancelled']
  }
}, schemaOptions);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// Favorite Model
const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  carId: { type: Number, required: true }
}, schemaOptions);

favoriteSchema.index({ userId: 1, carId: 1 }, { unique: true });

export const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);

// ==========================================
// 2. DATABASE CONNECTION & INITIALIZATION
// ==========================================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function getMongoUri() {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  const user = process.env.DB_USER || process.env.MONGO_INITDB_ROOT_USERNAME;
  const pass = process.env.DB_PASSWORD || process.env.MONGO_INITDB_ROOT_PASSWORD;
  const host = process.env.DB_SERVER || process.env.MONGO_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || process.env.MONGO_PORT || '27017';
  const dbName = process.env.DB_DATABASE || process.env.MONGO_DATABASE || 'db_web_oto';

  if (user && pass) {
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${dbName}?authSource=admin`;
  }
  return `mongodb://${host}:${port}/${dbName}`;
}

export async function connectDB(retries = (process.env.CI || process.env.NODE_ENV === 'test' ? 2 : 10), delayMs = (process.env.CI || process.env.NODE_ENV === 'test' ? 800 : 2500)) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = getMongoUri();
  // Safe display uri without exposing password in logs
  const safeUri = uri.replace(/\/\/[^@]+@/, '//***:***@');

  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[MongoDB] Đang kết nối MongoDB (lần ${i}/${retries}) tới: ${safeUri}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: process.env.CI ? 3000 : 5000
      });
      console.log(`✅ Kết nối thành công MongoDB [Database: ${mongoose.connection.name}]`);
      return mongoose.connection;
    } catch (err) {
      console.warn(`[MongoDB] Chưa sẵn sàng (${err.message}). Đợi ${delayMs / 1000}s thử lại...`);
      if (i === retries) {
        if (process.env.CI) {
          console.warn('⚠️ Hết số lần thử kết nối MongoDB trong CI.');
          return null;
        }
        throw err;
      }
      await delay(delayMs);
    }
  }
  return null;
}

// Backwards-compatibility for existing tests/scripts expecting getPool()
export async function getPool() {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  return mongoose.connection;
}

export async function initializeDatabase() {
  try {
    const conn = await connectDB();
    if (!conn) {
      return false;
    }

    // 1. Seed Cars
    const carsCount = await Car.countDocuments();
    if (carsCount === 0) {
      console.log('🌱 Nạp dữ liệu xe mẫu (INITIAL_CARS) vào MongoDB...');
      await Car.insertMany(INITIAL_CARS);
    }

    // 2. Seed Users
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log('🌱 Nạp tài khoản mẫu (admin & user123) vào MongoDB...');
      const usersToInsert = INITIAL_USERS.map(({ favorites: _f, ...u }) => u);
      await User.insertMany(usersToInsert);
    }

    // 3. Seed Bookings
    const bookingsCount = await Booking.countDocuments();
    if (bookingsCount === 0) {
      console.log('🌱 Nạp dữ liệu lịch hẹn mẫu vào MongoDB...');
      await Booking.insertMany(INITIAL_BOOKINGS);
    }

    // 4. Seed Favorites
    const favCount = await Favorite.countDocuments();
    if (favCount === 0) {
      const favDocs = [];
      for (const u of INITIAL_USERS) {
        if (Array.isArray(u.favorites)) {
          for (const carId of u.favorites) {
            favDocs.push({ userId: u.id, carId });
          }
        }
      }
      if (favDocs.length > 0) {
        await Favorite.insertMany(favDocs);
      }
    }

    return true;
  } catch (err) {
    console.error('❌ Lỗi khởi tạo dữ liệu ban đầu MongoDB:', err.message);
    return false;
  }
}

export default {
  connectDB,
  initializeDatabase,
  getPool,
  Car,
  User,
  Booking,
  Favorite
};
