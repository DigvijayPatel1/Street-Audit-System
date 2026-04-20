import "../styles/components.css";
import bgImage from "../assets/background.jpg";

function getHazardType(reasons = []) {
  const hasCanopy = reasons.includes("CANOPY");
  const hasClearance = reasons.includes("HEIGHT") || reasons.includes("NEAR POLE");

  if (hasCanopy && hasClearance) return "Mixed (Canopy + Clearance)";
  if (hasCanopy) return "Canopy Risk";
  if (hasClearance) return "Clearance Risk";
  return "General Risk";
}

export default function StatsPanel({ result }) {
  return (
    <section className="stats-showcase" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="stats-overlay">
        <h2>Result Side</h2>
        {!result && <p>Run an audit to see live counts and hazard confidence on this panel.</p>}

        {result && (
          <>
            <div className="stats-results">
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

            <img
              src={`data:image/jpeg;base64,${result.image}`}
              alt="Analyzed road preview"
              className="stats-final-image"
            />
          </>
        )}
      </div>
    </section>
  );
}
