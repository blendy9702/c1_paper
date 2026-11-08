'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ResultCard from '@/components/ResultCard'
import type { QuizRecord } from '@/lib/supabase'

export default function ResultView({ record }: { record: QuizRecord }) {
  const router = useRouter()

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#f6f1e8',
        padding: '60px 20px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <div className="mb-6 text-center">
          <p
            style={{
              color: '#8d6840',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Your Scent Profile
          </p>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 300,
              color: '#2b241c',
              letterSpacing: '-0.02em',
            }}
          >
            향수 프로필 완성
          </h2>
        </div>
        <ResultCard
          data={record}
          shareCode={record.share_code}
          onRestart={() => router.push('/')}
        />
      </motion.div>
    </main>
  )
}
