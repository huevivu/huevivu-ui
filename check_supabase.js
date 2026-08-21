require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSupabaseSchema() {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching from Supabase:', error.message);
  } else {
    if (data && data.length > 0) {
      console.log('Columns in Supabase places table:');
      console.log(Object.keys(data[0]).join(', '));
    } else {
      console.log('No data found in places table to inspect columns.');
      // Let's try to insert a dummy to see if it complains about missing columns
    }
  }
}

checkSupabaseSchema();
