const { createClient } = require('@supabase/supabase-js');
const url = "https://bqypqkvutclgjeeflrkh.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeXBxa3Z1dGNsZ2plZWZscmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MTU1NTIsImV4cCI6MjA5MTk5MTU1Mn0.O-ji0lv67SzyqDRLmSSP3_sGRxfRIb246x3keuoeMGk";
const supabase = createClient(url, key);
supabase.from('products').select('*').order('created_at').then(console.log).catch(console.error);
