import { createClient } from '@supabase/supabase-js';
export {}
   
const supabaseUrl = "https://rkaegpzielhmngxgklkh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrYWVncHppZWxobW5neGdrbGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDI4OTQsImV4cCI6MjA2MjU3ODg5NH0.uplTBRK6Tkfhx_3XIZ2eZn9WE9LJyTZDcJ2kLMYZK0Y"
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
