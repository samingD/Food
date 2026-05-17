import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://jajcgwmwepwtkielavey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphamNnd213ZXB3dGtpZWxhdmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODY4MDEsImV4cCI6MjA5MTg2MjgwMX0.XdwdLB38zT85sjK2wRSjIJHS8EuxcLDwybYWorXdNiY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('*');
  console.log('Error:', error);
  if (data && data.length > 0) {
    const cashew = data.find(p => String(p.name).trim().toLowerCase() === 'cashew nuts');
    if (cashew && typeof cashew.image === 'string') {
        console.log('Cashew image starts with:', cashew.image.substring(0, 50));
    }
  }
}
check();
