import { STORAGE_TOKEN, STORAGE_URL } from "@shared/utils/enviroments";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(STORAGE_URL, STORAGE_TOKEN)

export default supabase