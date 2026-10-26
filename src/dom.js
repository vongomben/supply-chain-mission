/**
 * Mini helper DOM — niente framework.
 * @param {string} tag
 * @param {Record<string, string | boolean | number | null | undefined>} [attrs]
 * @param {...(Node | string | null | undefined)} children
 */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") {
      node.className = String(value);
    } else if (key === "dataset") {
      Object.assign(node.dataset, value);
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) {
      node.setAttribute(key, "");
    } else {
      node.setAttribute(key, String(value));
    }
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function clear(node) {
  if (!node) return;
  node.replaceChildren();
}

export function mount(parent, child) {
  clear(parent);
  parent.append(child);
}

/**
 * Testo con **grassetto** (niente HTML: solo coppie di asterischi).
 * @param {string} text
 * @returns {DocumentFragment}
 */
export function inlineMarkup(text) {
  const fragment = document.createDocumentFragment();
  const parts = String(text ?? "").split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      fragment.append(el("strong", {}, bold[1]));
    } else if (part) {
      fragment.append(document.createTextNode(part));
    }
  }
  return fragment;
}
