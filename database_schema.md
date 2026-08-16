# Sơ đồ Cơ sở dữ liệu HueViVu (Database Schema)

Dưới đây là cấu trúc các bảng dữ liệu được trích xuất từ sơ đồ hệ thống HueViVu.

## Bảng `USERS`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `id` | TEXT | PK "user_xxx" |
| `name` | TEXT | NOT NULL |
| `email` | TEXT | UNIQUE, NOT NULL |
| `password_hash` | TEXT | NOT NULL |
| `level` | INTEGER | DEFAULT 1 |
| `total_trips` | INTEGER | DEFAULT 0 |
| `total_places` | INTEGER | DEFAULT 0 |
| `created_at` | TEXT | datetime('now') |

## Bảng `TRIPS`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `id` | TEXT | PK "trip_xxx" |
| `user_id` | TEXT | FK REFERENCES users(id) |
| `title` | TEXT | NOT NULL |
| `summary` | TEXT | |
| `duration` | INTEGER | NOT NULL (số ngày) |
| `style` | TEXT | NOT NULL (cultural, foodie,...) |
| `companion` | TEXT | NOT NULL (solo, couple, family,...) |
| `budget` | INTEGER | NOT NULL (VNĐ) |
| `food_prefs` | TEXT | JSON array |
| `itinerary` | TEXT | JSON (days/activities) |
| `highlights` | TEXT | JSON array |
| `ai_insight` | TEXT | |
| `total_cost_estimate`| TEXT | |
| `status` | TEXT | active\|upcoming\|past |
| `is_shared` | INTEGER | 0\|1 |
| `like_count` | INTEGER | DEFAULT 0 |
| `save_count` | INTEGER | DEFAULT 0 |
| `clone_count` | INTEGER | DEFAULT 0 |
| `ai_match_score` | INTEGER | DEFAULT 85 |
| `created_at` | TEXT | |

## Bảng `PLACES`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `id` | TEXT | PK "citadel, pagoda,..." |
| `name` | TEXT | NOT NULL |
| `category` | TEXT | NOT NULL (heritage, food, cafe,...) |
| `description` | TEXT | |
| `address` | TEXT | |
| `rating` | REAL | DEFAULT 4.5 |
| `rating_count` | INTEGER | DEFAULT 100 |
| `price` | TEXT | DEFAULT Miễn phí |
| `duration` | TEXT | DEFAULT 1-2 giờ |
| `distance` | TEXT | |
| `lat` | REAL | DEFAULT 16.4637 |
| `lng` | REAL | DEFAULT 107.5909 |
| `img` | TEXT | |
| `ai_insight` | TEXT | |
| `hours` | TEXT | |
| `hours_time` | TEXT | |
| `hours_note` | TEXT | |
| `highlights` | TEXT | JSON array |
| `tips` | TEXT | JSON array |
| `indoor` | INTEGER | 0\|1 |
| `best_time` | TEXT | morning\|afternoon\|evening\|all |
| `crowd_level` | TEXT | low\|medium\|high |
| `physical_level` | TEXT | easy\|moderate\|hard |
| `tags` | TEXT | JSON array |
| `avg_visit_min` | INTEGER | DEFAULT 90 |
| `popularity` | REAL | 0.0 - 1.0 |
| `vibe` | TEXT | JSON array ("romantic", "historic",...) |
| `noise_level` | TEXT | quiet\|moderate\|loud |
| `authenticity` | INTEGER | 1 đến 5 |
| `walking_distance`| TEXT | minimal\|moderate\|extensive |
| `accessibility` | TEXT | JSON array ("wheelchair",...) |
| `weather_dependent`| INTEGER | 0\|1 |
| `best_time_of_day`| TEXT | JSON array ("early_morning",...) |
| `ideal_pacing` | TEXT | quick_stop\|immersive |
| `taste_profile` | TEXT | JSON array ("spicy", "savory",...) |
| `dining_style` | TEXT | street_food\|casual\|fine_dining |
| `specialties` | TEXT | JSON array ("bun_bo", "che",...) |

## Bảng `JOURNAL_ENTRIES`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `id` | TEXT | PK "je_xxx" |
| `trip_id` | TEXT | FK |
| `user_id` | TEXT | FK REFERENCES users(id) |
| `time_str` | TEXT | |
| `place_name` | TEXT | |
| `content` | TEXT | NOT NULL |
| `mood` | TEXT | happy\|wonder\|love\|... |
| `is_private` | INTEGER | 0\|1 |
| `created_at` | TEXT | |

## Bảng `TRIP_LIKES`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `trip_id` | TEXT | PK_FK |
| `user_id` | TEXT | PK_FK |
| `created_at` | TEXT | |

## Bảng `TRIP_SAVES`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `trip_id` | TEXT | PK_FK |
| `user_id` | TEXT | PK_FK |
| `created_at` | TEXT | |

## Bảng `CHAT_MESSAGES`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `id` | TEXT | PK |
| `trip_id` | TEXT | FK |
| `user_id` | TEXT | NOT NULL |
| `role` | TEXT | user\|assistant |
| `content` | TEXT | NOT NULL |
| `created_at` | TEXT | |

## Bảng `USER_EVENTS`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `id` | TEXT | PK "UUID" |
| `user_id` | TEXT | FK nullable |
| `session_id` | TEXT | NOT NULL |
| `event_type` | TEXT | NOT NULL (view, save, skip, add_trip, rate) |
| `place_id` | TEXT | FK nullable |
| `trip_id` | TEXT | FK nullable |
| `value` | REAL | nullable |
| `context` | TEXT | JSON |
| `created_at` | TEXT | |

## Bảng `TRIP_FEEDBACK`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `id` | TEXT | PK "fb_xxx" |
| `trip_id` | TEXT | FK NOT NULL |
| `user_id` | TEXT | FK nullable |
| `session_id` | TEXT | nullable |
| `overall_rating`| REAL | |
| `ai_rating` | REAL | |
| `places_visited`| TEXT | JSON array |
| `places_skipped`| TEXT | JSON array |
| `duration_actual`| INTEGER | |
| `notes` | TEXT | |
| `created_at` | TEXT | |

## Bảng `TRAINING_EXAMPLES`
| Cột | Kiểu dữ liệu | Ràng buộc / Mặc định |
| --- | --- | --- |
| `id` | TEXT | PK "UUID" |
| `user_profile` | TEXT | JSON (styles, companion, duration, budget, food_prefs) |
| `context` | TEXT | JSON (season, timestamp) |
| `output` | TEXT | JSON (trip_id, places_visited, places_skipped) |
| `reward` | REAL | 0.0 - 1.0 |
| `source` | TEXT | generated\|feedback |
| `created_at` | TEXT | |

---

> **Lưu ý:**
> - Bảng `TRIPS.itinerary` lưu trữ JSON phức tạp chứa chi tiết các ngày và hoạt động.
> - Bảng `PLACES.tags` lưu trữ array các tag để phục vụ cho ML recommendation.
> - Bảng `TRAINING_EXAMPLES` được tự động tạo từ `TRIP_FEEDBACK` dùng để fine-tune AI model trong tương lai.
