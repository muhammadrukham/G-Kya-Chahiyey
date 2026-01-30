
import { createClient } from '@supabase/supabase-js';

// Configuration for Ji Kya Chahiye Supabase Backend
const supabaseUrl = 'https://wmtftsefvyexesjnefhg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdGZ0c2VmdnlexGVzam5lZmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTQ0MTYsImV4cCI6MjA4NTMzMDQxNn0.CdrQdpsADkuC-epDGELsIWlpOA5IQDAwqrcy4qWy4gs';

// This client handles all cloud syncing
export const supabase = createClient(supabaseUrl, supabaseKey);
