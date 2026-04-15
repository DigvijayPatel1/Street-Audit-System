import "../styles/components.css";

export default function ResultPanel({ result }) {
  if (!result) return null;

  return (
    <div className="panel">
      <h3>Analysis</h3>

      <div className="stat">Poles: {result.poles}</div>
      <div className="stat">Trees: {result.trees}</div>
      <div className="stat danger">Hazards: {result.hazards}</div>

      <div className="hazard-list">
        {result.hazard_details.map((h, i) => (
          <div key={i} className="hazard-item">
            <strong>{h.tree}</strong>
            <span>{h.reasons.join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
