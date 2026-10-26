import { el } from "../dom.js";
import { COPY } from "../copy.js";
import { shuffleCopy } from "../utils.js";
import { mountTappaFrame } from "./TappaFrame.js";
import { mountHintButton } from "./HintButton.js";
import { mountFeedbackBox } from "./FeedbackBox.js";

/**
 * Puzzle di ordinamento touch-first (drag + pulsanti Su/Giù).
 * Config tappa:
 *   elementi: [{ id, testo }]
 *   ordineCorretto: [id, id, ...]
 *
 * @param {HTMLElement} parent
 * @param {{
 *   tappa: object,
 *   hintUsed: boolean,
 *   review?: boolean,
 *   onHint: () => void,
 *   onSolved: () => void,
 *   onError?: () => void,
 *   onBack?: () => void,
 *   backLabel?: string,
 * }} props
 */
export function mountTappaPuzzleDrag(parent, { tappa, hintUsed, review = false, onHint, onSolved, onError, onBack, backLabel }) {
  const frame = mountTappaFrame(parent, { tappa, onBack, backLabel });
  mountHintButton(frame.hintMount, {
    used: hintUsed,
    testo: tappa.indizioExtra,
    onUse: onHint,
  });

  const corretto = tappa.ordineCorretto ?? [];
  let items = review
    ? (tappa.elementi ?? []).slice().sort(
        (a, b) => corretto.indexOf(a.id) - corretto.indexOf(b.id),
      )
    : shuffleCopy(tappa.elementi ?? []);
  if (!review && items.length > 1 && items.every((item, i) => item.id === corretto[i])) {
    items = [items[items.length - 1], ...items.slice(0, -1)];
  }

  const list = el("ol", { class: "drag-list" });
  const help = el("p", { class: "drag-list__help" }, COPY.ordineHint);
  let draggingId = null;

  function currentIds() {
    return [...list.querySelectorAll("[data-id]")].map((node) => node.dataset.id);
  }

  function move(id, direction) {
    const index = items.findIndex((item) => item.id === id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= items.length) return;
    const copy = [...items];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    items = copy;
    paint();
  }

  function paint() {
    list.replaceChildren();
    items.forEach((item, index) => {
      const li = el("li", {
        class: "drag-item",
        draggable: review ? "false" : "true",
        "data-id": item.id,
      });
      li.append(
        el("span", { class: "drag-item__index" }, String(index + 1)),
        el("span", { class: "drag-item__text" }, item.testo),
        el(
          "span",
          { class: "drag-item__controls" },
          button(COPY.su, () => move(item.id, -1), index === 0),
          button(COPY.giu, () => move(item.id, 1), index === items.length - 1),
        ),
      );

      li.addEventListener("dragstart", (event) => {
        if (review) {
          event.preventDefault();
          return;
        }
        draggingId = item.id;
        li.classList.add("is-dragging");
        event.dataTransfer?.setData("text/plain", item.id);
        event.dataTransfer?.setDragImage(li, 20, 20);
      });
      li.addEventListener("dragend", () => {
        draggingId = null;
        li.classList.remove("is-dragging");
      });
      li.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
      li.addEventListener("drop", (event) => {
        event.preventDefault();
        const fromId = draggingId || event.dataTransfer?.getData("text/plain");
        if (!fromId || fromId === item.id) return;
        const from = items.findIndex((row) => row.id === fromId);
        const to = items.findIndex((row) => row.id === item.id);
        if (from < 0 || to < 0) return;
        const copy = [...items];
        const [moved] = copy.splice(from, 1);
        copy.splice(to, 0, moved);
        items = copy;
        paint();
      });

      // Touch: pointer-based reorder by dropping onto another row
      li.addEventListener("pointerdown", (event) => {
        if (review) return;
        if (event.pointerType === "mouse") return;
        if (event.target.closest("button")) return;
        draggingId = item.id;
        li.classList.add("is-dragging");
        li.setPointerCapture(event.pointerId);
      });
      li.addEventListener("pointerup", (event) => {
        if (event.pointerType === "mouse") return;
        li.classList.remove("is-dragging");
        const target = document.elementFromPoint(event.clientX, event.clientY);
        const other = target?.closest(".drag-item");
        const fromId = draggingId;
        draggingId = null;
        if (!fromId || !other || other.dataset.id === fromId) return;
        const from = items.findIndex((row) => row.id === fromId);
        const to = items.findIndex((row) => row.id === other.dataset.id);
        if (from < 0 || to < 0) return;
        const copy = [...items];
        const [moved] = copy.splice(from, 1);
        copy.splice(to, 0, moved);
        items = copy;
        paint();
      });

      list.append(li);
    });
  }

  function button(label, onClick, disabled) {
    const btn = el("button", { class: "btn btn--tiny", type: "button", disabled: disabled || undefined }, label);
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      onClick();
    });
    return btn;
  }

  const verify = el("button", { class: "btn btn--primary", type: "button" }, COPY.verifica);
  verify.addEventListener("click", () => {
    const ok = currentIds().join("|") === corretto.join("|");
    if (ok) {
      verify.disabled = true;
      list.querySelectorAll("button").forEach((node) => {
        node.disabled = true;
      });
      mountFeedbackBox(frame.feedbackMount, {
        ok: true,
        testo: tappa.feedbackCorretto || COPY.rispostaGiusta,
        ctaLabel: COPY.avanti,
        onCta: onSolved,
      });
    } else {
      onError?.();
      mountFeedbackBox(frame.feedbackMount, {
        ok: false,
        testo: tappa.feedbackErrato || COPY.rispostaSbagliata,
      });
    }
  });

  paint();
  frame.body.append(help, list, verify);

  if (review) {
    verify.disabled = true;
    list.querySelectorAll("button").forEach((node) => {
      node.disabled = true;
    });
    mountFeedbackBox(frame.feedbackMount, {
      ok: true,
      testo: tappa.feedbackCorretto || COPY.rispostaGiusta,
      ctaLabel: COPY.avanti,
      onCta: onSolved,
    });
  }

  return frame.destroy;
}
