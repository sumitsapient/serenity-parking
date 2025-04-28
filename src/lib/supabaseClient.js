import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usxysetamfoivookrcvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeHlzZXRhbWZvaXZvb2tyY3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NjUyMTksImV4cCI6MjA2MTQ0MTIxOX0.LyaoYreo6LcJC_klaxGy3d3qQXDhWnhP-6GCdZAwJcA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
