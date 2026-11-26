import * as React from "react"

export function TrycoreLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 230 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Trycore"
    >
      {/* Anillo exterior azul marino (se adapta en dark mode) */}
      <circle
        cx="28"
        cy="28"
        r="19"
        stroke="currentColor"
        strokeWidth="10"
        className="text-[#18264F] dark:text-slate-100"
      />
      {/* Línea diagonal y nodos turquesa */}
      <line
        x1="13"
        y1="40"
        x2="43"
        y2="16"
        stroke="#62C3D0"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <circle cx="28" cy="28" r="8" fill="#62C3D0" />
      <circle cx="43" cy="16" r="5.5" fill="#62C3D0" />
      <circle cx="13" cy="40" r="5.5" fill="#62C3D0" />

      {/* Logotipo "trycore" */}
      <text
        x="60"
        y="40"
        fill="currentColor"
        className="text-[#18264F] dark:text-slate-100"
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: "38px",
          letterSpacing: "-0.03em",
        }}
      >
        trycore
      </text>
    </svg>
  )
}
