// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zpaosjhrydnyajyfsfzr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYW9zamhyeWRueWFqeWZzZnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDExOTcsImV4cCI6MjA1Nzk3NzE5N30.3o2VZVU7vhIK4LK3TwHKh7ouaQj9s1GO4WLsRV3JhhM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);