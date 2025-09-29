import React from "react";
import { createRoot } from "react-dom/client";
import PersonaSelector from "./components/PersonaSelector.tsx";

const root = createRoot(document.getElementById("persona-selector"));
root.render(<PersonaSelector />);
