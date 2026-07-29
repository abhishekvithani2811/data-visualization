"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Dev-only: Next/font + HMR (and some extensions) abort in-flight fetches.
  // Those AbortErrors are harmless but Next.js surfaces them as runtime overlays.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason?.name === "AbortError" ||
        (reason instanceof Error &&
          reason.message === "The user aborted a request.")
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", onRejection);
    return () => window.removeEventListener("unhandledrejection", onRejection);
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
