const { createClient } = require('@supabase/supabase-js');

const url = "https://dczoxzxxnsfxwzjfuhzq.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjem94enh4bnNmeHd6amZ1aHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzA1MjcsImV4cCI6MjA5MjAwNjUyN30.Ikx7hLX26iHXQtr-E50dX1rpH171gOkfyLCZysHsVRM";

const supabase = createClient(url, key);

(async () => {
  const { data, error } = await supabase.from('products').insert([
    {
      name: "Test Anon",
      description: "Test Desc",
      price: 15,
      image: ""
    }
  ]);
  console.log("Error:", error);
  console.log("Data:", data);
})();
