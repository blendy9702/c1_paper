'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 'max(16px, env(safe-area-inset-top, 0px))',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 'min(420px, calc(100% - 40px))',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '9px 14px',
          borderRadius: 9999,
          background: '#fffdf9',
          border: '1px solid rgba(141,104,64,0.18)',
          boxShadow: '0 10px 28px rgba(43,36,28,0.06)',
        }}
      >
        <span
          style={{
            minWidth: 24,
            color: '#8d6840',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.06em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {current}
        </span>
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 9999,
            background: 'rgba(43,36,28,0.08)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              borderRadius: 9999,
              background: 'linear-gradient(90deg, #c4a36a, #8d6840)',
            }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          />
        </div>
        <span
          style={{
            minWidth: 24,
            color: '#a3988c',
            fontSize: 13,
            letterSpacing: '0.06em',
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {total}
        </span>
      </div>
    </div>
  )
}
