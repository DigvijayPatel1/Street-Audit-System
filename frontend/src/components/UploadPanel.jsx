import { useEffect, useState } from "react";
import Button from "./Button";
import "../styles/components.css";

export default function UploadPanel({ setResult, variant = "default", resetToken = 0 }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFile(null);
    setError("");
    setLoading(false);
  }, [resetToken]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await fetch(import.meta.env.VITE_API_URL + "/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (uploadError) {
      setError("Unable to analyze the image. Try again.");
      console.error(uploadError);
    } finally {
      setLoading(false);
    }
  };

  const isHero = variant === "hero";

  return (
    <div className={isHero ? "upload-inline" : "panel"}>
      {!isHero && (
        <>
          <h2>Road Hazard System</h2>
          <p>Upload a road image for AI analysis</p>
        </>
      )}

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className={isHero ? "upload-inline-file" : ""}
      />
      {file && <small className="panel-note">Selected: {file.name}</small>}
      {error && <small className="panel-error">{error}</small>}

      <Button
        text={loading ? "Analyzing..." : isHero ? "Start Audit" : "Analyze Image"}
        onClick={handleUpload}
        disabled={!file || loading}
      />
    </div>
  );
}
