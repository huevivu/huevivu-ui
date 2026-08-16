'use client';
import { useState } from 'react';
import '@/styles/admin.css';
import { API } from '@/lib/api-client';

export default function NewPlaceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    category: 'heritage',
    description: '',
    address: '',
    rating: 4.5,
    rating_count: 100,
    price: 'Miễn phí',
    duration: '1-2 giờ',
    distance: '',
    lat: 16.4637,
    lng: 107.5909,
    img: '',
    ai_insight: '',
    hours: '',
    hours_time: '',
    hours_note: '',
    indoor: 0,
    best_time: 'all',
    crowd_level: 'medium',
    physical_level: 'easy',
    avg_visit_min: 90,
    popularity: 0.5,
    noise_level: 'moderate',
    authenticity: 3,
    walking_distance: 'minimal',
    weather_dependent: 0,
    ideal_pacing: 'immersive',
    dining_style: '',
    // Array fields
    highlights: '',
    tips: '',
    tags: '',
    vibe: [],
    taste_profile: [],
    specialties: '',
  });

  const vibeOptions = ['historic', 'romantic', 'peaceful', 'bustling', 'local', 'scenic', 'retro', 'modern'];
  const tasteOptions = ['spicy', 'savory', 'sweet', 'sour', 'bitter', 'rich', 'light'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'indoor' || name === 'weather_dependent') {
        setFormData({ ...formData, [name]: checked ? 1 : 0 });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(item => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Chuẩn bị payload
      const payload = { ...formData };
      
      // Chuyển string comma-separated thành mảng JSON
      payload.highlights = payload.highlights ? payload.highlights.split(',').map(s => s.trim()) : [];
      payload.tips = payload.tips ? payload.tips.split(',').map(s => s.trim()) : [];
      payload.tags = payload.tags ? payload.tags.split(',').map(s => s.trim()) : [];
      payload.specialties = payload.specialties ? payload.specialties.split(',').map(s => s.trim()) : [];
      
      // Đảm bảo số là số
      payload.lat = parseFloat(payload.lat);
      payload.lng = parseFloat(payload.lng);
      payload.rating = parseFloat(payload.rating);
      payload.rating_count = parseInt(payload.rating_count);
      payload.avg_visit_min = parseInt(payload.avg_visit_min);
      payload.authenticity = parseInt(payload.authenticity);
      payload.popularity = parseFloat(payload.popularity);

      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status === 'success') {
        showToast('Đã lưu địa điểm thành công!', 'success');
        // Reset vài field cơ bản
        setFormData(prev => ({ ...prev, name: '', description: '', address: '', img: '' }));
      } else {
        showToast(`Lỗi: ${result.message}`, 'error');
      }
    } catch (error) {
      showToast('Có lỗi xảy ra khi lưu!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Thêm Địa Điểm Mới</h1>
        <p>Công cụ nhập liệu nội bộ cho hệ thống AI HueViVu</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        
        <div className="form-section">
          <h3 className="form-section-title">1. Thông tin Cơ bản</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Tên địa điểm *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Danh mục *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="heritage">Heritage (Di sản)</option>
                <option value="food">Food (Ăn uống)</option>
                <option value="cafe">Cafe & Chill</option>
                <option value="nature">Nature (Thiên nhiên)</option>
                <option value="activity">Activity (Hoạt động)</option>
              </select>
            </div>
            <div className="form-group full">
              <label>Mô tả ngắn</label>
              <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
            </div>
            <div className="form-group full">
              <label>Địa chỉ</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Giá cả (Text)</label>
              <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Ví dụ: 150,000 VNĐ" />
            </div>
            <div className="form-group">
              <label>Khoảng cách (Text)</label>
              <input type="text" name="distance" value={formData.distance} onChange={handleChange} placeholder="Ví dụ: Trung tâm" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">2. Hình ảnh & Bản đồ</h3>
          <div className="form-grid">
            <div className="form-group full">
              <label>URL Hình ảnh (Unsplash / Cloudinary)</label>
              <input type="url" name="img" value={formData.img} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Vĩ độ (Latitude)</label>
              <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Kinh độ (Longitude)</label>
              <input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">3. Khai báo cho AI (AI Metadata)</h3>
          <div className="form-grid">
            <div className="form-group full">
              <label>AI Insight (Lời khuyên từ AI)</label>
              <textarea name="ai_insight" value={formData.ai_insight} onChange={handleChange} placeholder="Gợi ý gì cho người dùng khi đến đây?"></textarea>
            </div>
            <div className="form-group">
              <label>Mức độ đông đúc</label>
              <select name="crowd_level" value={formData.crowd_level} onChange={handleChange}>
                <option value="low">Thấp (Yên tĩnh)</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao (Đông đúc)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Thể lực yêu cầu</label>
              <select name="physical_level" value={formData.physical_level} onChange={handleChange}>
                <option value="easy">Dễ dàng (Easy)</option>
                <option value="moderate">Vừa phải (Moderate)</option>
                <option value="hard">Nhiều thể lực (Hard)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Thời điểm tốt nhất</label>
              <select name="best_time" value={formData.best_time} onChange={handleChange}>
                <option value="morning">Sáng</option>
                <option value="afternoon">Chiều</option>
                <option value="evening">Tối</option>
                <option value="all">Cả ngày</option>
              </select>
            </div>
            <div className="form-group">
              <label>Độ chuẩn vị/Local (1-5)</label>
              <input type="number" min="1" max="5" name="authenticity" value={formData.authenticity} onChange={handleChange} />
            </div>
            
            <div className="form-group full">
              <label>Vibe (Không khí) - Chọn nhiều</label>
              <div className="checkbox-group">
                {vibeOptions.map(vibe => (
                  <label key={vibe} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.vibe.includes(vibe)}
                      onChange={() => handleArrayChange('vibe', vibe)}
                    />
                    {vibe}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>Taste Profile (Hương vị) - Dành cho món ăn</label>
              <div className="checkbox-group">
                {tasteOptions.map(taste => (
                  <label key={taste} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.taste_profile.includes(taste)}
                      onChange={() => handleArrayChange('taste_profile', taste)}
                    />
                    {taste}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>Highlights (Các điểm nổi bật) - Ngăn cách bằng dấu phẩy</label>
              <input type="text" name="highlights" value={formData.highlights} onChange={handleChange} placeholder="Ngọ Môn, Điện Thái Hòa..." />
            </div>
            <div className="form-group full">
              <label>Tips (Mẹo vặt) - Ngăn cách bằng dấu phẩy</label>
              <input type="text" name="tips" value={formData.tips} onChange={handleChange} placeholder="Nên đi sớm, Nhớ mang ô..." />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu Địa Điểm'}
          </button>
        </div>
      </form>

      <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}
