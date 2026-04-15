import "../styles/components.css";

export default function HeroSection({ result }) {
  return (
    <div className="hero">
      <div className="big-number">AI</div>
      {!result && <p className="hero-placeholder">Upload an image to see AI output</p>}

      {result && (
        <img
          src={`data:image/jpeg;base64,${result.image}`}
          alt="Analyzed road preview"
          className="hero-image"
        />
      )}
    </div>
  );
}
