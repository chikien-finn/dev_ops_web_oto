import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

export const INITIAL_CARS = [
  {
    id: 1,
    name: 'Mercedes-Benz S-Class 2026',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=800&q=80',
    year: 2026,
    type: 'Sedan',
    fuel: 'Hybrid',
    specs: {
      acceleration: '4.4 giây',
      topSpeed: '250 km/h',
      horsepower: '429 HP',
      transmission: '9G-TRONIC 9 cấp',
      drivetrain: '4MATIC Toàn thời gian',
      engine: '3.0L Turbo Hybrid MHEV',
      features: [
        { title: 'Hệ thống treo khí nén AIRMATIC', desc: 'Tự động thích ứng giảm xóc theo từng điều kiện mặt đường' },
        { title: 'Nội thất Da Nappa & Gỗ quý', desc: 'Không gian tĩnh lặng tuyệt đối với kính cách âm nhiều lớp' },
        { title: 'Âm thanh Burmester® 3D High-End', desc: 'Hệ thống 15 loa vòm công suất 710 Watt sống động' },
        { title: 'Hỗ trợ lái bán tự động Cấp 3', desc: 'Tự động giữ làn, chuyển làn và bám đuôi an toàn' }
      ]
    }
  },
  {
    id: 2,
    name: 'Porsche 911 Turbo S',
    price: 205000,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'Coupe',
    fuel: 'Gasoline',
    specs: {
      acceleration: '2.7 giây',
      topSpeed: '330 km/h',
      horsepower: '650 HP',
      transmission: '8 cấp PDK ly hợp kép',
      drivetrain: 'AWD 4 bánh chủ động',
      engine: '3.8L Boxer Twin-Turbo',
      features: [
        { title: 'Phanh Gốm Carbon Porsche (PCCB)', desc: 'Hiệu suất phanh đỉnh cao với kẹp phanh 10 piston phía trước' },
        { title: 'Kiểm soát khung gầm PDCC', desc: 'Hạn chế tối đa độ nghiêng thân xe khi vào cua tốc độ cao' },
        { title: 'Ghế thể thao Adaptive 18 hướng', desc: 'Bọc da cao cấp với đường chỉ may thủ công thể thao độc quyền' },
        { title: 'Hệ thống treo chủ động PASM', desc: 'Hạ thấp trọng tâm 10mm mang lại trải nghiệm xe đua thuần túy' }
      ]
    }
  },
  {
    id: 3,
    name: 'Audi RS e-tron GT',
    price: 140000,
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'Sedan',
    fuel: 'Electric',
    specs: {
      acceleration: '3.1 giây',
      topSpeed: '250 km/h',
      horsepower: '637 HP',
      transmission: '2 cấp thể thao điện tử',
      drivetrain: 'quattro điện tử siêu nhạy',
      engine: 'Dual Electric Motors (800V)',
      features: [
        { title: 'Công nghệ sạc siêu nhanh 800V', desc: 'Sạc từ 5% lên 80% chỉ trong 22.5 phút với trạm sạc DC 270kW' },
        { title: 'Đèn pha Matrix LED & Laser Audi', desc: 'Tầm chiếu sáng vượt trội gấp đôi so với đèn thông thường' },
        { title: 'Hệ thống đánh lái 4 bánh', desc: 'Bán kính quay vòng linh hoạt và ổn định tuyệt đối ở tốc độ cao' },
        { title: 'Nội thất thuần chay sinh thái', desc: 'Chất liệu tái chế siêu cao cấp Dinamica & sợi Kaskade hiện đại' }
      ]
    }
  },
  {
    id: 4,
    name: 'BMW M8 Competition',
    price: 135000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    type: 'Coupe',
    fuel: 'Gasoline',
    specs: {
      acceleration: '3.0 giây',
      topSpeed: '305 km/h',
      horsepower: '617 HP',
      transmission: '8 cấp M Steptronic',
      drivetrain: 'M xDrive thể thao 3 chế độ',
      engine: '4.4L V8 M TwinPower Turbo',
      features: [
        { title: 'M xDrive với chế độ 2WD', desc: 'Tự do chuyển đổi giữa dẫn động 4 bánh và dẫn động cầu sau drift' },
        { title: 'Mui xe sợi Carbon gia cường (CFRP)', desc: 'Cắt giảm trọng lượng và tối ưu hóa trọng tâm xe thể thao' },
        { title: 'Hệ thống xả thể thao M Sport', desc: 'Âm thanh gầm rú uy lực với van bướm điều khiển điện tử' },
        { title: 'Bảng đồng hồ Live Cockpit Pro', desc: 'Màn hình 12.3 inch đồ họa thể thao chuyên biệt trường đua' }
      ]
    }
  },
  {
    id: 5,
    name: 'Range Rover SV Autobiography',
    price: 215000,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'SUV',
    fuel: 'Hybrid',
    specs: {
      acceleration: '4.6 giây',
      topSpeed: '261 km/h',
      horsepower: '523 HP',
      transmission: '8 cấp ZF tự động',
      drivetrain: 'AWD Địa hình All-Terrain',
      engine: '4.4L Twin-Turbo V8 Hybrid',
      features: [
        { title: 'Hệ thống Terrain Response 2', desc: 'Tự động nhận diện và thích ứng mọi địa hình tuyết, bùn, đá, cát' },
        { title: 'Ghế thương gia Hạng Nhất SV', desc: 'Massage đá nóng, chỉnh điện 24 hướng và đệm đỡ bắp chân thư giãn' },
        { title: 'Khử tiếng ồn chủ động thế hệ 3', desc: 'Loa gắn tại tựa đầu tạo vùng tĩnh lặng riêng tư tối đa' },
        { title: 'Cửa mở tự động điều khiển điện', desc: 'Tích hợp cảm biến chống kẹt và tự hít cửa êm ái sang trọng' }
      ]
    }
  },
  {
    id: 6,
    name: 'Aston Martin DB12',
    price: 245000,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    type: 'Coupe',
    fuel: 'Gasoline',
    specs: {
      acceleration: '3.5 giây',
      topSpeed: '325 km/h',
      horsepower: '671 HP',
      transmission: '8 cấp tự động thể thao',
      drivetrain: 'Cầu sau RWD vi sai điện tử E-Diff',
      engine: '4.0L Twin-Turbo V8',
      features: [
        { title: 'Siêu xe Super Tourer đầu tiên thế giới', desc: 'Sự kết hợp hoàn mỹ giữa sức mạnh mãnh thú và sự êm ái xa xỉ' },
        { title: 'Nội thất da Bridge of Weir thủ công', desc: 'Chế tác thủ công tại Vương Quốc Anh chuẩn hoàng gia' },
        { title: 'Hệ thống vi sai điện tử thông minh', desc: 'Phân bổ lực kéo theo mili-giây giúp ôm cua chuẩn xác tuyệt đối' },
        { title: 'Hệ thống giải trí thế hệ mới', desc: 'Màn hình cảm ứng điện dung sắc nét, Apple CarPlay không dây' }
      ]
    }
  }
];

export const INITIAL_USERS = [
  {
    id: 'user_admin_1',
    username: 'admin',
    password: 'admin123',
    name: 'Quản Trị Viên',
    email: 'admin@autopremium.com',
    phone: '0999 888 777',
    address: 'Trụ sở AutoPremium, Hà Nội',
    role: 'admin',
    favorites: [1, 2],
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_default_1',
    username: 'user123',
    password: '123456',
    name: 'Nguyễn Văn A',
    email: 'user123@gmail.com',
    phone: '0123 456 789',
    address: 'Hà Nội, Việt Nam',
    role: 'user',
    favorites: [3],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'booking_1',
    carId: 2,
    carName: 'Porsche 911 Turbo S',
    name: 'Trần Minh Đức',
    phone: '0988 123 456',
    date: '2026-10-05',
    location: 'showroom',
    note: 'Muốn trải nghiệm chế độ lái Sport Plus và kiểm tra nội thất màu nâu.',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'booking_2',
    carId: 1,
    carName: 'Mercedes-Benz S-Class 2026',
    name: 'Lê Hoàng Nam',
    phone: '0912 999 888',
    date: '2026-10-08',
    location: 'home',
    note: 'Tư vấn gói bảo dưỡng định kỳ và dịch vụ giao xe tận nhà.',
    status: 'contacted',
    createdAt: new Date().toISOString()
  }
];

// Helper: Ensure directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Helper: Read collection or seed if not present
export async function readCollection(name, defaultData) {
  await ensureDir(DATA_DIR);
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // If not found or invalid, seed and save default
  }
  await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
  return defaultData;
}

// Helper: Write collection
export async function writeCollection(name, data) {
  await ensureDir(DATA_DIR);
  const filePath = path.join(DATA_DIR, `${name}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return data;
}
