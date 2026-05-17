const { createClient } = require('@supabase/supabase-js');
const url = "https://jajcgwmwepwtkielavey.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphamNnd213ZXB3dGtpZWxhdmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODY4MDEsImV4cCI6MjA5MTg2MjgwMX0.XdwdLB38zT85sjK2wRSjIJHS8EuxcLDwybYWorXdNiY";
const supabase = createClient(url, key);
supabase.from('products').update({ name: 'Renamed Product' }).eq('id', '572ab530-48df-430a-b562-9f7dbd827775').select().single().then(console.log).catch(console.error);
