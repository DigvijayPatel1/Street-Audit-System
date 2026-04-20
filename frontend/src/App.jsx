import { useState } from "react";
import Layout from "./components/Layout";
import HeroSection from "./components/HeroSection";
import StatsPanel from "./components/StatsPanel";

export default function App() {
  const [result, setResult] = useState(null);
  const [resetToken, setResetToken] = useState(0);

  const handleHomeReset = () => {
    setResult(null);
    setResetToken((prev) => prev + 1);
  };

  return (
    <Layout
      center={<HeroSection result={result} setResult={setResult} onHome={handleHomeReset} resetToken={resetToken} />}
      right={<StatsPanel result={result} />}
    />
  );
}
