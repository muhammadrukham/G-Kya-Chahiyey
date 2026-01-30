
import { createClient } from '@supabase/supabase-js';

// Default credentials for "Ji Kya Chahiye" Demo
const DEFAULT_URL = 'https://wmtftsefvyexesjnefhg.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdGZ0c2VmdnlexGVzam5lZmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTQ0MTYsImV4cCI6MjA4NTMzMDQxNn0.CdrQdpsADkuC-epDGELsIWlpOA5IQDAwqrcy4qWy4gs';

// Get credentials from localStorage or use defaults
const supabaseUrl = localStorage.getItem('JKC_SUPABASE_URL') || DEFAULT_URL;
const supabaseKey = localStorage.getItem('JKC_SUPABASE_KEY') || DEFAULT_KEY;

// This client handles all cloud syncing
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to update credentials
export const updateSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('JKC_SUPABASE_URL', url);
  localStorage.setItem('JKC_SUPABASE_KEY', key);
  window.location.reload(); // Reload to re-initialize the client
};

export const resetSupabaseConfig = () => {
  localStorage.removeItem('JKC_SUPABASE_URL');
  localStorage.removeItem('JKC_SUPABASE_KEY');
  window.location.reload();
};
