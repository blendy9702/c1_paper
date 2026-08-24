"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import type { QuizResponse } from "@/lib/supabase";

interface ResultCardProps {
  data: QuizResponse;
  shareCode?: string;
  onRestart: () => void;
}

const SCENT_EMOJI: Record<string, string> = {
  "플로럴(꽃향)": "🌸",
  "시트러스(상큼한 향)": "🍋",
  "파우더리(비누향)": "🫧",
  "우디(나무향)": "🌲",
  "머스크(성숙한향)": "✨",
  "아쿠아(물향)": "💧",
  "소피(비누향)": "🧴",
  "그린티(풀향)": "🍃",
  "바닐라(달콤한 향)": "🍂",
  "허브(힐링의 향)": "🌿",
  "코튼(린넨향)": "🤍",
};

const OCCASION_EMOJI: Record<string, string> = {
  "미래의 나를 위한 선물": "🎁",
  "이성과의 만남": "💕",
  "중요한 만남을 위해": "⭐",
  "평범한 일상을 위해": "☕",
  "사람들에게 기억되기 위해": "💫",
};

export default function ResultCard({ data, shareCode, onRestart }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" && shareCode
      ? `${window.location.origin}/r/${shareCode}`
      : "";

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0a0a0f",
      });
      const link = document.createElement("a");
      link.download = `여운_${data.name || "나의향수"}.png`;
      link.href = dataUrl;
      link.click();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const year = data.birth_year;
  const age = year ? new Date().getFullYear() - year + 1 : null;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 저장될 카드 */}
      <div
        ref={cardRef}
        style={{
          width: "100%",
          maxWidth: 400,
          background:
            "linear-gradient(145deg, #0f0f14 0%, #13131a 60%, #0a0a0f 100%)",
          borderRadius: 24,
          border: "1px solid rgba(201,169,110,0.25)",
          padding: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,60,51,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* 헤더 */}
        <div className="relative z-10 mb-6">
          <p
            style={{
              color: "rgba(201,169,110,0.7)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            나만의 여운
          </p>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: "#f0ede8",
              letterSpacing: "-0.02em",
            }}
          >
            {data.name || "나"}의 향
          </h2>
          <p style={{ color: "#8a8278", fontSize: 13, marginTop: 4 }}>
            {data.occupation && `${data.occupation} · `}
            {age && `${age}세 · `}
            {data.mbti && data.mbti}
          </p>
        </div>

        {/* 구분선 */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)",
            marginBottom: 20,
          }}
        />

        {/* 사용 목적 */}
        {data.usage_occasions.length > 0 && (
          <div className="relative z-10 mb-5">
            <p
              style={{
                color: "#8a8278",
                fontSize: 11,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              사용 목적
            </p>
            <div className="flex flex-wrap gap-2">
              {data.usage_occasions.map((o) => (
                <span
                  key={o}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 9999,
                    padding: "4px 10px",
                    fontSize: 12,
                    color: "#c9a96e",
                  }}
                >
                  {OCCASION_EMOJI[o] || ""} {o}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 선호 향 */}
        {data.preferred_scents.length > 0 && (
          <div className="relative z-10 mb-5">
            <p
              style={{
                color: "#8a8278",
                fontSize: 11,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              선호하는 향
            </p>
            <div className="flex flex-wrap gap-2">
              {data.preferred_scents.map((s) => (
                <span
                  key={s}
                  style={{
                    background: "rgba(201,169,110,0.08)",
                    border: "1px solid rgba(201,169,110,0.25)",
                    borderRadius: 9999,
                    padding: "4px 10px",
                    fontSize: 12,
                    color: "#e8d5b0",
                  }}
                >
                  {SCENT_EMOJI[s] || ""} {s.split("(")[0]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 라이프 패턴 */}
        {data.life_pattern && (
          <div className="relative z-10 mb-5">
            <p
              style={{
                color: "#8a8278",
                fontSize: 11,
                letterSpacing: "0.1em",
                marginBottom: 6,
              }}
            >
              나의 일상
            </p>
            <p style={{ color: "#c0b49a", fontSize: 13, lineHeight: 1.6 }}>
              {data.life_pattern}
            </p>
          </div>
        )}

        {/* 나의 이미지 & 원하는 무드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
            position: "relative",
            zIndex: 10,
          }}
        >
          {data.self_image && (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <p
                style={{
                  color: "#8a8278",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                나의 이미지
              </p>
              <p style={{ color: "#e0d9d0", fontSize: 13 }}>
                {data.self_image}
              </p>
            </div>
          )}
          {data.desired_mood && (
            <div
              style={{
                background: "rgba(201,169,110,0.05)",
                border: "1px solid rgba(201,169,110,0.15)",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <p
                style={{
                  color: "#8a8278",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                원하는 무드
              </p>
              <p style={{ color: "#c9a96e", fontSize: 13 }}>
                {data.desired_mood}
              </p>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)",
            marginBottom: 16,
          }}
        />

        {/* 힐링 방법 */}
        {data.healing_methods.length > 0 && (
          <div className="relative z-10">
            <p
              style={{
                color: "#8a8278",
                fontSize: 11,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              나의 힐링
            </p>
            <div className="flex flex-wrap gap-2">
              {data.healing_methods.map((h) => (
                <span
                  key={h}
                  style={{
                    background: "rgba(0,60,51,0.2)",
                    border: "1px solid rgba(0,100,80,0.3)",
                    borderRadius: 9999,
                    padding: "3px 10px",
                    fontSize: 11,
                    color: "#7ec8b8",
                  }}
                >
                  {h}
                </span>
              ))}
              {data.healing_other && (
                <span
                  style={{
                    background: "rgba(0,60,51,0.2)",
                    border: "1px solid rgba(0,100,80,0.3)",
                    borderRadius: 9999,
                    padding: "3px 10px",
                    fontSize: 11,
                    color: "#7ec8b8",
                  }}
                >
                  {data.healing_other}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 워터마크 */}
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            color: "rgba(201,169,110,0.3)",
            fontSize: 11,
            letterSpacing: "0.2em",
          }}
        >
          YEOUN{shareCode ? ` · ${shareCode.toUpperCase()}` : ""}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col gap-3 w-full max-w-[400px]">
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 9999,
              background: saving
                ? 'rgba(201,169,110,0.3)'
                : 'linear-gradient(135deg, #c9a96e, #a07850)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              border: 'none',
              fontFamily: 'inherit',
              letterSpacing: '0.03em',
            }}
          >
            {saving ? '저장 중…' : saved ? '✓ 저장 완료' : '이미지로 저장'}
          </motion.button>
          {shareCode && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyLink}
              style={{
                flex: 1,
                padding: '14px 0',
                borderRadius: 9999,
                background: 'transparent',
                color: '#e8d5b0',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid rgba(201,169,110,0.35)',
                fontFamily: 'inherit',
              }}
            >
              {copied ? '✓ 복사됨' : '링크 복사'}
            </motion.button>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onRestart}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 9999,
            background: 'transparent',
            color: '#8a8278',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.12)',
            fontFamily: 'inherit',
          }}
        >
          처음으로
        </motion.button>
      </div>
    </div>
  );
}
