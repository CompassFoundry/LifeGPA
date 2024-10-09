// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mklzktwiwxijdbyxpmux.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbHprdHdpd3hpamRieXhwbXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0OTI0MzIsImV4cCI6MjA0NDA2ODQzMn0.qJ7iFsqO272TbYdvP0UMbelWpPdcVoRMYBax6oy01e0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
