/**
 * A slowly scrolling band of skills. The list is read once by screen readers;
 * the repeated copy that makes the loop seamless is hidden from them.
 */
export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee">
      <div className="marquee-track">
        <ul aria-label="Tools I work with">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <ul aria-hidden="true">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
