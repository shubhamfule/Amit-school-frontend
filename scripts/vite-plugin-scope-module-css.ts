// Scopes each portal module's CSS under a unique wrapper class so modules
// stop leaking generic selectors (.sidebar, .main, .content, table, button, …)
// into each other once all their stylesheets land in the same bundle.
//
// This never edits the source .css files — it rewrites selectors at build
// time, based on which module folder the file lives in. Each module's root
// component wraps its output in the matching wrapper class (see the App.jsx
// files under src/modules/*).
import postcss, { type Rule, type Container, type AtRule } from "postcss";
import type { Plugin } from "vite";

export const MODULE_SCOPES: { match: RegExp; scope: string }[] = [
  { match: /[\\/]src[\\/]modules[\\/]admin[\\/]/, scope: ".app-admin" },
  { match: /[\\/]src[\\/]modules[\\/]library[\\/]/, scope: ".app-library" },
  { match: /[\\/]src[\\/]modules[\\/]main-accountant[\\/]/, scope: ".app-main-accountant" },
  { match: /[\\/]src[\\/]modules[\\/]non-teaching-accountant[\\/]/, scope: ".app-non-teaching-accountant" },
  { match: /[\\/]src[\\/]modules[\\/]student-accountant[\\/]/, scope: ".app-student-accountant" },
  { match: /[\\/]src[\\/]modules[\\/]teaching-accountant[\\/]/, scope: ".app-teaching-accountant" },
  { match: /[\\/]src[\\/]modules[\\/]student[\\/]/, scope: ".app-student" },
  { match: /[\\/]src[\\/]modules[\\/]teacher[\\/]/, scope: ".app-teacher" },
];

function scopeForFile(id: string): string | null {
  const found = MODULE_SCOPES.find((m) => m.match.test(id));
  return found ? found.scope : null;
}

// Split a selector list on top-level commas only (ignores commas inside
// (), [], since those belong to a single compound selector, e.g. :not(a, b)).
function splitTopLevel(selectorList: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of selectorList) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function isInsideKeyframes(rule: Rule): boolean {
  let p: Container | undefined = rule.parent;
  while (p) {
    if (p.type === "atrule" && /-?keyframes$/i.test((p as AtRule).name)) {
      return true;
    }
    p = p.parent as Container | undefined;
  }
  return false;
}

function scopeSelector(sel: string, scopeClass: string): string {
  const trimmed = sel.trim();

  if (
    trimmed === scopeClass ||
    trimmed.startsWith(`${scopeClass} `) ||
    trimmed.startsWith(`${scopeClass}.`) ||
    trimmed.startsWith(`${scopeClass}:`)
  ) {
    return trimmed; // already scoped
  }

  // The page-level "container" selectors: make them target the module's own
  // wrapper element instead of the real html/body/#root.
  if (trimmed === ":root" || /^(html|body|#root)$/i.test(trimmed)) {
    return scopeClass;
  }

  // Global toggle-state selectors (dark mode class/attr placed on <html> or
  // <body> by a Layout component): keep the ancestor condition, but scope
  // the effect to this module's subtree only.
  if (
    /^(html|body)([.:#[][^\s]*)?$/i.test(trimmed) ||
    /^\[[^\]]+\]$/.test(trimmed)
  ) {
    return `${trimmed} ${scopeClass}`;
  }

  return `${scopeClass} ${trimmed}`;
}

export function scopeModuleCss(css: string, id: string): string | null {
  const scopeClass = scopeForFile(id);
  if (!scopeClass) return null;

  const root = postcss.parse(css, { from: undefined });

  root.walkRules((rule) => {
    if (isInsideKeyframes(rule)) return;
    const parts = splitTopLevel(rule.selector).map((s) => scopeSelector(s, scopeClass));
    rule.selector = Array.from(new Set(parts)).join(", ");
  });

  return root.toResult().css;
}

export default function scopeModuleCssPlugin(): Plugin {
  return {
    name: "scope-module-css",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".css")) return null;
      const scoped = scopeModuleCss(code, id);
      if (scoped === null) return null;
      return { code: scoped, map: null };
    },
  };
}
