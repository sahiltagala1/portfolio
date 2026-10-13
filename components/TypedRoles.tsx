"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1800;

/**
 * Types each role, holds it, deletes it, and moves to the next, with a
 * blinking caret. Screen readers get the full list once. With reduced motion,
 * or before the script loads, the first role simply sits there.
 */
export function TypedRoles({ roles }: { roles: string[] }) {
  const [text, setText] = useState(roles[0] ?? "");

  useEffect(() => {
    if (roles.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let shown = roles[0]!.length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (deleting) {
        shown -= 1;
        if (shown === 0) {
          deleting = false;
          index = (index + 1) % roles.length;
        }
      } else {
        shown += 1;
      }
      setText(roles[index]!.slice(0, shown));

      const finishedTyping = !deleting && shown === roles[index]!.length;
      if (finishedTyping) deleting = true;
      timer = setTimeout(step, finishedTyping ? HOLD_MS : deleting ? DELETE_MS : TYPE_MS);
    };

    timer = setTimeout(step, HOLD_MS);
    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <span className="typed">
      <span className="sr">{roles.join(", ")}</span>
      <span aria-hidden="true">
        {text}
        <span className="caret" />
      </span>
    </span>
  );
}
