import { supabase, type QuizResponse } from '@/lib/supabase'

function waitUntilSubscribed(timeoutMs = 4000) {
  const receivedIds = new Set<string>()
  let pendingId: string | null = null
  let pendingResolve: ((ok: boolean) => void) | null = null

  const channel = supabase
    .channel(`perfume-quiz-${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'perfume_quiz_responses',
      },
      (payload) => {
        const id = (payload.new as { id?: string }).id
        if (!id) return
        receivedIds.add(id)
        if (pendingId === id) {
          pendingResolve?.(true)
          pendingResolve = null
        }
      },
    )

  const ready = new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => resolve(false), timeoutMs)
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        clearTimeout(timer)
        resolve(true)
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        clearTimeout(timer)
        resolve(false)
      }
    })
  })

  const waitForInsert = (id: string, timeoutMs = 2500) => {
    if (receivedIds.has(id)) return Promise.resolve(true)
    pendingId = id
    return new Promise<boolean>((resolve) => {
      pendingResolve = resolve
      setTimeout(() => {
        if (pendingResolve === resolve) {
          pendingResolve = null
          resolve(false)
        }
      }, timeoutMs)
    })
  }

  const cleanup = () => {
    void supabase.removeChannel(channel)
  }

  return { ready, waitForInsert, cleanup }
}

async function invokeTelegram(id: string, shareCode: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const { error } = await supabase.functions.invoke('yeoun_quiz_bot', {
    body: { id, origin, shareCode },
  })
  if (error) {
    console.error('telegram notify failed', error)
  }
}

export async function saveQuizAndNotify(form: QuizResponse) {
  const realtime = waitUntilSubscribed()
  await realtime.ready

  const { data, error } = await supabase
    .from('perfume_quiz_responses')
    .insert({
      ...form,
      birth_year: form.birth_year ?? null,
    })
    .select('id, share_code')
    .single()

  if (error || !data?.id || !data.share_code) {
    realtime.cleanup()
    throw error ?? new Error('저장에 실패했습니다.')
  }

  await realtime.waitForInsert(data.id)
  await invokeTelegram(data.id, data.share_code)
  realtime.cleanup()
  return { id: data.id, shareCode: data.share_code as string }
}
