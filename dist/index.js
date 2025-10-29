var wt = Object.defineProperty;
var xt = (s, e, t) => e in s ? wt(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var T = (s, e, t) => xt(s, typeof e != "symbol" ? e + "" : e, t);
import { inject as vt, computed as Me, unref as v, defineComponent as nt, ref as A, createElementBlock as b, openBlock as f, createElementVNode as a, createCommentVNode as Y, withDirectives as P, toDisplayString as R, withKeys as Be, vModelText as te, normalizeClass as ne, vModelSelect as re, Fragment as de, renderList as he, createTextVNode as ee, nextTick as $t, onMounted as _t, watch as St, createBlock as Tt, vModelCheckbox as Rt } from "vue";
import { useQuery as ge, useQueryClient as fe, useMutation as me } from "@tanstack/vue-query";
const Ct = Symbol.for("y2kfund.supabase");
function G() {
  const s = vt(Ct, null);
  if (!s) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return s;
}
const q = {
  all: ["tasks"],
  list: (s) => [...q.all, "list", s],
  detail: (s) => [...q.all, "detail", s],
  comments: (s) => [...q.all, "comments", s],
  history: (s) => [...q.all, "history", s]
};
function At(s) {
  const e = G();
  return ge({
    queryKey: Me(() => {
      const t = s ? v(s) : {};
      return q.list(t);
    }),
    queryFn: async () => {
      const t = s ? v(s) : {};
      let n = e.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (t != null && t.status && (n = n.eq("status", t.status)), t != null && t.search && t.search.trim()) {
        const c = t.search.trim();
        n = n.or(`summary.ilike.%${c}%,description.ilike.%${c}%`);
      }
      const { data: r, error: l } = await n;
      if (l) throw l;
      return r;
    }
  });
}
function zt(s) {
  const e = G();
  return ge({
    queryKey: q.detail(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("tasks").select("*").eq("id", s).single();
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function It(s) {
  const e = G();
  return ge({
    queryKey: q.comments(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("task_comments").select("*").eq("task_id", s).order("created_at", { ascending: !1 });
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function Lt(s) {
  const e = G();
  return ge({
    queryKey: q.history(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("task_history").select("*").eq("task_id", s).order("changed_at", { ascending: !1 });
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function Pt() {
  const s = G(), e = fe();
  return me({
    mutationFn: async (t) => {
      const { data: n, error: r } = await s.schema("hf").from("tasks").insert(t).select().single();
      if (r) throw r;
      return n;
    },
    onSuccess: () => {
      e.invalidateQueries({ queryKey: q.all });
    }
  });
}
function rt() {
  const s = G(), e = fe();
  return me({
    mutationFn: async ({
      id: t,
      updates: n,
      userId: r
    }) => {
      const { data: l, error: c } = await s.schema("hf").from("tasks").select("*").eq("id", t).single();
      if (c) throw c;
      const { data: i, error: u } = await s.schema("hf").from("tasks").update(n).eq("id", t).select().single();
      if (u) throw u;
      const o = Object.keys(n).filter((k) => l[k] !== n[k]).map((k) => ({
        task_id: t,
        field_name: k,
        old_value: String(l[k] || ""),
        new_value: String(n[k] || ""),
        changed_by: r
      }));
      if (o.length > 0) {
        const { error: k } = await s.schema("hf").from("task_history").insert(o);
        k && console.error("Failed to save history:", k);
      }
      return i;
    },
    onSuccess: (t) => {
      e.invalidateQueries({ queryKey: q.all }), e.invalidateQueries({ queryKey: q.detail(t.id) }), e.invalidateQueries({ queryKey: q.history(t.id) });
    }
  });
}
function qt() {
  const s = G(), e = fe();
  return me({
    mutationFn: async (t) => {
      const { data: n, error: r } = await s.schema("hf").from("task_comments").insert(t).select().single();
      if (r) throw r;
      return n;
    },
    onSuccess: (t) => {
      e.invalidateQueries({ queryKey: q.comments(t.task_id) });
    }
  });
}
function Et() {
  const s = G(), e = fe();
  return me({
    mutationFn: async (t) => {
      await s.schema("hf").from("task_comments").delete().eq("task_id", t), await s.schema("hf").from("task_history").delete().eq("task_id", t);
      const { error: n } = await s.schema("hf").from("tasks").delete().eq("id", t);
      if (n) throw n;
      return t;
    },
    onSuccess: () => {
      e.invalidateQueries({ queryKey: q.all });
    }
  });
}
function Bt() {
  const s = G(), e = fe();
  return me({
    mutationFn: async ({ id: t, comment: n }) => {
      const { data: r, error: l } = await s.schema("hf").from("task_comments").update({ comment: n }).eq("id", t).select().single();
      if (l) throw l;
      return r;
    },
    onSuccess: (t) => {
      e.invalidateQueries({ queryKey: q.comments(t.task_id) });
    }
  });
}
function it() {
  const s = G();
  return ge({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: e, error: t } = await s.from("users_view").select("id, email, name").order("email");
      if (t) throw t;
      return (e || []).map((n) => ({
        id: n.id,
        email: n.email,
        name: n.name || n.email
      }));
    },
    staleTime: 5 * 60 * 1e3
  });
}
function Ne() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var le = Ne();
function lt(s) {
  le = s;
}
var ke = { exec: () => null };
function _(s, e = "") {
  let t = typeof s == "string" ? s : s.source, n = { replace: (r, l) => {
    let c = typeof l == "string" ? l : l.source;
    return c = c.replace(E.caret, "$1"), t = t.replace(r, c), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var E = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i") }, Mt = /^(?:[ \t]*(?:\n|$))+/, Dt = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ut = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, be = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ft = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ve = /(?:[*+-]|\d{1,9}[.)])/, at = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ot = _(at).replace(/bull/g, Ve).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Nt = _(at).replace(/bull/g, Ve).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), He = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Vt = /^[^\n]+/, Ze = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ht = _(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ze).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Zt = _(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ve).getRegex(), Re = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Qe = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Qt = _("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Qe).replace("tag", Re).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ct = _(He).replace("hr", be).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Re).getRegex(), Ot = _(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ct).getRegex(), Oe = { blockquote: Ot, code: Dt, def: Ht, fences: Ut, heading: Ft, hr: be, html: Qt, lheading: ot, list: Zt, newline: Mt, paragraph: ct, table: ke, text: Vt }, Xe = _("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", be).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Re).getRegex(), Kt = { ...Oe, lheading: Nt, table: Xe, paragraph: _(He).replace("hr", be).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Xe).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Re).getRegex() }, jt = { ...Oe, html: _(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Qe).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ke, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: _(He).replace("hr", be).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ot).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Gt = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Wt = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ut = /^( {2,}|\\)\n(?!\s*$)/, Xt = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Ce = /[\p{P}\p{S}]/u, Ke = /[\s\p{P}\p{S}]/u, pt = /[^\s\p{P}\p{S}]/u, Jt = _(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ke).getRegex(), dt = /(?!~)[\p{P}\p{S}]/u, Yt = /(?!~)[\s\p{P}\p{S}]/u, es = /(?:[^\s\p{P}\p{S}]|~)/u, ts = _(/link|code|html/, "g").replace("link", new RegExp("\\[(?:[^\\[\\]`]|(?<!`)(?<a>`+)[^`]+\\k<a>(?!`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)")).replace("code", new RegExp("(?<!`)(?<b>`+)[^`]+\\k<b>(?!`)")).replace("html", /<(?! )[^<>]*?>/).getRegex(), ht = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ss = _(ht, "u").replace(/punct/g, Ce).getRegex(), ns = _(ht, "u").replace(/punct/g, dt).getRegex(), kt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", rs = _(kt, "gu").replace(/notPunctSpace/g, pt).replace(/punctSpace/g, Ke).replace(/punct/g, Ce).getRegex(), is = _(kt, "gu").replace(/notPunctSpace/g, es).replace(/punctSpace/g, Yt).replace(/punct/g, dt).getRegex(), ls = _("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, pt).replace(/punctSpace/g, Ke).replace(/punct/g, Ce).getRegex(), as = _(/\\(punct)/, "gu").replace(/punct/g, Ce).getRegex(), os = _(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), cs = _(Qe).replace("(?:-->|$)", "-->").getRegex(), us = _("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", cs).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), _e = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ps = _(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _e).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), gt = _(/^!?\[(label)\]\[(ref)\]/).replace("label", _e).replace("ref", Ze).getRegex(), ft = _(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ze).getRegex(), ds = _("reflink|nolink(?!\\()", "g").replace("reflink", gt).replace("nolink", ft).getRegex(), Je = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, je = { _backpedal: ke, anyPunctuation: as, autolink: os, blockSkip: ts, br: ut, code: Wt, del: ke, emStrongLDelim: ss, emStrongRDelimAst: rs, emStrongRDelimUnd: ls, escape: Gt, link: ps, nolink: ft, punctuation: Jt, reflink: gt, reflinkSearch: ds, tag: us, text: Xt, url: ke }, hs = { ...je, link: _(/^!?\[(label)\]\((.*?)\)/).replace("label", _e).getRegex(), reflink: _(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _e).getRegex() }, De = { ...je, emStrongRDelimAst: is, emStrongLDelim: ns, url: _(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Je).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: _(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Je).getRegex() }, ks = { ...De, br: _(ut).replace("{2,}", "*").getRegex(), text: _(De.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, ve = { normal: Oe, gfm: Kt, pedantic: jt }, ce = { normal: je, gfm: De, breaks: ks, pedantic: hs }, gs = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ye = (s) => gs[s];
function j(s, e) {
  if (e) {
    if (E.escapeTest.test(s)) return s.replace(E.escapeReplace, Ye);
  } else if (E.escapeTestNoEncode.test(s)) return s.replace(E.escapeReplaceNoEncode, Ye);
  return s;
}
function et(s) {
  try {
    s = encodeURI(s).replace(E.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function tt(s, e) {
  var l;
  let t = s.replace(E.findPipe, (c, i, u) => {
    let o = !1, k = i;
    for (; --k >= 0 && u[k] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), n = t.split(E.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !((l = n.at(-1)) != null && l.trim()) && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(E.slashPipe, "|");
  return n;
}
function ue(s, e, t) {
  let n = s.length;
  if (n === 0) return "";
  let r = 0;
  for (; r < n && s.charAt(n - r - 1) === e; )
    r++;
  return s.slice(0, n - r);
}
function fs(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < s.length; n++) if (s[n] === "\\") n++;
  else if (s[n] === e[0]) t++;
  else if (s[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
function st(s, e, t, n, r) {
  let l = e.href, c = e.title || null, i = s[1].replace(r.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let u = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: t, href: l, title: c, text: i, tokens: n.inlineTokens(i) };
  return n.state.inLink = !1, u;
}
function ms(s, e, t) {
  let n = s.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let r = n[1];
  return e.split(`
`).map((l) => {
    let c = l.match(t.other.beginningSpace);
    if (c === null) return l;
    let [i] = c;
    return i.length >= r.length ? l.slice(r.length) : l;
  }).join(`
`);
}
var Se = class {
  constructor(s) {
    T(this, "options");
    T(this, "rules");
    T(this, "lexer");
    this.options = s || le;
  }
  space(s) {
    let e = this.rules.block.newline.exec(s);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(s) {
    let e = this.rules.block.code.exec(s);
    if (e) {
      let t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? t : ue(t, `
`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let t = e[0], n = ms(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let n = ue(t, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (t = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: ue(e[0], `
`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let t = ue(e[0], `
`).split(`
`), n = "", r = "", l = [];
      for (; t.length > 0; ) {
        let c = !1, i = [], u;
        for (u = 0; u < t.length; u++) if (this.rules.other.blockquoteStart.test(t[u])) i.push(t[u]), c = !0;
        else if (!c) i.push(t[u]);
        else break;
        t = t.slice(u);
        let o = i.join(`
`), k = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? `${n}
${o}` : o, r = r ? `${r}
${k}` : k;
        let x = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(k, l, !0), this.lexer.state.top = x, t.length === 0) break;
        let p = l.at(-1);
        if ((p == null ? void 0 : p.type) === "code") break;
        if ((p == null ? void 0 : p.type) === "blockquote") {
          let C = p, m = C.raw + `
` + t.join(`
`), I = this.blockquote(m);
          l[l.length - 1] = I, n = n.substring(0, n.length - C.raw.length) + I.raw, r = r.substring(0, r.length - C.text.length) + I.text;
          break;
        } else if ((p == null ? void 0 : p.type) === "list") {
          let C = p, m = C.raw + `
` + t.join(`
`), I = this.list(m);
          l[l.length - 1] = I, n = n.substring(0, n.length - p.raw.length) + I.raw, r = r.substring(0, r.length - C.raw.length) + I.raw, t = m.substring(l.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: l, text: r };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let t = e[1].trim(), n = t.length > 1, r = { type: "list", raw: "", ordered: n, start: n ? +t.slice(0, -1) : "", loose: !1, items: [] };
      t = n ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = n ? t : "[*+-]");
      let l = this.rules.other.listItemRegex(t), c = !1;
      for (; s; ) {
        let u = !1, o = "", k = "";
        if (!(e = l.exec(s)) || this.rules.block.hr.test(s)) break;
        o = e[0], s = s.substring(o.length);
        let x = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (N) => " ".repeat(3 * N.length)), p = s.split(`
`, 1)[0], C = !x.trim(), m = 0;
        if (this.options.pedantic ? (m = 2, k = x.trimStart()) : C ? m = e[1].length + 1 : (m = e[2].search(this.rules.other.nonSpaceChar), m = m > 4 ? 1 : m, k = x.slice(m), m += e[1].length), C && this.rules.other.blankLine.test(p) && (o += p + `
`, s = s.substring(p.length + 1), u = !0), !u) {
          let N = this.rules.other.nextBulletRegex(m), B = this.rules.other.hrRegex(m), z = this.rules.other.fencesBeginRegex(m), H = this.rules.other.headingBeginRegex(m), M = this.rules.other.htmlBeginRegex(m);
          for (; s; ) {
            let Z = s.split(`
`, 1)[0], U;
            if (p = Z, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), U = p) : U = p.replace(this.rules.other.tabCharGlobal, "    "), z.test(p) || H.test(p) || M.test(p) || N.test(p) || B.test(p)) break;
            if (U.search(this.rules.other.nonSpaceChar) >= m || !p.trim()) k += `
` + U.slice(m);
            else {
              if (C || x.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || z.test(x) || H.test(x) || B.test(x)) break;
              k += `
` + p;
            }
            !C && !p.trim() && (C = !0), o += Z + `
`, s = s.substring(Z.length + 1), x = U.slice(m);
          }
        }
        r.loose || (c ? r.loose = !0 : this.rules.other.doubleBlankLine.test(o) && (c = !0));
        let I = null, F;
        this.options.gfm && (I = this.rules.other.listIsTask.exec(k), I && (F = I[0] !== "[ ] ", k = k.replace(this.rules.other.listReplaceTask, ""))), r.items.push({ type: "list_item", raw: o, task: !!I, checked: F, loose: !1, text: k, tokens: [] }), r.raw += o;
      }
      let i = r.items.at(-1);
      if (i) i.raw = i.raw.trimEnd(), i.text = i.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let u = 0; u < r.items.length; u++) if (this.lexer.state.top = !1, r.items[u].tokens = this.lexer.blockTokens(r.items[u].text, []), !r.loose) {
        let o = r.items[u].tokens.filter((x) => x.type === "space"), k = o.length > 0 && o.some((x) => this.rules.other.anyLine.test(x.raw));
        r.loose = k;
      }
      if (r.loose) for (let u = 0; u < r.items.length; u++) r.items[u].loose = !0;
      return r;
    }
  }
  html(s) {
    let e = this.rules.block.html.exec(s);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(s) {
    let e = this.rules.block.def.exec(s);
    if (e) {
      let t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: e[0], href: n, title: r };
    }
  }
  table(s) {
    var c;
    let e = this.rules.block.table.exec(s);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = tt(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = (c = e[3]) != null && c.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (t.length === n.length) {
      for (let i of n) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < t.length; i++) l.header.push({ text: t[i], tokens: this.lexer.inline(t[i]), header: !0, align: l.align[i] });
      for (let i of r) l.rows.push(tt(i, l.header.length).map((u, o) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: l.align[o] })));
      return l;
    }
  }
  lheading(s) {
    let e = this.rules.block.lheading.exec(s);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(s) {
    let e = this.rules.block.paragraph.exec(s);
    if (e) {
      let t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: t, tokens: this.lexer.inline(t) };
    }
  }
  text(s) {
    let e = this.rules.block.text.exec(s);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(s) {
    let e = this.rules.inline.escape.exec(s);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(s) {
    let e = this.rules.inline.tag.exec(s);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(s) {
    let e = this.rules.inline.link.exec(s);
    if (e) {
      let t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t)) return;
        let l = ue(t.slice(0, -1), "\\");
        if ((t.length - l.length) % 2 === 0) return;
      } else {
        let l = fs(e[2], "()");
        if (l === -2) return;
        if (l > -1) {
          let c = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + l;
          e[2] = e[2].substring(0, l), e[0] = e[0].substring(0, c).trim(), e[3] = "";
        }
      }
      let n = e[2], r = "";
      if (this.options.pedantic) {
        let l = this.rules.other.pedanticHrefTitle.exec(n);
        l && (n = l[1], r = l[3]);
      } else r = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? n = n.slice(1) : n = n.slice(1, -1)), st(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(s)) || (t = this.rules.inline.nolink.exec(s))) {
      let n = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[n.toLowerCase()];
      if (!r) {
        let l = t[0].charAt(0);
        return { type: "text", raw: l, text: l };
      }
      return st(t, r, t[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, t = "") {
    let n = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!n || n[3] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !t || this.rules.inline.punctuation.exec(t))) {
      let r = [...n[0]].length - 1, l, c, i = r, u = 0, o = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (o.lastIndex = 0, e = e.slice(-1 * s.length + r); (n = o.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l) continue;
        if (c = [...l].length, n[3] || n[4]) {
          i += c;
          continue;
        } else if ((n[5] || n[6]) && r % 3 && !((r + c) % 3)) {
          u += c;
          continue;
        }
        if (i -= c, i > 0) continue;
        c = Math.min(c, c + i + u);
        let k = [...n[0]][0].length, x = s.slice(0, r + n.index + k + c);
        if (Math.min(r, c) % 2) {
          let C = x.slice(1, -1);
          return { type: "em", raw: x, text: C, tokens: this.lexer.inlineTokens(C) };
        }
        let p = x.slice(2, -2);
        return { type: "strong", raw: x, text: p, tokens: this.lexer.inlineTokens(p) };
      }
    }
  }
  codespan(s) {
    let e = this.rules.inline.code.exec(s);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(t), r = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return n && r && (t = t.substring(1, t.length - 1)), { type: "codespan", raw: e[0], text: t };
    }
  }
  br(s) {
    let e = this.rules.inline.br.exec(s);
    if (e) return { type: "br", raw: e[0] };
  }
  del(s) {
    let e = this.rules.inline.del.exec(s);
    if (e) return { type: "del", raw: e[0], text: e[2], tokens: this.lexer.inlineTokens(e[2]) };
  }
  autolink(s) {
    let e = this.rules.inline.autolink.exec(s);
    if (e) {
      let t, n;
      return e[2] === "@" ? (t = e[1], n = "mailto:" + t) : (t = e[1], n = t), { type: "link", raw: e[0], text: t, href: n, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  url(s) {
    var t;
    let e;
    if (e = this.rules.inline.url.exec(s)) {
      let n, r;
      if (e[2] === "@") n = e[0], r = "mailto:" + n;
      else {
        let l;
        do
          l = e[0], e[0] = ((t = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : t[0]) ?? "";
        while (l !== e[0]);
        n = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(s) {
    let e = this.rules.inline.text.exec(s);
    if (e) {
      let t = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: t };
    }
  }
}, Q = class Ue {
  constructor(e) {
    T(this, "tokens");
    T(this, "options");
    T(this, "state");
    T(this, "tokenizer");
    T(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || le, this.options.tokenizer = this.options.tokenizer || new Se(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: E, block: ve.normal, inline: ce.normal };
    this.options.pedantic ? (t.block = ve.pedantic, t.inline = ce.pedantic) : this.options.gfm && (t.block = ve.gfm, this.options.breaks ? t.inline = ce.breaks : t.inline = ce.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: ve, inline: ce };
  }
  static lex(e, t) {
    return new Ue(t).lex(e);
  }
  static lexInline(e, t) {
    return new Ue(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(E.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = !1) {
    var r, l, c;
    for (this.options.pedantic && (e = e.replace(E.tabCharGlobal, "    ").replace(E.spaceLine, "")); e; ) {
      let i;
      if ((l = (r = this.options.extensions) == null ? void 0 : r.block) != null && l.some((o) => (i = o.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), !0) : !1)) continue;
      if (i = this.tokenizer.space(e)) {
        e = e.substring(i.raw.length);
        let o = t.at(-1);
        i.raw.length === 1 && o !== void 0 ? o.raw += `
` : t.push(i);
        continue;
      }
      if (i = this.tokenizer.code(e)) {
        e = e.substring(i.raw.length);
        let o = t.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.text, this.inlineQueue.at(-1).src = o.text) : t.push(i);
        continue;
      }
      if (i = this.tokenizer.fences(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.heading(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.hr(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.blockquote(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.list(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.html(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.def(e)) {
        e = e.substring(i.raw.length);
        let o = t.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[i.tag] || (this.tokens.links[i.tag] = { href: i.href, title: i.title }, t.push(i));
        continue;
      }
      if (i = this.tokenizer.table(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.lheading(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      let u = e;
      if ((c = this.options.extensions) != null && c.startBlock) {
        let o = 1 / 0, k = e.slice(1), x;
        this.options.extensions.startBlock.forEach((p) => {
          x = p.call({ lexer: this }, k), typeof x == "number" && x >= 0 && (o = Math.min(o, x));
        }), o < 1 / 0 && o >= 0 && (u = e.substring(0, o + 1));
      }
      if (this.state.top && (i = this.tokenizer.paragraph(u))) {
        let o = t.at(-1);
        n && (o == null ? void 0 : o.type) === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(i), n = u.length !== e.length, e = e.substring(i.raw.length);
        continue;
      }
      if (i = this.tokenizer.text(e)) {
        e = e.substring(i.raw.length);
        let o = t.at(-1);
        (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(i);
        continue;
      }
      if (e) {
        let o = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(o);
          break;
        } else throw new Error(o);
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    var i, u, o, k, x;
    let n = e, r = null;
    if (this.tokens.links) {
      let p = Object.keys(this.tokens.links);
      if (p.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) p.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = ((u = (i = this.options.hooks) == null ? void 0 : i.emStrongMask) == null ? void 0 : u.call({ lexer: this }, n)) ?? n;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let p;
      if ((k = (o = this.options.extensions) == null ? void 0 : o.inline) != null && k.some((m) => (p = m.call({ lexer: this }, e, t)) ? (e = e.substring(p.raw.length), t.push(p), !0) : !1)) continue;
      if (p = this.tokenizer.escape(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.tag(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.link(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(p.raw.length);
        let m = t.at(-1);
        p.type === "text" && (m == null ? void 0 : m.type) === "text" ? (m.raw += p.raw, m.text += p.text) : t.push(p);
        continue;
      }
      if (p = this.tokenizer.emStrong(e, n, c)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.codespan(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.br(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.del(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.autolink(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (!this.state.inLink && (p = this.tokenizer.url(e))) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      let C = e;
      if ((x = this.options.extensions) != null && x.startInline) {
        let m = 1 / 0, I = e.slice(1), F;
        this.options.extensions.startInline.forEach((N) => {
          F = N.call({ lexer: this }, I), typeof F == "number" && F >= 0 && (m = Math.min(m, F));
        }), m < 1 / 0 && m >= 0 && (C = e.substring(0, m + 1));
      }
      if (p = this.tokenizer.inlineText(C)) {
        e = e.substring(p.raw.length), p.raw.slice(-1) !== "_" && (c = p.raw.slice(-1)), l = !0;
        let m = t.at(-1);
        (m == null ? void 0 : m.type) === "text" ? (m.raw += p.raw, m.text += p.text) : t.push(p);
        continue;
      }
      if (e) {
        let m = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(m);
          break;
        } else throw new Error(m);
      }
    }
    return t;
  }
}, Te = class {
  constructor(s) {
    T(this, "options");
    T(this, "parser");
    this.options = s || le;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: t }) {
    var l;
    let n = (l = (e || "").match(E.notSpaceStart)) == null ? void 0 : l[0], r = s.replace(E.endingNewline, "") + `
`;
    return n ? '<pre><code class="language-' + j(n) + '">' + (t ? r : j(r, !0)) + `</code></pre>
` : "<pre><code>" + (t ? r : j(r, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: s }) {
    return `<blockquote>
${this.parser.parse(s)}</blockquote>
`;
  }
  html({ text: s }) {
    return s;
  }
  def(s) {
    return "";
  }
  heading({ tokens: s, depth: e }) {
    return `<h${e}>${this.parser.parseInline(s)}</h${e}>
`;
  }
  hr(s) {
    return `<hr>
`;
  }
  list(s) {
    let e = s.ordered, t = s.start, n = "";
    for (let c = 0; c < s.items.length; c++) {
      let i = s.items[c];
      n += this.listitem(i);
    }
    let r = e ? "ol" : "ul", l = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + r + l + `>
` + n + "</" + r + `>
`;
  }
  listitem(s) {
    var t;
    let e = "";
    if (s.task) {
      let n = this.checkbox({ checked: !!s.checked });
      s.loose ? ((t = s.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (s.tokens[0].text = n + " " + s.tokens[0].text, s.tokens[0].tokens && s.tokens[0].tokens.length > 0 && s.tokens[0].tokens[0].type === "text" && (s.tokens[0].tokens[0].text = n + " " + j(s.tokens[0].tokens[0].text), s.tokens[0].tokens[0].escaped = !0)) : s.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: !0 }) : e += n + " ";
    }
    return e += this.parser.parse(s.tokens, !!s.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: s }) {
    return "<input " + (s ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: s }) {
    return `<p>${this.parser.parseInline(s)}</p>
`;
  }
  table(s) {
    let e = "", t = "";
    for (let r = 0; r < s.header.length; r++) t += this.tablecell(s.header[r]);
    e += this.tablerow({ text: t });
    let n = "";
    for (let r = 0; r < s.rows.length; r++) {
      let l = s.rows[r];
      t = "";
      for (let c = 0; c < l.length; c++) t += this.tablecell(l[c]);
      n += this.tablerow({ text: t });
    }
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + n + `</table>
`;
  }
  tablerow({ text: s }) {
    return `<tr>
${s}</tr>
`;
  }
  tablecell(s) {
    let e = this.parser.parseInline(s.tokens), t = s.header ? "th" : "td";
    return (s.align ? `<${t} align="${s.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  strong({ tokens: s }) {
    return `<strong>${this.parser.parseInline(s)}</strong>`;
  }
  em({ tokens: s }) {
    return `<em>${this.parser.parseInline(s)}</em>`;
  }
  codespan({ text: s }) {
    return `<code>${j(s, !0)}</code>`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return `<del>${this.parser.parseInline(s)}</del>`;
  }
  link({ href: s, title: e, tokens: t }) {
    let n = this.parser.parseInline(t), r = et(s);
    if (r === null) return n;
    s = r;
    let l = '<a href="' + s + '"';
    return e && (l += ' title="' + j(e) + '"'), l += ">" + n + "</a>", l;
  }
  image({ href: s, title: e, text: t, tokens: n }) {
    n && (t = this.parser.parseInline(n, this.parser.textRenderer));
    let r = et(s);
    if (r === null) return j(t);
    s = r;
    let l = `<img src="${s}" alt="${t}"`;
    return e && (l += ` title="${j(e)}"`), l += ">", l;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : j(s.text);
  }
}, Ge = class {
  strong({ text: s }) {
    return s;
  }
  em({ text: s }) {
    return s;
  }
  codespan({ text: s }) {
    return s;
  }
  del({ text: s }) {
    return s;
  }
  html({ text: s }) {
    return s;
  }
  text({ text: s }) {
    return s;
  }
  link({ text: s }) {
    return "" + s;
  }
  image({ text: s }) {
    return "" + s;
  }
  br() {
    return "";
  }
}, O = class Fe {
  constructor(e) {
    T(this, "options");
    T(this, "renderer");
    T(this, "textRenderer");
    this.options = e || le, this.options.renderer = this.options.renderer || new Te(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Ge();
  }
  static parse(e, t) {
    return new Fe(t).parse(e);
  }
  static parseInline(e, t) {
    return new Fe(t).parseInline(e);
  }
  parse(e, t = !0) {
    var r, l;
    let n = "";
    for (let c = 0; c < e.length; c++) {
      let i = e[c];
      if ((l = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && l[i.type]) {
        let o = i, k = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (k !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o.type)) {
          n += k || "";
          continue;
        }
      }
      let u = i;
      switch (u.type) {
        case "space": {
          n += this.renderer.space(u);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(u);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(u);
          continue;
        }
        case "code": {
          n += this.renderer.code(u);
          continue;
        }
        case "table": {
          n += this.renderer.table(u);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(u);
          continue;
        }
        case "list": {
          n += this.renderer.list(u);
          continue;
        }
        case "html": {
          n += this.renderer.html(u);
          continue;
        }
        case "def": {
          n += this.renderer.def(u);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(u);
          continue;
        }
        case "text": {
          let o = u, k = this.renderer.text(o);
          for (; c + 1 < e.length && e[c + 1].type === "text"; ) o = e[++c], k += `
` + this.renderer.text(o);
          t ? n += this.renderer.paragraph({ type: "paragraph", raw: k, text: k, tokens: [{ type: "text", raw: k, text: k, escaped: !0 }] }) : n += k;
          continue;
        }
        default: {
          let o = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
  parseInline(e, t = this.renderer) {
    var r, l;
    let n = "";
    for (let c = 0; c < e.length; c++) {
      let i = e[c];
      if ((l = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && l[i.type]) {
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += o || "";
          continue;
        }
      }
      let u = i;
      switch (u.type) {
        case "escape": {
          n += t.text(u);
          break;
        }
        case "html": {
          n += t.html(u);
          break;
        }
        case "link": {
          n += t.link(u);
          break;
        }
        case "image": {
          n += t.image(u);
          break;
        }
        case "strong": {
          n += t.strong(u);
          break;
        }
        case "em": {
          n += t.em(u);
          break;
        }
        case "codespan": {
          n += t.codespan(u);
          break;
        }
        case "br": {
          n += t.br(u);
          break;
        }
        case "del": {
          n += t.del(u);
          break;
        }
        case "text": {
          n += t.text(u);
          break;
        }
        default: {
          let o = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
}, $e, pe = ($e = class {
  constructor(s) {
    T(this, "options");
    T(this, "block");
    this.options = s || le;
  }
  preprocess(s) {
    return s;
  }
  postprocess(s) {
    return s;
  }
  processAllTokens(s) {
    return s;
  }
  emStrongMask(s) {
    return s;
  }
  provideLexer() {
    return this.block ? Q.lex : Q.lexInline;
  }
  provideParser() {
    return this.block ? O.parse : O.parseInline;
  }
}, T($e, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), T($e, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), $e), bs = class {
  constructor(...s) {
    T(this, "defaults", Ne());
    T(this, "options", this.setOptions);
    T(this, "parse", this.parseMarkdown(!0));
    T(this, "parseInline", this.parseMarkdown(!1));
    T(this, "Parser", O);
    T(this, "Renderer", Te);
    T(this, "TextRenderer", Ge);
    T(this, "Lexer", Q);
    T(this, "Tokenizer", Se);
    T(this, "Hooks", pe);
    this.use(...s);
  }
  walkTokens(s, e) {
    var n, r;
    let t = [];
    for (let l of s) switch (t = t.concat(e.call(this, l)), l.type) {
      case "table": {
        let c = l;
        for (let i of c.header) t = t.concat(this.walkTokens(i.tokens, e));
        for (let i of c.rows) for (let u of i) t = t.concat(this.walkTokens(u.tokens, e));
        break;
      }
      case "list": {
        let c = l;
        t = t.concat(this.walkTokens(c.items, e));
        break;
      }
      default: {
        let c = l;
        (r = (n = this.defaults.extensions) == null ? void 0 : n.childTokens) != null && r[c.type] ? this.defaults.extensions.childTokens[c.type].forEach((i) => {
          let u = c[i].flat(1 / 0);
          t = t.concat(this.walkTokens(u, e));
        }) : c.tokens && (t = t.concat(this.walkTokens(c.tokens, e)));
      }
    }
    return t;
  }
  use(...s) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return s.forEach((t) => {
      let n = { ...t };
      if (n.async = this.defaults.async || n.async || !1, t.extensions && (t.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let l = e.renderers[r.name];
          l ? e.renderers[r.name] = function(...c) {
            let i = r.renderer.apply(this, c);
            return i === !1 && (i = l.apply(this, c)), i;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[r.level];
          l ? l.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), n.extensions = e), t.renderer) {
        let r = this.defaults.renderer || new Te(this.defaults);
        for (let l in t.renderer) {
          if (!(l in r)) throw new Error(`renderer '${l}' does not exist`);
          if (["options", "parser"].includes(l)) continue;
          let c = l, i = t.renderer[c], u = r[c];
          r[c] = (...o) => {
            let k = i.apply(r, o);
            return k === !1 && (k = u.apply(r, o)), k || "";
          };
        }
        n.renderer = r;
      }
      if (t.tokenizer) {
        let r = this.defaults.tokenizer || new Se(this.defaults);
        for (let l in t.tokenizer) {
          if (!(l in r)) throw new Error(`tokenizer '${l}' does not exist`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let c = l, i = t.tokenizer[c], u = r[c];
          r[c] = (...o) => {
            let k = i.apply(r, o);
            return k === !1 && (k = u.apply(r, o)), k;
          };
        }
        n.tokenizer = r;
      }
      if (t.hooks) {
        let r = this.defaults.hooks || new pe();
        for (let l in t.hooks) {
          if (!(l in r)) throw new Error(`hook '${l}' does not exist`);
          if (["options", "block"].includes(l)) continue;
          let c = l, i = t.hooks[c], u = r[c];
          pe.passThroughHooks.has(l) ? r[c] = (o) => {
            if (this.defaults.async && pe.passThroughHooksRespectAsync.has(l)) return (async () => {
              let x = await i.call(r, o);
              return u.call(r, x);
            })();
            let k = i.call(r, o);
            return u.call(r, k);
          } : r[c] = (...o) => {
            if (this.defaults.async) return (async () => {
              let x = await i.apply(r, o);
              return x === !1 && (x = await u.apply(r, o)), x;
            })();
            let k = i.apply(r, o);
            return k === !1 && (k = u.apply(r, o)), k;
          };
        }
        n.hooks = r;
      }
      if (t.walkTokens) {
        let r = this.defaults.walkTokens, l = t.walkTokens;
        n.walkTokens = function(c) {
          let i = [];
          return i.push(l.call(this, c)), r && (i = i.concat(r.call(this, c))), i;
        };
      }
      this.defaults = { ...this.defaults, ...n };
    }), this;
  }
  setOptions(s) {
    return this.defaults = { ...this.defaults, ...s }, this;
  }
  lexer(s, e) {
    return Q.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return O.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, t) => {
      let n = { ...t }, r = { ...this.defaults, ...n }, l = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && n.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = s), r.async) return (async () => {
        let c = r.hooks ? await r.hooks.preprocess(e) : e, i = await (r.hooks ? await r.hooks.provideLexer() : s ? Q.lex : Q.lexInline)(c, r), u = r.hooks ? await r.hooks.processAllTokens(i) : i;
        r.walkTokens && await Promise.all(this.walkTokens(u, r.walkTokens));
        let o = await (r.hooks ? await r.hooks.provideParser() : s ? O.parse : O.parseInline)(u, r);
        return r.hooks ? await r.hooks.postprocess(o) : o;
      })().catch(l);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let c = (r.hooks ? r.hooks.provideLexer() : s ? Q.lex : Q.lexInline)(e, r);
        r.hooks && (c = r.hooks.processAllTokens(c)), r.walkTokens && this.walkTokens(c, r.walkTokens);
        let i = (r.hooks ? r.hooks.provideParser() : s ? O.parse : O.parseInline)(c, r);
        return r.hooks && (i = r.hooks.postprocess(i)), i;
      } catch (c) {
        return l(c);
      }
    };
  }
  onError(s, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, s) {
        let n = "<p>An error occurred:</p><pre>" + j(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, ie = new bs();
function S(s, e) {
  return ie.parse(s, e);
}
S.options = S.setOptions = function(s) {
  return ie.setOptions(s), S.defaults = ie.defaults, lt(S.defaults), S;
};
S.getDefaults = Ne;
S.defaults = le;
S.use = function(...s) {
  return ie.use(...s), S.defaults = ie.defaults, lt(S.defaults), S;
};
S.walkTokens = function(s, e) {
  return ie.walkTokens(s, e);
};
S.parseInline = ie.parseInline;
S.Parser = O;
S.parser = O.parse;
S.Renderer = Te;
S.TextRenderer = Ge;
S.Lexer = Q;
S.lexer = Q.lex;
S.Tokenizer = Se;
S.Hooks = pe;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
O.parse;
Q.lex;
const ys = { class: "detail-container" }, ws = { class: "detail-header" }, xs = { style: { flex: "1" } }, vs = {
  key: 0,
  class: "saved-message"
}, $s = {
  key: 1,
  class: "loading"
}, _s = {
  key: 2,
  class: "error"
}, Ss = {
  key: 3,
  class: "detail-content"
}, Ts = { class: "task-info" }, Rs = { class: "info-row" }, Cs = ["innerHTML"], As = { class: "info-row" }, zs = { class: "info-value details-row" }, Is = { class: "detail-item" }, Ls = { class: "detail-item" }, Ps = { class: "detail-item" }, qs = ["disabled"], Es = ["value"], Bs = {
  key: 1,
  class: "info-value"
}, Ms = { class: "history-section" }, Ds = { class: "expand-icon" }, Us = { key: 0 }, Fs = {
  key: 0,
  class: "loading"
}, Ns = {
  key: 1,
  class: "history-list"
}, Vs = { class: "history-meta" }, Hs = { class: "history-date" }, Zs = { class: "history-change" }, Qs = { class: "change-values" }, Os = { class: "old-value" }, Ks = { class: "new-value" }, js = {
  key: 2,
  class: "no-history"
}, Gs = { class: "comments-section" }, Ws = {
  key: 0,
  class: "loading"
}, Xs = {
  key: 1,
  class: "comments-list"
}, Js = { class: "comment-meta" }, Ys = { class: "comment-date" }, en = {
  key: 0,
  class: "comment-menu"
}, tn = ["onClick"], sn = {
  key: 0,
  class: "menu-dropdown"
}, nn = ["onClick"], rn = { key: 0 }, ln = ["onClick"], an = { key: 1 }, on = ["innerHTML"], cn = ["innerHTML"], un = {
  key: 2,
  class: "no-comments"
}, pn = { class: "add-comment" }, dn = ["disabled"], hn = ["disabled"], kn = { key: 0 }, gn = { key: 1 }, fn = /* @__PURE__ */ nt({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = A(""), l = A(null), c = A(""), i = A(null), { data: u, isLoading: o, error: k } = zt(t.taskId), { data: x, isLoading: p } = It(t.taskId), { data: C, isLoading: m } = Lt(t.taskId), I = Bt(), F = rt(), N = qt(), B = A(null), z = A(""), H = A(null), M = A(""), Z = A(!1), U = A(!1), { data: ae, isLoading: oe } = it();
    async function V(w, d) {
      B.value = w, z.value = d, await $t();
      const L = H.value;
      L && typeof L.focus == "function" && L.focus();
    }
    function W() {
      B.value = null, z.value = "";
    }
    async function D() {
      if (!B.value || !u.value) return;
      const w = B.value, d = u.value[w];
      if (z.value !== d)
        try {
          await F.mutateAsync({
            id: t.taskId,
            updates: { [w]: z.value },
            userId: t.userId
          }), r.value = "Saved!", setTimeout(() => {
            r.value = "";
          }, 1200);
        } catch (L) {
          console.error("Failed to update task:", L);
        }
      W();
    }
    async function ye() {
      if (M.value.trim()) {
        if (M.value.trim().startsWith("@analyze")) {
          const w = M.value.trim().replace(/^@analyze\s*/, "");
          if (!w) return;
          U.value = !0;
          try {
            const L = await (await fetch("https://www.y2k.fund/api/ai-analyze-task", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                taskId: t.taskId,
                userId: t.userId,
                question: w
              })
            })).json();
            await N.mutateAsync({
              task_id: t.taskId,
              comment: `${L.reply}`,
              created_by: "Analyze"
              // or props.userId if you want to attribute to user
            }), M.value = "";
          } catch (d) {
            console.error("AI analysis failed:", d);
          } finally {
            U.value = !1;
          }
          return;
        }
        try {
          await N.mutateAsync({
            task_id: t.taskId,
            comment: M.value,
            created_by: t.userId
          }), M.value = "";
        } catch (w) {
          console.error("Failed to add comment:", w);
        }
      }
    }
    async function Ae() {
      if (u.value)
        try {
          await F.mutateAsync({
            id: u.value.id,
            updates: { archived: !u.value.archived },
            userId: t.userId
          });
        } catch (w) {
          console.error("Failed to archive/unarchive task:", w);
        }
    }
    function we(w) {
      return new Date(w).toLocaleString();
    }
    function ze(w) {
      return w.replace(/_/g, " ").replace(/\b\w/g, (d) => d.toUpperCase());
    }
    function xe(w) {
      return w.replace(
        /!\[.*?\]\((https?:\/\/[^)]+|data:image\/[^)]+)\)/g,
        `<img src="$1" class="img-thumb" data-src="$1" onclick="window.open(this.dataset.src,'_blank')" />`
      ).replace(/\n/g, "<br/>");
    }
    async function Ie(w) {
      await h(w, (d) => {
        z.value += `
![image](${d})
`;
      });
    }
    async function $(w) {
      await h(w, (d) => {
        M.value += `
![image](${d})
`;
      });
    }
    async function h(w, d) {
      var X;
      const L = (X = w.clipboardData) == null ? void 0 : X.items;
      if (L) {
        for (const J of L)
          if (J.type.indexOf("image") !== -1) {
            w.preventDefault();
            const y = J.getAsFile();
            if (y) {
              const K = new FileReader();
              K.onload = (bt) => {
                var We;
                const yt = (We = bt.target) == null ? void 0 : We.result;
                d(yt);
              }, K.readAsDataURL(y);
            }
          }
      }
    }
    function g(w) {
      if (!w || !ae.value) return "";
      const d = ae.value.find((L) => L.id === w);
      return (d == null ? void 0 : d.name) || w;
    }
    function se(w) {
      return S.parse(w);
    }
    function Le(w) {
      i.value = i.value === w ? null : w;
    }
    function Pe(w) {
      l.value = w.id, c.value = w.comment, i.value = null;
    }
    function qe() {
      l.value = null, c.value = "";
    }
    async function Ee(w) {
      if (c.value.trim())
        try {
          await I.mutateAsync({
            id: w,
            comment: c.value
          }), l.value = null, c.value = "";
        } catch (d) {
          console.error("Failed to edit comment:", d);
        }
    }
    return (w, d) => {
      var L, X, J;
      return f(), b("div", ys, [
        a("div", ws, [
          a("button", {
            class: "btn btn-back",
            onClick: d[0] || (d[0] = (y) => n("close"))
          }, " ← Back to Tasks "),
          a("div", xs, [
            B.value !== "summary" ? (f(), b("h2", {
              key: 0,
              class: "header-summary",
              onDblclick: d[1] || (d[1] = (y) => {
                var K;
                return V("summary", ((K = v(u)) == null ? void 0 : K.summary) || "");
              }),
              title: "Double-click to edit summary"
            }, R(((L = v(u)) == null ? void 0 : L.summary) || "Task Details"), 33)) : P((f(), b("input", {
              key: 1,
              "onUpdate:modelValue": d[2] || (d[2] = (y) => z.value = y),
              onBlur: D,
              onKeyup: [
                Be(W, ["esc"]),
                Be(D, ["enter"])
              ],
              ref_key: "editInput",
              ref: H,
              class: "inline-edit",
              style: { "font-size": "1rem", width: "100%" },
              placeholder: "Task Summary"
            }, null, 544)), [
              [te, z.value]
            ])
          ]),
          a("button", {
            class: ne(["btn", (X = v(u)) != null && X.archived ? "btn-success" : "btn-danger"]),
            onClick: Ae
          }, R((J = v(u)) != null && J.archived ? "Unarchive" : "Archive") + " Task ", 3)
        ]),
        r.value ? (f(), b("div", vs, R(r.value), 1)) : Y("", !0),
        v(o) ? (f(), b("div", $s, "Loading task details...")) : v(k) ? (f(), b("div", _s, "Error: " + R(v(k)), 1)) : v(u) ? (f(), b("div", Ss, [
          a("div", Ts, [
            a("div", Rs, [
              d[14] || (d[14] = a("label", null, "Description", -1)),
              a("div", {
                onDblclick: d[4] || (d[4] = (y) => V("description", v(u).description || ""))
              }, [
                B.value === "description" ? P((f(), b("textarea", {
                  key: 0,
                  "onUpdate:modelValue": d[3] || (d[3] = (y) => z.value = y),
                  onBlur: D,
                  onKeyup: Be(W, ["esc"]),
                  onPaste: Ie,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: H
                }, null, 544)), [
                  [te, z.value]
                ]) : (f(), b("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: xe(v(u).description || "")
                }, null, 8, Cs))
              ], 32)
            ]),
            a("div", As, [
              d[21] || (d[21] = a("label", null, "Details", -1)),
              a("div", zs, [
                a("div", Is, [
                  d[16] || (d[16] = a("div", { class: "small-label" }, "Status", -1)),
                  a("div", {
                    onDblclick: d[6] || (d[6] = (y) => V("status", v(u).status))
                  }, [
                    B.value === "status" ? P((f(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": d[5] || (d[5] = (y) => z.value = y),
                      onBlur: D,
                      onChange: D,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H
                    }, [...d[15] || (d[15] = [
                      a("option", { value: "open" }, "Open", -1),
                      a("option", { value: "in-progress" }, "In Progress", -1),
                      a("option", { value: "completed" }, "Completed", -1),
                      a("option", { value: "closed" }, "Closed", -1)
                    ])], 544)), [
                      [re, z.value]
                    ]) : (f(), b("span", {
                      key: 1,
                      class: ne(`status-badge status-${v(u).status}`)
                    }, R(v(u).status), 3))
                  ], 32)
                ]),
                a("div", Ls, [
                  d[18] || (d[18] = a("div", { class: "small-label" }, "Priority", -1)),
                  a("div", {
                    onDblclick: d[8] || (d[8] = (y) => V("priority", v(u).priority))
                  }, [
                    B.value === "priority" ? P((f(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": d[7] || (d[7] = (y) => z.value = y),
                      onBlur: D,
                      onChange: D,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H
                    }, [...d[17] || (d[17] = [
                      a("option", { value: "low" }, "Low", -1),
                      a("option", { value: "medium" }, "Medium", -1),
                      a("option", { value: "high" }, "High", -1),
                      a("option", { value: "critical" }, "Critical", -1)
                    ])], 544)), [
                      [re, z.value]
                    ]) : (f(), b("span", {
                      key: 1,
                      class: ne(`priority-badge priority-${v(u).priority}`)
                    }, R(v(u).priority), 3))
                  ], 32)
                ]),
                a("div", Ps, [
                  d[20] || (d[20] = a("div", { class: "small-label" }, "Assigned", -1)),
                  a("div", {
                    onDblclick: d[10] || (d[10] = (y) => V("assigned_to", v(u).assigned_to || ""))
                  }, [
                    B.value === "assigned_to" ? P((f(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": d[9] || (d[9] = (y) => z.value = y),
                      onBlur: D,
                      onChange: D,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H,
                      disabled: v(oe)
                    }, [
                      d[19] || (d[19] = a("option", { value: "" }, "-- Unassigned --", -1)),
                      (f(!0), b(de, null, he(v(ae), (y) => (f(), b("option", {
                        key: y.id,
                        value: y.id
                      }, R(y.name), 9, Es))), 128))
                    ], 40, qs)), [
                      [re, z.value]
                    ]) : (f(), b("div", Bs, R(g(v(u).assigned_to) || "-"), 1))
                  ], 32)
                ])
              ])
            ])
          ]),
          a("div", Ms, [
            a("div", {
              class: "section-header",
              onClick: d[11] || (d[11] = (y) => Z.value = !Z.value)
            }, [
              a("h3", null, [
                a("span", Ds, R(Z.value ? "▼" : "▶"), 1),
                d[22] || (d[22] = ee(" History ", -1))
              ])
            ]),
            Z.value ? (f(), b("div", Us, [
              v(m) ? (f(), b("div", Fs, "Loading history...")) : v(C) && v(C).length > 0 ? (f(), b("div", Ns, [
                (f(!0), b(de, null, he(v(C), (y) => (f(), b("div", {
                  key: y.id,
                  class: "history-item"
                }, [
                  a("div", Vs, [
                    a("strong", null, R(g(y.changed_by)), 1),
                    a("span", Hs, R(we(y.changed_at)), 1)
                  ]),
                  a("div", Zs, [
                    d[26] || (d[26] = ee(" Changed ", -1)),
                    a("strong", null, R(ze(y.field_name)), 1),
                    a("span", Qs, [
                      d[23] || (d[23] = ee(' from "', -1)),
                      a("span", Os, R(y.old_value), 1),
                      d[24] || (d[24] = ee('" to "', -1)),
                      a("span", Ks, R(y.new_value), 1),
                      d[25] || (d[25] = ee('" ', -1))
                    ])
                  ])
                ]))), 128))
              ])) : (f(), b("div", js, "No history yet"))
            ])) : Y("", !0)
          ]),
          a("div", Gs, [
            d[28] || (d[28] = a("h3", null, "Comments", -1)),
            v(p) ? (f(), b("div", Ws, "Loading comments...")) : v(x) && v(x).length > 0 ? (f(), b("div", Xs, [
              (f(!0), b(de, null, he(v(x), (y) => (f(), b("div", {
                key: y.id,
                class: "comment-item"
              }, [
                a("div", Js, [
                  a("strong", null, R(g(y.created_by)), 1),
                  a("span", Ys, R(we(y.created_at)), 1),
                  y.created_by === t.userId ? (f(), b("div", en, [
                    a("button", {
                      class: "menu-btn",
                      onClick: (K) => Le(y.id)
                    }, "⋮", 8, tn),
                    i.value === y.id ? (f(), b("div", sn, [
                      a("button", {
                        onClick: (K) => Pe(y)
                      }, "Edit", 8, nn)
                    ])) : Y("", !0)
                  ])) : Y("", !0)
                ]),
                l.value === y.id ? (f(), b("div", rn, [
                  P(a("textarea", {
                    "onUpdate:modelValue": d[12] || (d[12] = (K) => c.value = K),
                    rows: "3",
                    class: "comment-input"
                  }, null, 512), [
                    [te, c.value]
                  ]),
                  a("button", {
                    class: "btn-primary",
                    onClick: (K) => Ee(y.id)
                  }, "Save", 8, ln),
                  a("button", {
                    class: "btn",
                    onClick: qe
                  }, "Cancel")
                ])) : (f(), b("div", an, [
                  y.created_by === "Analyze" ? (f(), b("div", {
                    key: 0,
                    class: "comment-text",
                    innerHTML: se(y.comment)
                  }, null, 8, on)) : (f(), b("div", {
                    key: 1,
                    class: "comment-text",
                    innerHTML: xe(y.comment)
                  }, null, 8, cn))
                ]))
              ]))), 128))
            ])) : (f(), b("div", un, "No comments yet")),
            a("div", pn, [
              P(a("textarea", {
                "onUpdate:modelValue": d[13] || (d[13] = (y) => M.value = y),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: $,
                disabled: U.value
              }, null, 40, dn), [
                [te, M.value]
              ]),
              d[27] || (d[27] = a("small", null, "Paste images from clipboard", -1)),
              a("button", {
                onClick: ye,
                disabled: !M.value.trim() || U.value,
                class: "btn-primary"
              }, [
                U.value ? (f(), b("span", kn, "Analyzing...")) : (f(), b("span", gn, "Add Comment"))
              ], 8, hn)
            ])
          ])
        ])) : Y("", !0)
      ]);
    };
  }
}), mt = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [n, r] of e)
    t[n] = r;
  return t;
}, mn = /* @__PURE__ */ mt(fn, [["__scopeId", "data-v-513d9a9f"]]), bn = { class: "tasks-card" }, yn = {
  key: 0,
  class: "loading"
}, wn = {
  key: 1,
  class: "error"
}, xn = {
  key: 2,
  class: "tasks-container"
}, vn = { class: "tasks-header" }, $n = { class: "tasks-header-actions" }, _n = { class: "tasks-filters" }, Sn = { class: "filter-checkbox" }, Tn = { class: "tasks-table-wrapper" }, Rn = { class: "tasks-table" }, Cn = {
  key: 0,
  class: "no-results"
}, An = { class: "task-actions" }, zn = ["onClick"], In = ["onClick", "title", "disabled"], Ln = { key: 0 }, Pn = { key: 1 }, qn = {
  key: 3,
  class: "task-form-container"
}, En = { class: "form-body" }, Bn = { class: "form-group" }, Mn = { class: "form-group" }, Dn = { class: "form-row" }, Un = { class: "form-group" }, Fn = { class: "form-group" }, Nn = { class: "form-group" }, Vn = ["disabled"], Hn = ["value"], Zn = { class: "form-actions" }, Qn = ["disabled"], On = {
  key: 5,
  class: "rename-dialog-backdrop"
}, Kn = { class: "rename-dialog" }, jn = { class: "dialog-actions" }, Gn = /* @__PURE__ */ nt({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = A(""), l = A(""), c = A("list"), i = A(null);
    A(null), A(""), A(null);
    const u = A({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: t.userId
    }), o = A(!1), k = A(null);
    A(null);
    const x = Me(() => ({
      status: l.value || void 0
    })), { data: p, isLoading: C, error: m } = At(x), I = Pt(), F = rt();
    Et();
    const { data: N, isLoading: B } = it(), z = Me(() => {
      if (!p.value) return [];
      const $ = r.value.toLowerCase().trim();
      let h = p.value.filter((g) => o.value ? !!g.archived : !g.archived);
      return $ ? h.filter((g) => {
        var w, d, L, X, J;
        const se = ((w = g.summary) == null ? void 0 : w.toLowerCase()) || "", Le = ((d = g.description) == null ? void 0 : d.toLowerCase()) || "", Pe = ((L = g.status) == null ? void 0 : L.toLowerCase().replace("_", " ")) || "", qe = ((X = g.priority) == null ? void 0 : X.toLowerCase()) || "", Ee = ((J = g.assigned_to) == null ? void 0 : J.toLowerCase()) || "";
        return se.includes($) || Le.includes($) || Pe.includes($) || qe.includes($) || Ee.includes($);
      }) : h;
    });
    function H($) {
      return new Date($).toLocaleDateString();
    }
    async function M() {
      try {
        await I.mutateAsync(u.value), Z(), c.value = "list";
      } catch ($) {
        console.error("Failed to create task:", $);
      }
    }
    function Z() {
      u.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: t.userId
      };
    }
    function U() {
      Z(), c.value = "create";
    }
    function ae($) {
      i.value = $, c.value = "detail";
    }
    function oe() {
      c.value = "list", i.value = null;
    }
    const V = A("Task Management"), W = A(!1), D = A("");
    function ye() {
      return new URL(window.location.href).searchParams.get("app_name") || "Task Management";
    }
    function Ae($) {
      const h = new URL(window.location.href);
      $ && $.trim() && $ !== "Task Management" ? h.searchParams.set("app_name", $.trim()) : h.searchParams.delete("app_name"), window.history.replaceState({}, "", h.toString());
    }
    function we() {
      D.value = V.value, W.value = !0;
    }
    function ze() {
      V.value = D.value.trim() || "Task Management", Ae(V.value), W.value = !1;
    }
    _t(() => {
      const h = new URLSearchParams(window.location.search).get("taskId");
      h && (i.value = h, c.value = "detail"), V.value = ye(), window.addEventListener("popstate", () => {
        V.value = ye();
      });
    }), St([i, c], ([$, h]) => {
      const g = new URLSearchParams(window.location.search);
      h === "detail" && $ ? g.set("taskId", $) : g.delete("taskId");
      const se = `${window.location.pathname}?${g.toString()}`;
      window.history.replaceState({}, "", se);
    });
    async function xe($) {
      k.value = $.id;
      try {
        await F.mutateAsync({
          id: $.id,
          updates: { archived: !$.archived },
          userId: t.userId
        });
      } catch (h) {
        console.error("Failed to archive/unarchive task:", h);
      } finally {
        k.value = null;
      }
    }
    function Ie($) {
      if (!$ || !N.value) return "";
      const h = N.value.find((g) => g.id === $);
      return (h == null ? void 0 : h.name) || $;
    }
    return ($, h) => (f(), b("div", bn, [
      v(C) && !v(p) ? (f(), b("div", yn, [...h[12] || (h[12] = [
        a("div", { class: "loading-spinner" }, null, -1),
        ee(" Loading tasks... ", -1)
      ])])) : v(m) ? (f(), b("div", wn, [
        h[13] || (h[13] = a("h3", null, "Error loading tasks", -1)),
        a("p", null, R(v(m)), 1)
      ])) : c.value === "list" ? (f(), b("div", xn, [
        a("div", vn, [
          a("h2", {
            class: ne({ "tasks-header-clickable": t.showHeaderLink }),
            onClick: h[0] || (h[0] = (g) => t.showHeaderLink && n("navigate"))
          }, [
            ee(R(V.value) + " ", 1),
            a("button", {
              class: "appname-rename-btn",
              onClick: we,
              title: "Rename app",
              style: { width: "auto", padding: "2px 7px", "font-size": "13px", background: "none", border: "none", color: "#888", cursor: "pointer" }
            }, "✎")
          ], 2),
          a("div", $n, [
            a("button", {
              class: "btn btn-add",
              onClick: U
            }, [...h[14] || (h[14] = [
              a("span", { class: "icon" }, "➕", -1)
            ])]),
            a("button", {
              class: "btn btn-minimize",
              onClick: h[1] || (h[1] = (g) => n("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        a("div", _n, [
          P(a("input", {
            "onUpdate:modelValue": h[2] || (h[2] = (g) => r.value = g),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [te, r.value]
          ]),
          P(a("select", {
            "onUpdate:modelValue": h[3] || (h[3] = (g) => l.value = g),
            class: "filter-select"
          }, [...h[15] || (h[15] = [
            a("option", { value: "" }, "All Status", -1),
            a("option", { value: "open" }, "Open", -1),
            a("option", { value: "in_progress" }, "In Progress", -1),
            a("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [re, l.value]
          ]),
          a("label", Sn, [
            P(a("input", {
              type: "checkbox",
              "onUpdate:modelValue": h[4] || (h[4] = (g) => o.value = g)
            }, null, 512), [
              [Rt, o.value]
            ]),
            h[16] || (h[16] = ee(" Show Archived ", -1))
          ])
        ]),
        a("div", Tn, [
          a("table", Rn, [
            h[19] || (h[19] = a("thead", null, [
              a("tr", null, [
                a("th", null, "Summary"),
                a("th", null, "Status"),
                a("th", null, "Priority"),
                a("th", null, "Assigned To"),
                a("th", null, "Created"),
                a("th", null, "Actions")
              ])
            ], -1)),
            a("tbody", null, [
              z.value.length === 0 ? (f(), b("tr", Cn, [...h[17] || (h[17] = [
                a("td", {
                  colspan: "6",
                  class: "no-results-cell"
                }, [
                  a("div", { class: "no-results-content" }, [
                    a("span", { class: "no-results-icon" }, "🗂️"),
                    a("span", { class: "no-results-text" }, [
                      a("strong", null, "No tasks found.")
                    ])
                  ])
                ], -1)
              ])])) : Y("", !0),
              (f(!0), b(de, null, he(z.value, (g) => (f(), b("tr", {
                key: g.id
              }, [
                a("td", null, R(g.summary), 1),
                a("td", null, [
                  a("span", {
                    class: ne(`status-badge status-${g.status}`)
                  }, R(g.status), 3)
                ]),
                a("td", null, [
                  a("span", {
                    class: ne(`priority-badge priority-${g.priority}`)
                  }, R(g.priority), 3)
                ]),
                a("td", null, R(Ie(g.assigned_to) || "-"), 1),
                a("td", null, R(H(g.created_at)), 1),
                a("td", An, [
                  a("button", {
                    class: "btn btn-icon",
                    onClick: (se) => ae(g.id),
                    title: "View details"
                  }, " 👁️ ", 8, zn),
                  a("button", {
                    class: ne(["btn btn-icon", g.archived ? "btn-success" : "btn-danger"]),
                    onClick: (se) => xe(g),
                    title: g.archived ? "Unarchive task" : "Archive task",
                    disabled: k.value === g.id
                  }, [
                    k.value === g.id ? (f(), b("span", Ln, [...h[18] || (h[18] = [
                      a("span", {
                        class: "loading-spinner",
                        style: { display: "inline-block", width: "1em", height: "1em", "border-width": "2px" }
                      }, null, -1)
                    ])])) : (f(), b("span", Pn, R(g.archived ? "↩️" : "🗑️"), 1))
                  ], 10, In)
                ])
              ]))), 128))
            ])
          ])
        ])
      ])) : c.value === "create" ? (f(), b("div", qn, [
        a("div", { class: "form-header" }, [
          a("button", {
            class: "btn btn-back",
            onClick: oe
          }, " ← Back to Tasks "),
          h[20] || (h[20] = a("h2", null, "Create New Task", -1))
        ]),
        a("div", En, [
          a("div", Bn, [
            h[21] || (h[21] = a("label", { for: "task-summary" }, "Summary *", -1)),
            P(a("input", {
              id: "task-summary",
              "onUpdate:modelValue": h[5] || (h[5] = (g) => u.value.summary = g),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [te, u.value.summary]
            ])
          ]),
          a("div", Mn, [
            h[22] || (h[22] = a("label", { for: "task-description" }, "Description", -1)),
            P(a("textarea", {
              id: "task-description",
              "onUpdate:modelValue": h[6] || (h[6] = (g) => u.value.description = g),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [te, u.value.description]
            ])
          ]),
          a("div", Dn, [
            a("div", Un, [
              h[24] || (h[24] = a("label", { for: "task-status" }, "Status", -1)),
              P(a("select", {
                id: "task-status",
                "onUpdate:modelValue": h[7] || (h[7] = (g) => u.value.status = g)
              }, [...h[23] || (h[23] = [
                a("option", { value: "open" }, "Open", -1),
                a("option", { value: "in_progress" }, "In Progress", -1),
                a("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [re, u.value.status]
              ])
            ]),
            a("div", Fn, [
              h[26] || (h[26] = a("label", { for: "task-priority" }, "Priority", -1)),
              P(a("select", {
                id: "task-priority",
                "onUpdate:modelValue": h[8] || (h[8] = (g) => u.value.priority = g)
              }, [...h[25] || (h[25] = [
                a("option", { value: "low" }, "Low", -1),
                a("option", { value: "medium" }, "Medium", -1),
                a("option", { value: "high" }, "High", -1)
              ])], 512), [
                [re, u.value.priority]
              ])
            ])
          ]),
          a("div", Nn, [
            h[28] || (h[28] = a("label", { for: "task-assigned" }, "Assigned To", -1)),
            P(a("select", {
              id: "task-assigned",
              "onUpdate:modelValue": h[9] || (h[9] = (g) => u.value.assigned_to = g),
              disabled: v(B)
            }, [
              h[27] || (h[27] = a("option", { value: "" }, "-- Select User --", -1)),
              (f(!0), b(de, null, he(v(N), (g) => (f(), b("option", {
                key: g.id,
                value: g.id
              }, R(g.name), 9, Hn))), 128))
            ], 8, Vn), [
              [re, u.value.assigned_to]
            ])
          ]),
          a("div", Zn, [
            a("button", {
              class: "btn btn-cancel",
              onClick: oe
            }, "Cancel"),
            a("button", {
              class: "btn btn-primary",
              onClick: M,
              disabled: !u.value.summary.trim()
            }, " Create Task ", 8, Qn)
          ])
        ])
      ])) : c.value === "detail" && i.value ? (f(), Tt(mn, {
        key: 4,
        "task-id": i.value,
        "user-id": s.userId,
        onClose: oe
      }, null, 8, ["task-id", "user-id"])) : Y("", !0),
      W.value ? (f(), b("div", On, [
        a("div", Kn, [
          h[29] || (h[29] = a("h3", null, "Rename App", -1)),
          P(a("input", {
            "onUpdate:modelValue": h[10] || (h[10] = (g) => D.value = g),
            placeholder: "App name"
          }, null, 512), [
            [te, D.value]
          ]),
          a("div", jn, [
            a("button", { onClick: ze }, "Save"),
            a("button", {
              onClick: h[11] || (h[11] = (g) => W.value = !1)
            }, "Cancel")
          ])
        ])
      ])) : Y("", !0)
    ]));
  }
}), Yn = /* @__PURE__ */ mt(Gn, [["__scopeId", "data-v-1cd4aaac"]]);
export {
  mn as TaskDetail,
  Yn as Tasks
};
