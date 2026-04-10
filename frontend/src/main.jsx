import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider afterSignOutUrl="/">
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
