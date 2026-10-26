import { gameConfig } from "./data/game-config.js";
import { COPY } from "./copy.js";
import { el } from "./dom.js";
import { mountSiteNav } from "./site-nav.js";
import { isFacilitatoreMode } from "./utils.js";
import { mountIntroScreen } from "./components/IntroScreen.js";
import { mountTappaQuiz } from "./components/TappaQuiz.js";
import { mountTappaEnigma } from "./components/TappaEnigma.js";
import { mountTappaCodice } from "./components/TappaCodice.js";
import { mountTappaPuzzleDrag } from "./components/TappaPuzzleDrag.js";
import { mountVittoriaScreen } from "./components/VittoriaScreen.js";
import { mountProgressBar } from "./components/ProgressBar.js";
import { mountTimer } from "./components/Timer.js";
import { mountFacilitatorePanel } from "./components/FacilitatorePanel.js";

/**
 * Motore: legge solo `gameConfig`. Cambiare le tappe non richiede toccare questo file.
 * @param {HTMLElement} root
 * @param {typeof gameConfig} [config]
 */
export function createGame(root, config = gameConfig) {
  mountSiteNav(config.navigazione ?? config.meta?.navigazione);

  const tappe = config.tappe ?? [];
  const timerConf = config.meta?.timer ?? { modalita: "countdown", secondi: 420 };

  const state = {
    screen: "intro",
    tappaIndex: 0,
    hintsUsed: /** @type {Record<string, boolean>} */ ({}),
    solvedIds: /** @type {Record<string, boolean>} */ ({}),
    reachedFinale: false,
    /** Risposte sbagliate su tappe e codice finale: con gli indizi fanno il punteggio a stelle. */
    errors: 0,
    /** Prima risposta sbagliata per tappa: solo queste incrementano `errors`. */
    mistakeIds: /** @type {Record<string, boolean>} */ ({}),
  };

  let unmountScreen = () => {};
  let unmountProgress = () => {};
  /** @type {{ start: Function, stop: Function, destroy: Function } | null} */
  let timerApi = null;

  const app = el("div", { class: "app" });
  const header = el("header", { class: "app-bar" });
  const brand = el("p", { class: "app-bar__title" }, config.meta.titolo);
  const timerMount = el("div", { class: "app-bar__timer" });
  header.append(brand, timerMount);

  const progressMount = el("div", { class: "app-progress" });
  const screenMount = el("main", { class: "app-screen", id: "screen" });
  const facilMount = el("div", { class: "app-facilitatore" });
  app.append(header, progressMount, screenMount, facilMount);
  root.replaceChildren(app);

  if (isFacilitatoreMode()) {
    mountFacilitatorePanel(facilMount, { config });
    app.classList.add("has-facilitatore");
  }

  function renderProgress() {
    unmountProgress();
    progressMount.replaceChildren();
    if (state.screen === "intro") {
      header.classList.remove("is-playing");
      progressMount.hidden = true;
      return;
    }
    header.classList.add("is-playing");
    progressMount.hidden = false;
    const current = state.screen === "tappa" ? state.tappaIndex + 1 : tappe.length;
    unmountProgress =
      mountProgressBar(progressMount, {
        current,
        total: Math.max(tappe.length, 1),
        phase: state.screen === "tappa" ? "tappa" : state.screen,
        hintsUsed: state.hintsUsed,
        tappe,
        solvedIds: state.solvedIds,
        onSelectTappa: jumpToTappa,
        onSelectFinale: config.codiceFinale?.valore && state.reachedFinale ? goCodice : undefined,
        showFinale: Boolean(config.codiceFinale?.valore),
      }) ?? (() => {});
  }

  function show(mountFn) {
    unmountScreen();
    screenMount.replaceChildren();
    unmountScreen = mountFn() || (() => {});
    renderProgress();
    screenMount.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function useHint(id) {
    state.hintsUsed[id] = true;
    renderProgress();
  }

  function countError() {
    state.errors += 1;
  }

  function pickMount(tappa) {
    if (tappa.tipo === "enigma" && tappa.opzioni?.length) {
      return mountTappaQuiz;
    }
    switch (tappa.tipo) {
      case "enigma":
        return mountTappaEnigma;
      case "input-codice":
        return (parent, props) =>
          mountTappaCodice(parent, { ...props, soluzione: tappa.soluzione });
      case "puzzle-drag":
        return mountTappaPuzzleDrag;
      default:
        return mountTappaQuiz;
    }
  }

  function goIntro() {
    state.screen = "intro";
    state.tappaIndex = 0;
    state.hintsUsed = {};
    state.solvedIds = {};
    state.reachedFinale = false;
    state.errors = 0;
    state.mistakeIds = {};
    timerApi?.destroy();
    timerApi = null;
    timerMount.replaceChildren();
    show(() => mountIntroScreen(screenMount, { config, onStart: startMission }));
  }

  function startMission() {
    timerApi?.destroy();
    timerMount.replaceChildren();
    timerApi = mountTimer(timerMount, {
      modalita: timerConf.modalita ?? "countdown",
      secondi: Number(timerConf.secondi) || 420,
      running: true,
    });
    if (!tappe.length) {
      goCodiceOrVictory();
      return;
    }
    state.tappaIndex = 0;
    goTappa();
  }

  function jumpToTappa(index) {
    const tappa = tappe[index];
    if (!tappa) return;
    if (!state.solvedIds[tappa.id] && index !== state.tappaIndex) return;
    state.tappaIndex = index;
    goTappa();
  }

  function goBack() {
    if (state.screen === "codice") {
      if (!tappe.length) return;
      state.tappaIndex = tappe.length - 1;
      goTappa();
      return;
    }
    if (state.screen === "tappa" && state.tappaIndex > 0) {
      state.tappaIndex -= 1;
      goTappa();
    }
  }

  function goTappa() {
    state.screen = "tappa";
    const tappa = tappe[state.tappaIndex];
    const mount = pickMount(tappa);
    const canGoBack = state.tappaIndex > 0;
    show(() =>
      mount(screenMount, {
        tappa,
        hintUsed: Boolean(state.hintsUsed[tappa.id]),
        review: Boolean(state.solvedIds[tappa.id]),
        onHint: () => useHint(tappa.id),
        onSolved: nextAfterTappa,
        onError: () => {
          if (state.mistakeIds[tappa.id]) return;
          state.mistakeIds[tappa.id] = true;
          countError();
        },
        onBack: canGoBack ? goBack : undefined,
        backLabel: COPY.indietro,
      }),
    );
  }

  function nextAfterTappa() {
    const tappa = tappe[state.tappaIndex];
    if (tappa?.id) state.solvedIds[tappa.id] = true;

    if (state.tappaIndex < tappe.length - 1) {
      state.tappaIndex += 1;
      goTappa();
      return;
    }
    goCodiceOrVictory();
  }

  function goCodiceOrVictory() {
    if (config.codiceFinale?.valore) {
      goCodice();
      return;
    }
    goVittoria();
  }

  function goCodice() {
    state.screen = "codice";
    state.reachedFinale = true;
    show(() =>
      mountTappaCodice(screenMount, {
        titolo: COPY.sblocco,
        testo: config.codiceFinale.prompt,
        soluzione: config.codiceFinale.valore,
        formatoAtteso: config.codiceFinale.formatoAtteso,
        onSolved: goVittoria,
        onError: countError,
        onBack: tappe.length ? goBack : undefined,
        backLabel: COPY.tornaAllaTappa,
        wrongMessage: COPY.codiceSbagliato,
      }),
    );
  }

  function goVittoria() {
    state.screen = "vittoria";
    timerApi?.stop();
    show(() =>
      mountVittoriaScreen(screenMount, {
        config,
        hintsUsed: state.hintsUsed,
        errors: state.errors,
        mistakeIds: state.mistakeIds,
        onRestart: goIntro,
      }),
    );
  }

  goIntro();

  return {
    destroy() {
      unmountScreen();
      unmountProgress();
      timerApi?.destroy();
      app.remove();
    },
  };
}
