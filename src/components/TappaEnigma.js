import { el } from "../dom.js";
import { COPY } from "../copy.js";
import { answersMatch } from "../utils.js";
import { mountTappaFrame } from "./TappaFrame.js";
import { mountHintButton } from "./HintButton.js";
import { mountFeedbackBox } from "./FeedbackBox.js";

/**
 * Risposta libera (enigma / parola).
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
export function mountTappaEnigma(parent, { tappa, hintUsed, review = false, onHint, onSolved, onError, onBack, backLabel }) {
  const frame = mountTappaFrame(parent, { tappa, onBack, backLabel });
  mountHintButton(frame.hintMount, {
    used: hintUsed,
    testo: tappa.indizioExtra,
    onUse: onHint,
  });

  const form = el("form", { class: "code-form", autocomplete: "off" });
  const field = el("label", { class: "code-form__field" });
  const input = el("input", {
    class: "code-form__input",
    type: "text",
    name: "enigma",
    inputmode: "text",
    enterkeyhint: "done",
    autocapitalize: "none",
    autocomplete: "off",
    spellcheck: "false",
    placeholder: tappa.formatoAtteso || COPY.placeholderCodice,
    "aria-label": tappa.formatoAtteso || COPY.placeholderCodice,
  });
  field.append(input);
  const submit = el("button", { class: "btn btn--primary", type: "submit" }, COPY.verifica);
  form.append(field, submit);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    if (answersMatch(value, tappa.soluzione)) {
      input.disabled = true;
      submit.disabled = true;
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
      input.select();
    }
  });

  frame.body.append(form);

  if (review) {
    input.value = tappa.soluzione ?? "";
    input.disabled = true;
    submit.disabled = true;
    mountFeedbackBox(frame.feedbackMount, {
      ok: true,
      testo: tappa.feedbackCorretto || COPY.rispostaGiusta,
      ctaLabel: COPY.avanti,
      onCta: onSolved,
    });
  } else {
    queueMicrotask(() => input.focus());
  }

  return frame.destroy;
}
