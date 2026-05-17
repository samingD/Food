const { createClient } = require('@supabase/supabase-js');

const url = "https://dczoxzxxnsfxwzjfuhzq.supabase.co";
// Using the service_role key provided previously
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjem94enh4bnNmeHd6amZ1aHpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQzMDUyNywiZXhwIjoyMDkyMDA2NTI3fQ.uYFLeAszyDB8MkGV6J4_L4T7ubv8mQSyRBjZbTMInaM";

const supabase = createClient(url, key);

(async () => {
  const { data, error } = await supabase.from('products').insert([
    {
      name: "Test Admin",
      description: "Admin",
      price: 20
    }
  ]);
  console.log("Service-role insert error:", error);
  const getRes = await supabase.from('products').select('*');
  console.log("Service-role get error:", getRes.error);
})();
