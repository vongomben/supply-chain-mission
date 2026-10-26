/**
 * Punteggio a stelle (1–5), uguale in tutti i giochi IT'S YOUR FUTURE.
 *
 * soglie[i] = errori massimi per ottenere (5 - i) stelle.
 * Oltre l'ultima soglia: 1 stella. Chi arriva in fondo ha sempre almeno 1 stella.
 * Esempio [0, 1, 2, 4]: 0 errori → 5, 1 → 4, 2 → 3, 3–4 → 2, 5+ → 1.
 */
export const STELLE_MAX = 5;

export function calcolaStelle(errori, soglie) {
  const i = soglie.findIndex((max) => errori <= max);
  return i === -1 ? 1 : STELLE_MAX - i;
}

export function stelleElement(stelle, dettaglio) {
  const box = document.createElement("div");
  box.className = "punteggio";
  box.setAttribute("role", "img");
  box.setAttribute("aria-label", `${stelle} stelle su ${STELLE_MAX}`);

  const label = document.createElement("p");
  label.className = "punteggio__label";
  label.textContent = "Punteggio";

  const stars = document.createElement("p");
  stars.className = "punteggio__stelle";
  stars.setAttribute("aria-hidden", "true");
  for (let i = 1; i <= STELLE_MAX; i += 1) {
    const s = document.createElement("span");
    s.className = i <= stelle ? "stella stella--on" : "stella";
    s.textContent = "★";
    stars.append(s);
  }

  box.append(label, stars);
  if (dettaglio) {
    const d = document.createElement("p");
    d.className = "punteggio__dettaglio";
    d.textContent = dettaglio;
    box.append(d);
  }
  return box;
}
