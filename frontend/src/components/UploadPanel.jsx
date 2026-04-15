import Button from "./Button";
import "../styles/components.css";

export default function UploadPanel({ setResult }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(import.meta.env.VITE_API_URL + "/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="panel">
      <h2>Road Hazard System</h2>
      <p>Upload image for AI analysis</p>

      <input type="file" onChange={handleUpload} />

      <Button text="Analyze Image" />
    </div>
  );
}
