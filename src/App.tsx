import { useEffect } from "react";
import { FarmDashboard } from "@/components/FarmDashboard";

export default function App() {
  useEffect(() => {
    function syncViewport() {
      const viewportHeight = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--app-height", `${viewportHeight}px`);
      window.dispatchEvent(new Event("resize"));
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        window.setTimeout(syncViewport, 50);
      }
    }

    syncViewport();
    window.addEventListener("pageshow", syncViewport);
    window.addEventListener("orientationchange", syncViewport);
    window.addEventListener("resize", syncViewport);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", syncViewport);
      window.removeEventListener("orientationchange", syncViewport);
      window.removeEventListener("resize", syncViewport);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <FarmDashboard />;
}
