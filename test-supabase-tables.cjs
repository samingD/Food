const { createClient } = require('@supabase/supabase-js');
const url = "https://jajcgwmwepwtkielavey.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphamNnd213ZXB3dGtpZWxhdmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODY4MDEsImV4cCI6MjA5MTg2MjgwMX0.XdwdLB38zT85sjK2wRSjIJHS8EuxcLDwybYWorXdNiY";
const supabase = createClient(url, key);
supabase.from('orders').select('*').limit(1).then(console.log).catch(console.error);
