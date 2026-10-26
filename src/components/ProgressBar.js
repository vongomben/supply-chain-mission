import { el } from "../dom.js";
import { COPY } from "../copy.js";

/**
 * @param {HTMLElement} parent
 * @param {{
 *   current: number,
 *   total: number,
 *   phase: "tappa" | "codice" | "vittoria",
 *   hintsUsed?: Record<string, boolean>,
 *   tappe?: { id: string }[],
 *   solvedIds?: Record<string, boolean>,
 *   onSelectTappa?: (index: number) => void,
 *   onSelectFinale?: () => void,
 * }} props
 */
export function mountProgressBar(
  parent,
  {
    current,
    total,
    phase,
    hintsUsed = {},
    tappe = [],
    solvedIds = {},
    onSelectTappa,
    onSelectFinale,
    showFinale = true,
  },
) {
  const label =
    phase === "codice"
      ? COPY.sblocco
      : phase === "vittoria"
        ? COPY.completata
        : COPY.tappaDi(current, total);

  const root = el("div", { class: "progress", "aria-label": label });
  const text = el("p", { class: "progress__label" }, label);
  const track = el("div", { class: "progress__track", role: "list" });

  for (let i = 0; i < total; i += 1) {
    const tappaId = tappe[i]?.id;
    const solved = Boolean(tappaId && solvedIds[tappaId]);
    const done = phase === "vittoria" || phase === "codice" || solved;
    const active = phase === "tappa" && i === current - 1;
    const hinted = Boolean(tappe[i] && hintsUsed[tappe[i].id]);
    const clickable = phase !== "vittoria" && Boolean(onSelectTappa) && (solved || active);

    const seg = el(clickable ? "button" : "span", {
      class: `progress__seg${done ? " is-done" : ""}${active ? " is-active" : ""}${hinted ? " is-hinted" : ""}${clickable ? " is-clickable" : ""}`,
      type: clickable ? "button" : undefined,
      role: "listitem",
      title: clickable ? `Vai alla tappa ${i + 1}` : `Tappa ${i + 1}`,
    });
    if (clickable) {
      const index = i;
      seg.addEventListener("click", () => onSelectTappa(index));
    }
    track.append(seg);
  }

  if (showFinale) {
    const finaleClickable = phase === "codice" || (phase !== "vittoria" && Boolean(onSelectFinale));
    const finale = el(finaleClickable ? "button" : "span", {
      class: `progress__seg progress__seg--finale${phase === "codice" ? " is-active" : ""}${phase === "vittoria" ? " is-done" : ""}${finaleClickable ? " is-clickable" : ""}`,
      type: finaleClickable ? "button" : undefined,
      role: "listitem",
      title: COPY.sblocco,
    });
    if (finaleClickable && onSelectFinale) {
      finale.addEventListener("click", onSelectFinale);
    }
    track.append(finale);
  }

  root.append(text, track);
  parent.append(root);

  return () => root.remove();
}
