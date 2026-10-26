import { el } from "../dom.js";
import { COPY } from "../copy.js";
import { renderSceneArt } from "../utils.js";
import { renderTabella } from "./TappaFrame.js";

/**
 * @param {HTMLElement} parent
 * @param {{ config: object, onStart: () => void }} props
 */
export function mountIntroScreen(parent, { config, onStart }) {
  const { meta } = config;
  const section = el("section", { class: "intro" });
  const art = renderSceneArt(meta.immagine, meta.immagineAlt);
  if (art) section.append(art);

  section.append(
    el("p", { class: "intro__kicker" }, meta.sottotitolo || "ITS · mini-missione"),
    el("h1", { class: "intro__title" }, meta.titoloIntro || meta.titolo),
    el("p", { class: "intro__narrative" }, meta.contestoNarrativo),
  );

  const brief = renderTabella(meta.brief);
  if (brief) section.append(brief);

  const metaList = el("dl", { class: "intro__meta" });
  metaList.append(
    el("div", {}, el("dt", {}, COPY.corso), el("dd", {}, meta.corsoRiferimento)),
    el("div", {}, el("dt", {}, COPY.durata), el("dd", {}, meta.durataStimata)),
  );
  if (meta.obiettivoDidattico) {
    metaList.append(
      el("div", {}, el("dt", {}, COPY.obiettivo), el("dd", {}, meta.obiettivoDidattico)),
    );
  }
  section.append(metaList);

  const start = el("button", { class: "btn btn--primary btn--xl", type: "button" }, COPY.inizia);
  start.addEventListener("click", onStart);
  section.append(start);
  parent.append(section);

  queueMicrotask(() => start.focus());
  return () => section.remove();
}
