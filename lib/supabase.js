import { createBrowserClient } from '@supabase/ssr';

let client;
export function getSupabase() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('أضف بيانات Supabase في ملف .env.local أولاً');
    client = createBrowserClient(url, key);
  }
  return client;
}

// Student codes are mapped to the email addresses provisioned for them in Supabase Auth.
export function studentEmailFromCode(code) {
  const normalized = code.trim().toLowerCase().replace(/\s+/g, '');
  return `${normalized}@students.example.com`;
}
