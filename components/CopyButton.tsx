"use client";

import { useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./Icons";

type Status = "idle" | "copied" | "failed";

/**
 * Copies `text` to the clipboard. If the browser refuses, it selects the text
 * in the element with id `targetId` so the visitor can copy it by hand.
 */
export function CopyButton({
  text,
  label,
  targetId,
}: {
  text: string;
  label: string;
  targetId: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      const target = document.getElementById(targetId);
      if (target) window.getSelection()?.selectAllChildren(target);
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <>
      <button
        type="button"
        className="copy-btn"
        onClick={copy}
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
      >
        {status === "copied" ? <CheckIcon /> : <CopyIcon />}
      </button>
      <span className="copy-status" role="status">
        {status === "copied"
          ? "Copied"
          : status === "failed"
            ? "Selected. Press Ctrl+C to copy."
            : ""}
      </span>
    </>
  );
}
