"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type PaletteItem = { label: string; hint: string; href: string };

/**
 * Quick navigation. Opens with the header button or Ctrl/⌘ + K.
 * It is an extra: every destination is also reachable by ordinary links.
 * Uses the native <dialog>, which traps focus, closes on Escape and returns
 * focus to the button that opened it.
 */
export function Palette({ items }: { items: PaletteItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const q = query.trim().toLowerCase();
  const matches = q ? items.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q)) : items;
  const current = Math.min(active, Math.max(matches.length - 1, 0));

  function open() {
    if (dialog.current?.open) return;
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
    input.current?.focus();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else {
          setQuery("");
          setActive(0);
          dialog.current?.showModal();
          input.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(item: PaletteItem | undefined) {
    if (!item) return;
    dialog.current?.close();
    if (item.href.startsWith("http")) window.location.assign(item.href);
    else router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const last = matches.length - 1;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(current >= last ? 0 : current + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(current <= 0 ? last : current - 1); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(last); }
    else if (e.key === "Enter") { e.preventDefault(); go(matches[current]); }
  }

  return (
    <>
      <button type="button" className="palette-open" onClick={open} aria-haspopup="dialog">
        Jump to <kbd>Ctrl K</kbd>
      </button>
      <dialog ref={dialog} className="palette" aria-label="Jump to a page or section">
        <div className="palette-head">
          <label htmlFor="palette-input" className="sr">Search pages and sections</label>
          <input
            ref={input}
            id="palette-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={matches.length ? `palette-${current}` : undefined}
            placeholder="Where to? Try “notes” or “split”"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
          />
          <button type="button" className="palette-close" onClick={() => dialog.current?.close()}>Close</button>
        </div>
        <ul id="palette-list" role="listbox" aria-label="Destinations">
          {matches.map((item, i) => (
            <li
              key={item.href}
              id={`palette-${i}`}
              role="option"
              aria-selected={i === current}
              onClick={() => go(item)}
              onMouseMove={() => setActive(i)}
            >
              <span>{item.label}</span>
              <span className="palette-hint">{item.hint}</span>
            </li>
          ))}
        </ul>
        {matches.length === 0 && (
          <p className="palette-empty" role="status">
            Nothing matches “{query}”. Try “work”, “notes” or “contact”.
          </p>
        )}
        <p className="palette-keys" aria-hidden="true">↑ ↓ to move · Enter to open · Esc to close</p>
      </dialog>
    </>
  );
}
