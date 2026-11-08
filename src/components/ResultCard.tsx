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
  "인센스(차분한 향)": "🕯️",
  "앰버(묵직한향)": "🟠",
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
        backgroundColor: "#f8f3eb",
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
            "linear-gradient(180deg, #fffdf9 0%, #f8f3eb 100%)",
          borderRadius: 24,
          border: "1px solid rgba(141,104,64,0.28)",
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
              "radial-gradient(circle, rgba(196,163,106,0.28) 0%, transparent 70%)",
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
              "radial-gradient(circle, rgba(255,236,214,0.9) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* 헤더 */}
        <div className="relative z-10 mb-6">
          <p
            style={{
              color: "#8d6840",
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
              color: "#2b241c",
              letterSpacing: "-0.02em",
            }}
          >
            {data.name || "나"}의 향
          </h2>
          <p style={{ color: "#7a6f64", fontSize: 13, marginTop: 4 }}>
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
              "linear-gradient(90deg, transparent, rgba(141,104,64,0.35), transparent)",
            marginBottom: 20,
          }}
        />

        {/* 사용 목적 */}
        {data.usage_occasions.length > 0 && (
          <div className="relative z-10 mb-5">
            <p
              style={{
                color: "#7a6f64",
                fontSize: 11,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              사용 목적
            </p>
            <div className="flex flex-col gap-2">
              {data.usage_occasions.map((o, index) => (
                <span
                  key={o}
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(141,104,64,0.2)",
                    borderRadius: 9999,
                    padding: "6px 12px",
                    fontSize: 12,
                    color: "#6b4e2e",
                  }}
                >
                  {index + 1}. {OCCASION_EMOJI[o] || ""} {o}
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
                color: "#7a6f64",
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
                    background: "rgba(141,104,64,0.08)",
                    border: "1px solid rgba(141,104,64,0.22)",
                    borderRadius: 9999,
                    padding: "4px 10px",
                    fontSize: 12,
                    color: "#6b4e2e",
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
                color: "#7a6f64",
                fontSize: 11,
                letterSpacing: "0.1em",
                marginBottom: 6,
              }}
            >
              나의 일상
            </p>
            <p style={{ color: "#2b241c", fontSize: 13, lineHeight: 1.6 }}>
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
                background: "#fff",
                border: "1px solid rgba(43,36,28,0.08)",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <p
                style={{
                  color: "#7a6f64",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                나의 이미지
              </p>
              <p style={{ color: "#2b241c", fontSize: 13 }}>
                {data.self_image}
              </p>
            </div>
          )}
          {data.desired_mood && (
            <div
              style={{
                background: "rgba(141,104,64,0.08)",
                border: "1px solid rgba(141,104,64,0.18)",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <p
                style={{
                  color: "#7a6f64",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                원하는 무드
              </p>
              <p style={{ color: "#6b4e2e", fontSize: 13 }}>
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
              "linear-gradient(90deg, transparent, rgba(141,104,64,0.28), transparent)",
            marginBottom: 16,
          }}
        />

        {/* 힐링 방법 */}
        {data.healing_methods.length > 0 && (
          <div className="relative z-10">
            <p
              style={{
                color: "#7a6f64",
                fontSize: 11,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              나의 힐링
            </p>
            <div className="flex flex-col gap-2">
              {data.healing_methods.map((h, index) => (
                <span
                  key={h}
                  style={{
                    background: "rgba(47,107,90,0.08)",
                    border: "1px solid rgba(47,107,90,0.18)",
                    borderRadius: 9999,
                    padding: "6px 12px",
                    fontSize: 12,
                    color: "#2f6b5a",
                  }}
                >
                  {index + 1}. {h}
                  {h === "기타" && data.healing_other ? ` · ${data.healing_other}` : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 워터마크 */}
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            color: "rgba(141,104,64,0.55)",
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
                ? 'var(--color-button-shadow)'
                : 'var(--color-button)',
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
                color: '#6b4e2e',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid rgba(141,104,64,0.35)',
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
            color: '#7a6f64',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            border: '1px solid rgba(43,36,28,0.14)',
            fontFamily: 'inherit',
          }}
        >
          처음으로
        </motion.button>
      </div>
    </div>
  );
}
