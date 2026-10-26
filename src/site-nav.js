import { el } from "./dom.js";

const DEFAULTS = {
  homeUrl: "../",
  logoSrc: "../img/IT-Y-Flogo.png",
  logoAlt: "IT'S YOUR FUTURE",
};

/**
 * Barra sito: logo → home, testo → landing ateneo.
 * @param {Record<string, string> | undefined} nav
 */
export function createSiteNav(nav = {}) {
  const homeUrl = nav.homeUrl || DEFAULTS.homeUrl;
  const logoSrc = nav.logoSrc || DEFAULTS.logoSrc;
  const logoAlt = nav.logoAlt || DEFAULTS.logoAlt;
  const percorsoLabel = nav.percorsoLabel;
  const percorsoUrl = nav.percorsoUrl;

  const logo = el("img", {
    class: "iyf-site-nav__logo",
    src: logoSrc,
    alt: logoAlt,
  });

  const homeLink = el("a", {
    class: "iyf-site-nav__home",
    href: homeUrl,
    "aria-label": "Torna alla home IT'S YOUR FUTURE",
  }, logo);

  const children = [homeLink];
  if (percorsoLabel && percorsoUrl) {
    children.push(
      el(
        "a",
        {
          class: "iyf-site-nav__percorso",
          href: percorsoUrl,
        },
        percorsoLabel,
      ),
    );
  }

  return el("nav", { class: "iyf-site-nav", "aria-label": "Navigazione sito" }, ...children);
}

export function mountSiteNav(nav) {
  if (document.querySelector(".iyf-site-nav")) return;
  document.body.prepend(createSiteNav(nav));
}
