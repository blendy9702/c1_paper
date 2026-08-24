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
        paddingTop: 'max(20px, env(safe-area-inset-top, 0px))',
        paddingBottom: 14,
        background: 'rgba(10, 10, 15, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="h-[2px] bg-white/10 w-full">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #c9a96e, #e8d5b0)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      <div className="flex justify-center pt-4 pb-1.5">
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i + 1 === current ? 1.2 : 1,
                backgroundColor:
                  i + 1 < current
                    ? '#c9a96e'
                    : i + 1 === current
                    ? '#e8d5b0'
                    : 'rgba(255,255,255,0.15)',
              }}
              transition={{ duration: 0.3 }}
              className="rounded-full"
              style={{
                width: i + 1 === current ? 20 : 6,
                height: 6,
              }}
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: 'rgba(201,169,110,0.7)' }}
        >
          {current} / {total}
        </span>
      </div>
    </div>
  )
}
