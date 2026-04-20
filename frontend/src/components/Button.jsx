import "../styles/components.css";

export default function Button({ text, onClick, type = "button", disabled = false }) {
  return (
    <button className="btn" onClick={onClick} type={type} disabled={disabled}>
      {text}
    </button>
  );
}
