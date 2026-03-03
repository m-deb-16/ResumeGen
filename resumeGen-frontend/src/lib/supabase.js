import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tgqdppoguvogenbhxxcp.supabase.co";
const supabaseKey = "sb_publishable_A4_zIHKA5yzKppvDJppmoQ_IljwEe5A";

export const supabase = createClient(supabaseUrl, supabaseKey);
