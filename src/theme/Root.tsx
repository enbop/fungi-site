import { type ReactNode, useEffect } from "react";
import { useLocation } from "@docusaurus/router";

declare global {
  interface Window {
    goatcounter?: {
      count?: (vars: { path: string; title: string }) => void;
    };
  }
}

let lastTrackedPath: string | undefined;

function GoatCounterPageviews() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    if (lastTrackedPath === path) {
      return;
    }

    const count = () => {
      if (!window.goatcounter?.count) {
        return false;
      }

      window.goatcounter.count({ path, title: document.title });
      lastTrackedPath = path;
      return true;
    };

    if (count()) {
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (count() || attempts >= 50) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [location.pathname, location.search]);

  return null;
}

export default function Root({ children }: { children: ReactNode }) {
  return (
    <>
      <GoatCounterPageviews />
      {children}
    </>
  );
}
