import { X, Check } from 'lucide-react';

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
          <h3>{isEditing ? 'Chỉnh Sửa Thông Tin Xe' : 'Thêm Siêu Xe Mới'}</h3>
          <button onClick={onClose} className="admin-modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-form-grid">
            <div className="form-group modal-form-full">
              <label>Tên Xe <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ví dụ: Ferrari 296 GTB 2026"
                value={carForm.name}
                onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Giá Bán ($) <span style={{ color: '#ff6b6b' }}>*</span></label>
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
                max="2030"
              />
            </div>

            <div className="form-group">
              <label>Phân Khúc Xe</label>
              <select 
                className="form-control"
                value={carForm.type}
                onChange={(e) => setCarForm({ ...carForm, type: e.target.value })}
              >
                <option value="Sedan">Sedan</option>
                <option value="Coupe">Coupe</option>
                <option value="SUV">SUV</option>
                <option value="Convertible">Convertible</option>
                <option value="Hypercar">Hypercar</option>
              </select>
            </div>

            <div className="form-group">
              <label>Loại Nhiên Liệu</label>
              <select 
                className="form-control"
                value={carForm.fuel}
                onChange={(e) => setCarForm({ ...carForm, fuel: e.target.value })}
              >
                <option value="Gasoline">Xăng (Gasoline)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Thuần Điện (Electric)</option>
              </select>
            </div>

            <div className="form-group modal-form-full">
              <label>Đường Dẫn Ảnh (URL) <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://images.unsplash.com/..."
                value={carForm.image}
                onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                required
              />
              {sampleImages.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Chọn nhanh ảnh mẫu đẹp:</span>
                  <div className="sample-image-options">
                    {sampleImages.map((sample, idx) => (
                      <button 
                        key={idx} 
                        type="button" 
                        className="sample-image-chip"
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

          {carForm.image && (
            <div style={{ margin: '14px 0', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Xem trước ảnh:</p>
              <img 
                src={carForm.image} 
                alt="Preview" 
                style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'cover' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} /> {isEditing ? 'Lưu Thay Đổi' : 'Thêm Xe Ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
