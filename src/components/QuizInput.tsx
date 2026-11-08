"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  background: "#fffdf9",
  border: "1px solid rgba(43,36,28,0.12)",
  borderRadius: 12,
  color: "#2b241c",
  padding: "14px 16px",
  fontSize: 16,
  outline: "none",
  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
  appearance: "none",
  WebkitAppearance: "none",
};

const focusStyle = {
  borderColor: "#8d6840",
  background: "#fff",
  boxShadow: "0 0 0 3px rgba(141,104,64,0.12)",
};

const labelStyle: React.CSSProperties = {
  color: "#7a6f64",
  fontSize: 13,
  letterSpacing: "0.05em",
};

export function QuizTextInput(
  props: InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    hint?: string;
  },
) {
  const { label, hint, ...rest } = props;
  return (
    <div className='flex flex-col gap-2'>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        {...rest}
        style={baseInputStyle}
        onFocus={(e) => {
          Object.assign(e.currentTarget.style, focusStyle);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(43,36,28,0.12)";
          e.currentTarget.style.background = "#fffdf9";
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
      {hint && <p style={{ color: "#7a6f64", fontSize: 12 }}>{hint}</p>}
    </div>
  );
}

export function QuizSelect(
  props: SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    options: { value: string; label: string }[];
  },
) {
  const { label, options, ...rest } = props;
  return (
    <div className='flex flex-col gap-2 relative'>
      {label && <label style={labelStyle}>{label}</label>}
      <div className='relative'>
        <select
          {...rest}
          style={{
            ...baseInputStyle,
            cursor: "pointer",
            paddingRight: 40,
          }}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, focusStyle);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(43,36,28,0.12)";
            e.currentTarget.style.background = "#fffdf9";
            e.currentTarget.style.boxShadow = "none";
            props.onBlur?.(e);
          }}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: "#fffdf9", color: "#2b241c" }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2'
          style={{ color: "#7a6f64" }}
        >
          ▾
        </span>
      </div>
    </div>
  );
}

export function QuizTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    hint?: string;
  },
) {
  const { label, hint, ...rest } = props;
  return (
    <div className='flex flex-col gap-2'>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea
        {...rest}
        rows={rest.rows ?? 3}
        style={{
          ...baseInputStyle,
          resize: "none",
          lineHeight: 1.6,
        }}
        onFocus={(e) => {
          Object.assign(e.currentTarget.style, focusStyle);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(43,36,28,0.12)";
          e.currentTarget.style.background = "#fffdf9";
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
      {hint && <p style={{ color: "#7a6f64", fontSize: 12 }}>{hint}</p>}
    </div>
  );
}

const MBTI_GROUPS = [
  { name: "분석형", types: ["INTJ", "INTP", "ENTJ", "ENTP"] },
  { name: "외교형", types: ["INFJ", "INFP", "ENFJ", "ENFP"] },
  { name: "관리형", types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"] },
  { name: "탐험형", types: ["ISTP", "ISFP", "ESTP", "ESFP"] },
];

export function MbtiPicker({
  label = "MBTI",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className='flex flex-col gap-2'>
      {label && <label style={labelStyle}>{label}</label>}
      <button
        type='button'
        onClick={() => setOpen(true)}
        style={{
          ...baseInputStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
          color: value ? "#2b241c" : "#a3988c",
        }}
      >
        <span>{value || "MBTI 선택"}</span>
        <span style={{ color: "#8d6840", fontSize: 13 }}>선택</span>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            role='presentation'
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 80,
              background: "rgba(43, 36, 28, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              role='dialog'
              aria-modal='true'
              aria-labelledby={titleId}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 440,
                maxHeight: "min(86dvh, 720px)",
                overflow: "auto",
                background: "#fffdf9",
                borderRadius: 24,
                padding: "22px 18px 18px",
                boxShadow: "0 24px 60px rgba(43,36,28,0.16)",
              }}
            >
              <div
                className='flex items-start justify-between gap-3'
                style={{ marginBottom: 16 }}
              >
                <div>
                  <p
                    id={titleId}
                    style={{
                      color: "#2b241c",
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    MBTI
                  </p>
                  {/* <p style={{ color: '#7a6f64', fontSize: 13, marginTop: 4 }}>
                  네 글자 유형을 선택해주세요
                </p> */}
                </div>
                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  aria-label='닫기'
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9999,
                    border: "1px solid rgba(43,36,28,0.12)",
                    background: "#fff",
                    color: "#7a6f64",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ✕
                </button>
              </div>

              <div className='flex flex-col gap-4'>
                {MBTI_GROUPS.map((group) => (
                  <section key={group.name}>
                    <p
                      style={{
                        color: "#8d6840",
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        marginBottom: 8,
                      }}
                    >
                      {group.name}
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 8,
                      }}
                    >
                      {group.types.map((type) => {
                        const selected = value === type;
                        return (
                          <button
                            key={type}
                            type='button'
                            onClick={() => {
                              onChange(type);
                              setOpen(false);
                            }}
                            style={{
                              height: 48,
                              borderRadius: 12,
                              border: selected
                                ? "1px solid #8d6840"
                                : "1px solid rgba(43,36,28,0.1)",
                              background: selected
                                ? "rgba(141,104,64,0.12)"
                                : "#fff",
                              color: selected ? "#6b4e2e" : "#2b241c",
                              fontSize: 14,
                              fontWeight: selected ? 600 : 500,
                              letterSpacing: "0.04em",
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  rank?: number;
}

export function CheckboxOption({
  label,
  checked,
  onChange,
  rank,
}: CheckboxOptionProps) {
  return (
    <button
      type='button'
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        border: checked
          ? "1px solid rgba(141,104,64,0.55)"
          : "1px solid rgba(43,36,28,0.1)",
        borderRadius: 12,
        background: checked ? "rgba(141,104,64,0.1)" : "#fffdf9",
        color: "#2b241c",
        fontSize: 15,
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.2s",
        width: "100%",
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: rank ? 9999 : 6,
          border: checked
            ? "1.5px solid #8d6840"
            : "1.5px solid rgba(43,36,28,0.2)",
          background: checked ? "#8d6840" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.2s",
          fontSize: 12,
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {checked ? (rank ?? "✓") : ""}
      </span>
      {label}
    </button>
  );
}
