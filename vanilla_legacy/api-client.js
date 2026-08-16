// HueViVu Frontend API Client
// Include this script in any page that needs to talk to the backend.
// Usage: <script src="api-client.js"></script>  then  await API.generateTrip({...})

const API = (() => {
  const BASE = (() => {
    if (typeof window === 'undefined') return '';
    const { hostname, port } = window.location;
    // Local dev: forward to Express on 3000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return port === '3000' ? '' : 'http://localhost:3000';
    }
    return ''; // same-origin in production (Vercel)
  })();

  // ── Token management ────────────────────────────────────────────────────
  const getToken = () => localStorage.getItem('hv_token');
  const setToken = (t) => localStorage.setItem('hv_token', t);
  const getUser = () => {
    try { return JSON.parse(localStorage.getItem('hv_user') || 'null'); } catch { return null; }
  };
  const setUser = (u) => localStorage.setItem('hv_user', JSON.stringify(u));

  async function ensureAuth() {
    if (getToken()) return getToken();
    try {
      const data = await _post('/api/auth/demo');
      setToken(data.token);
      setUser(data.user);
      return data.token;
    } catch {
      return null;
    }
  }

  // ── Core request ────────────────────────────────────────────────────────
  async function _req(method, path, body) {
    const token = await ensureAuth();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(BASE + path, opts);
    const json = await res.json().catch(() => ({ error: res.statusText }));
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
  }

  const _get  = (p)    => _req('GET',    p);
  const _post = (p, b) => _req('POST',   p, b);
  const _put  = (p, b) => _req('PUT',    p, b);
  const _del  = (p)    => _req('DELETE', p);

  // ── Auth ────────────────────────────────────────────────────────────────
  async function login(email, password) {
    const data = await _post('/api/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function register(name, email, password) {
    const data = await _post('/api/auth/register', { name, email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem('hv_token');
    localStorage.removeItem('hv_user');
  }

  // ── Trips ───────────────────────────────────────────────────────────────
  const generateTrip  = (data)  => _post('/api/trips/generate', data);
  const getTrips      = ()      => _get('/api/trips');
  const getTrip       = (id)    => _get(`/api/trips/${id}`);
  const shareTrip     = (id)    => _put(`/api/trips/${id}/share`);
  const setTripStatus = (id, s) => _put(`/api/trips/${id}/status`, { status: s });
  const customizeTrip = (id, instruction) => _post(`/api/trips/${id}/customize`, { instruction });

  // ── Chat ────────────────────────────────────────────────────────────────
  const sendChat = (message, tripId, history) => _post('/api/chat', { message, tripId, history });
  const getChatHistory = (tripId) => _get(`/api/chat/${tripId}`);

  // ── Places ──────────────────────────────────────────────────────────────
  const getPlaces = (params) => _get('/api/places' + (params ? '?' + new URLSearchParams(params) : ''));
  const getPlace  = (id)     => _get(`/api/places/${id}`);

  // ── Community Feed ──────────────────────────────────────────────────────
  const getFeed    = ()   => _get('/api/feed');
  const likeTrip   = (id) => _post(`/api/feed/${id}/like`);
  const saveTrip   = (id) => _post(`/api/feed/${id}/save`);
  const cloneTrip  = (id) => _post(`/api/feed/${id}/clone`);

  // ── Journal ─────────────────────────────────────────────────────────────
  const getJournal       = (tripId)       => _get('/api/journal' + (tripId ? `?tripId=${tripId}` : ''));
  const addJournalEntry  = (data)         => _post('/api/journal', data);
  const updateJournalEntry = (id, data)   => _put(`/api/journal/${id}`, data);
  const deleteJournalEntry = (id)         => _del(`/api/journal/${id}`);

  // ── Weather ─────────────────────────────────────────────────────────────
  const getWeather = () => _get('/api/weather');

  // ── User ────────────────────────────────────────────────────────────────
  const getProfile    = ()     => _get('/api/user/profile');
  const updateProfile = (data) => _put('/api/user/profile', data);
  const getUserContext = ()    => _get('/api/user/context');

  // ── Event Tracking ──────────────────────────────────────────────────────
  function trackEvent(eventType, data = {}) {
    const sessionId = _getSessionId();
    return _post('/api/events', { event_type: eventType, session_id: sessionId, ...data }).catch(() => {});
  }

  function _getSessionId() {
    let sid = sessionStorage.getItem('hv_session');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('hv_session', sid);
    }
    return sid;
  }

  // ── Feedback ────────────────────────────────────────────────────────────
  const submitFeedback    = (data)   => _post('/api/feedback/trip', { session_id: _getSessionId(), ...data });
  const getTripFeedback   = (tripId) => _get(`/api/feedback/trip/${tripId}`);

  return {
    // Auth
    login, register, logout, getToken, getUser, ensureAuth,
    // Trips
    generateTrip, getTrips, getTrip, shareTrip, setTripStatus, customizeTrip,
    // Chat
    sendChat, getChatHistory,
    // Places
    getPlaces, getPlace,
    // Community
    getFeed, likeTrip, saveTrip, cloneTrip,
    // Journal
    getJournal, addJournalEntry, updateJournalEntry, deleteJournalEntry,
    // Weather
    getWeather,
    // User
    getProfile, updateProfile, getUserContext,
    // Tracking & Feedback
    trackEvent, submitFeedback, getTripFeedback,
  };
})();

// Expose globally
if (typeof window !== 'undefined') window.API = API;

// ── Chia sẻ — dùng chung mọi nút Share (Web Share API + fallback copy link) ──
if (typeof window !== 'undefined' && !window.hvShare) {
  window.hvShare = async function (title, text, url) {
    url = url || (typeof location !== 'undefined' ? location.href : '');
    try {
      if (navigator.share) {
        await navigator.share({ title: title || 'HueViVu', text: text || title || '', url });
        return;
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return; // user huỷ → không báo lỗi
    }
    // Fallback: copy link (desktop / trình duyệt không hỗ trợ Web Share)
    try {
      await navigator.clipboard.writeText(url);
      if (window.toast) window.toast('Đã sao chép liên kết 🔗', 'success');
    } catch {
      if (window.toast) window.toast('Không chia sẻ được trên thiết bị này', 'error');
    }
  };
}

// ── Toast — phản hồi nhẹ nhàng, nhất quán toàn app ──────────────────────────
(function () {
  if (typeof window === 'undefined' || window.toast) return;
  let container = null;
  function ensure() {
    if (container) return container;
    container = document.createElement('div');
    container.id = 'hv-toast-wrap';
    container.style.cssText =
      'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:9999;' +
      'display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;max-width:90vw;';
    document.body.appendChild(container);
    return container;
  }
  window.toast = function (msg, type) {
    const el = document.createElement('div');
    const bg = type === 'error'
      ? 'linear-gradient(135deg,#EF4444,#F87171)'
      : type === 'success'
        ? 'linear-gradient(135deg,#22C55E,#4ADE80)'
        : 'linear-gradient(135deg,#FF7F6B,#FF9A76)';
    el.style.cssText =
      `background:${bg};color:#fff;padding:12px 18px;border-radius:16px;font-size:14px;font-weight:600;` +
      'box-shadow:0 8px 28px rgba(0,0,0,0.18);opacity:0;transform:translateY(12px);' +
      'transition:all .35s cubic-bezier(0.16,1,0.3,1);text-align:center;line-height:1.35;';
    el.textContent = msg;
    ensure().appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      setTimeout(() => el.remove(), 400);
    }, type === 'error' ? 3200 : 2200);
  };
})();
