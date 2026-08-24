'use client'

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  color: '#f0ede8',
  padding: '14px 16px',
  fontSize: 16,
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
  fontFamily: 'inherit',
  appearance: 'none',
  WebkitAppearance: 'none',
}

const focusStyle = {
  borderColor: '#c9a96e',
  background: 'rgba(201,169,110,0.07)',
}

export function QuizTextInput(
  props: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }
) {
  const { label, hint, ...rest } = props
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label style={{ color: '#8a8278', fontSize: 13, letterSpacing: '0.05em' }}>
          {label}
        </label>
      )}
      <input
        {...rest}
        style={baseInputStyle}
        onFocus={(e) => {
          Object.assign(e.currentTarget.style, focusStyle)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
          props.onBlur?.(e)
        }}
      />
      {hint && (
        <p style={{ color: '#8a8278', fontSize: 12, fontStyle: 'italic' }}>{hint}</p>
      )}
    </div>
  )
}

export function QuizSelect(
  props: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }
) {
  const { label, options, ...rest } = props
  return (
    <div className="flex flex-col gap-2 relative">
      {label && (
        <label style={{ color: '#8a8278', fontSize: 13, letterSpacing: '0.05em' }}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          {...rest}
          style={{
            ...baseInputStyle,
            cursor: 'pointer',
            paddingRight: 40,
          }}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, focusStyle)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            props.onBlur?.(e)
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#13131a', color: '#f0ede8' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* 커스텀 화살표 */}
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          style={{ color: '#8a8278' }}
        >
          ▾
        </span>
      </div>
    </div>
  )
}

export function QuizTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }
) {
  const { label, hint, ...rest } = props
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label style={{ color: '#8a8278', fontSize: 13, letterSpacing: '0.05em' }}>
          {label}
        </label>
      )}
      <textarea
        {...rest}
        rows={3}
        style={{
          ...baseInputStyle,
          resize: 'none',
          lineHeight: 1.6,
        }}
        onFocus={(e) => {
          Object.assign(e.currentTarget.style, focusStyle)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
          props.onBlur?.(e)
        }}
      />
      {hint && (
        <p style={{ color: '#8a8278', fontSize: 12, fontStyle: 'italic' }}>{hint}</p>
      )}
    </div>
  )
}

interface CheckboxOptionProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxOption({ label, checked, onChange }: CheckboxOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        border: checked ? '1px solid rgba(201,169,110,0.6)' : '1px solid rgba(255,255,255,0.10)',
        borderRadius: 12,
        background: checked ? 'rgba(201,169,110,0.10)' : 'rgba(255,255,255,0.03)',
        color: checked ? '#e8d5b0' : '#8a8278',
        fontSize: 15,
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '100%',
        fontFamily: 'inherit',
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          border: checked ? '1.5px solid #c9a96e' : '1.5px solid rgba(255,255,255,0.2)',
          background: checked ? 'rgba(201,169,110,0.2)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s',
          fontSize: 11,
          color: '#c9a96e',
        }}
      >
        {checked ? '✓' : ''}
      </span>
      {label}
    </button>
  )
}
