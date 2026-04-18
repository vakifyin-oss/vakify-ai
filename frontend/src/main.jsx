import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles.css";

const clerkAppearance = {
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "#101010",
    colorInputBackground: "#080808",
    colorInputText: "#f5f5f5",
    colorText: "#f5f5f5",
    colorTextSecondary: "#adadad",
    borderRadius: "12px",
  },
  elements: {
    card: "cl-card",
    headerTitle: "cl-header-title",
    headerSubtitle: "cl-header-subtitle",
    socialButtonsBlockButton: "cl-social-btn",
    dividerLine: "cl-divider-line",
    dividerText: "cl-divider-text",
    formButtonPrimary: "cl-primary-btn",
    formFieldInput: "cl-input",
    footerActionText: "cl-footer-text",
    footerActionLink: "cl-footer-link",
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider afterSignOutUrl="/" appearance={clerkAppearance}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
