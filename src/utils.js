import { el } from "./dom.js";

/** @param {unknown} value */
export function normalizeAnswer(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "");
}

/**
 * Confronto permissivo per stand fieristico:
 * - ignora maiuscole, accenti, spazi e trattini
 * - se la soluzione è numerica, confronta anche solo le cifre
 *   (così "EXP-4821" vale "4821")
 * @param {unknown} input
 * @param {unknown} soluzione
 */
export function answersMatch(input, soluzione) {
  const a = normalizeAnswer(input);
  const b = normalizeAnswer(soluzione);
  if (!b) return false;
  if (a === b) return true;

  const digitsA = String(input ?? "").replace(/\D/g, "");
  const digitsB = String(soluzione ?? "").replace(/\D/g, "");
  if (digitsB.length >= 3 && digitsA === digitsB) return true;

  return false;
}

/** @param {number} totalSeconds */
export function formatMmSs(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function isFacilitatoreMode() {
  return new URLSearchParams(window.location.search).get("facilitatore") === "1";
}

/** @param {string | undefined} path */
export function assetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "./";
  return `${base}${String(path).replace(/^\//, "")}`;
}

/** Immagine di scena (intro / tappa / esito). Se manca il file, si nasconde. */
export function renderSceneArt(src, alt) {
  if (!src) return null;
  const img = el("img", {
    class: "scene-art",
    src: assetUrl(src),
    alt: alt || "",
    width: "1200",
    height: "400",
    decoding: "async",
  });
  img.addEventListener("error", () => img.remove());
  return img;
}

/** @param {unknown[]} list */
export function shuffleCopy(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function opzioneCorretta(tappa) {
  return (tappa?.opzioni ?? []).find((o) => o.corretta);
}