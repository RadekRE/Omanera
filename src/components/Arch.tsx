/** Obloukový motiv značky. Barvy z tokenů přes currentColor; čáry se při načtení „nakreslí". */
export default function Arch({ className = "", rings = 4 }: { className?: string; rings?: number }) {
  return (
    <svg className={`arch ${className}`} viewBox="0 0 400 460" fill="none" aria-hidden="true" focusable="false">
      {Array.from({ length: rings }).map((_, i) => {
        const inset = 20 + i * 42;
        const w = 400 - inset * 2;
        const d = `M${inset} 460 V${inset + w / 2} A${w / 2} ${w / 2} 0 0 1 ${400 - inset} ${inset + w / 2} V460`;
        return <path key={i} d={d} pathLength={1} style={{ animationDelay: `${i * 160}ms` }} strokeWidth={i === 0 ? 2 : 1.5} />;
      })}
    </svg>
  );
}
