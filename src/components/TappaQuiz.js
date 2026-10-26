import { el } from "../dom.js";
import { COPY, letteraOpzione } from "../copy.js";
import { shuffleCopy } from "../utils.js";
import { mountTappaFrame } from "./TappaFrame.js";
import { mountHintButton } from "./HintButton.js";
import { mountFeedbackBox } from "./FeedbackBox.js";

/**
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
export function mountTappaQuiz(parent, { tappa, hintUsed, review = false, onHint, onSolved, onError, onBack, backLabel }) {
  const frame = mountTappaFrame(parent, { tappa, onBack, backLabel });
  mountHintButton(frame.hintMount, {
    used: hintUsed,
    testo: tappa.indizioExtra,
    onUse: onHint,
  });

  const list = el("div", { class: "choices", role: "group", "aria-label": tappa.titolo });
  const opzioni = review ? (tappa.opzioni ?? []) : shuffleCopy(tappa.opzioni ?? []);
  let locked = Boolean(review);

  opzioni.forEach((opzione, index) => {
    const btn = el(
      "button",
      {
        class: "choice",
        type: "button",
        "data-index": String(index),
      },
      el("span", { class: "choice__letter" }, letteraOpzione(index)),
      el("span", { class: "choice__text" }, opzione.testo),
    );

    if (review) {
      btn.disabled = true;
      if (opzione.corretta) btn.classList.add("is-correct");
    }

    btn.addEventListener("click", () => {
      if (locked) return;
      if (opzione.corretta) {
        locked = true;
        btn.classList.add("is-correct");
        list.querySelectorAll(".choice").forEach((node) => {
          node.disabled = true;
        });
        mountFeedbackBox(frame.feedbackMount, {
          ok: true,
          testo: opzione.feedback || tappa.feedbackCorretto || "",
          ctaLabel: COPY.avanti,
          onCta: onSolved,
        });
      } else {
        onError?.();
        btn.classList.add("is-wrong");
        btn.disabled = true;
        mountFeedbackBox(frame.feedbackMount, {
          ok: false,
          testo: opzione.feedback || COPY.rispostaSbagliata,
        });
      }
    });

    list.append(btn);
  });

  frame.body.append(list);

  if (review) {
    const corretta = opzioni.find((opzione) => opzione.corretta);
    mountFeedbackBox(frame.feedbackMount, {
      ok: true,
      testo: corretta?.feedback || tappa.feedbackCorretto || "",
      ctaLabel: COPY.avanti,
      onCta: onSolved,
    });
  }

  return frame.destroy;
}
