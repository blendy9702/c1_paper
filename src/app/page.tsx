"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import {
  QuizTextInput,
  QuizTextarea,
  CheckboxOption,
  MbtiPicker,
} from "@/components/QuizInput";
import { type QuizResponse } from "@/lib/supabase";
import { saveQuizAndNotify } from "@/lib/notify";

// ─── 상수 ───────────────────────────────────────────────────────────
const TOTAL_STEPS = 6;

const USAGE_OCCASIONS = [
  "미래의 나를 위한 선물",
  "이성과의 만남",
  "중요한 만남을 위해",
  "평범한 일상을 위해",
  "사람들에게 기억되기 위해",
];

const PREFERRED_SCENTS = [
  "플로럴(꽃향)",
  "시트러스(상큼한 향)",
  "파우더리(비누향)",
  "우디(나무향)",
  "머스크(성숙한향)",
  "아쿠아(물향)",
  "소피(비누향)",
  "그린티(풀향)",
  "바닐라(달콤한 향)",
  "허브(힐링의 향)",
  "코튼(린넨향)",
  "인센스(차분한 향)",
  "앰버(묵직한향)",
];

const HEALING_METHODS = [
  "가족, 지인과의 소통",
  "취미생활",
  "충분한 수면",
  "멘토나 전문가와 상담",
  "기타",
];

// ─── 초기값 ─────────────────────────────────────────────────────────
const INITIAL: QuizResponse = {
  name: "",
  occupation: "",
  birth_year: null,
  mbti: "",
  usage_occasions: [],
  life_pattern: "",
  preferred_scents: [],
  healing_methods: [],
  healing_other: "",
  self_image: "",
  desired_mood: "",
};

// ─── 타입 ────────────────────────────────────────────────────────────
type Page = "landing" | "quiz";

// ─── 유틸 ────────────────────────────────────────────────────────────
function toggleArray(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function withoutDigits(value: string) {
  return value.replace(/[0-9０-９]/g, "");
}

function ageToBirthYear(ageText: string) {
  const digits = ageText.replace(/\D/g, "").slice(0, 3);
  const age = Number(digits);
  if (!digits || age < 1 || age > 120) return null;
  return new Date().getFullYear() - age + 1;
}

// ─── 질문 헤더 컴포넌트 ──────────────────────────────────────────────
function QuestionHeader({
  num,
  title,
  sub,
}: {
  num: number;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-6">
      <span
        style={{
          display: "inline-block",
          color: "#8d6840",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Question {num}
      </span>
      <h2
        style={{
          fontSize: "clamp(20px, 5vw, 26px)",
          fontWeight: 400,
          color: "#2b241c",
          lineHeight: 1.4,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            marginTop: 6,
            color: "#7a6f64",
            fontSize: 13,
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

const NAV_BTN_STYLE = {
  height: 50,
  boxSizing: "border-box" as const,
  borderRadius: 9999,
  fontSize: 15,
  fontFamily: "inherit",
  letterSpacing: "0.04em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

function NextButton({
  onClick,
  disabled,
  label = "다음으로",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...NAV_BTN_STYLE,
        width: "100%",
        background: disabled
          ? "rgba(43,36,28,0.06)"
          : "linear-gradient(135deg, #c4a36a 0%, #8d6840 100%)",
        color: disabled ? "#b3a89e" : "#fff",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        border: disabled ? "1px solid rgba(43,36,28,0.08)" : "none",
        transition: "all 0.2s",
      }}
    >
      {label}
    </motion.button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...NAV_BTN_STYLE,
        flex: "0 0 88px",
        width: 88,
        background: "transparent",
        color: "#7a6f64",
        fontWeight: 500,
        cursor: "pointer",
        border: "1px solid rgba(43,36,28,0.14)",
      }}
    >
      이전
    </button>
  );
}

function StepNav({
  onBack,
  onNext,
  disabled,
  label,
}: {
  onBack?: () => void;
  onNext: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{ marginTop: 48 }}
    >
      {onBack && <BackButton onClick={onBack} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <NextButton onClick={onNext} disabled={disabled} label={label} />
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [page, setPage] = useState<Page>("landing");
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<QuizResponse>(INITIAL);
  const [ageText, setAgeText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      goTo(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { shareCode } = await saveQuizAndNotify(form);
      router.push(`/r/${shareCode}`);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  // 각 스텝의 필수 조건 체크
  const canProceed = (() => {
    switch (step) {
      case 1:
        return form.name.trim().length > 0;
      case 2:
        return form.usage_occasions.length === USAGE_OCCASIONS.length;
      case 3:
        return form.life_pattern.trim().length > 0;
      case 4:
        return form.preferred_scents.length > 0;
      case 5:
        return (
          form.healing_methods.length === HEALING_METHODS.length &&
          (!form.healing_methods.includes("기타") ||
            form.healing_other.trim().length > 0)
        );
      case 6:
        return (
          form.self_image.trim().length > 0 &&
          form.desired_mood.trim().length > 0
        );
      default:
        return true;
    }
  })();

  // ── 랜딩 페이지 ─────────────────────────────────────────────────
  if (page === "landing") {
    return (
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(212,180,131,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(255,244,230,0.95) 0%, transparent 50%), #f6f1e8",
          padding: "40px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 원 */}
        <div
          style={{
            position: "absolute",
            width: "50vmax",
            height: "50vmax",
            borderRadius: "50%",
            border: "1px solid rgba(141,104,64,0.16)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "70vmax",
            height: "70vmax",
            borderRadius: "50%",
            border: "1px solid rgba(141,104,64,0.1)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: "center", position: "relative", zIndex: 1 }}
        >
          {/* 상단 레이블 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              color: "#8d6840",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            YEOUN Perfume Curation
          </motion.p>

          {/* 메인 카피 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            style={{
              fontSize: "clamp(36px, 10vw, 64px)",
              fontWeight: 200,
              color: "#2b241c",
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
              marginBottom: 16,
            }}
          >
            나만의 여운을
            <br />
            <span
              style={{
                fontWeight: 400,
                background: "linear-gradient(135deg, #8d6840, #c4a36a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              남기다
            </span>
          </motion.h1>

          {/* 서브 카피 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{
              color: "#7a6f64",
              fontSize: "clamp(14px, 3.5vw, 16px)",
              lineHeight: 1.7,
              marginBottom: 48,
              maxWidth: 300,
              margin: "0 auto 48px",
            }}
          >
            당신의 이야기를 담은
            <br />
            향을 찾아드립니다
          </motion.p>

          {/* 시작 버튼 */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPage("quiz")}
            style={{
              padding: "16px 48px",
              borderRadius: 9999,
              background: "linear-gradient(135deg, #c4a36a 0%, #8d6840 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              fontFamily: "inherit",
              letterSpacing: "0.08em",
              boxShadow: "0 10px 28px rgba(141,104,64,0.22)",
            }}
          >
            시작하기
          </motion.button>
        </motion.div>
      </main>
    );
  }

  // ── 퀴즈 페이지 ─────────────────────────────────────────────────
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#f6f1e8",
        paddingBottom: 40,
      }}
    >
      <ProgressBar current={step} total={TOTAL_STEPS} />

      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "max(92px, calc(env(safe-area-inset-top, 0px) + 76px)) 20px 40px",
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* ── 스텝 1: 기본 정보 ── */}
            {step === 1 && (
              <div>
                <QuestionHeader num={1} title="어떤 사람이 사용하나요?" />
                <div className="flex flex-col gap-4">
                  <QuizTextInput
                    label="이름"
                    placeholder="이름을 입력해주세요"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: withoutDigits(e.target.value) })
                    }
                  />
                  <QuizTextInput
                    label="직업"
                    placeholder="직업을 입력해주세요"
                    value={form.occupation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        occupation: withoutDigits(e.target.value),
                      })
                    }
                  />
                  <QuizTextInput
                    label="나이"
                    placeholder="나이를 입력해주세요"
                    inputMode="numeric"
                    value={ageText}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
                      setAgeText(digits);
                      setForm({ ...form, birth_year: ageToBirthYear(digits) });
                    }}
                  />
                  <MbtiPicker
                    value={form.mbti}
                    onChange={(mbti) => setForm({ ...form, mbti })}
                  />
                </div>
                <StepNav onNext={handleNext} disabled={!canProceed} />
              </div>
            )}

            {/* ── 스텝 2: 사용 목적 ── */}
            {step === 2 && (
              <div>
                <QuestionHeader
                  num={2}
                  title="언제 사용하나요?"
                  sub="중요한 순서대로 모두 선택해주세요. 먼저 고른 항목이 1순위입니다."
                />
                <p style={{ color: "#8d6840", fontSize: 13, marginBottom: 12 }}>
                  {form.usage_occasions.length} / {USAGE_OCCASIONS.length}
                </p>
                <div className="flex flex-col gap-3">
                  {USAGE_OCCASIONS.map((item) => {
                    const rank = form.usage_occasions.indexOf(item);
                    return (
                      <CheckboxOption
                        key={item}
                        label={item}
                        rank={rank >= 0 ? rank + 1 : undefined}
                        checked={rank >= 0}
                        onChange={() =>
                          setForm({
                            ...form,
                            usage_occasions: toggleArray(
                              form.usage_occasions,
                              item,
                            ),
                          })
                        }
                      />
                    );
                  })}
                </div>
                <StepNav
                  onBack={() => goTo(step - 1)}
                  onNext={handleNext}
                  disabled={!canProceed}
                />
              </div>
            )}

            {/* ── 스텝 3: 라이프 패턴 ── */}
            {step === 3 && (
              <div>
                <QuestionHeader
                  num={3}
                  title="당신의 라이프 패턴은 무엇인가요?"
                  sub="OOTD에 맞는 향을 만들기 위함입니다 · ex) 학교, 동아리, 직장, 데이트 등"
                />
                <QuizTextarea
                  placeholder="나의 일상적인 생활 패턴을 적어주세요"
                  value={form.life_pattern}
                  onChange={(e) =>
                    setForm({ ...form, life_pattern: e.target.value })
                  }
                />
                <StepNav
                  onBack={() => goTo(step - 1)}
                  onNext={handleNext}
                  disabled={!canProceed}
                />
              </div>
            )}

            {/* ── 스텝 4: 선호 향 ── */}
            {step === 4 && (
              <div>
                <QuestionHeader
                  num={4}
                  title="평소 선호하는 향은?"
                  sub="복수 선택 가능합니다"
                />
                <div className="flex flex-col gap-2.5">
                  {PREFERRED_SCENTS.map((item) => (
                    <CheckboxOption
                      key={item}
                      label={item}
                      checked={form.preferred_scents.includes(item)}
                      onChange={() =>
                        setForm({
                          ...form,
                          preferred_scents: toggleArray(
                            form.preferred_scents,
                            item,
                          ),
                        })
                      }
                    />
                  ))}
                </div>
                <StepNav
                  onBack={() => goTo(step - 1)}
                  onNext={handleNext}
                  disabled={!canProceed}
                />
              </div>
            )}

            {/* ── 스텝 5: 힐링 방법 ── */}
            {step === 5 && (
              <div>
                <QuestionHeader
                  num={5}
                  title="나만의 힐링 방법은?"
                  sub="향은 직접적으로 사람의 감정에 영향을 미칩니다. 중요한 순서대로 모두 선택해주세요."
                />
                <p style={{ color: "#8d6840", fontSize: 13, marginBottom: 12 }}>
                  {form.healing_methods.length} / {HEALING_METHODS.length}
                </p>
                <div className="flex flex-col gap-3">
                  {HEALING_METHODS.map((item) => {
                    const rank = form.healing_methods.indexOf(item);
                    return (
                    <div key={item}>
                      <CheckboxOption
                        label={item}
                        rank={rank >= 0 ? rank + 1 : undefined}
                        checked={rank >= 0}
                        onChange={() => {
                          const next = toggleArray(form.healing_methods, item);
                          setForm({
                            ...form,
                            healing_methods: next,
                            healing_other:
                              item === "기타" && !next.includes("기타")
                                ? ""
                                : form.healing_other,
                          });
                        }}
                      />
                      {item === "기타" &&
                        form.healing_methods.includes("기타") && (
                          <div className="mt-2 ml-0">
                            <QuizTextInput
                              placeholder="직접 입력해주세요"
                              value={form.healing_other}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  healing_other: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                    </div>
                    );
                  })}
                </div>
                <StepNav
                  onBack={() => goTo(step - 1)}
                  onNext={handleNext}
                  disabled={!canProceed}
                />
              </div>
            )}

            {/* ── 스텝 6+7: 이미지 & 무드 (한 레이아웃) ── */}
            {step === 6 && (
              <div>
                <QuestionHeader num={6} title="나를 표현해주세요" />

                <div className="flex flex-col gap-6">
                  {/* 6번 */}
                  <div>
                    <p
                      style={{
                        color: "#8d6840",
                        fontSize: 11,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        marginBottom: 10,
                      }}
                    >
                      Q6 — 내가 생각하는 나의 이미지
                    </p>
                    <QuizTextarea
                      placeholder="예) 따뜻하고 감성적인, 시크하고 독립적인..."
                      value={form.self_image}
                      onChange={(e) =>
                        setForm({ ...form, self_image: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  {/* 구분선 */}
                  <div
                    style={{
                      height: 1,
                      background:
                        "linear-gradient(90deg, transparent, rgba(141,104,64,0.28), transparent)",
                    }}
                  />

                  {/* 7번 */}
                  <div>
                    <p
                      style={{
                        color: "#8d6840",
                        fontSize: 11,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        marginBottom: 10,
                      }}
                    >
                      Q7 — 앞으로 내가 갖고 싶은 무드
                    </p>
                    <QuizTextarea
                      placeholder="예) 자신감 넘치는, 여유롭고 우아한, 신비로운..."
                      value={form.desired_mood}
                      onChange={(e) =>
                        setForm({ ...form, desired_mood: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <StepNav
                  onBack={() => goTo(step - 1)}
                  onNext={handleNext}
                  disabled={!canProceed || submitting}
                  label={submitting ? "제출 중…" : "완성하기"}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
