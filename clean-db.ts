import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jajcgwmwepwtkielavey.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphamNnd213ZXB3dGtpZWxhdmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODY4MDEsImV4cCI6MjA5MTg2MjgwMX0.XdwdLB38zT85sjK2wRSjIJHS8EuxcLDwybYWorXdNiY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  const { data, error } = await supabase.from('products').select('*');
  console.log("Products currently:", data, error);

  if (data && data.length > 0) {
    console.log("Trying to delete all products to wipe them clean...");
    for (const p of data) {
       const del = await supabase.from('products').delete().eq('id', p.id);
       console.log("Delete result for", p.id, del.error);
    }
  }

  // Final check
  const check = await supabase.from('products').select('*');
  console.log("Products after cleanup:", check.data);
})();
