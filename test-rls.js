const { createClient } = require('@supabase/supabase-js');
const url = "https://jajcgwmwepwtkielavey.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphamNnd213ZXB3dGtpZWxhdmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODY4MDEsImV4cCI6MjA5MTg2MjgwMX0.XdwdLB38zT85sjK2wRSjIJHS8EuxcLDwybYWorXdNiY";
const supabase = createClient(url, key);

// Insert should violate RLS if RLS is enabled and no policy allows anon insertions.
// I already tested insert on their db and it succeeded, meaning their table might NOT have RLS, or they already added a policy!
