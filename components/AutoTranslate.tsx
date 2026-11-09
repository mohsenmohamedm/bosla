'use client';

import { useEffect } from 'react';
import { useLang } from '@/lib/lang';
import { STATIC_EN } from '@/lib/i18n-dict';

/**
 * بيترجم نصوص موقع العميل للإنجليزي لما اللغة EN، وبيرجّع النصوص الأصلية لما اللغة عربي.
 * القاموس: lib/i18n-dict.ts + أسماء ووصف المنتجات الإنجليزي من /api/i18n.
 */

const AR = /[؀-ۿ]/;
const AR_DIGITS = /[٠-٩٫٬]/g;
const EGP = /\s*ج\.م/g;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'NOSCRIPT']);
const ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];

let dynamicPairs: Array<[string, string]> = [];
let loaded: Promise<void> | null = null;
let cache: { entries: Array<[string, string]>; exact: Map<string, string> } | null = null;

function loadDynamic(): Promise<void> {
  if (!loaded) {
    loaded = fetch('/api/i18n')
      .then((response) => response.json())
      .then((data: { pairs?: Array<[string, string]> }) => {
        dynamicPairs = data.pairs ?? [];
        cache = null;
      })
      .catch(() => {
        loaded = null;
      });
  }
  return loaded;
}

function getDict() {
  if (!cache) {
    const exact = new Map<string, string>(Object.entries(STATIC_EN));
    for (const [ar, en] of dynamicPairs) exact.set(ar.trim(), en);
    const entries = [...exact.entries()].filter(([ar]) => ar.length >= 3).sort((a, b) => b[0].length - a[0].length);
    cache = { entries, exact };
  }
  return cache;
}

function translate(text: string): string {
  if (!AR.test(text) && !AR_DIGITS.test(text)) return text;
  AR_DIGITS.lastIndex = 0;
  const { entries, exact } = getDict();
  const trimmed = text.trim();
  let out = text;
  const whole = exact.get(trimmed);
  if (whole !== undefined) {
    out = text.replace(trimmed, whole);
  } else {
    for (const [ar, en] of entries) {
      if (out.includes(ar)) out = out.split(ar).join(en);
    }
  }
  out = out.replace(AR_DIGITS, (c) => (c === '٫' ? '.' : c === '٬' ? ',' : String(c.charCodeAt(0) - 0x0660)));
  out = out.replace(EGP, ' EGP');
  return out;
}

interface Record_ {
  orig: string;
  out: string;
}

export default function AutoTranslate() {
  const { lang } = useLang();

  useEffect(() => {
    const texts = new Map<Node, Record_>();
    const attrs = new Map<Element, Map<string, Record_>>();
    let title: Record_ | null = null;
    let frame = 0;
    let observer: MutationObserver | null = null;
    let cancelled = false;

    const applyText = (node: Node) => {
      const value = node.nodeValue ?? '';
      const record = texts.get(node);
      if (record && record.out === value) return;
      const out = translate(value);
      texts.set(node, { orig: value, out });
      if (out !== value) node.nodeValue = out;
    };

    const applyAttrs = (el: Element) => {
      for (const name of ATTRS) {
        const value = el.getAttribute(name);
        if (value === null) continue;
        const map = attrs.get(el) ?? new Map<string, Record_>();
        const record = map.get(name);
        if (record && record.out === value) continue;
        const out = translate(value);
        map.set(name, { orig: value, out });
        attrs.set(el, map);
        if (out !== value) el.setAttribute(name, out);
      }
    };

    const walk = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        if (!SKIP_TAGS.has((root.parentElement?.tagName ?? ''))) applyText(root);
        return;
      }
      if (root.nodeType !== Node.ELEMENT_NODE) return;
      const el = root as Element;
      if (SKIP_TAGS.has(el.tagName)) return;
      applyAttrs(el);
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let current = walker.nextNode();
      while (current) {
        if (current.nodeType === Node.TEXT_NODE) {
          if (!SKIP_TAGS.has(current.parentElement?.tagName ?? '')) applyText(current);
        } else {
          applyAttrs(current as Element);
        }
        current = walker.nextNode();
      }
    };

    const run = () => {
      frame = 0;
      if (cancelled) return;
      observer?.disconnect();
      walk(document.body);
      const current = document.title;
      if (!title || title.out !== current) {
        const out = translate(current);
        title = { orig: current, out };
        if (out !== current) document.title = out;
      }
      observer?.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(run);
    };

    const restore = () => {
      texts.forEach((record, node) => {
        if (node.isConnected && node.nodeValue === record.out) node.nodeValue = record.orig;
      });
      attrs.forEach((map, el) => {
        map.forEach((record, name) => {
          if (el.isConnected && el.getAttribute(name) === record.out) el.setAttribute(name, record.orig);
        });
      });
      if (title && document.title === title.out) document.title = title.orig;
      texts.clear();
      attrs.clear();
    };

    if (lang === 'en') {
      observer = new MutationObserver(schedule);
      void loadDynamic().then(() => {
        if (!cancelled) {
          cache = null;
          run();
        }
      });
      run();
    }

    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      restore();
    };
  }, [lang]);

  return null;
}
