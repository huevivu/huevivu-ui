import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Khởi tạo query cơ bản
    let query = supabase.from('places').select('*');

    // Hỗ trợ các bộ lọc cơ bản
    const category = searchParams.get('category');
    if (category) {
      query = query.eq('category', category);
    }

    const physicalLevel = searchParams.get('physical_level');
    if (physicalLevel) {
      query = query.eq('physical_level', physicalLevel);
    }

    // Sắp xếp (mặc định theo rating)
    const sortBy = searchParams.get('sort') || 'rating';
    query = query.order(sortBy, { ascending: false });

    // Giới hạn số lượng (mặc định 10)
    const limit = parseInt(searchParams.get('limit') || '10');
    query = query.limit(limit);

    // Thực thi truy vấn
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      status: 'success',
      data: data,
    });
  } catch (error) {
    console.error('API /places error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
