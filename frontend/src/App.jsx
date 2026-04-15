import { useState } from "react";
import Layout from "./components/Layout";
import HeroSection from "./components/HeroSection";
import UploadPanel from "./components/UploadPanel";
import ResultPanel from "./components/ResultPanel";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <Layout
      left={<UploadPanel setResult={setResult} />}
      center={<HeroSection result={result} />}
      right={<ResultPanel result={result} />}
    />
  );
}