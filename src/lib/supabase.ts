import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface QuizResponse {
  name: string
  occupation: string
  birth_year: number | null
  mbti: string
  usage_occasions: string[]
  life_pattern: string
  preferred_scents: string[]
  healing_methods: string[]
  healing_other: string
  self_image: string
  desired_mood: string
}
