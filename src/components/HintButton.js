import { el } from "../dom.js";
import { COPY } from "../copy.js";

/**
 * @param {HTMLElement} parent
 * @param {{
 *   used: boolean,
 *   testo: string,
 *   onUse: () => void,
 * }} props
 */
export function mountHintButton(parent, { used, testo, onUse }) {
  if (!testo) {
    return () => {};
  }

  const wrap = el("div", { class: "hint" });
  const btn = el(
    "button",
    { class: "btn btn--ghost hint__btn", type: "button" },
    used ? COPY.indizioUsato : COPY.indizio,
  );
  const panel = el("p", { class: "hint__panel", hidden: true }, testo);

  if (used) {
    btn.disabled = true;
    panel.hidden = false;
    wrap.classList.add("hint--used");
  }

  btn.addEventListener("click", () => {
    if (!used) {
      onUse();
    }
    panel.hidden = false;
    btn.textContent = COPY.indizioUsato;
    btn.disabled = true;
    wrap.classList.add("hint--used");
  });

  wrap.append(btn, panel);
  parent.append(wrap);

  return () => wrap.remove();
}
