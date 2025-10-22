import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { initializeAnalytics, setupErrorTracking, platformAnalytics } from "./services/analytics";

// Initialize analytics and error tracking
initializeAnalytics();
setupErrorTracking();
platformAnalytics.trackPerformance();

createRoot(document.getElementById("root")!).render(<App />);
