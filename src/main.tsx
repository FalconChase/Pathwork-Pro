import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initDb } from "./db/client";

// Run migrations once at startup, before the tree mounts.
initDb().finally(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
