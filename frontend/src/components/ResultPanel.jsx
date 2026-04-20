import "../styles/components.css";

function getHazardType(reasons = []) {
  const hasCanopy = reasons.includes("CANOPY");
  const hasClearance = reasons.includes("HEIGHT") || reasons.includes("NEAR POLE");

  if (hasCanopy && hasClearance) return "Mixed (Canopy + Clearance)";
  if (hasCanopy) return "Canopy Risk";
  if (hasClearance) return "Clearance Risk";
  return "General Risk";
}

export default function ResultPanel({ result }) {
  if (!result) return null;

  return (
    <div className="panel audit-results">
      <h3>Analysis</h3>

      <div className="stat">Poles: {result.poles}</div>
      <div className="stat">Trees: {result.trees}</div>
      <div className="stat danger">Hazards: {result.hazards}</div>

      <div className="hazard-list">
        {result.hazard_details.map((h, i) => (
          <div key={i} className="hazard-item">
            <strong>{h.tree}</strong>
            <span>Type: {getHazardType(h.reasons)}</span>
            <span>{h.reasons.join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
