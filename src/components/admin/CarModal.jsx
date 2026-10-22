import { X, Check, Image as ImageIcon, Gauge, Zap } from 'lucide-react';

export default function CarModal({ 
  isOpen, 
  isEditing, 
  carForm, 
  setCarForm, 
  onClose, 
  onSave, 
  sampleImages = [] 
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="glass-card admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="admin-modal-icon-badge">
              <Zap size={20} />
            </div>
            <div>
              <h3>{isEditing ? 'Chỉnh Sửa Thông Tin Siêu Xe' : 'Thêm Siêu Xe Mới Vào Kho'}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {isEditing ? `Mã xe: #${carForm.id || ''}` : 'Cập nhật trực tiếp lên hệ thống quản trị và MongoDB'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="admin-modal-close" title="Đóng cửa sổ">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="admin-modal-form">
          <div className="modal-form-grid">
            {/* Tên xe */}
            <div className="form-group modal-form-full">
              <label>Tên Siêu Xe <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ví dụ: Ferrari 296 GTB 2026"
                value={carForm.name}
                onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                required
              />
            </div>

            {/* Giá xe */}
            <div className="form-group">
              <label>Giá Niêm Yết ($ USD) <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Ví dụ: 250000"
                value={carForm.price}
                onChange={(e) => setCarForm({ ...carForm, price: e.target.value })}
                required
                min="1"
              />
            </div>

            {/* Năm sản xuất */}
            <div className="form-group">
              <label>Năm Sản Xuất <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="2026"
                value={carForm.year}
                onChange={(e) => setCarForm({ ...carForm, year: e.target.value })}
                required
                min="1990"
                max="2035"
              />
            </div>

            {/* Phân khúc */}
            <div className="form-group">
              <label>Phân Khúc Dáng Xe</label>
              <select 
                className="form-control"
                value={carForm.type}
                onChange={(e) => setCarForm({ ...carForm, type: e.target.value })}
              >
                <option value="Sedan">Sedan (Hạng sang cỡ lớn)</option>
                <option value="Coupe">Coupe (Thể thao 2 cửa)</option>
                <option value="SUV">SUV (Gầm cao sang trọng)</option>
                <option value="Hypercar">Hypercar (Siêu phẩm giới hạn)</option>
                <option value="Convertible">Convertible (Mui trần phóng khoáng)</option>
              </select>
            </div>

            {/* Loại nhiên liệu */}
            <div className="form-group">
              <label>Công Nghệ Động Cơ & Nhiên Liệu</label>
              <select 
                className="form-control"
                value={carForm.fuel}
                onChange={(e) => setCarForm({ ...carForm, fuel: e.target.value })}
              >
                <option value="Gasoline">Xăng (Gasoline V6 / V8 / V12)</option>
                <option value="Hybrid">Hybrid / MHEV / PHEV</option>
                <option value="Electric">Thuần Điện 100% (Electric 800V)</option>
              </select>
            </div>

            {/* Mã lực */}
            <div className="form-group">
              <label><Gauge size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Mã Lực (Horsepower)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ví dụ: 650 HP"
                value={carForm.horsepower || ''}
                onChange={(e) => setCarForm({ ...carForm, horsepower: e.target.value })}
              />
            </div>

            {/* Tăng tốc */}
            <div className="form-group">
              <label><Zap size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Gia Tốc 0-100 km/h</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ví dụ: 2.8 giây"
                value={carForm.acceleration || ''}
                onChange={(e) => setCarForm({ ...carForm, acceleration: e.target.value })}
              />
            </div>

            {/* Đường dẫn ảnh */}
            <div className="form-group modal-form-full">
              <label><ImageIcon size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Đường Dẫn Ảnh Bìa (URL) <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://images.unsplash.com/..."
                value={carForm.image}
                onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                required
              />
              
              {sampleImages.length > 0 && (
                <div className="sample-images-section">
                  <span className="sample-images-title">Gợi ý ảnh chụp xe sang chuẩn 4K (Click để chọn nhanh):</span>
                  <div className="sample-image-options">
                    {sampleImages.map((sample, idx) => (
                      <button 
                        key={idx} 
                        type="button" 
                        className={`sample-image-chip ${carForm.image === sample.url ? 'active' : ''}`}
                        onClick={() => setCarForm({ ...carForm, image: sample.url })}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview ảnh trực quan */}
          {carForm.image && (
            <div className="modal-preview-wrapper">
              <span className="modal-preview-label">Xem trước hình ảnh hiển thị trên showroom:</span>
              <div className="modal-preview-box">
                <img 
                  src={carForm.image} 
                  alt="Preview" 
                  className="modal-preview-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="modal-preview-tags">
                  <span className="preview-tag-pill">{carForm.type || 'Sedan'}</span>
                  <span className="preview-tag-pill">{carForm.fuel || 'Gasoline'}</span>
                  {carForm.price && (
                    <span className="preview-tag-pill price">${Number(carForm.price).toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="admin-modal-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Hủy Bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} /> {isEditing ? 'Lưu Cập Nhật Xe' : 'Thêm Xe Vào Kho Ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
