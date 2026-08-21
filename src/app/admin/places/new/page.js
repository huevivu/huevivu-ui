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
    accessibility: [],
    best_time_of_day: [],
    specialties: '',
  });

  const [imageFile, setImageFile] = useState(null);

  const vibeOptions = [
    { value: 'historic', label: 'Lịch sử (Historic)' },
    { value: 'romantic', label: 'Lãng mạn (Romantic)' },
    { value: 'peaceful', label: 'Yên bình (Peaceful)' },
    { value: 'bustling', label: 'Sầm uất (Bustling)' },
    { value: 'local', label: 'Chuẩn địa phương (Local)' },
    { value: 'scenic', label: 'Phong cảnh đẹp (Scenic)' },
    { value: 'retro', label: 'Hoài cổ (Retro)' },
    { value: 'modern', label: 'Hiện đại (Modern)' }
  ];
  const tasteOptions = [
    { value: 'spicy', label: 'Cay (Spicy)' },
    { value: 'savory', label: 'Mặn mòi (Savory)' },
    { value: 'sweet', label: 'Ngọt (Sweet)' },
    { value: 'sour', label: 'Chua (Sour)' },
    { value: 'bitter', label: 'Đắng (Bitter)' },
    { value: 'rich', label: 'Béo ngậy (Rich)' },
    { value: 'light', label: 'Thanh đạm (Light)' }
  ];
  const accessibilityOptions = [
    { value: 'wheelchair', label: 'Xe lăn (Toàn diện)' },
    { value: 'wheelchair_partial', label: 'Xe lăn (Một phần)' },
    { value: 'stroller_friendly', label: 'Thân thiện xe đẩy trẻ em' },
    { value: 'elderly_friendly', label: 'Thân thiện người lớn tuổi' }
  ];
  const bestTimeOfDayOptions = [
    { value: 'early_morning', label: 'Sáng sớm (Early Morning)' },
    { value: 'morning', label: 'Sáng (Morning)' },
    { value: 'afternoon', label: 'Chiều (Afternoon)' },
    { value: 'late_afternoon', label: 'Chiều muộn (Late Afternoon)' },
    { value: 'evening', label: 'Tối (Evening)' },
    { value: 'night', label: 'Đêm (Night)' }
  ];

  const [mapUrl, setMapUrl] = useState('');

  const handleExtractLocation = () => {
    if (!mapUrl) {
      showToast('Vui lòng nhập Link Google Maps trước!', 'error');
      return;
    }
    // Parse URL Google Maps: https://www.google.com/maps/place/xyz/@16.4637,107.5909,15z
    const match = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match && match.length === 3) {
      setFormData(prev => ({ ...prev, lat: parseFloat(match[1]), lng: parseFloat(match[2]) }));
      showToast('Đã trích xuất tọa độ thành công!', 'success');
      setMapUrl('');
    } else {
      showToast('Không tìm thấy tọa độ trong link này!', 'error');
    }
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      showToast('Đang lấy vị trí...', 'success');
      navigator.geolocation.getCurrentPosition(
        function(position) {
          setFormData(prev => ({ 
            ...prev, 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          }));
          showToast('Đã lấy vị trí hiện tại!', 'success');
        },
        function(error) {
          showToast('Lỗi lấy vị trí: ' + error.message, 'error');
        }
      );
    } else {
      showToast('Trình duyệt của bạn không hỗ trợ định vị!', 'error');
    }
  };

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
      const payload = new FormData();
      
      // Chuyển string comma-separated thành chuỗi JSON
      const highlightsArr = formData.highlights ? formData.highlights.split(',').map(s => s.trim()) : [];
      const tipsArr = formData.tips ? formData.tips.split(',').map(s => s.trim()) : [];
      const tagsArr = formData.tags ? formData.tags.split(',').map(s => s.trim()) : [];
      const specialtiesArr = formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [];
      
      const prepareData = {
        ...formData,
        highlights: JSON.stringify(highlightsArr),
        tips: JSON.stringify(tipsArr),
        tags: JSON.stringify(tagsArr),
        specialties: JSON.stringify(specialtiesArr),
        vibe: JSON.stringify(formData.vibe),
        taste_profile: JSON.stringify(formData.taste_profile),
        accessibility: JSON.stringify(formData.accessibility),
        best_time_of_day: JSON.stringify(formData.best_time_of_day),
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        rating: parseFloat(formData.rating),
        rating_count: parseInt(formData.rating_count),
        avg_visit_min: parseInt(formData.avg_visit_min),
        authenticity: parseInt(formData.authenticity),
        popularity: parseFloat(formData.popularity),
        weather_dependent: parseInt(formData.weather_dependent),
      };

      for (const key in prepareData) {
        payload.append(key, prepareData[key]);
      }

      if (imageFile) {
        payload.append('image', imageFile);
      }

      const res = await fetch('/api/places', {
        method: 'POST',
        body: payload,
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
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">2. Hình ảnh & Bản đồ</h3>
          
          <div className="form-group full" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px dashed #9ca3af' }}>
            <label style={{ color: '#111827' }}>⚡ Công cụ lấy tọa độ nhanh</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Dán link Google Maps vào đây..." 
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="button" className="btn-helper" onClick={handleExtractLocation}>
                🔍 Trích xuất
              </button>
              <button type="button" className="btn-helper" onClick={handleGetCurrentLocation}>
                📍 Lấy vị trí của bạn
              </button>
            </div>
            <small style={{ color: '#6b7280', marginTop: '0.5rem', display: 'block' }}>Cách 1: Mở Google Maps, chọn điểm, copy URL dán vào đây. Cách 2: Đứng tại quán và bấm Lấy vị trí.</small>
          </div>

          <div className="form-grid">
            <div className="form-group full">
              <label>Tải lên Hình ảnh (Image Upload)</label>
              <input type="file" name="image" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
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
              <label>Thể lực yêu cầu <small style={{display:'block', color:'#6b7280', fontSize:'0.8em', fontWeight:'normal'}}>VD: Leo dốc chọn "Nhiều thể lực", đi phẳng chọn "Dễ dàng"</small></label>
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
              <label>Độ chuẩn vị/Local (1-5) <small style={{display:'block', color:'#6b7280', fontSize:'0.8em', fontWeight:'normal'}}>1: Du lịch công nghiệp - 5: Rặt local</small></label>
              <input type="number" min="1" max="5" name="authenticity" value={formData.authenticity} onChange={handleChange} />
            </div>
            
            <div className="form-group full">
              <label>Vibe (Không khí) - Chọn nhiều <small style={{color:'#6b7280', fontSize:'0.8em', fontWeight:'normal'}}>(Gợi ý: Phù hợp mọi danh mục)</small></label>
              <div className="checkbox-group">
                {vibeOptions.map(opt => (
                  <label key={opt.value} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.vibe.includes(opt.value)}
                      onChange={() => handleArrayChange('vibe', opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>Taste Profile (Hương vị) - Chọn nhiều <small style={{color:'#6b7280', fontSize:'0.8em', fontWeight:'normal'}}>(Gợi ý: Dành cho danh mục Food, Cafe & Chill)</small></label>
              <div className="checkbox-group">
                {tasteOptions.map(opt => (
                  <label key={opt.value} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.taste_profile.includes(opt.value)}
                      onChange={() => handleArrayChange('taste_profile', opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>Tiếp cận (Accessibility) - Chọn nhiều <small style={{color:'#6b7280', fontSize:'0.8em', fontWeight:'normal'}}>(Gợi ý: Phù hợp với Heritage, Nature, Activity)</small></label>
              <div className="checkbox-group">
                {accessibilityOptions.map(opt => (
                  <label key={opt.value} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.accessibility.includes(opt.value)}
                      onChange={() => handleArrayChange('accessibility', opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>Thời điểm tốt nhất trong ngày - Chọn nhiều <small style={{color:'#6b7280', fontSize:'0.8em', fontWeight:'normal'}}>(Gợi ý: Phù hợp với Heritage, Nature, Cafe & Chill)</small></label>
              <div className="checkbox-group">
                {bestTimeOfDayOptions.map(opt => (
                  <label key={opt.value} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.best_time_of_day.includes(opt.value)}
                      onChange={() => handleArrayChange('best_time_of_day', opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Độ ồn (Noise Level)</label>
              <select name="noise_level" value={formData.noise_level} onChange={handleChange}>
                <option value="quiet">Yên tĩnh (Quiet)</option>
                <option value="moderate">Vừa phải (Moderate)</option>
                <option value="loud">Ồn ào (Loud)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Khoảng cách đi bộ (Walking Distance)</label>
              <select name="walking_distance" value={formData.walking_distance} onChange={handleChange}>
                <option value="minimal">Tối thiểu (Minimal)</option>
                <option value="moderate">Vừa phải (Moderate)</option>
                <option value="extensive">Nhiều (Extensive)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nhịp điệu tham quan (Ideal Pacing)</label>
              <select name="ideal_pacing" value={formData.ideal_pacing} onChange={handleChange}>
                <option value="quick_stop">Ghé ngang (Quick stop)</option>
                <option value="immersive">Thong thả (Immersive)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phong cách ăn uống (Dining Style) <small style={{display:'block', color:'#6b7280', fontSize:'0.8em', fontWeight:'normal'}}>(Gợi ý: Dành cho Food)</small></label>
              <select name="dining_style" value={formData.dining_style} onChange={handleChange}>
                <option value="">(Không có)</option>
                <option value="street_food">Lề đường (Street food)</option>
                <option value="casual">Bình dân (Casual)</option>
                <option value="fine_dining">Cao cấp (Fine dining)</option>
              </select>
            </div>

            <div className="form-group full" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input 
                type="checkbox" 
                name="weather_dependent" 
                id="weather_dependent"
                checked={formData.weather_dependent === 1}
                onChange={handleChange}
                style={{ width: 'auto' }}
              />
              <label htmlFor="weather_dependent" style={{ marginBottom: 0 }}>Phụ thuộc vào thời tiết (Ví dụ: ngoài trời)</label>
            </div>

            <div className="form-group full">
              <label>Highlights (Các điểm nổi bật) - Ngăn cách bằng dấu phẩy</label>
              <input type="text" name="highlights" value={formData.highlights} onChange={handleChange} placeholder="Ngọ Môn, Điện Thái Hòa..." />
            </div>
            <div className="form-group full">
              <label>Tips (Mẹo vặt) - Ngăn cách bằng dấu phẩy</label>
              <input type="text" name="tips" value={formData.tips} onChange={handleChange} placeholder="Nên đi sớm, Nhớ mang ô..." />
            </div>
            <div className="form-group full">
              <label>Specialties (Đặc sản/Món chính) - Ngăn cách bằng dấu phẩy</label>
              <input type="text" name="specialties" value={formData.specialties} onChange={handleChange} placeholder="Bún bò, Bánh bèo..." />
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
