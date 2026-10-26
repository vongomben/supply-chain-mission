import { el } from "../dom.js";
import { COPY } from "../copy.js";
import { opzioneCorretta } from "../utils.js";

/**
 * Pannello soluzioni per chi gestisce lo stand (?facilitatore=1).
 * @param {HTMLElement} parent
 * @param {{ config: object }} props
 */
export function mountFacilitatorePanel(parent, { config }) {
  let open = true;
  const root = el("aside", { class: "facilitatore", "aria-label": COPY.facilitatoreTitolo });
  const toggle = el("button", { class: "facilitatore__toggle", type: "button" }, COPY.facilitatoreChiudi);
  const panel = el("div", { class: "facilitatore__panel" });

  panel.append(
    el("h2", {}, COPY.facilitatoreTitolo),
    el("p", { class: "facilitatore__lead" }, config.meta?.titolo ?? ""),
  );

  panel.append(el("p", { class: "facilitatore__lead" }, COPY.regolaStelle));

  const list = el("ol", { class: "facilitatore__list" });
  for (const tappa of config.tappe ?? []) {
    const item = el("li", {});
    item.append(el("h3", {}, `${tappa.titolo} · ${tappa.tipo}`));
    if (tappa.puntiChiave) {
      item.append(el("p", {}, tappa.puntiChiave));
    }

    const corretta = opzioneCorretta(tappa);
    if (corretta) {
      item.append(el("p", {}, `${COPY.corretta}: ${corretta.testo}`));
    }
    if (tappa.soluzione) {
      item.append(el("p", {}, `${COPY.soluzione}: ${tappa.soluzione}`));
    }
    if (tappa.ordineCorretto?.length) {
      const labels = (tappa.ordineCorretto ?? [])
        .map((id) => tappa.elementi?.find((elItem) => elItem.id === id)?.testo ?? id)
        .join(" → ");
      item.append(el("p", {}, `${COPY.soluzione}: ${labels}`));
    }
    if (tappa.indizioExtra) {
      item.append(el("p", { class: "facilitatore__hint" }, `${COPY.indizio}: ${tappa.indizioExtra}`));
    }
    list.append(item);
  }
  panel.append(list);

  const codice = config.lockerCode || config.codiceFinale?.valore;
  if (codice) {
    panel.append(
      el(
        "p",
        { class: "facilitatore__code" },
        `${COPY.codiceLucchetto}: ${codice}${config.codiceFinale?.formatoAtteso ? ` (${config.codiceFinale.formatoAtteso})` : ""}`,
      ),
    );
  }

  function sync() {
    panel.hidden = !open;
    toggle.textContent = open ? COPY.facilitatoreChiudi : COPY.facilitatore;
    root.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", () => {
    open = !open;
    sync();
  });

  sync();
  root.append(toggle, panel);
  parent.append(root);
  return () => root.remove();
}
