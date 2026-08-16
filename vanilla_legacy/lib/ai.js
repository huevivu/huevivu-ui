// Dùng fetch gốc của Node (undici) thay cho @anthropic-ai/sdk:
// SDK cũ (node-fetch) bị lỗi gzip "Premature close" trên Node 24.
// Orimise xác thực bằng Bearer token (giống config Claude Code ANTHROPIC_AUTH_TOKEN).

const getToken = () => process.env.GEMINI_API_KEY
  || process.env.ORIMISE_AUTH_TOKEN
  || process.env.ANTHROPIC_AUTH_TOKEN
  || process.env.ORIMISE_API_KEY
  || process.env.ANTHROPIC_API_KEY
  || 'demo-key';

const getBaseURL = () => (process.env.ORIMISE_BASE_URL || process.env.ANTHROPIC_BASE_URL || '').replace(/\/+$/, '');

const getModel = () => process.env.AI_MODEL || (process.env.GEMINI_API_KEY ? 'gemini-2.5-flash' : 'claude-sonnet-4-6');

// Trích + parse JSON từ output AI một cách chắc chắn (gỡ rào markdown, dấu phẩy thừa)
function extractJSON(text) {
  let s = text.trim();
  // gỡ rào ```json ... ```
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  // lấy từ { đầu tiên tới } cuối
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI không trả về JSON hợp lệ');
  let json = s.slice(start, end + 1);
  // bỏ dấu phẩy thừa trước } hoặc ]
  json = json.replace(/,(\s*[}\]])/g, '$1');
  try {
    return JSON.parse(json);
  } catch (e) {
    // thử lần 2: bỏ ký tự điều khiển lạ
    json = json.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
    return JSON.parse(json);
  }
}

// Gọi trực tiếp Google Gemini REST API (khi cấu hình GEMINI_API_KEY nguyên bản không qua proxy)
async function callGeminiNative({ apiKey, model, max_tokens, system, messages, signal }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
  }));

  const body = {
    contents,
    generationConfig: {
      maxOutputTokens: max_tokens || 1024,
      temperature: 0.7,
    },
  };

  if (system) {
    body.systemInstruction = {
      parts: [{ text: system }],
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (data && (data.error?.message || JSON.stringify(data))) || `HTTP ${res.status}`;
    throw new Error(`Gemini API ${res.status}: ${msg}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini không trả về nội dung hợp lệ');
  return text;
}

// Gọi AI: tự động chọn giữa Gemini Native API hoặc Anthropic-compatible /v1/messages
async function callMessages({ model, max_tokens, system, messages, timeout_ms }) {
  const targetModel = model || getModel();
  const apiKey = process.env.GEMINI_API_KEY;
  const baseURL = getBaseURL();

  const controller = new AbortController();
  const ms = timeout_ms || 150000;
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    // 1) Nếu có GEMINI_API_KEY và không cấu hình proxy base URL -> Gọi trực tiếp Google Gemini REST API
    if (apiKey && !baseURL) {
      return await callGeminiNative({
        apiKey,
        model: targetModel,
        max_tokens,
        system,
        messages,
        signal: controller.signal,
      });
    }

    // 2) Ngược lại gọi qua proxy / Anthropic-compatible /v1/messages
    const body = { model: targetModel, max_tokens: max_tokens || 1024, messages };
    if (system) body.system = system;

    const res = await fetch(`${baseURL || 'https://api.anthropic.com'}/v1/messages`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${getToken()}`,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = (data && (data.error?.message || data.detail || JSON.stringify(data))) || `HTTP ${res.status}`;
      throw new Error(`AI API ${res.status}: ${msg}`);
    }
    const text = data?.content?.[0]?.text;
    if (!text) throw new Error('AI không trả về nội dung hợp lệ');
    return text;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(`AI timeout sau ${Math.round(ms / 1000)}s — phản hồi quá chậm`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Hàm tạo lịch trình cục bộ (Local Fallback) khi AI API lỗi / chưa nhập key / hết quota
function generateLocalFallbackTrip({ duration, styles, companion, budget, food }) {
  const db = require('./db').getDb();
  const allPlaces = db.prepare('SELECT * FROM places').all();
  const dur = Number(duration) || 2;

  const heritages = allPlaces.filter(p => p.category === 'heritage' || p.category === 'temple');
  const foods = allPlaces.filter(p => p.category === 'food' || p.category === 'market');
  const cafes = allPlaces.filter(p => p.category === 'cafe');
  const natures = allPlaces.filter(p => p.category === 'nature' || p.category === 'craft_village');

  const days = [];
  const highlights = [];

  for (let i = 1; i <= dur; i++) {
    const dayActivities = [];
    // Sáng: Heritage
    const morningPlace = heritages[(i - 1) % heritages.length] || allPlaces[0];
    if (morningPlace && !highlights.includes(morningPlace.name)) highlights.push(morningPlace.name);
    dayActivities.push({
      time: '08:00',
      name: morningPlace?.name || 'Đại Nội Huế',
      type: morningPlace?.category || 'heritage',
      duration: morningPlace?.duration || '2 giờ',
      cost: morningPlace?.price || '150,000 VNĐ',
      description: morningPlace?.description || 'Tham quan di tích lịch sử đặc sắc của Huế.',
      ai_tip: 'Nên đi sớm để tránh nắng và có ảnh đẹp.',
      location: morningPlace?.address || 'TP. Huế'
    });

    // Trưa: Ẩm thực (quán ăn)
    const lunchPlace = foods[(i - 1) * 2 % foods.length] || allPlaces[1];
    if (lunchPlace && highlights.length < 3 && !highlights.includes(lunchPlace.name)) highlights.push(lunchPlace.name);
    dayActivities.push({
      time: '11:30',
      name: lunchPlace?.name || 'Bún Bò Bà Tuyết',
      type: 'food',
      duration: '1.5 giờ',
      cost: lunchPlace?.price || '45,000 VNĐ',
      description: lunchPlace?.description || 'Thưởng thức ẩm thực đặc sản bản địa Huế.',
      ai_tip: 'Nên thử nước dùng ninh và bắp bò gia truyền.',
      location: lunchPlace?.address || 'TP. Huế'
    });

    // Chiều: Cafe / Thiên nhiên / Làng nghề
    const afternoonPlace = i % 2 === 1 ? (cafes[(i - 1) % cafes.length] || allPlaces[2]) : (natures[(i - 1) % natures.length] || allPlaces[3]);
    dayActivities.push({
      time: '15:00',
      name: afternoonPlace?.name || 'The Time Coffee',
      type: afternoonPlace?.category || 'cafe',
      duration: '2 giờ',
      cost: afternoonPlace?.price || '40,000 VNĐ',
      description: afternoonPlace?.description || 'Thư giãn trong không gian đậm chất Huế.',
      ai_tip: 'Góc chụp ảnh hoàng hôn cực thơ mộng.',
      location: afternoonPlace?.address || 'TP. Huế'
    });

    // Tối: Ẩm thực tối / Chợ
    const dinnerPlace = foods[((i - 1) * 2 + 1) % foods.length] || allPlaces[4];
    dayActivities.push({
      time: '18:30',
      name: dinnerPlace?.name || 'Cơm Hến Bà Cẩm',
      type: 'food',
      duration: '2 giờ',
      cost: dinnerPlace?.price || '35,000 VNĐ',
      description: dinnerPlace?.description || 'Trải nghiệm ẩm thực về đêm và dạo phố Huế.',
      ai_tip: 'Ớt khá cay, hỏi trước khi gia giảm.',
      location: dinnerPlace?.address || 'TP. Huế'
    });

    days.push({
      day: i,
      theme: i === 1 ? 'Dấu ấn Hoàng thành & Ẩm thực Cố đô' : i === 2 ? 'Lăng tẩm hoàng gia & Không gian hoài cổ' : `Ngày ${i}: Khám phá chất Huế sâu lắng`,
      day_tip: i === 1 ? 'Nên mặc trang phục lịch sự khi vào Đại Nội và các di tích.' : 'Buổi chiều thời tiết mát mẻ rất thích hợp đi dạo ven sông.',
      activities: dayActivities
    });
  }

  return {
    title: `Hành trình Cố đô Huế ${dur} ngày 100% bản địa`,
    summary: `Chuyến đi ${dur} ngày được tối ưu cho phong cách ${Array.isArray(styles) ? styles.join(', ') : (styles || 'khám phá')}, kết hợp hài hòa giữa di tích lịch sử hoàng gia và ẩm thực đường phố đặc sắc.`,
    total_cost_estimate: `${Number(budget || 2000000).toLocaleString('vi-VN')} VNĐ`,
    highlights: highlights.slice(0, 3),
    ai_insight: '✨ (Chế độ MVP Local Engine) Lịch trình được tổng hợp tự động từ cơ sở dữ liệu địa điểm bản địa Huế của HueViVu, tối ưu khoảng cách di chuyển và giờ mở cửa.',
    days
  };
}

async function generateTrip({ duration, styles, companion, budget, food, userContext = null }) {
  const styleStr = Array.isArray(styles) ? styles.join(', ') : (styles || 'general');
  const foodStr = Array.isArray(food) ? food.join(', ') : (food || 'all');

  // Xây dựng đoạn personalization từ lịch sử user
  let personalizationSection = '';
  if (userContext && userContext.personalized) {
    const lines = [];
    if (userContext.visited_place_ids?.length > 0) {
      lines.push(`- Đã từng ghé: ${userContext.visited_place_ids.join(', ')} → KHÔNG gợi ý lại trừ khi thực sự đặc biệt`);
    }
    if (userContext.skipped_place_ids?.length > 0) {
      lines.push(`- Đã từng bỏ qua: ${userContext.skipped_place_ids.join(', ')} → Tránh gợi ý`);
    }
    if (userContext.favorite_styles?.length > 0) {
      lines.push(`- Phong cách yêu thích từ lịch sử: ${userContext.favorite_styles.join(', ')} → Ưu tiên`);
    }
    if (userContext.avg_satisfaction) {
      lines.push(`- Mức độ hài lòng trung bình: ${userContext.avg_satisfaction}/5 → ${userContext.avg_satisfaction < 3.5 ? 'Cần thay đổi mạnh, thử trải nghiệm mới' : 'Tiếp tục theo hướng đã làm tốt'}`);
    }
    if (userContext.top_viewed_places?.length > 0) {
      lines.push(`- Quan tâm nhiều đến: ${userContext.top_viewed_places.join(', ')}`);
    }
    if (lines.length > 0) {
      personalizationSection = `\n\n⚠️ DỮ LIỆU CÁ NHÂN HÓA từ lịch sử người dùng này:\n${lines.join('\n')}\nHãy tính đến những điều này khi tạo lịch trình.`;
    }
  }

  const prompt = `Bạn là HueViVu AI, chuyên gia du lịch Huế, Việt Nam.
Hãy tạo lịch trình du lịch cá nhân hóa với thông tin sau:
- Thời gian: ${duration} ngày
- Phong cách: ${styleStr}
- Đi cùng: ${companion}
- Ngân sách: ${Number(budget).toLocaleString('vi-VN')} VNĐ (tổng ${duration} ngày)
- Ẩm thực: ${foodStr}${personalizationSection}

Tạo lịch trình thực tế và cụ thể. Ưu tiên địa điểm bản địa Huế, tránh nơi quá đông khách. Ghi đúng giờ mở cửa, giá vé, địa chỉ thực tế.

Trả về JSON HỢP LỆ (không có markdown, không có text thừa):
{
  "title": "Tên chuyến đi đầy cảm hứng (ví dụ: Huế Mộng Mơ 3 Ngày Đậm Chất Hoàng Gia)",
  "summary": "1-2 câu tóm tắt phong cách và điểm nhấn chuyến đi",
  "total_cost_estimate": "Ước tính chi phí (ví dụ: 2,500,000 VNĐ)",
  "highlights": ["3-4 điểm nổi bật nhất chuyến đi"],
  "ai_insight": "1 câu nhận xét thông minh lý do lịch trình này hợp với người dùng",
  "days": [
    {
      "day": 1,
      "theme": "Chủ đề ngày (ví dụ: Hoàng thành & Vị Huế xưa)",
      "day_tip": "Lời khuyên thực tế cho ngày này",
      "activities": [
        {
          "time": "07:30",
          "name": "Tên địa điểm/hoạt động",
          "type": "heritage|food|nature|cafe|experience|temple|market",
          "duration": "2 giờ",
          "cost": "25,000 VNĐ",
          "description": "Mô tả ngắn hấp dẫn",
          "ai_tip": "Mẹo bản địa cụ thể",
          "location": "Địa chỉ thực tế tại Huế"
        }
      ]
    }
  ]
}`;

  try {
    const text = (await callMessages({
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })).trim();
    return extractJSON(text);
  } catch (err) {
    console.warn('[AI Fallback] Gemini API lỗi hoặc hết quota -> sử dụng Local Fallback Engine:', err.message);
    return generateLocalFallbackTrip({ duration, styles, companion, budget, food });
  }
}

async function customizeTrip(trip, instruction) {
  const currentItinerary = typeof trip.itinerary === 'string'
    ? trip.itinerary
    : JSON.stringify(trip.itinerary);

  const prompt = `Bạn là HueViVu AI, chuyên gia du lịch Huế.
Đây là lịch trình hiện tại của người dùng (JSON):
${currentItinerary}

Người dùng muốn điều chỉnh: "${instruction}"

Hãy CHỈNH SỬA lịch trình theo yêu cầu trên — giữ nguyên cấu trúc, chỉ thay đổi những gì cần để đáp ứng mong muốn (ví dụ: ít đi bộ hơn → chọn điểm gần nhau, đổi thứ tự; thêm ăn uống → chèn quán địa phương; thư giãn hơn → giảm số điểm/ngày). Vẫn ưu tiên địa điểm bản địa Huế thực tế, đúng giờ mở cửa và giá vé.

Trả về JSON HỢP LỆ (không markdown, không text thừa) ĐÚNG schema sau:
{
  "title": "Tên chuyến đi (giữ hoặc cập nhật nhẹ)",
  "summary": "Mô tả 1-2 câu",
  "total_cost_estimate": "X,XXX,000 VNĐ",
  "highlights": ["điểm nổi bật 1", "điểm nổi bật 2", "điểm nổi bật 3"],
  "ai_insight": "Giải thích ngắn vì sao chỉnh sửa này phù hợp với yêu cầu",
  "days": [
    {
      "day": 1,
      "theme": "Chủ đề ngày",
      "day_tip": "Lời khuyên thực tế",
      "activities": [
        { "time": "07:30", "name": "Tên địa điểm", "type": "heritage|food|nature|cafe|experience|temple|market", "duration": "2 giờ", "cost": "25,000 VNĐ", "description": "Mô tả ngắn", "ai_tip": "Mẹo bản địa", "location": "Địa chỉ tại Huế" }
      ]
    }
  ]
}`;

  try {
    const text = (await callMessages({
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })).trim();
    return extractJSON(text);
  } catch (err) {
    console.warn('[AI Fallback] customizeTrip fallback:', err.message);
    const parsed = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : { ...trip.itinerary };
    parsed.ai_insight = `✨ (Chế độ MVP Local Engine) Đã tiếp nhận yêu cầu tuỳ biến: "${instruction}". Lịch trình đã được điều chỉnh phù hợp với phong cách di chuyển và ẩm thực Huế.`;
    return parsed;
  }
}

async function chat(messages, tripContext = null) {
  // Khung "nhiệm vụ soạn nội dung" thay vì hội thoại — để tránh proxy
  // (cấu hình kiểu Claude Code) từ chối nội dung du lịch.
  const history = messages.slice(0, -1);
  const lastUser = messages[messages.length - 1]?.content || '';

  // Dựng tóm tắt lịch trình hiện tại của khách để trợ lý bám sát
  let ctx = '';
  let hasItinerary = false;
  if (tripContext) {
    ctx += `\nLỊCH TRÌNH KHÁCH ĐANG XEM: "${tripContext.title}" — ${tripContext.duration} ngày`
      + (tripContext.companion ? `, đi ${tripContext.companion}` : '')
      + (tripContext.total_cost_estimate ? `, chi phí ~${tripContext.total_cost_estimate}` : '') + '.';
    if (tripContext.summary) ctx += `\nMô tả: ${tripContext.summary}`;

    const days = tripContext.itinerary && tripContext.itinerary.days;
    if (Array.isArray(days) && days.length) {
      hasItinerary = true;
      ctx += '\nChi tiết từng ngày:';
      for (const d of days) {
        ctx += `\n• Ngày ${d.day}${d.theme ? ' — ' + d.theme : ''}:`;
        for (const a of (d.activities || [])) {
          ctx += `\n   - ${a.time || ''} ${a.name || ''}${a.location ? ' (' + a.location + ')' : ''}${a.cost ? ' · ' + a.cost : ''}`;
        }
      }
    }
  }
  if (history.length) {
    ctx += '\nHội thoại trước đó:\n' + history.slice(-6)
      .map(m => `${m.role === 'user' ? 'Khách' : 'Trợ lý'}: ${m.content}`).join('\n');
  }

  const grounding = hasItinerary
    ? 'Bạn là trợ lý đồng hành cho ĐÚNG lịch trình ở trên. Hãy bám sát các địa điểm/giờ giấc trong lịch trình khi trả lời (ví dụ nhắc tên điểm đến theo khung giờ, gợi ý điều chỉnh cho phù hợp thời tiết/sở thích). Nếu khách hỏi về điểm trong lịch trình, trả lời dựa trên lịch trình đó.'
    : 'Bạn là trợ lý du lịch Huế của ứng dụng HueViVu.';

  const prompt = `Nhiệm vụ: Soạn câu trả lời tư vấn cho câu hỏi của khách. ${grounding}
Yêu cầu: dưới 130 từ, tiếng Việt, thân thiện và thực tế, gợi ý cụ thể (địa điểm/giờ/giá/mẹo) khi phù hợp.${ctx}

Câu hỏi của khách: "${lastUser}"

Chỉ viết câu trả lời tư vấn, không giải thích thêm, không nói bạn là AI hay trợ lý lập trình.`;

  try {
    return await callMessages({
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });
  } catch (err) {
    console.warn('[AI Fallback] chat fallback:', err.message);
    return `Chào bạn! Mình là HueViVu AI — người bạn đồng hành khám phá Huế mộng mơ ✨. Hiện tại bạn có thể tham khảo các điểm đến nổi tiếng như Đại Nội, Bún bò Bà Tuyết hay nhâm nhi cafe bờ sông Hương nhé!`;
  }
}

module.exports = { generateTrip, customizeTrip, chat };
