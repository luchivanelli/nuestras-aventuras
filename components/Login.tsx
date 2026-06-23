"use client";
import { useState, useRef, useEffect } from "react";
import { Heart, Lock } from "lucide-react";

interface LoginProps {
  onUnlock: () => void;
}

const SECRET_DATE = "25/05/2026";

export default function Login({ onUnlock }: LoginProps) {
  const [parts, setParts] = useState(["", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  function handleChange(i: number, val: string) {
    const clean = val.replace(/\D/g, "");
    const maxLen = i === 2 ? 4 : 2;
    const sliced = clean.slice(0, maxLen);
    const next = [...parts];
    next[i] = sliced;
    setParts(next);
    setError(false);
    if (sliced.length === maxLen && i < 2) {
      refs[i + 1].current?.focus();
    }
  }

  function handleSubmit() {
    const full = `${parts[0]}/${parts[1]}/${parts[2]}`;
    if (full === SECRET_DATE) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setParts(["", "", ""]);
      refs[0].current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Backspace" && parts[i] === "" && i > 0) {
      refs[i - 1].current?.focus();
    }
  }

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #F9EEF1 0%, #FFF5F7 50%, #F0F4F8 100%)" }}>

      {/* Floating hearts bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {["10%", "85%", "50%", "25%", "70%"].map((left, i) => (
          <div key={i} className="absolute text-2xl opacity-10 float"
            style={{ left, top: `${15 + i * 17}%`, animationDelay: `${i * 0.6}s` }}>
            ❤️
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
            style={{ background: "linear-gradient(135deg, #C9788A, #E8A4B0)" }}>
            <Heart className="w-9 h-9 text-white heartbeat" fill="white" />
          </div>
          <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: "#2D1F26" }}>
            Nuestra Lista de<br />Aventuras
          </h1>
          <p className="text-sm" style={{ color: "#8B7D82" }}>
            Este espacio es solo nuestro 🔒
          </p>
        </div>

        {/* Card */}
        <div className={`rounded-3xl p-8 shadow-xl ${shake ? "animate-bounce" : ""}`}
          style={{ background: "white", boxShadow: "0 20px 60px rgba(201,120,138,0.15)" }}>
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4" style={{ color: "#C9788A" }} />
            <p className="text-sm font-medium" style={{ color: "#8B7D82" }}>
              ¿Cuándo nos pusimos de novios?
            </p>
          </div>

          {/* Date inputs */}
          <div className="flex items-center gap-3 mb-2">
            {[
              { placeholder: "DD", maxLen: 2 },
              { placeholder: "MM", maxLen: 2 },
              { placeholder: "AAAA", maxLen: 4 },
            ].map(({ placeholder, maxLen }, i) => (
              <div key={i} className="flex-1">
                <input
                  ref={refs[i]}
                  type="text"
                  inputMode="numeric"
                  placeholder={placeholder}
                  value={parts[i]}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  className="w-full text-center text-xl font-semibold rounded-2xl border-2 py-4 outline-none transition-all"
                  style={{
                    borderColor: error ? "#C9788A" : parts[i] ? "#C9788A" : "#F0E0E4",
                    background: error ? "#FEF0F2" : parts[i] ? "#FFF5F7" : "#FAFAFA",
                    color: "#2D1F26",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                {i < 2 && (
                  <div className="absolute" style={{ marginTop: "-2.5rem", marginLeft: "calc(100% + 2px)", width: "12px", textAlign: "center", color: "#C9788A", fontSize: "20px" }}>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-center mb-6" style={{ color: "#C9788A", opacity: error ? 1 : 0, transition: "opacity 0.2s" }}>
            Esa no es la fecha especial 💔
          </p>

          <button
            onClick={handleSubmit}
            disabled={parts.some(p => p === "")}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all"
            style={{
              background: parts.every(p => p !== "")
                ? "linear-gradient(135deg, #C9788A, #E8A4B0)"
                : "#E8D5D8",
              cursor: parts.every(p => p !== "") ? "pointer" : "not-allowed",
              boxShadow: parts.every(p => p !== "") ? "0 8px 24px rgba(201,120,138,0.35)" : "none",
            }}>
            Entrar a nuestro espacio ❤️
          </button>
        </div>
      </div>
    </div>
  );
}
