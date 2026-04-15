import "../styles/layout.css";

export default function Layout({ left, center, right }) {
  return (
    <div className="layout">
      <div className="left">{left}</div>
      <div className="center">{center}</div>
      <div className="right">{right}</div>
    </div>
  );
}
