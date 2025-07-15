import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jlqcogzhhwwkafwqeeul.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscWNvZ3poaHd3a2Fmd3FlZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTkyOTMsImV4cCI6MjA2ODEzNTI5M30.tBPnhz6R8FYwCW4Qi3mJ2HzUC4a2U4EIZhxjF4oRs_Y'

export const supabase = createClient(supabaseUrl, supabaseKey)
