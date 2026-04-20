import "../styles/layout.css";

export default function Layout({ left, center, right }) {
  const hasLeft = Boolean(left);

  return (
    <div className={`layout ${hasLeft ? "" : "no-left"}`.trim()}>
      {hasLeft && <div className="left">{left}</div>}
      <div className="center">{center}</div>
      <div className="right">{right}</div>
    </div>
  );
}
