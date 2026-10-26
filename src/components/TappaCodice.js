import { el } from "../dom.js";
import { COPY } from "../copy.js";
import { answersMatch } from "../utils.js";
import { mountTappaFrame } from "./TappaFrame.js";
import { mountHintButton } from "./HintButton.js";
import { mountFeedbackBox } from "./FeedbackBox.js";

/**
 * Input codice/parola — usato sia come tappa `input-codice` sia come sblocco finale.
 * @param {HTMLElement} parent
 * @param {{
 *   tappa?: object,
 *   titolo?: string,
 *   testo?: string,
 *   soluzione: string,
 *   formatoAtteso?: string,
 *   hintUsed?: boolean,
 *   review?: boolean,
 *   onHint?: () => void,
 *   onSolved: () => void,
 *   onError?: () => void,
 *   onBack?: () => void,
 *   backLabel?: string,
 *   wrongMessage?: string,
 * }} props
 */
export function mountTappaCodice(parent, props) {
  const tappa = props.tappa ?? {
    titolo: props.titolo,
    testo: props.testo,
    soluzione: props.soluzione,
    formatoAtteso: props.formatoAtteso,
    indizioExtra: undefined,
  };

  const frame = mountTappaFrame(parent, {
    tappa,
    onBack: props.onBack,
    backLabel: props.backLabel,
  });
  if (tappa.indizioExtra && props.onHint) {
    mountHintButton(frame.hintMount, {
      used: Boolean(props.hintUsed),
      testo: tappa.indizioExtra,
      onUse: props.onHint,
    });
  }

  if (tappa.formatoAtteso) {
    frame.body.append(
      el("p", { class: "code-form__hint" }, `${COPY.formato}: ${tappa.formatoAtteso}`),
    );
  }

  const form = el("form", { class: "code-form", autocomplete: "off" });
  const input = el("input", {
    class: "code-form__input code-form__input--code",
    type: "text",
    name: "codice",
    inputmode: /^\d/.test(String(tappa.formatoAtteso ?? tappa.soluzione ?? "")) ? "numeric" : "text",
    enterkeyhint: "done",
    autocapitalize: "characters",
    autocomplete: "off",
    spellcheck: "false",
    maxlength: "24",
    placeholder: COPY.placeholderCodice,
    "aria-label": COPY.placeholderCodice,
  });
  const submit = el("button", { class: "btn btn--primary", type: "submit" }, COPY.conferma);
  form.append(input, submit);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (answersMatch(input.value, props.soluzione ?? tappa.soluzione)) {
      input.disabled = true;
      submit.disabled = true;
      mountFeedbackBox(frame.feedbackMount, {
        ok: true,
        testo: tappa.feedbackCorretto || "Codice accettato. La missione si sblocca.",
        ctaLabel: COPY.avanti,
        onCta: props.onSolved,
      });
    } else {
      props.onError?.();
      mountFeedbackBox(frame.feedbackMount, {
        ok: false,
        testo: props.wrongMessage || tappa.feedbackErrato || COPY.codiceSbagliato,
      });
      input.select();
    }
  });

  frame.body.append(form);

  if (props.review) {
    input.value = String(props.soluzione ?? tappa.soluzione ?? "");
    input.disabled = true;
    submit.disabled = true;
    mountFeedbackBox(frame.feedbackMount, {
      ok: true,
      testo: tappa.feedbackCorretto || COPY.rispostaGiusta,
      ctaLabel: COPY.avanti,
      onCta: props.onSolved,
    });
  } else {
    queueMicrotask(() => input.focus());
  }

  return frame.destroy;
}
