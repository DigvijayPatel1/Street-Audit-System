import "../styles/components.css";
import UploadPanel from "./UploadPanel";

export default function HeroSection({ result, setResult, onHome, resetToken }) {
  return (
    <div className="hero">
      <div className="hero-top">
        <div className="brand-mark">
          <img src="/Logo_of_NIT_Calicut.svg" alt="NIT logo" className="brand-logo" />
        </div>

        <nav className="hero-nav">
          <button type="button" onClick={onHome}>Home</button>
        </nav>
      </div>

      <div className="hero-body">
        <div className="hero-copy">
          <h1>No Shortcuts, Just Safer Roads.</h1>
          <p>Upload an image, run audit, and review complete hazard details instantly.</p>
          <UploadPanel setResult={setResult} variant="hero" resetToken={resetToken} />
        </div>
      </div>
    </div>
  );
}
