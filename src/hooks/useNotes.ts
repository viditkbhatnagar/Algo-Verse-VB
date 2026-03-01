"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useNotes(algorithmId: string) {
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isLoading, setIsLoading] = useState(true);
  const debouncedContent = useDebounce(content, 1000);
  const initialLoadRef = useRef(true);
  const prevContentRef = useRef("");

  // Load note on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    initialLoadRef.current = true;

    fetch(`/api/notes?algorithmId=${encodeURIComponent(algorithmId)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch notes failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          const loaded = data?.content ?? "";
          setContent(loaded);
          prevContentRef.current = loaded;
          setIsLoading(false);
          initialLoadRef.current = false;
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
          initialLoadRef.current = false;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [algorithmId]);

  // Auto-save on debounced content change
  useEffect(() => {
    if (initialLoadRef.current) return;
    if (debouncedContent === prevContentRef.current) return;

    setSaveStatus("saving");

    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ algorithmId, content: debouncedContent }),
    })
      .then((res) => {
        if (res.ok) {
          prevContentRef.current = debouncedContent;
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      })
      .catch(() => {
        setSaveStatus("error");
      });
  }, [debouncedContent, algorithmId]);

  const updateContent = useCallback((value: string) => {
    setContent(value);
    setSaveStatus("idle");
  }, []);

  return { content, updateContent, saveStatus, isLoading };
}
