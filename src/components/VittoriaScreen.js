import { el } from "../dom.js";
import { COPY } from "../copy.js";
import { renderSceneArt } from "../utils.js";
import { calcolaStelle, stelleElement } from "../stelle.js";

/** Quante tappe con almeno un errore si possono perdonare per l'esito positivo. */
export const MAX_MISTAKES_FOR_SUCCESS = 1;

/**
 * Errori → stelle: 0 → 5, 1 → 4, 2 → 3, 3–4 → 2, 5+ → 1.
 * Sovrascrivibile da config.punteggio.soglie.
 */
export const SOGLIE_STELLE = [0, 1, 2, 4];

function dettaglioPunteggio(errori, totale) {
  if (errori === 0) return COPY.nessunErrore;
  return `Errori in ${errori} ${errori === 1 ? COPY.tappa : COPY.tappe} su ${totale}`;
}

/**
 * Schermata esito: positivo mostra il lucchetto, negativo no.
 * @param {HTMLElement} parent
 * @param {{ config: object, hintsUsed: Record<string, boolean>, errors: number, mistakeIds?: Record<string, boolean>, onRestart: () => void }} props
 */
export function mountVittoriaScreen(
  parent,
  { config, hintsUsed, errors = 0, mistakeIds = {}, onRestart },
) {
  const vittoria = config.codiceFinale?.schermataVittoria ?? {};
  const tappe = config.tappe ?? [];
  const ok = errors <= MAX_MISTAKES_FOR_SUCCESS;
  const esito = ok ? config.esiti?.positivo : config.esiti?.negativo;
  const stelle = calcolaStelle(errors, config.punteggio?.soglie ?? SOGLIE_STELLE);
  const section = el("section", { class: `victory${ok ? " victory--ok" : " victory--ko"}` });
  const art = renderSceneArt(vittoria.immagine, vittoria.immagineAlt);
  if (art) section.append(art);

  section.append(
    el("p", { class: "victory__kicker" }, ok ? COPY.spedizioneOk : COPY.spedizioneKo),
    el("h1", { class: "victory__title" }, esito?.titolo || vittoria.titolo || COPY.completata),
  );

  section.append(stelleElement(stelle, dettaglioPunteggio(errors, tappe.length)));

  const testo = esito?.testo || vittoria.testo;
  if (testo) {
    section.append(el("p", { class: "victory__text" }, testo));
  }

  if (ok && config.lockerCode) {
    section.append(
      el(
        "p",
        { class: "locker", "aria-label": `${COPY.codiceLucchetto} ${config.lockerCode}` },
        el("span", { class: "locker__label" }, COPY.codiceLucchetto),
        el("strong", { class: "locker__code" }, config.lockerCode),
      ),
    );
  }

  const competenze = vittoria.competenzeEvidenziate ?? [];
  if (competenze.length) {
    const list = el("ul", { class: "victory__chips" });
    for (const voce of competenze) {
      list.append(el("li", { class: "chip" }, voce));
    }
    section.append(el("h2", { class: "victory__h2" }, COPY.competenze), list);
  }

  if (tappe.length) {
    const wrap = el("div", { class: "victory__points" });
    wrap.append(el("h2", { class: "victory__h2" }, COPY.puntiDalleTappe));
    for (const tappa of tappe) {
      const missed = Boolean(mistakeIds[tappa.id]);
      const card = el("article", { class: `point-card${missed ? " point-card--miss" : ""}` });
      card.append(el("h3", { class: "point-card__title" }, tappa.titolo));
      if (tappa.puntiChiave) {
        card.append(el("p", {}, tappa.puntiChiave));
      }
      if (missed) {
        card.append(el("p", { class: "point-card__miss" }, COPY.provaDaRivedere));
      }
      if (hintsUsed[tappa.id]) {
        card.append(el("p", { class: "point-card__hint" }, COPY.indizioUsato));
      }
      wrap.append(card);
    }
    section.append(wrap);
  }

  const restart = el("button", { class: "btn btn--ghost", type: "button" }, COPY.nuovaMissione);
  restart.addEventListener("click", onRestart);
  section.append(restart);
  parent.append(section);
  return () => section.remove();
}
