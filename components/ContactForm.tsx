"use client";

import { useRef, useState } from "react";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const TIMEOUT_MS = 15000;

/**
 * Posts to Formspree. Without JavaScript the form still submits the normal
 * way, because `action` and `method` are real. With JavaScript it sends in
 * place, shows what happened, and keeps the message if sending fails.
 */
export function ContactForm({ formId, fallback }: { formId: string; fallback: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const form = useRef<HTMLFormElement>(null);
  const action = `https://formspree.io/f/${formId}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "sending") return; // no double sends
    setState({ kind: "sending" });
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
        signal: abort.signal,
      });
      if (res.ok) {
        form.current?.reset();
        setState({ kind: "sent" });
      } else if (res.status === 429) {
        setState({ kind: "error", message: "Too many messages were sent in a short time. Wait a minute, then send again." });
      } else if (res.status === 422) {
        setState({ kind: "error", message: "The form service rejected one of the fields. Check the email address, then send again." });
      } else {
        setState({ kind: "error", message: `The message was not sent (error ${res.status}). ${fallback}` });
      }
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "AbortError";
      setState({
        kind: "error",
        message: timedOut
          ? `Sending took too long and was stopped. ${fallback}`
          : `The message could not be sent. Check your connection, then send again. ${fallback}`,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  return (
    <form ref={form} className="form" action={action} method="POST" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required maxLength={100} />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Your email</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required maxLength={200} />
      </div>
      <div className="field field-wide">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" required minLength={10} maxLength={3000} rows={5} />
      </div>
      {/* Honeypot: people never see or fill this, simple bots do. */}
      <div className="sr" aria-hidden="true">
        <label htmlFor="cf-gotcha">Leave this empty</label>
        <input id="cf-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field-wide form-foot">
        <button type="submit" className="btn btn-solid" aria-disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="form-status" role="status" aria-live="polite">
          {state.kind === "sent" && <span className="form-ok">✓ Message sent. Your message has left this page.</span>}
          {state.kind === "error" && <span className="form-error">✕ {state.message} Your message is still in the form.</span>}
        </p>
      </div>
    </form>
  );
}
