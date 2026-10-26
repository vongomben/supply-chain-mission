import { el, inlineMarkup } from "../dom.js";
import { COPY } from "../copy.js";

/**
 * @param {HTMLElement} parent
 * @param {{ ok: boolean, testo: string, ctaLabel?: string, onCta?: () => void }} props
 */
export function mountFeedbackBox(parent, { ok, testo, ctaLabel, onCta }) {
  const box = el("div", {
    class: `feedback ${ok ? "feedback--ok" : "feedback--ko"}`,
    role: "status",
  });
  box.append(
    el("p", { class: "feedback__kicker" }, ok ? COPY.rispostaGiusta : COPY.rispostaSbagliata),
    el("p", { class: "feedback__text" }, inlineMarkup(testo)),
  );
  if (ctaLabel && onCta) {
    const btn = el("button", { class: `btn ${ok ? "btn--primary" : "btn--ghost"}`, type: "button" }, ctaLabel);
    btn.addEventListener("click", onCta);
    box.append(btn);
  }
  parent.replaceChildren(box);
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  box.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  return () => box.remove();
}
