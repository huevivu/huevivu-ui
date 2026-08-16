-- 01_schema.sql
-- HueViVu Database Schema for Supabase (PostgreSQL)

-- ==============================================================================
-- Bảng USERS
-- ==============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    total_trips INTEGER DEFAULT 0,
    total_places INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Bảng PLACES
-- ==============================================================================
CREATE TABLE places (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    address TEXT,
    rating REAL DEFAULT 4.5,
    rating_count INTEGER DEFAULT 100,
    price TEXT DEFAULT 'Miễn phí',
    duration TEXT DEFAULT '1-2 giờ',
    distance TEXT,
    lat REAL DEFAULT 16.4637,
    lng REAL DEFAULT 107.5909,
    img TEXT,
    ai_insight TEXT,
    hours TEXT,
    hours_time TEXT,
    hours_note TEXT,
    highlights JSONB DEFAULT '[]',
    tips JSONB DEFAULT '[]',
    indoor INTEGER DEFAULT 0,
    best_time TEXT,
    crowd_level TEXT,
    physical_level TEXT,
    tags JSONB DEFAULT '[]',
    avg_visit_min INTEGER DEFAULT 90,
    popularity REAL DEFAULT 0.0,
    vibe JSONB DEFAULT '[]',
    noise_level TEXT,
    authenticity INTEGER DEFAULT 3,
    walking_distance TEXT,
    accessibility JSONB DEFAULT '[]',
    weather_dependent INTEGER DEFAULT 0,
    best_time_of_day JSONB DEFAULT '[]',
    ideal_pacing TEXT,
    taste_profile JSONB DEFAULT '[]',
    dining_style TEXT,
    specialties JSONB DEFAULT '[]'
);

-- ==============================================================================
-- Bảng TRIPS
-- ==============================================================================
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    duration INTEGER NOT NULL,
    style TEXT NOT NULL,
    companion TEXT NOT NULL,
    budget INTEGER NOT NULL,
    food_prefs JSONB DEFAULT '[]',
    itinerary JSONB DEFAULT '{}',
    highlights JSONB DEFAULT '[]',
    ai_insight TEXT,
    total_cost_estimate TEXT,
    status TEXT DEFAULT 'active',
    is_shared INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    clone_count INTEGER DEFAULT 0,
    ai_match_score INTEGER DEFAULT 85,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Bảng JOURNAL_ENTRIES
-- ==============================================================================
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    time_str TEXT,
    place_name TEXT,
    content TEXT NOT NULL,
    mood TEXT,
    is_private INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Bảng TRIP_LIKES
-- ==============================================================================
CREATE TABLE trip_likes (
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (trip_id, user_id)
);
