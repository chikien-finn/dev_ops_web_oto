export const FALLBACK_CAR_IMAGE = 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=800&q=80';

export const allCars = [
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
  },
  {
    id: 7,
    name: 'Ferrari 296 GTB 2025',
    price: 340000,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'Coupe',
    fuel: 'Hybrid',
    specs: {
      acceleration: '2.9 giây',
      topSpeed: '330 km/h',
      horsepower: '819 HP',
      transmission: '8 cấp F1 ly hợp kép',
      drivetrain: 'Cầu sau RWD thể thao',
      engine: '3.0L V6 Twin-Turbo Plug-in Hybrid',
      features: [
        { title: 'Động cơ V6 Turbo Hybrid F1', desc: 'Kế thừa công nghệ từ giải đua Công thức 1 với tổng công suất 819 mã lực' },
        { title: 'Khung gầm trọng lượng siêu nhẹ', desc: 'Tỷ lệ trọng lượng/công suất xuất sắc 1.77 kg/HP cho cảm giác lái nhạy bén' },
        { title: 'Hệ thống phanh điện tử Brake-by-Wire', desc: 'Quãng đường phanh 200-0 km/h ấn tượng chỉ trong 107 mét' },
        { title: 'Giao diện điều khiển HMI cảm ứng', desc: 'Vô lăng tích hợp toàn bộ các phím điều khiển chế độ eManettino hiện đại' }
      ]
    }
  },
  {
    id: 8,
    name: 'Lamborghini Revuelto 2026',
    price: 608000,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    year: 2026,
    type: 'Hypercar',
    fuel: 'Hybrid',
    specs: {
      acceleration: '2.5 giây',
      topSpeed: '350 km/h',
      horsepower: '1001 HP',
      transmission: '8 cấp ly hợp kép điện tử',
      drivetrain: '4WD Điện hóa thông minh',
      engine: '6.5L V12 hút khí tự nhiên + 3 Mô-tơ điện',
      features: [
        { title: 'Cấu trúc Monofuselage Carbon', desc: 'Khung đơn khối hoàn toàn bằng sợi carbon tăng 25% độ cứng chống vặn xoắn' },
        { title: 'Sức mạnh vượt mốc 1,000 HP', desc: 'Động cơ V12 huyền thoại kết hợp 3 mô-tơ điện sản sinh gia tốc xé gió' },
        { title: 'Cửa cắt kéo Scissor Doors kinh điển', desc: 'Dấu ấn độc bản của siêu xe thể thao biểu tượng nước Ý' },
        { title: '13 Chế độ lái chuyên biệt', desc: 'Tùy biến linh hoạt từ đi phố êm ái Città đến bùng nổ trên trường đua Corsa' }
      ]
    }
  },
  {
    id: 9,
    name: 'Rolls-Royce Spectre 2025',
    price: 420000,
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'Coupe',
    fuel: 'Electric',
    specs: {
      acceleration: '4.4 giây',
      topSpeed: '250 km/h',
      horsepower: '577 HP',
      transmission: 'Hộp số đơn cấp tĩnh lặng',
      drivetrain: 'AWD 4 bánh toàn thời gian',
      engine: 'Động cơ điện kép Dual-Motor (102 kWh)',
      features: [
        { title: 'Coupe siêu sang thuần điện đầu tiên', desc: 'Hệ thống treo Planar mang đến cảm giác lướt êm ái như trên thảm bay diệu kỳ' },
        { title: 'Cửa Starlight Doors ngàn sao', desc: '4,796 điểm sáng sợi quang học hoàn thiện thủ công tạo bầu trời đêm lung linh' },
        { title: 'Lưới tản nhiệt Pantheon phát sáng', desc: 'Lưới tản nhiệt rộng nhất với 22 đèn LED chiếu sáng nhẹ nhàng đẳng cấp' },
        { title: 'Nội thất Bespoke đỉnh cao', desc: 'Chất liệu da thượng hạng và gỗ quý tuyển chọn theo yêu cầu riêng của chủ nhân' }
      ]
    }
  },
  {
    id: 10,
    name: 'Bentley Continental GT Speed 2025',
    price: 310000,
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'Coupe',
    fuel: 'Hybrid',
    specs: {
      acceleration: '3.2 giây',
      topSpeed: '335 km/h',
      horsepower: '771 HP',
      transmission: '8 cấp ly hợp kép thể thao',
      drivetrain: 'AWD chủ động toàn thời gian',
      engine: '4.0L Ultra Performance V8 Hybrid',
      features: [
        { title: 'Động cơ Ultra Performance Hybrid', desc: 'Mô-men xoắn 1,000 Nm đem lại sức bứt tốc mượt mà không độ trễ' },
        { title: 'Màn hình xoay Bentley Rotating Display', desc: 'Tùy biến 3 mặt gồm màn hình cảm ứng, 3 đồng hồ cơ sang trọng hoặc vân gỗ cao cấp' },
        { title: 'Nội thất chần kim cương Dark Tint', desc: 'Hơn 310,000 mũi chỉ may thủ công chuẩn xác bởi các nghệ nhân Crewe' },
        { title: 'Kiểm soát chống lật Bentley Dynamic Ride', desc: 'Hệ thống thanh cân bằng điện tử 48V triệt tiêu rung lắc thân xe khi vào cua' }
      ]
    }
  },
  {
    id: 11,
    name: 'Mercedes-AMG G 63 2025',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'SUV',
    fuel: 'Gasoline',
    specs: {
      acceleration: '4.3 giây',
      topSpeed: '240 km/h',
      horsepower: '577 HP',
      transmission: 'AMG SPEEDSHIFT TCT 9 cấp',
      drivetrain: 'AMG Performance 4MATIC 3 khóa vi sai',
      engine: '4.0L V8 Biturbo AMG',
      features: [
        { title: 'Biểu tượng địa hình King of SUV', desc: '3 khóa vi sai độc lập cơ học vượt qua mọi điều kiện địa hình trắc trở nhất' },
        { title: 'Ống xả kép AMG Side-pipes hông xe', desc: 'Âm thanh gầm gừ uy lực trứ danh đặc trưng của dòng xe AMG V8' },
        { title: 'Treo thể thao AMG RIDE CONTROL', desc: 'Hệ thống giảm xóc thích ứng điều chỉnh điện tử tăng cường độ ổn định' },
        { title: 'Khoang lái Da Nappa & Carbon', desc: 'Màn hình kép kỹ thuật số MBUX hiện đại tích hợp hệ thống âm thanh Burmester' }
      ]
    }
  },
  {
    id: 12,
    name: 'McLaren 750S Spider 2025',
    price: 345000,
    image: 'https://images.unsplash.com/photo-1622322062602-536444855598?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'Convertible',
    fuel: 'Gasoline',
    specs: {
      acceleration: '2.8 giây',
      topSpeed: '332 km/h',
      horsepower: '740 HP',
      transmission: '7 cấp SSG ly hợp kép',
      drivetrain: 'Cầu sau RWD thuần thể thao',
      engine: '4.0L V8 Twin-Turbo',
      features: [
        { title: 'Mui xếp cứng đóng mở trong 11 giây', desc: 'Vận hành êm ái bằng mô-tơ điện ngay cả khi xe đang chạy ở tốc độ 50 km/h' },
        { title: 'Khung gầm sợi Carbon MonoCage II-S', desc: 'Trọng lượng khô siêu nhẹ chỉ 1,389 kg mang lại tỷ số công suất/trọng lượng đáng kinh ngạc' },
        { title: 'Treo chủ động Proactive Chassis Control III', desc: 'Cân bằng thủy lực độc quyền cho cảm giác lái trực quan chân thực tối đa' },
        { title: 'Cánh gió sau khí động học chủ động', desc: 'Tự động mở phanh khí động học Airbrake khi phanh khẩn cấp ở tốc độ cao' }
      ]
    }
  },
  {
    id: 13,
    name: 'Porsche Taycan Turbo GT 2025',
    price: 230000,
    image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'Sedan',
    fuel: 'Electric',
    specs: {
      acceleration: '2.2 giây',
      topSpeed: '305 km/h',
      horsepower: '1019 HP',
      transmission: '2 cấp trục sau hiệu năng cao',
      drivetrain: 'AWD điện tử toàn thời gian',
      engine: 'Dual Electric Motors + Biến tần Silicon Carbide',
      features: [
        { title: 'Kỷ lục gia tốc 0-100 km/h trong 2.2 giây', desc: 'Chế độ Attack Mode cung cấp thêm 120 kW lực đẩy tức thời trong 10 giây' },
        { title: 'Treo chủ động Porsche Active Ride', desc: 'Triệt tiêu hoàn toàn lực nghiêng thân xe khi tăng tốc, phanh và vào cua gắt' },
        { title: 'Phanh Gốm Carbon PCCB thế hệ mới', desc: 'Giảm 2 kg trọng lượng mâm phanh với kẹp phanh sơn màu Victory Gold độc quyền' },
        { title: 'Nền tảng sạc siêu tốc 800V 320 kW', desc: 'Thời gian nạp pin từ 10% lên 80% chỉ trong vòng 18 phút' }
      ]
    }
  },
  {
    id: 14,
    name: 'Aston Martin DBX707 2025',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'SUV',
    fuel: 'Gasoline',
    specs: {
      acceleration: '3.3 giây',
      topSpeed: '310 km/h',
      horsepower: '697 HP',
      transmission: '9 cấp ly hợp ướt đa đĩa',
      drivetrain: 'AWD với vi sai cầu sau điện tử E-Diff',
      engine: '4.0L Twin-Turbo V8',
      features: [
        { title: 'Chiếc SUV hạng sang nhanh nhất phân khúc', desc: 'Vận tốc tối đa 310 km/h cùng mã lực khủng 697 HP dẫn đầu mọi cuộc đua' },
        { title: 'Phanh Carbon Ceramic 420mm', desc: 'Đảm bảo lực hãm siêu việt và giảm tối đa tải trọng không được treo' },
        { title: 'Khoang nội thất da Semi-Aniline', desc: 'May đo thủ công tinh tế với các đường chỉ thêu tương phản sang trọng' },
        { title: 'Cụm điều khiển công nghệ cao hoàn toàn mới', desc: 'Màn hình cảm ứng 10.25 inch kết hợp các phím xoay cơ khí mạ crom xúc giác' }
      ]
    }
  },
  {
    id: 15,
    name: 'BMW i7 M70 xDrive 2025',
    price: 170000,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'Sedan',
    fuel: 'Electric',
    specs: {
      acceleration: '3.7 giây',
      topSpeed: '250 km/h',
      horsepower: '650 HP',
      transmission: 'Hộp số đơn cấp thể thao',
      drivetrain: 'AWD M xDrive thông minh',
      engine: 'Động cơ điện kép M eDrive',
      features: [
        { title: 'Màn hình rạp phim BMW Theater Screen 31.3 inch', desc: 'Độ phân giải 8K gập từ trần xe kết hợp kho giải trí Amazon Fire TV tích hợp' },
        { title: 'Dàn âm thanh Bowers & Wilkins Diamond 4D', desc: '36 loa công suất 1,965 Watt với loa rung bass tích hợp ngay trong lưng ghế' },
        { title: 'Đèn pha pha lê BMW Crystal Swarovski', desc: 'Chế tác từ pha lê Swarovski phản chiếu ánh sáng lấp lánh như trang sức' },
        { title: 'Cửa tự động đóng mở thông minh', desc: 'Mở cửa tự động đón chủ nhân khi nhận diện chìa khóa số Digital Key Plus' }
      ]
    }
  },
  {
    id: 16,
    name: 'Cadillac Escalade-V 2025',
    price: 155000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    type: 'SUV',
    fuel: 'Gasoline',
    specs: {
      acceleration: '4.4 giây',
      topSpeed: '200 km/h',
      horsepower: '682 HP',
      transmission: '10 cấp tự động Hydra-Matic',
      drivetrain: 'Full-time AWD thể thao',
      engine: '6.2L V8 Supercharged Hand-built',
      features: [
        { title: 'Động cơ V8 siêu nạp Supercharged 682 HP', desc: 'Mô-men xoắn cực đại 885 Nm cho sức kéo vượt trội và tiếng gầm trầm hùng' },
        { title: 'Màn hình cong OLED 38 inch khổng lồ', desc: 'Mật độ điểm ảnh gấp đôi TV 4K đem lại độ hiển thị đen sâu tuyệt đối' },
        { title: 'Hệ thống tự lái thông minh Super Cruise', desc: 'Công nghệ hỗ trợ lái rảnh tay trên hàng trăm ngàn dặm cao tốc' },
        { title: 'Hệ thống âm thanh Studio Reference AKG 36 loa', desc: 'Tái hiện không gian âm nhạc sống động như buổi biểu diễn hòa nhạc trực tiếp' }
      ]
    }
  }
];

export const featuredCars = allCars.slice(0, 4);
