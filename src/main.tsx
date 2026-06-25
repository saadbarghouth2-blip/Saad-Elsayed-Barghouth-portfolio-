import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { shouldReduceEffects } from "@/lib/perf";

const legacyHashPath = window.location.hash.match(/^#(\/.*)$/)?.[1];
if (legacyHashPath) {
  window.history.replaceState(null, "", legacyHashPath + window.location.search);
}

// Hint CSS to avoid expensive effects on constrained devices / connections.
const perfOverride = new URLSearchParams(window.location.search).get("perf");
if (perfOverride === "low") {
  document.documentElement.dataset.perf = "low";
} else if (perfOverride === "full") {
  delete document.documentElement.dataset.perf;
} else if (shouldReduceEffects()) {
  document.documentElement.dataset.perf = "low";
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
