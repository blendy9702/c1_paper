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

export interface QuizRecord extends QuizResponse {
  id: string
  share_code: string
}

export function mapQuizRow(row: {
  id: string
  share_code: string
  name: string | null
  occupation: string | null
  birth_year: number | null
  mbti: string | null
  usage_occasions: string[] | null
  life_pattern: string | null
  preferred_scents: string[] | null
  healing_methods: string[] | null
  healing_other: string | null
  self_image: string | null
  desired_mood: string | null
}): QuizRecord {
  return {
    id: row.id,
    share_code: row.share_code,
    name: row.name ?? '',
    occupation: row.occupation ?? '',
    birth_year: row.birth_year,
    mbti: row.mbti ?? '',
    usage_occasions: row.usage_occasions ?? [],
    life_pattern: row.life_pattern ?? '',
    preferred_scents: row.preferred_scents ?? [],
    healing_methods: row.healing_methods ?? [],
    healing_other: row.healing_other ?? '',
    self_image: row.self_image ?? '',
    desired_mood: row.desired_mood ?? '',
  }
}

export async function fetchQuizByShareCode(code: string): Promise<QuizRecord | null> {
  const { data, error } = await supabase
    .from('perfume_quiz_responses')
    .select('*')
    .eq('share_code', code)
    .maybeSingle()

  if (error || !data) return null
  return mapQuizRow(data)
}
