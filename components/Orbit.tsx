/**
 * Decoration for the hero: tools I use, slowly orbiting. Pure CSS, hidden from
 * screen readers, and still when the visitor prefers reduced motion.
 */
const INNER = ["Node.js", "Python", "PostgreSQL", "Redis"];
const OUTER = ["TypeScript", "PyTorch", "SHAP", "Docker", "FastAPI", "MongoDB"];

function Ring({ items, className }: { items: string[]; className: string }) {
  return (
    <div className={`orbit-ring ${className}`}>
      {items.map((item, i) => (
        <span
          key={item}
          className="orbit-chip"
          style={{ "--angle": `${(360 / items.length) * i}deg` } as React.CSSProperties}
        >
          <span>{item}</span>
        </span>
      ))}
    </div>
  );
}

export function Orbit() {
  return (
    <div className="orbit" aria-hidden="true">
      <Ring items={OUTER} className="orbit-outer" />
      <Ring items={INNER} className="orbit-inner" />
      <span className="orbit-core">{"{ }"}</span>
    </div>
  );
}
