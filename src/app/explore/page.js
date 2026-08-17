import { createClient } from '@supabase/supabase-js';
import ClientExplore from './ClientExplore';

// Cấu hình Supabase (Server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const metadata = {
  title: 'Khám phá - HueViVu',
};

// Vô hiệu hóa cache tĩnh nếu muốn luôn fetch mới nhất, hoặc để auto
export const revalidate = 60;

export default async function ExplorePage() {
  // Fetch tất cả địa điểm từ Supabase
  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching places:', error);
  }

  return <ClientExplore initialPlaces={places || []} />;
}
