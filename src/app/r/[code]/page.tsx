import { notFound } from 'next/navigation'
import { fetchQuizByShareCode } from '@/lib/supabase'
import ResultView from '@/components/ResultView'

export default async function ResultPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const record = await fetchQuizByShareCode(code)

  if (!record) {
    notFound()
  }

  return <ResultView record={record} />
}
