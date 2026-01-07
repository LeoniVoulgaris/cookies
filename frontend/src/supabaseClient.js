import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jdecxwfjzoptepedwzvo.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZWN4d2Zqem9wdGVwZWR3enZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Njg3ODAsImV4cCI6MjA3MTQ0NDc4MH0.GGimjpGY-ScbQLTbFtCz2BIoEsb0jF8iT4Di_iZ0DcY'; // Replace with your Supabase anon key
export const supabase = createClient(supabaseUrl, supabaseKey);
