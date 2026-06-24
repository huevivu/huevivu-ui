// Dùng fetch gốc của Node (undici) thay cho @anthropic-ai/sdk:
// SDK cũ (node-fetch) bị lỗi gzip "Premature close" trên Node 24.
// Orimise xác thực bằng Bearer token (giống config Claude Code ANTHROPIC_AUTH_TOKEN).

const getToken = () => process.env.ORIMISE_AUTH_TOKEN
  || process.env.ANTHROPIC_AUTH_TOKEN
  || process.env.ORIMISE_API_KEY
  || process.env.ANTHROPIC_API_KEY
  || 'demo-key';

const getBaseURL = () => (process.env.ORIMISE_BASE_URL || process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');

const getModel = () => process.env.AI_MODEL || 'claude-sonnet-4-6';

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

// Gọi Anthropic-compatible /v1/messages, trả về text của message
async function callMessages({ model, max_tokens, system, messages, timeout_ms }) {
  const body = { model: model || getModel(), max_tokens: max_tokens || 1024, messages };
  if (system) body.system = system;

  // Timeout để không treo vô hạn nếu proxy đơ (generate chậm ~1–2 phút → mặc định 150s)
  const controller = new AbortController();
  const ms = timeout_ms || 150000;
  const timer = setTimeout(() => controller.abort(), ms);

  let res;
  try {
    res = await fetch(`${getBaseURL()}/v1/messages`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${getToken()}`,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(`AI timeout sau ${Math.round(ms / 1000)}s — proxy phản hồi quá chậm`);
    throw err;
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (data && (data.error?.message || data.detail || JSON.stringify(data))) || `HTTP ${res.status}`;
    throw new Error(`AI API ${res.status}: ${msg}`);
  }
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error('AI không trả về nội dung hợp lệ');
  return text;
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
  "title": "Tên chuyến đi ngắn gọn (tối đa 40 ký tự)",
  "summary": "Mô tả 1-2 câu đặc trưng chuyến đi",
  "total_cost_estimate": "X,XXX,000 VNĐ",
  "highlights": ["điểm nổi bật 1", "điểm nổi bật 2", "điểm nổi bật 3"],
  "ai_insight": "Nhận xét cá nhân hóa ngắn về lý do lịch trình này phù hợp",
  "days": [
    {
      "day": 1,
      "theme": "Chủ đề ngày",
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

  const text = (await callMessages({
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })).trim();
  return extractJSON(text);
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

  const text = (await callMessages({
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })).trim();
  return extractJSON(text);
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

  return await callMessages({
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });
}

module.exports = { generateTrip, customizeTrip, chat };
