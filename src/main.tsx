import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import "@/index.css";

const root_el = document.getElementById("root");
if (!root_el) {
  throw new Error("root missing");
}

createRoot(root_el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
