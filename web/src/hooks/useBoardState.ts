import { useEffect, useState } from "react";
import { BoardState } from "../types";
import { api } from "../api";

export function useBoardState(): BoardState | null {
  const [state, setState] = useState<BoardState | null>(null);

  useEffect(() => {
    let cancelled = false;
    let source: EventSource | null = null;
    let pollTimer: number | null = null;

    api.getState().then((s) => {
      if (!cancelled) setState(s);
    }).catch(() => {});

    if (typeof EventSource !== "undefined") {
      source = new EventSource("/api/state/events");
      source.addEventListener("state", (e) => {
        try { setState(JSON.parse((e as MessageEvent).data) as BoardState); } catch {}
      });
      source.onerror = () => {
        source?.close();
        source = null;
        startPolling();
      };
    } else {
      startPolling();
    }

    function startPolling() {
      if (pollTimer !== null) return;
      pollTimer = window.setInterval(() => {
        api.getState().then((s) => { if (!cancelled) setState(s); }).catch(() => {});
      }, 5000);
    }

    return () => {
      cancelled = true;
      source?.close();
      if (pollTimer !== null) clearInterval(pollTimer);
    };
  }, []);

  return state;
}
