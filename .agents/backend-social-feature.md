# HueViVu — Backend Architecture: Trip Sharing & Travel Journal

> **Document Purpose**: Tài liệu này là reference cho backend implementation trong tương lai.
> Frontend đã được xây dựng (xem phần F). Backend cần triển khai theo specs dưới đây.

---

## A. Product Thinking

### Vì sao tính năng này hợp với HueViVu

HueViVu **không phải mạng xã hội** — nó là **AI Travel Operating System**. Tính năng social đóng vai trò:

1. **Data Flywheel**: Mỗi lịch trình chia sẻ = 1 training sample cho AI recommendation
2. **Trust Layer**: Review thực tế từ người đi trước tăng độ tin cậy gợi ý AI
3. **Retention Hook**: Journal + memories tạo emotional attachment → quay lại app
4. **Clone & Optimize**: Trip clone = onboarding shortcut → giảm friction cho user mới

### Giá trị Business
- **Engagement**: Session time tăng 2-3x khi có feed + journal
- **Retention**: Travel memory tạo lý do quay lại app sau chuyến đi
- **Virality**: Trip share = organic marketing

### Giá trị AI
- Collaborative filtering từ dữ liệu cộng đồng
- Real-time price/budget validation từ chi phí thực tế
- Sentiment analysis từ journal → cải thiện AI tone

### Network Effect
- Càng nhiều trip share → AI recommendation càng chính xác → user mới clone trip → chia sẻ thêm

---

## B. User Flow

### Flow 1: Chia sẻ lịch trình (Post-Trip)
```
Chuyến đi hoàn thành → AI gợi ý "Chia sẻ chuyến đi?" →
Chọn ảnh → Viết caption → Gắn mood/tags → Set public/private →
AI tự tạo summary → Review & publish → Xuất hiện trên Community Feed
```

### Flow 2: Viết nhật ký
```
Đang ở địa điểm → Nhấn "+" → Chọn "Nhật ký" →
Chọn ngày → Ghi text + ảnh + cảm xúc → Gắn location →
AI auto-tag mood → Lưu → Có thể public sau
```

### Flow 3: Clone Trip
```
Xem trip trên feed → Nhấn "Clone lịch trình" →
AI phân tích trip → Điều chỉnh theo preference user →
Tạo draft itinerary → User customize → Lưu thành trip mới
```

### Flow 4: AI Optimize from Shared Trip
```
Xem trip → Nhấn "Tối ưu bằng AI" →
AI so sánh budget, thời gian, sở thích →
Gợi ý thay đổi (bớt điểm, thêm ăn, đổi thứ tự) →
User approve → Tạo trip mới
```

---

## C. Database Design

### Core Tables

```sql
-- Shared Trips
CREATE TABLE shared_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  city VARCHAR(100) DEFAULT 'Huế',
  duration_days INT NOT NULL,
  total_cost DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'VND',
  mood VARCHAR(50),           -- 'relaxed', 'adventure', 'cultural', 'foodie'
  travel_style VARCHAR(50),   -- 'solo', 'couple', 'family', 'friends'
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  like_count INT DEFAULT 0,
  save_count INT DEFAULT 0,
  clone_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  ai_summary TEXT,            -- AI-generated trip summary
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shared_trips_user ON shared_trips(user_id);
CREATE INDEX idx_shared_trips_public ON shared_trips(is_public, created_at DESC);
CREATE INDEX idx_shared_trips_mood ON shared_trips(mood);
CREATE INDEX idx_shared_trips_style ON shared_trips(travel_style);

-- Shared Trip Places (ordered timeline)
CREATE TABLE shared_trip_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_trip_id UUID NOT NULL REFERENCES shared_trips(id) ON DELETE CASCADE,
  place_name VARCHAR(200) NOT NULL,
  place_type VARCHAR(50),     -- 'heritage', 'food', 'nature', 'temple'
  day_number INT NOT NULL,
  order_in_day INT NOT NULL,
  time_slot VARCHAR(20),      -- '07:00'
  actual_cost DECIMAL(10,2),
  rating DECIMAL(2,1),
  review TEXT,
  photo_urls TEXT[],
  emoji VARCHAR(10)
);

CREATE INDEX idx_stp_trip ON shared_trip_places(shared_trip_id, day_number, order_in_day);

-- Trip Photos
CREATE TABLE trip_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_trip_id UUID REFERENCES shared_trips(id) ON DELETE CASCADE,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  location_name VARCHAR(200),
  taken_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_trip ON trip_photos(shared_trip_id);
CREATE INDEX idx_photos_journal ON trip_photos(journal_id);

-- Journals
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  title VARCHAR(200),
  content TEXT NOT NULL,
  mood VARCHAR(30),           -- 'happy', 'peaceful', 'excited', 'nostalgic'
  mood_emoji VARCHAR(10),
  location_name VARCHAR(200),
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  day_number INT,
  is_public BOOLEAN DEFAULT false,
  like_count INT DEFAULT 0,
  ai_recap TEXT,              -- AI-generated recap
  weather VARCHAR(50),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journals_user ON journals(user_id, created_at DESC);
CREATE INDEX idx_journals_trip ON journals(trip_id);
CREATE INDEX idx_journals_public ON journals(is_public, created_at DESC);

-- Social Interactions
CREATE TABLE likes (
  user_id UUID NOT NULL REFERENCES users(id),
  target_type VARCHAR(20) NOT NULL,  -- 'trip', 'journal'
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, target_type, target_id)
);

CREATE TABLE saves (
  user_id UUID NOT NULL REFERENCES users(id),
  target_type VARCHAR(20) NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, target_type, target_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  target_type VARCHAR(20) NOT NULL,
  target_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_target ON comments(target_type, target_id, created_at);

-- Trip Clones (tracking)
CREATE TABLE trip_clones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_trip_id UUID NOT NULL REFERENCES shared_trips(id),
  cloned_by UUID NOT NULL REFERENCES users(id),
  new_trip_id UUID REFERENCES trips(id),
  ai_optimized BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Cache Strategy
- **Feed**: Redis sorted set by score (recency + engagement), TTL 5min
- **Trip detail**: Redis hash, invalidate on like/comment
- **User profile stats**: Redis hash, recalc hourly
- **Popular trips**: Materialized view, refresh every 15min

---

## D. API Design (REST)

### Trip Sharing
```
POST   /api/v1/trips/share              # Share a completed trip
GET    /api/v1/feed                      # Community feed (paginated)
GET    /api/v1/feed/trending             # Trending trips
GET    /api/v1/trips/shared/:id          # Trip detail
POST   /api/v1/trips/shared/:id/like     # Like/unlike
POST   /api/v1/trips/shared/:id/save     # Save/unsave
POST   /api/v1/trips/shared/:id/clone    # Clone trip
POST   /api/v1/trips/shared/:id/optimize # AI optimize from shared trip
GET    /api/v1/trips/shared/:id/comments # Get comments
POST   /api/v1/trips/shared/:id/comments # Add comment
```

### Journal
```
POST   /api/v1/journals                  # Create journal entry
GET    /api/v1/journals                  # My journal list
GET    /api/v1/journals/:id              # Journal detail
PUT    /api/v1/journals/:id              # Update journal
DELETE /api/v1/journals/:id              # Delete journal
POST   /api/v1/journals/:id/ai-recap     # Generate AI recap
GET    /api/v1/trips/:id/memories        # Travel memory timeline
```

### Feed Response Example
```json
{
  "data": [
    {
      "id": "uuid",
      "user": { "name": "Hue Traveler", "avatar": "url", "level": 3 },
      "title": "3 Ngày Ẩm thực & Văn hóa",
      "description": "Chuyến đi tuyệt vời...",
      "cover_image": "url",
      "duration_days": 3,
      "total_cost": 2500000,
      "mood": "cultural",
      "travel_style": "solo",
      "tags": ["#ẩmthực", "#disản", "#huế"],
      "places_count": 12,
      "like_count": 42,
      "save_count": 18,
      "clone_count": 7,
      "comment_count": 5,
      "is_liked": false,
      "is_saved": true,
      "ai_match_score": 92,
      "created_at": "2026-05-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 156 }
}
```

### Auth
- All endpoints require `Authorization: Bearer <JWT>`
- Rate limit: 60 req/min for reads, 10 req/min for writes

---

## E. Recommendation Logic

### AI Scoring for Feed Ranking
```
score = (recency_weight * recency_score)
      + (engagement_weight * engagement_score)
      + (relevance_weight * ai_match_score)
      + (diversity_bonus)

Where:
- recency_score = 1 / (1 + hours_since_posted / 24)
- engagement_score = (likes * 1 + saves * 3 + clones * 5) / max_engagement
- ai_match_score = cosine_similarity(user_preference_vector, trip_vector)
- diversity_bonus = penalty for showing same mood/style consecutively
```

### Collaborative Filtering
```
1. Build user-trip interaction matrix (like, save, clone, view)
2. Find similar users by cosine similarity
3. Recommend trips liked by similar users but not seen by current user
4. Blend with content-based filtering (mood, style, budget match)
```

### Personalization Signals
- Travel personality type (Cultural Explorer, Foodie, etc.)
- Budget range preference
- Duration preference
- Past trip destinations
- Saved places
- Journal mood patterns

---

## F. Frontend Pages (IMPLEMENTED)

### New Pages Created
1. **community.html/css/js** — Community feed with trip cards, filter tabs, trending section
2. **journal.html/css/js** — Journal writing interface with mood picker, photo upload, timeline view
3. **shared-trip-detail.html/css/js** — Full shared trip view with timeline, photos, interactions
4. **travel-memory.html/css/js** — AI-generated travel recap with cinematic presentation

### Integration Points
- Trips page "Đã đi" tab → "Chia sẻ" CTA → Share flow
- Profile page → My shared trips section
- Home page → "Từ cộng đồng" section in feed
- Bottom nav → Community tab (hoặc tích hợp vào Explore)

---

## G. Scaling Considerations

### Image Storage
- **S3 / Cloudflare R2** for original images
- Auto-generate thumbnails (400px, 800px, 1200px) on upload
- WebP conversion for mobile
- Progressive JPEG fallback

### CDN
- Cloudflare CDN for all static assets
- Edge caching for feed API (30s TTL)
- Image CDN with transformation (Cloudinary / Imgix)

### Timeline Rendering
- Virtual scrolling for long feeds
- Lazy load images below fold
- Skeleton loading states
- Infinite scroll with cursor-based pagination

### Feed Ranking
- Pre-compute feed in background job (every 5min)
- Cache per-user feed in Redis sorted set
- Invalidate on new follow/like events

---

## H. Monetization

| Feature | Model | Price Range |
|---------|-------|------------|
| Premium Journal Themes | Subscription | 49k-99k VND/month |
| AI Travel Recap Video | One-time | 29k VND/recap |
| Featured Trip (boost) | Pay-per-impression | 50k-200k VND |
| Sponsored Location Pins | B2B | Negotiated |
| Creator/KOL Tools | Revenue share | 70/30 split |

### Creator Direction
- Verified travel creators (badge)
- Creator dashboard with analytics
- Affiliate links for experiences/tours
- Tip/support feature

---

## I. Risk Analysis

### Điểm mạnh
- Tạo data flywheel cho AI
- Tăng retention 2-3x
- Organic growth qua sharing
- Real budget data → AI pricing accuracy

### Điểm yếu
- Cần critical mass (>100 shared trips) để feed có giá trị
- Content moderation cần thiết
- Cold start problem cho new users

### Rủi ro biến thành MXH
- ❌ KHÔNG thêm: follow graph, DM, stories, reels
- ❌ KHÔNG thêm: vanity metrics (follower count on profile)
- ❌ KHÔNG thêm: algorithmic FOMO (notification spam)
- ✅ Luôn giữ: AI assistant là trọng tâm, social là data layer

### Cách giữ đúng trọng tâm
1. Feed luôn prioritize "AI match score" trên "popularity"
2. Clone + Optimize > Like + Comment (action > reaction)
3. Journal là private-first, public là opt-in
4. Mọi social action đều feed back vào AI recommendation
5. Không bao giờ show "follower count" — chỉ show "trips shared"

---

## Implementation Priority

### Phase 1 (Current — Frontend Only)
- [x] Community feed page
- [x] Journal writing UI
- [x] Shared trip detail view
- [x] Travel memory/recap UI

### Phase 2 (Backend MVP)
- [ ] PostgreSQL schema setup
- [ ] Auth + JWT middleware
- [ ] CRUD API for trips/journals
- [ ] Image upload to S3
- [ ] Basic feed with chronological order

### Phase 3 (AI Integration)
- [ ] AI trip summary generation
- [ ] AI journal recap
- [ ] Feed ranking with AI match score
- [ ] Collaborative filtering v1
- [ ] Clone + optimize flow

### Phase 4 (Scale)
- [ ] Redis caching layer
- [ ] CDN setup
- [ ] Content moderation
- [ ] Creator tools
- [ ] Monetization features
