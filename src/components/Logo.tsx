export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const tactical = variant === "light" ? "text-white" : "text-ink";
  const training = variant === "light" ? "text-white/80" : "text-ink/70";
  return (
    <div className="leading-none select-none">
      <div
        className={`${tactical} font-display italic font-extrabold tracking-tight text-3xl md:text-4xl`}
        style={{ transform: "skewX(-10deg)", fontStretch: "condensed" }}
      >
        TACTICAL
      </div>
      <div
        className={`${training} font-display not-italic text-[0.65rem] md:text-xs font-light tracking-[0.55em] text-right -mt-1`}
      >
        TRAINING
      </div>
    </div>
  );
}
