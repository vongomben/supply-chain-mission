import { el } from "../dom.js";
import { COPY } from "../copy.js";
import { formatMmSs } from "../utils.js";

/**
 * @param {HTMLElement} parent
 * @param {{
 *   modalita: "countdown" | "chrono",
 *   secondi: number,
 *   running: boolean,
 * }} options
 */
export function mountTimer(parent, { modalita = "countdown", secondi = 420, running = false }) {
  const isCountdown = modalita !== "chrono";
  let remaining = secondi;
  let elapsed = 0;
  let expired = false;
  let intervalId = 0;

  const root = el("div", { class: "timer", role: "timer", "aria-live": "polite" });
  const valueEl = el("span", { class: "timer__value" }, isCountdown ? formatMmSs(remaining) : "00:00");
  const labelEl = el("span", { class: "timer__label" }, isCountdown ? "TEMPO" : "CRONO");
  const expiredEl = el("span", { class: "timer__expired", hidden: true }, COPY.tempoScaduto);
  root.append(labelEl, valueEl);
  parent.append(root);

  function paint() {
    if (isCountdown) {
      valueEl.textContent = formatMmSs(remaining);
      root.classList.toggle("timer--warn", remaining <= 60 && remaining > 0);
      root.classList.toggle("timer--ended", expired);
      if (expired) {
        expiredEl.hidden = false;
        if (!expiredEl.isConnected) root.append(expiredEl);
      }
    } else {
      valueEl.textContent = formatMmSs(elapsed);
    }
  }

  function tick() {
    if (isCountdown) {
      remaining = Math.max(0, remaining - 1);
      if (remaining === 0 && !expired) {
        expired = true;
      }
    } else {
      elapsed += 1;
    }
    paint();
  }

  function start() {
    if (intervalId) return;
    intervalId = window.setInterval(tick, 1000);
  }

  function stop() {
    window.clearInterval(intervalId);
    intervalId = 0;
  }

  if (running) start();
  paint();

  return {
    start,
    stop,
    isExpired: () => expired,
    elapsed: () => (isCountdown ? secondi - remaining : elapsed),
    destroy() {
      stop();
      root.remove();
    },
  };
}
