import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://dczoxzxxnsfxwzjfuhzq.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjem94enh4bnNmeHd6amZ1aHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzA1MjcsImV4cCI6MjA5MjAwNjUyN30.Ikx7hLX26iHXQtr-E50dX1rpH171gOkfyLCZysHsVRM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('products').select('*');
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
