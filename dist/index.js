var dt = Object.defineProperty;
var ht = (t, e, s) => e in t ? dt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var T = (t, e, s) => ht(t, typeof e != "symbol" ? e + "" : e, s);
import { inject as gt, computed as ze, unref as w, defineComponent as Ge, ref as L, createElementBlock as b, openBlock as m, createElementVNode as a, createCommentVNode as ce, withDirectives as B, toDisplayString as A, withKeys as Ae, vModelText as te, normalizeClass as X, vModelSelect as J, Fragment as ue, renderList as pe, createTextVNode as W, nextTick as kt, onMounted as ft, watch as mt, createBlock as bt, vModelCheckbox as yt } from "vue";
import { useQuery as he, useQueryClient as ve, useMutation as $e } from "@tanstack/vue-query";
const xt = Symbol.for("y2kfund.supabase");
function V() {
  const t = gt(xt, null);
  if (!t) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return t;
}
const E = {
  all: ["tasks"],
  list: (t) => [...E.all, "list", t],
  detail: (t) => [...E.all, "detail", t],
  comments: (t) => [...E.all, "comments", t],
  history: (t) => [...E.all, "history", t]
};
function wt(t) {
  const e = V();
  return he({
    queryKey: ze(() => {
      const s = t ? w(t) : {};
      return E.list(s);
    }),
    queryFn: async () => {
      const s = t ? w(t) : {};
      let n = e.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (s != null && s.status && (n = n.eq("status", s.status)), s != null && s.search && s.search.trim()) {
        const c = s.search.trim();
        n = n.or(`summary.ilike.%${c}%,description.ilike.%${c}%`);
      }
      const { data: r, error: i } = await n;
      if (i) throw i;
      return r;
    }
  });
}
function vt(t) {
  const e = V();
  return he({
    queryKey: E.detail(t),
    queryFn: async () => {
      const { data: s, error: n } = await e.schema("hf").from("tasks").select("*").eq("id", t).single();
      if (n) throw n;
      return s;
    },
    enabled: !!t
  });
}
function $t(t) {
  const e = V();
  return he({
    queryKey: E.comments(t),
    queryFn: async () => {
      const { data: s, error: n } = await e.schema("hf").from("task_comments").select("*").eq("task_id", t).order("created_at", { ascending: !1 });
      if (n) throw n;
      return s;
    },
    enabled: !!t
  });
}
function _t(t) {
  const e = V();
  return he({
    queryKey: E.history(t),
    queryFn: async () => {
      const { data: s, error: n } = await e.schema("hf").from("task_history").select("*").eq("task_id", t).order("changed_at", { ascending: !1 });
      if (n) throw n;
      return s;
    },
    enabled: !!t
  });
}
function St() {
  const t = V(), e = ve();
  return $e({
    mutationFn: async (s) => {
      const { data: n, error: r } = await t.schema("hf").from("tasks").insert(s).select().single();
      if (r) throw r;
      return n;
    },
    onSuccess: () => {
      e.invalidateQueries({ queryKey: E.all });
    }
  });
}
function We() {
  const t = V(), e = ve();
  return $e({
    mutationFn: async ({
      id: s,
      updates: n,
      userId: r
    }) => {
      const { data: i, error: c } = await t.schema("hf").from("tasks").select("*").eq("id", s).single();
      if (c) throw c;
      const { data: l, error: u } = await t.schema("hf").from("tasks").update(n).eq("id", s).select().single();
      if (u) throw u;
      const o = Object.keys(n).filter((g) => i[g] !== n[g]).map((g) => ({
        task_id: s,
        field_name: g,
        old_value: String(i[g] || ""),
        new_value: String(n[g] || ""),
        changed_by: r
      }));
      if (o.length > 0) {
        const { error: g } = await t.schema("hf").from("task_history").insert(o);
        g && console.error("Failed to save history:", g);
      }
      return l;
    },
    onSuccess: (s) => {
      e.invalidateQueries({ queryKey: E.all }), e.invalidateQueries({ queryKey: E.detail(s.id) }), e.invalidateQueries({ queryKey: E.history(s.id) });
    }
  });
}
function Tt() {
  const t = V(), e = ve();
  return $e({
    mutationFn: async (s) => {
      const { data: n, error: r } = await t.schema("hf").from("task_comments").insert(s).select().single();
      if (r) throw r;
      return n;
    },
    onSuccess: (s) => {
      e.invalidateQueries({ queryKey: E.comments(s.task_id) });
    }
  });
}
function Rt() {
  const t = V(), e = ve();
  return $e({
    mutationFn: async (s) => {
      await t.schema("hf").from("task_comments").delete().eq("task_id", s), await t.schema("hf").from("task_history").delete().eq("task_id", s);
      const { error: n } = await t.schema("hf").from("tasks").delete().eq("id", s);
      if (n) throw n;
      return s;
    },
    onSuccess: () => {
      e.invalidateQueries({ queryKey: E.all });
    }
  });
}
function Xe() {
  const t = V();
  return he({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: e, error: s } = await t.from("users_view").select("id, email, name").order("email");
      if (s) throw s;
      return (e || []).map((n) => ({
        id: n.id,
        email: n.email,
        name: n.name || n.email
      }));
    },
    staleTime: 5 * 60 * 1e3
  });
}
function qe() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ee = qe();
function Je(t) {
  ee = t;
}
var de = { exec: () => null };
function _(t, e = "") {
  let s = typeof t == "string" ? t : t.source, n = { replace: (r, i) => {
    let c = typeof i == "string" ? i : i.source;
    return c = c.replace(P.caret, "$1"), s = s.replace(r, c), n;
  }, getRegex: () => new RegExp(s, e) };
  return n;
}
var P = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i") }, At = /^(?:[ \t]*(?:\n|$))+/, zt = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ct = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, ge = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, It = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Pe = /(?:[*+-]|\d{1,9}[.)])/, Ye = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, et = _(Ye).replace(/bull/g, Pe).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Lt = _(Ye).replace(/bull/g, Pe).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Be = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, qt = /^[^\n]+/, Ee = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Pt = _(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ee).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Bt = _(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Pe).getRegex(), _e = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", De = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Et = _("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", De).replace("tag", _e).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), tt = _(Be).replace("hr", ge).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _e).getRegex(), Dt = _(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", tt).getRegex(), Me = { blockquote: Dt, code: zt, def: Pt, fences: Ct, heading: It, hr: ge, html: Et, lheading: et, list: Bt, newline: At, paragraph: tt, table: de, text: qt }, Ne = _("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", ge).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _e).getRegex(), Mt = { ...Me, lheading: Lt, table: Ne, paragraph: _(Be).replace("hr", ge).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Ne).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _e).getRegex() }, Ft = { ...Me, html: _(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", De).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: de, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: _(Be).replace("hr", ge).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", et).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Ut = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ht = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, st = /^( {2,}|\\)\n(?!\s*$)/, Zt = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Se = /[\p{P}\p{S}]/u, Fe = /[\s\p{P}\p{S}]/u, nt = /[^\s\p{P}\p{S}]/u, Nt = _(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Fe).getRegex(), rt = /(?!~)[\p{P}\p{S}]/u, Qt = /(?!~)[\s\p{P}\p{S}]/u, Vt = /(?:[^\s\p{P}\p{S}]|~)/u, Ot = _(/link|code|html/, "g").replace("link", new RegExp("\\[(?:[^\\[\\]`]|(?<!`)(?<a>`+)[^`]+\\k<a>(?!`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)")).replace("code", new RegExp("(?<!`)(?<b>`+)[^`]+\\k<b>(?!`)")).replace("html", /<(?! )[^<>]*?>/).getRegex(), it = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Kt = _(it, "u").replace(/punct/g, Se).getRegex(), jt = _(it, "u").replace(/punct/g, rt).getRegex(), lt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Gt = _(lt, "gu").replace(/notPunctSpace/g, nt).replace(/punctSpace/g, Fe).replace(/punct/g, Se).getRegex(), Wt = _(lt, "gu").replace(/notPunctSpace/g, Vt).replace(/punctSpace/g, Qt).replace(/punct/g, rt).getRegex(), Xt = _("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, nt).replace(/punctSpace/g, Fe).replace(/punct/g, Se).getRegex(), Jt = _(/\\(punct)/, "gu").replace(/punct/g, Se).getRegex(), Yt = _(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), es = _(De).replace("(?:-->|$)", "-->").getRegex(), ts = _("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", es).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ye = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ss = _(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ye).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), at = _(/^!?\[(label)\]\[(ref)\]/).replace("label", ye).replace("ref", Ee).getRegex(), ot = _(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ee).getRegex(), ns = _("reflink|nolink(?!\\()", "g").replace("reflink", at).replace("nolink", ot).getRegex(), Qe = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Ue = { _backpedal: de, anyPunctuation: Jt, autolink: Yt, blockSkip: Ot, br: st, code: Ht, del: de, emStrongLDelim: Kt, emStrongRDelimAst: Gt, emStrongRDelimUnd: Xt, escape: Ut, link: ss, nolink: ot, punctuation: Nt, reflink: at, reflinkSearch: ns, tag: ts, text: Zt, url: de }, rs = { ...Ue, link: _(/^!?\[(label)\]\((.*?)\)/).replace("label", ye).getRegex(), reflink: _(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ye).getRegex() }, Ce = { ...Ue, emStrongRDelimAst: Wt, emStrongLDelim: jt, url: _(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Qe).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: _(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Qe).getRegex() }, is = { ...Ce, br: _(st).replace("{2,}", "*").getRegex(), text: _(Ce.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, me = { normal: Me, gfm: Mt, pedantic: Ft }, le = { normal: Ue, gfm: Ce, breaks: is, pedantic: rs }, ls = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ve = (t) => ls[t];
function N(t, e) {
  if (e) {
    if (P.escapeTest.test(t)) return t.replace(P.escapeReplace, Ve);
  } else if (P.escapeTestNoEncode.test(t)) return t.replace(P.escapeReplaceNoEncode, Ve);
  return t;
}
function Oe(t) {
  try {
    t = encodeURI(t).replace(P.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function Ke(t, e) {
  var i;
  let s = t.replace(P.findPipe, (c, l, u) => {
    let o = !1, g = l;
    for (; --g >= 0 && u[g] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), n = s.split(P.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !((i = n.at(-1)) != null && i.trim()) && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(P.slashPipe, "|");
  return n;
}
function ae(t, e, s) {
  let n = t.length;
  if (n === 0) return "";
  let r = 0;
  for (; r < n && t.charAt(n - r - 1) === e; )
    r++;
  return t.slice(0, n - r);
}
function as(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let s = 0;
  for (let n = 0; n < t.length; n++) if (t[n] === "\\") n++;
  else if (t[n] === e[0]) s++;
  else if (t[n] === e[1] && (s--, s < 0)) return n;
  return s > 0 ? -2 : -1;
}
function je(t, e, s, n, r) {
  let i = e.href, c = e.title || null, l = t[1].replace(r.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let u = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: s, href: i, title: c, text: l, tokens: n.inlineTokens(l) };
  return n.state.inLink = !1, u;
}
function os(t, e, s) {
  let n = t.match(s.other.indentCodeCompensation);
  if (n === null) return e;
  let r = n[1];
  return e.split(`
`).map((i) => {
    let c = i.match(s.other.beginningSpace);
    if (c === null) return i;
    let [l] = c;
    return l.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
var xe = class {
  constructor(t) {
    T(this, "options");
    T(this, "rules");
    T(this, "lexer");
    this.options = t || ee;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let s = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? s : ae(s, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let s = e[0], n = os(s, e[3] || "", this.rules);
      return { type: "code", raw: s, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let s = e[2].trim();
      if (this.rules.other.endingHash.test(s)) {
        let n = ae(s, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (s = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: s, tokens: this.lexer.inline(s) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: ae(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let s = ae(e[0], `
`).split(`
`), n = "", r = "", i = [];
      for (; s.length > 0; ) {
        let c = !1, l = [], u;
        for (u = 0; u < s.length; u++) if (this.rules.other.blockquoteStart.test(s[u])) l.push(s[u]), c = !0;
        else if (!c) l.push(s[u]);
        else break;
        s = s.slice(u);
        let o = l.join(`
`), g = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? `${n}
${o}` : o, r = r ? `${r}
${g}` : g;
        let x = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(g, i, !0), this.lexer.state.top = x, s.length === 0) break;
        let p = i.at(-1);
        if ((p == null ? void 0 : p.type) === "code") break;
        if ((p == null ? void 0 : p.type) === "blockquote") {
          let z = p, k = z.raw + `
` + s.join(`
`), $ = this.blockquote(k);
          i[i.length - 1] = $, n = n.substring(0, n.length - z.raw.length) + $.raw, r = r.substring(0, r.length - z.text.length) + $.text;
          break;
        } else if ((p == null ? void 0 : p.type) === "list") {
          let z = p, k = z.raw + `
` + s.join(`
`), $ = this.list(k);
          i[i.length - 1] = $, n = n.substring(0, n.length - p.raw.length) + $.raw, r = r.substring(0, r.length - z.raw.length) + $.raw, s = k.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: i, text: r };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let s = e[1].trim(), n = s.length > 1, r = { type: "list", raw: "", ordered: n, start: n ? +s.slice(0, -1) : "", loose: !1, items: [] };
      s = n ? `\\d{1,9}\\${s.slice(-1)}` : `\\${s}`, this.options.pedantic && (s = n ? s : "[*+-]");
      let i = this.rules.other.listItemRegex(s), c = !1;
      for (; t; ) {
        let u = !1, o = "", g = "";
        if (!(e = i.exec(t)) || this.rules.block.hr.test(t)) break;
        o = e[0], t = t.substring(o.length);
        let x = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (C) => " ".repeat(3 * C.length)), p = t.split(`
`, 1)[0], z = !x.trim(), k = 0;
        if (this.options.pedantic ? (k = 2, g = x.trimStart()) : z ? k = e[1].length + 1 : (k = e[2].search(this.rules.other.nonSpaceChar), k = k > 4 ? 1 : k, g = x.slice(k), k += e[1].length), z && this.rules.other.blankLine.test(p) && (o += p + `
`, t = t.substring(p.length + 1), u = !0), !u) {
          let C = this.rules.other.nextBulletRegex(k), Q = this.rules.other.hrRegex(k), M = this.rules.other.fencesBeginRegex(k), O = this.rules.other.headingBeginRegex(k), se = this.rules.other.htmlBeginRegex(k);
          for (; t; ) {
            let D = t.split(`
`, 1)[0], F;
            if (p = D, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), F = p) : F = p.replace(this.rules.other.tabCharGlobal, "    "), M.test(p) || O.test(p) || se.test(p) || C.test(p) || Q.test(p)) break;
            if (F.search(this.rules.other.nonSpaceChar) >= k || !p.trim()) g += `
` + F.slice(k);
            else {
              if (z || x.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || M.test(x) || O.test(x) || Q.test(x)) break;
              g += `
` + p;
            }
            !z && !p.trim() && (z = !0), o += D + `
`, t = t.substring(D.length + 1), x = F.slice(k);
          }
        }
        r.loose || (c ? r.loose = !0 : this.rules.other.doubleBlankLine.test(o) && (c = !0));
        let $ = null, q;
        this.options.gfm && ($ = this.rules.other.listIsTask.exec(g), $ && (q = $[0] !== "[ ] ", g = g.replace(this.rules.other.listReplaceTask, ""))), r.items.push({ type: "list_item", raw: o, task: !!$, checked: q, loose: !1, text: g, tokens: [] }), r.raw += o;
      }
      let l = r.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let u = 0; u < r.items.length; u++) if (this.lexer.state.top = !1, r.items[u].tokens = this.lexer.blockTokens(r.items[u].text, []), !r.loose) {
        let o = r.items[u].tokens.filter((x) => x.type === "space"), g = o.length > 0 && o.some((x) => this.rules.other.anyLine.test(x.raw));
        r.loose = g;
      }
      if (r.loose) for (let u = 0; u < r.items.length; u++) r.items[u].loose = !0;
      return r;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let s = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: s, raw: e[0], href: n, title: r };
    }
  }
  table(t) {
    var c;
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let s = Ke(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = (c = e[3]) != null && c.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (s.length === n.length) {
      for (let l of n) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < s.length; l++) i.header.push({ text: s[l], tokens: this.lexer.inline(s[l]), header: !0, align: i.align[l] });
      for (let l of r) i.rows.push(Ke(l, i.header.length).map((u, o) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: i.align[o] })));
      return i;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(t) {
    let e = this.rules.block.paragraph.exec(t);
    if (e) {
      let s = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: s, tokens: this.lexer.inline(s) };
    }
  }
  text(t) {
    let e = this.rules.block.text.exec(t);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(t) {
    let e = this.rules.inline.escape.exec(t);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(t) {
    let e = this.rules.inline.tag.exec(t);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(t) {
    let e = this.rules.inline.link.exec(t);
    if (e) {
      let s = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(s)) {
        if (!this.rules.other.endAngleBracket.test(s)) return;
        let i = ae(s.slice(0, -1), "\\");
        if ((s.length - i.length) % 2 === 0) return;
      } else {
        let i = as(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let c = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, c).trim(), e[3] = "";
        }
      }
      let n = e[2], r = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(n);
        i && (n = i[1], r = i[3]);
      } else r = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(s) ? n = n.slice(1) : n = n.slice(1, -1)), je(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let s;
    if ((s = this.rules.inline.reflink.exec(t)) || (s = this.rules.inline.nolink.exec(t))) {
      let n = (s[2] || s[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[n.toLowerCase()];
      if (!r) {
        let i = s[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return je(s, r, s[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, s = "") {
    let n = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!n || n[3] && s.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !s || this.rules.inline.punctuation.exec(s))) {
      let r = [...n[0]].length - 1, i, c, l = r, u = 0, o = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (o.lastIndex = 0, e = e.slice(-1 * t.length + r); (n = o.exec(e)) != null; ) {
        if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !i) continue;
        if (c = [...i].length, n[3] || n[4]) {
          l += c;
          continue;
        } else if ((n[5] || n[6]) && r % 3 && !((r + c) % 3)) {
          u += c;
          continue;
        }
        if (l -= c, l > 0) continue;
        c = Math.min(c, c + l + u);
        let g = [...n[0]][0].length, x = t.slice(0, r + n.index + g + c);
        if (Math.min(r, c) % 2) {
          let z = x.slice(1, -1);
          return { type: "em", raw: x, text: z, tokens: this.lexer.inlineTokens(z) };
        }
        let p = x.slice(2, -2);
        return { type: "strong", raw: x, text: p, tokens: this.lexer.inlineTokens(p) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let s = e[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(s), r = this.rules.other.startingSpaceChar.test(s) && this.rules.other.endingSpaceChar.test(s);
      return n && r && (s = s.substring(1, s.length - 1)), { type: "codespan", raw: e[0], text: s };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t) {
    let e = this.rules.inline.del.exec(t);
    if (e) return { type: "del", raw: e[0], text: e[2], tokens: this.lexer.inlineTokens(e[2]) };
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let s, n;
      return e[2] === "@" ? (s = e[1], n = "mailto:" + s) : (s = e[1], n = s), { type: "link", raw: e[0], text: s, href: n, tokens: [{ type: "text", raw: s, text: s }] };
    }
  }
  url(t) {
    var s;
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let n, r;
      if (e[2] === "@") n = e[0], r = "mailto:" + n;
      else {
        let i;
        do
          i = e[0], e[0] = ((s = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : s[0]) ?? "";
        while (i !== e[0]);
        n = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let s = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: s };
    }
  }
}, H = class Ie {
  constructor(e) {
    T(this, "tokens");
    T(this, "options");
    T(this, "state");
    T(this, "tokenizer");
    T(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ee, this.options.tokenizer = this.options.tokenizer || new xe(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let s = { other: P, block: me.normal, inline: le.normal };
    this.options.pedantic ? (s.block = me.pedantic, s.inline = le.pedantic) : this.options.gfm && (s.block = me.gfm, this.options.breaks ? s.inline = le.breaks : s.inline = le.gfm), this.tokenizer.rules = s;
  }
  static get rules() {
    return { block: me, inline: le };
  }
  static lex(e, s) {
    return new Ie(s).lex(e);
  }
  static lexInline(e, s) {
    return new Ie(s).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(P.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let s = 0; s < this.inlineQueue.length; s++) {
      let n = this.inlineQueue[s];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, s = [], n = !1) {
    var r, i, c;
    for (this.options.pedantic && (e = e.replace(P.tabCharGlobal, "    ").replace(P.spaceLine, "")); e; ) {
      let l;
      if ((i = (r = this.options.extensions) == null ? void 0 : r.block) != null && i.some((o) => (l = o.call({ lexer: this }, e, s)) ? (e = e.substring(l.raw.length), s.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.space(e)) {
        e = e.substring(l.raw.length);
        let o = s.at(-1);
        l.raw.length === 1 && o !== void 0 ? o.raw += `
` : s.push(l);
        continue;
      }
      if (l = this.tokenizer.code(e)) {
        e = e.substring(l.raw.length);
        let o = s.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + l.raw, o.text += `
` + l.text, this.inlineQueue.at(-1).src = o.text) : s.push(l);
        continue;
      }
      if (l = this.tokenizer.fences(e)) {
        e = e.substring(l.raw.length), s.push(l);
        continue;
      }
      if (l = this.tokenizer.heading(e)) {
        e = e.substring(l.raw.length), s.push(l);
        continue;
      }
      if (l = this.tokenizer.hr(e)) {
        e = e.substring(l.raw.length), s.push(l);
        continue;
      }
      if (l = this.tokenizer.blockquote(e)) {
        e = e.substring(l.raw.length), s.push(l);
        continue;
      }
      if (l = this.tokenizer.list(e)) {
        e = e.substring(l.raw.length), s.push(l);
        continue;
      }
      if (l = this.tokenizer.html(e)) {
        e = e.substring(l.raw.length), s.push(l);
        continue;
      }
      if (l = this.tokenizer.def(e)) {
        e = e.substring(l.raw.length);
        let o = s.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + l.raw, o.text += `
` + l.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[l.tag] || (this.tokens.links[l.tag] = { href: l.href, title: l.title }, s.push(l));
        continue;
      }
      if (l = this.tokenizer.table(e)) {
        e = e.substring(l.raw.length), s.push(l);
        continue;
      }
      if (l = this.tokenizer.lheading(e)) {
        e = e.substring(l.raw.length), s.push(l);
        continue;
      }
      let u = e;
      if ((c = this.options.extensions) != null && c.startBlock) {
        let o = 1 / 0, g = e.slice(1), x;
        this.options.extensions.startBlock.forEach((p) => {
          x = p.call({ lexer: this }, g), typeof x == "number" && x >= 0 && (o = Math.min(o, x));
        }), o < 1 / 0 && o >= 0 && (u = e.substring(0, o + 1));
      }
      if (this.state.top && (l = this.tokenizer.paragraph(u))) {
        let o = s.at(-1);
        n && (o == null ? void 0 : o.type) === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + l.raw, o.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : s.push(l), n = u.length !== e.length, e = e.substring(l.raw.length);
        continue;
      }
      if (l = this.tokenizer.text(e)) {
        e = e.substring(l.raw.length);
        let o = s.at(-1);
        (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + l.raw, o.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : s.push(l);
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
    return this.state.top = !0, s;
  }
  inline(e, s = []) {
    return this.inlineQueue.push({ src: e, tokens: s }), s;
  }
  inlineTokens(e, s = []) {
    var l, u, o, g, x;
    let n = e, r = null;
    if (this.tokens.links) {
      let p = Object.keys(this.tokens.links);
      if (p.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) p.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = ((u = (l = this.options.hooks) == null ? void 0 : l.emStrongMask) == null ? void 0 : u.call({ lexer: this }, n)) ?? n;
    let i = !1, c = "";
    for (; e; ) {
      i || (c = ""), i = !1;
      let p;
      if ((g = (o = this.options.extensions) == null ? void 0 : o.inline) != null && g.some((k) => (p = k.call({ lexer: this }, e, s)) ? (e = e.substring(p.raw.length), s.push(p), !0) : !1)) continue;
      if (p = this.tokenizer.escape(e)) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      if (p = this.tokenizer.tag(e)) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      if (p = this.tokenizer.link(e)) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      if (p = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(p.raw.length);
        let k = s.at(-1);
        p.type === "text" && (k == null ? void 0 : k.type) === "text" ? (k.raw += p.raw, k.text += p.text) : s.push(p);
        continue;
      }
      if (p = this.tokenizer.emStrong(e, n, c)) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      if (p = this.tokenizer.codespan(e)) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      if (p = this.tokenizer.br(e)) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      if (p = this.tokenizer.del(e)) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      if (p = this.tokenizer.autolink(e)) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      if (!this.state.inLink && (p = this.tokenizer.url(e))) {
        e = e.substring(p.raw.length), s.push(p);
        continue;
      }
      let z = e;
      if ((x = this.options.extensions) != null && x.startInline) {
        let k = 1 / 0, $ = e.slice(1), q;
        this.options.extensions.startInline.forEach((C) => {
          q = C.call({ lexer: this }, $), typeof q == "number" && q >= 0 && (k = Math.min(k, q));
        }), k < 1 / 0 && k >= 0 && (z = e.substring(0, k + 1));
      }
      if (p = this.tokenizer.inlineText(z)) {
        e = e.substring(p.raw.length), p.raw.slice(-1) !== "_" && (c = p.raw.slice(-1)), i = !0;
        let k = s.at(-1);
        (k == null ? void 0 : k.type) === "text" ? (k.raw += p.raw, k.text += p.text) : s.push(p);
        continue;
      }
      if (e) {
        let k = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(k);
          break;
        } else throw new Error(k);
      }
    }
    return s;
  }
}, we = class {
  constructor(t) {
    T(this, "options");
    T(this, "parser");
    this.options = t || ee;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: s }) {
    var i;
    let n = (i = (e || "").match(P.notSpaceStart)) == null ? void 0 : i[0], r = t.replace(P.endingNewline, "") + `
`;
    return n ? '<pre><code class="language-' + N(n) + '">' + (s ? r : N(r, !0)) + `</code></pre>
` : "<pre><code>" + (s ? r : N(r, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let e = t.ordered, s = t.start, n = "";
    for (let c = 0; c < t.items.length; c++) {
      let l = t.items[c];
      n += this.listitem(l);
    }
    let r = e ? "ol" : "ul", i = e && s !== 1 ? ' start="' + s + '"' : "";
    return "<" + r + i + `>
` + n + "</" + r + `>
`;
  }
  listitem(t) {
    var s;
    let e = "";
    if (t.task) {
      let n = this.checkbox({ checked: !!t.checked });
      t.loose ? ((s = t.tokens[0]) == null ? void 0 : s.type) === "paragraph" ? (t.tokens[0].text = n + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = n + " " + N(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: !0 }) : e += n + " ";
    }
    return e += this.parser.parse(t.tokens, !!t.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let e = "", s = "";
    for (let r = 0; r < t.header.length; r++) s += this.tablecell(t.header[r]);
    e += this.tablerow({ text: s });
    let n = "";
    for (let r = 0; r < t.rows.length; r++) {
      let i = t.rows[r];
      s = "";
      for (let c = 0; c < i.length; c++) s += this.tablecell(i[c]);
      n += this.tablerow({ text: s });
    }
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + n + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let e = this.parser.parseInline(t.tokens), s = t.header ? "th" : "td";
    return (t.align ? `<${s} align="${t.align}">` : `<${s}>`) + e + `</${s}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${N(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: s }) {
    let n = this.parser.parseInline(s), r = Oe(t);
    if (r === null) return n;
    t = r;
    let i = '<a href="' + t + '"';
    return e && (i += ' title="' + N(e) + '"'), i += ">" + n + "</a>", i;
  }
  image({ href: t, title: e, text: s, tokens: n }) {
    n && (s = this.parser.parseInline(n, this.parser.textRenderer));
    let r = Oe(t);
    if (r === null) return N(s);
    t = r;
    let i = `<img src="${t}" alt="${s}"`;
    return e && (i += ` title="${N(e)}"`), i += ">", i;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : N(t.text);
  }
}, He = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
}, Z = class Le {
  constructor(e) {
    T(this, "options");
    T(this, "renderer");
    T(this, "textRenderer");
    this.options = e || ee, this.options.renderer = this.options.renderer || new we(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new He();
  }
  static parse(e, s) {
    return new Le(s).parse(e);
  }
  static parseInline(e, s) {
    return new Le(s).parseInline(e);
  }
  parse(e, s = !0) {
    var r, i;
    let n = "";
    for (let c = 0; c < e.length; c++) {
      let l = e[c];
      if ((i = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && i[l.type]) {
        let o = l, g = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (g !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o.type)) {
          n += g || "";
          continue;
        }
      }
      let u = l;
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
          let o = u, g = this.renderer.text(o);
          for (; c + 1 < e.length && e[c + 1].type === "text"; ) o = e[++c], g += `
` + this.renderer.text(o);
          s ? n += this.renderer.paragraph({ type: "paragraph", raw: g, text: g, tokens: [{ type: "text", raw: g, text: g, escaped: !0 }] }) : n += g;
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
  parseInline(e, s = this.renderer) {
    var r, i;
    let n = "";
    for (let c = 0; c < e.length; c++) {
      let l = e[c];
      if ((i = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && i[l.type]) {
        let o = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          n += o || "";
          continue;
        }
      }
      let u = l;
      switch (u.type) {
        case "escape": {
          n += s.text(u);
          break;
        }
        case "html": {
          n += s.html(u);
          break;
        }
        case "link": {
          n += s.link(u);
          break;
        }
        case "image": {
          n += s.image(u);
          break;
        }
        case "strong": {
          n += s.strong(u);
          break;
        }
        case "em": {
          n += s.em(u);
          break;
        }
        case "codespan": {
          n += s.codespan(u);
          break;
        }
        case "br": {
          n += s.br(u);
          break;
        }
        case "del": {
          n += s.del(u);
          break;
        }
        case "text": {
          n += s.text(u);
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
}, be, oe = (be = class {
  constructor(t) {
    T(this, "options");
    T(this, "block");
    this.options = t || ee;
  }
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? H.lex : H.lexInline;
  }
  provideParser() {
    return this.block ? Z.parse : Z.parseInline;
  }
}, T(be, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), T(be, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), be), cs = class {
  constructor(...t) {
    T(this, "defaults", qe());
    T(this, "options", this.setOptions);
    T(this, "parse", this.parseMarkdown(!0));
    T(this, "parseInline", this.parseMarkdown(!1));
    T(this, "Parser", Z);
    T(this, "Renderer", we);
    T(this, "TextRenderer", He);
    T(this, "Lexer", H);
    T(this, "Tokenizer", xe);
    T(this, "Hooks", oe);
    this.use(...t);
  }
  walkTokens(t, e) {
    var n, r;
    let s = [];
    for (let i of t) switch (s = s.concat(e.call(this, i)), i.type) {
      case "table": {
        let c = i;
        for (let l of c.header) s = s.concat(this.walkTokens(l.tokens, e));
        for (let l of c.rows) for (let u of l) s = s.concat(this.walkTokens(u.tokens, e));
        break;
      }
      case "list": {
        let c = i;
        s = s.concat(this.walkTokens(c.items, e));
        break;
      }
      default: {
        let c = i;
        (r = (n = this.defaults.extensions) == null ? void 0 : n.childTokens) != null && r[c.type] ? this.defaults.extensions.childTokens[c.type].forEach((l) => {
          let u = c[l].flat(1 / 0);
          s = s.concat(this.walkTokens(u, e));
        }) : c.tokens && (s = s.concat(this.walkTokens(c.tokens, e)));
      }
    }
    return s;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((s) => {
      let n = { ...s };
      if (n.async = this.defaults.async || n.async || !1, s.extensions && (s.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let i = e.renderers[r.name];
          i ? e.renderers[r.name] = function(...c) {
            let l = r.renderer.apply(this, c);
            return l === !1 && (l = i.apply(this, c)), l;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[r.level];
          i ? i.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), n.extensions = e), s.renderer) {
        let r = this.defaults.renderer || new we(this.defaults);
        for (let i in s.renderer) {
          if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let c = i, l = s.renderer[c], u = r[c];
          r[c] = (...o) => {
            let g = l.apply(r, o);
            return g === !1 && (g = u.apply(r, o)), g || "";
          };
        }
        n.renderer = r;
      }
      if (s.tokenizer) {
        let r = this.defaults.tokenizer || new xe(this.defaults);
        for (let i in s.tokenizer) {
          if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let c = i, l = s.tokenizer[c], u = r[c];
          r[c] = (...o) => {
            let g = l.apply(r, o);
            return g === !1 && (g = u.apply(r, o)), g;
          };
        }
        n.tokenizer = r;
      }
      if (s.hooks) {
        let r = this.defaults.hooks || new oe();
        for (let i in s.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let c = i, l = s.hooks[c], u = r[c];
          oe.passThroughHooks.has(i) ? r[c] = (o) => {
            if (this.defaults.async && oe.passThroughHooksRespectAsync.has(i)) return (async () => {
              let x = await l.call(r, o);
              return u.call(r, x);
            })();
            let g = l.call(r, o);
            return u.call(r, g);
          } : r[c] = (...o) => {
            if (this.defaults.async) return (async () => {
              let x = await l.apply(r, o);
              return x === !1 && (x = await u.apply(r, o)), x;
            })();
            let g = l.apply(r, o);
            return g === !1 && (g = u.apply(r, o)), g;
          };
        }
        n.hooks = r;
      }
      if (s.walkTokens) {
        let r = this.defaults.walkTokens, i = s.walkTokens;
        n.walkTokens = function(c) {
          let l = [];
          return l.push(i.call(this, c)), r && (l = l.concat(r.call(this, c))), l;
        };
      }
      this.defaults = { ...this.defaults, ...n };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return H.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return Z.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, s) => {
      let n = { ...s }, r = { ...this.defaults, ...n }, i = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && n.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let c = r.hooks ? await r.hooks.preprocess(e) : e, l = await (r.hooks ? await r.hooks.provideLexer() : t ? H.lex : H.lexInline)(c, r), u = r.hooks ? await r.hooks.processAllTokens(l) : l;
        r.walkTokens && await Promise.all(this.walkTokens(u, r.walkTokens));
        let o = await (r.hooks ? await r.hooks.provideParser() : t ? Z.parse : Z.parseInline)(u, r);
        return r.hooks ? await r.hooks.postprocess(o) : o;
      })().catch(i);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let c = (r.hooks ? r.hooks.provideLexer() : t ? H.lex : H.lexInline)(e, r);
        r.hooks && (c = r.hooks.processAllTokens(c)), r.walkTokens && this.walkTokens(c, r.walkTokens);
        let l = (r.hooks ? r.hooks.provideParser() : t ? Z.parse : Z.parseInline)(c, r);
        return r.hooks && (l = r.hooks.postprocess(l)), l;
      } catch (c) {
        return i(c);
      }
    };
  }
  onError(t, e) {
    return (s) => {
      if (s.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let n = "<p>An error occurred:</p><pre>" + N(s.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(s);
      throw s;
    };
  }
}, Y = new cs();
function S(t, e) {
  return Y.parse(t, e);
}
S.options = S.setOptions = function(t) {
  return Y.setOptions(t), S.defaults = Y.defaults, Je(S.defaults), S;
};
S.getDefaults = qe;
S.defaults = ee;
S.use = function(...t) {
  return Y.use(...t), S.defaults = Y.defaults, Je(S.defaults), S;
};
S.walkTokens = function(t, e) {
  return Y.walkTokens(t, e);
};
S.parseInline = Y.parseInline;
S.Parser = Z;
S.parser = Z.parse;
S.Renderer = we;
S.TextRenderer = He;
S.Lexer = H;
S.lexer = H.lex;
S.Tokenizer = xe;
S.Hooks = oe;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
Z.parse;
H.lex;
const us = { class: "detail-container" }, ps = { class: "detail-header" }, ds = { style: { flex: "1" } }, hs = {
  key: 0,
  class: "saved-message"
}, gs = {
  key: 1,
  class: "loading"
}, ks = {
  key: 2,
  class: "error"
}, fs = {
  key: 3,
  class: "detail-content"
}, ms = { class: "task-info" }, bs = { class: "info-row" }, ys = ["innerHTML"], xs = { class: "info-row" }, ws = { class: "info-value details-row" }, vs = { class: "detail-item" }, $s = { class: "detail-item" }, _s = { class: "detail-item" }, Ss = ["disabled"], Ts = ["value"], Rs = {
  key: 1,
  class: "info-value"
}, As = { class: "history-section" }, zs = { class: "expand-icon" }, Cs = { key: 0 }, Is = {
  key: 0,
  class: "loading"
}, Ls = {
  key: 1,
  class: "history-list"
}, qs = { class: "history-meta" }, Ps = { class: "history-date" }, Bs = { class: "history-change" }, Es = { class: "change-values" }, Ds = { class: "old-value" }, Ms = { class: "new-value" }, Fs = {
  key: 2,
  class: "no-history"
}, Us = { class: "comments-section" }, Hs = {
  key: 0,
  class: "loading"
}, Zs = {
  key: 1,
  class: "comments-list"
}, Ns = { class: "comment-meta" }, Qs = { class: "comment-date" }, Vs = ["innerHTML"], Os = ["innerHTML"], Ks = {
  key: 2,
  class: "no-comments"
}, js = { class: "add-comment" }, Gs = ["disabled"], Ws = ["disabled"], Xs = { key: 0 }, Js = { key: 1 }, Ys = /* @__PURE__ */ Ge({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(t, { emit: e }) {
    const s = t, n = e, r = L(""), { data: i, isLoading: c, error: l } = vt(s.taskId), { data: u, isLoading: o } = $t(s.taskId), { data: g, isLoading: x } = _t(s.taskId), p = We(), z = Tt(), k = L(null), $ = L(""), q = L(null), C = L(""), Q = L(!1), M = L(!1), { data: O, isLoading: se } = Xe();
    async function D(v, d) {
      k.value = v, $.value = d, await kt();
      const I = q.value;
      I && typeof I.focus == "function" && I.focus();
    }
    function F() {
      k.value = null, $.value = "";
    }
    async function U() {
      if (!k.value || !i.value) return;
      const v = k.value, d = i.value[v];
      if ($.value !== d)
        try {
          await p.mutateAsync({
            id: s.taskId,
            updates: { [v]: $.value },
            userId: s.userId
          }), r.value = "Saved!", setTimeout(() => {
            r.value = "";
          }, 1200);
        } catch (I) {
          console.error("Failed to update task:", I);
        }
      F();
    }
    async function ne() {
      if (C.value.trim()) {
        if (C.value.trim().startsWith("@analyze")) {
          const v = C.value.trim().replace(/^@analyze\s*/, "");
          if (!v) return;
          M.value = !0;
          try {
            const I = await (await fetch("https://www.y2k.fund/api/ai-analyze-task", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                taskId: s.taskId,
                userId: s.userId,
                question: v
              })
            })).json();
            await z.mutateAsync({
              task_id: s.taskId,
              comment: `${I.reply}`,
              created_by: "Analyze"
              // or props.userId if you want to attribute to user
            }), C.value = "";
          } catch (d) {
            console.error("AI analysis failed:", d);
          } finally {
            M.value = !1;
          }
          return;
        }
        try {
          await z.mutateAsync({
            task_id: s.taskId,
            comment: C.value,
            created_by: s.userId
          }), C.value = "";
        } catch (v) {
          console.error("Failed to add comment:", v);
        }
      }
    }
    async function Te() {
      if (i.value)
        try {
          await p.mutateAsync({
            id: i.value.id,
            updates: { archived: !i.value.archived },
            userId: s.userId
          });
        } catch (v) {
          console.error("Failed to archive/unarchive task:", v);
        }
    }
    function ke(v) {
      return new Date(v).toLocaleString();
    }
    function R(v) {
      return v.replace(/_/g, " ").replace(/\b\w/g, (d) => d.toUpperCase());
    }
    function h(v) {
      return v.replace(
        /!\[.*?\]\((https?:\/\/[^)]+|data:image\/[^)]+)\)/g,
        `<img src="$1" class="img-thumb" data-src="$1" onclick="window.open(this.dataset.src,'_blank')" />`
      ).replace(/\n/g, "<br/>");
    }
    async function f(v) {
      await fe(v, (d) => {
        $.value += `
![image](${d})
`;
      });
    }
    async function G(v) {
      await fe(v, (d) => {
        C.value += `
![image](${d})
`;
      });
    }
    async function fe(v, d) {
      var K;
      const I = (K = v.clipboardData) == null ? void 0 : K.items;
      if (I) {
        for (const j of I)
          if (j.type.indexOf("image") !== -1) {
            v.preventDefault();
            const y = j.getAsFile();
            if (y) {
              const ie = new FileReader();
              ie.onload = (ut) => {
                var Ze;
                const pt = (Ze = ut.target) == null ? void 0 : Ze.result;
                d(pt);
              }, ie.readAsDataURL(y);
            }
          }
      }
    }
    function re(v) {
      if (!v || !O.value) return "";
      const d = O.value.find((I) => I.id === v);
      return (d == null ? void 0 : d.name) || v;
    }
    function Re(v) {
      return S.parse(v);
    }
    return (v, d) => {
      var I, K, j;
      return m(), b("div", us, [
        a("div", ps, [
          a("button", {
            class: "btn btn-back",
            onClick: d[0] || (d[0] = (y) => n("close"))
          }, " ← Back to Tasks "),
          a("div", ds, [
            k.value !== "summary" ? (m(), b("h2", {
              key: 0,
              class: "header-summary",
              onDblclick: d[1] || (d[1] = (y) => {
                var ie;
                return D("summary", ((ie = w(i)) == null ? void 0 : ie.summary) || "");
              }),
              title: "Double-click to edit summary"
            }, A(((I = w(i)) == null ? void 0 : I.summary) || "Task Details"), 33)) : B((m(), b("input", {
              key: 1,
              "onUpdate:modelValue": d[2] || (d[2] = (y) => $.value = y),
              onBlur: U,
              onKeyup: [
                Ae(F, ["esc"]),
                Ae(U, ["enter"])
              ],
              ref_key: "editInput",
              ref: q,
              class: "inline-edit",
              style: { "font-size": "1rem", width: "100%" },
              placeholder: "Task Summary"
            }, null, 544)), [
              [te, $.value]
            ])
          ]),
          a("button", {
            class: X(["btn", (K = w(i)) != null && K.archived ? "btn-success" : "btn-danger"]),
            onClick: Te
          }, A((j = w(i)) != null && j.archived ? "Unarchive" : "Archive") + " Task ", 3)
        ]),
        r.value ? (m(), b("div", hs, A(r.value), 1)) : ce("", !0),
        w(c) ? (m(), b("div", gs, "Loading task details...")) : w(l) ? (m(), b("div", ks, "Error: " + A(w(l)), 1)) : w(i) ? (m(), b("div", fs, [
          a("div", ms, [
            a("div", bs, [
              d[13] || (d[13] = a("label", null, "Description", -1)),
              a("div", {
                onDblclick: d[4] || (d[4] = (y) => D("description", w(i).description || ""))
              }, [
                k.value === "description" ? B((m(), b("textarea", {
                  key: 0,
                  "onUpdate:modelValue": d[3] || (d[3] = (y) => $.value = y),
                  onBlur: U,
                  onKeyup: Ae(F, ["esc"]),
                  onPaste: f,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: q
                }, null, 544)), [
                  [te, $.value]
                ]) : (m(), b("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: h(w(i).description || "")
                }, null, 8, ys))
              ], 32)
            ]),
            a("div", xs, [
              d[20] || (d[20] = a("label", null, "Details", -1)),
              a("div", ws, [
                a("div", vs, [
                  d[15] || (d[15] = a("div", { class: "small-label" }, "Status", -1)),
                  a("div", {
                    onDblclick: d[6] || (d[6] = (y) => D("status", w(i).status))
                  }, [
                    k.value === "status" ? B((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": d[5] || (d[5] = (y) => $.value = y),
                      onBlur: U,
                      onChange: U,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: q
                    }, [...d[14] || (d[14] = [
                      a("option", { value: "open" }, "Open", -1),
                      a("option", { value: "in-progress" }, "In Progress", -1),
                      a("option", { value: "completed" }, "Completed", -1),
                      a("option", { value: "closed" }, "Closed", -1)
                    ])], 544)), [
                      [J, $.value]
                    ]) : (m(), b("span", {
                      key: 1,
                      class: X(`status-badge status-${w(i).status}`)
                    }, A(w(i).status), 3))
                  ], 32)
                ]),
                a("div", $s, [
                  d[17] || (d[17] = a("div", { class: "small-label" }, "Priority", -1)),
                  a("div", {
                    onDblclick: d[8] || (d[8] = (y) => D("priority", w(i).priority))
                  }, [
                    k.value === "priority" ? B((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": d[7] || (d[7] = (y) => $.value = y),
                      onBlur: U,
                      onChange: U,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: q
                    }, [...d[16] || (d[16] = [
                      a("option", { value: "low" }, "Low", -1),
                      a("option", { value: "medium" }, "Medium", -1),
                      a("option", { value: "high" }, "High", -1),
                      a("option", { value: "critical" }, "Critical", -1)
                    ])], 544)), [
                      [J, $.value]
                    ]) : (m(), b("span", {
                      key: 1,
                      class: X(`priority-badge priority-${w(i).priority}`)
                    }, A(w(i).priority), 3))
                  ], 32)
                ]),
                a("div", _s, [
                  d[19] || (d[19] = a("div", { class: "small-label" }, "Assigned", -1)),
                  a("div", {
                    onDblclick: d[10] || (d[10] = (y) => D("assigned_to", w(i).assigned_to || ""))
                  }, [
                    k.value === "assigned_to" ? B((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": d[9] || (d[9] = (y) => $.value = y),
                      onBlur: U,
                      onChange: U,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: q,
                      disabled: w(se)
                    }, [
                      d[18] || (d[18] = a("option", { value: "" }, "-- Unassigned --", -1)),
                      (m(!0), b(ue, null, pe(w(O), (y) => (m(), b("option", {
                        key: y.id,
                        value: y.id
                      }, A(y.name), 9, Ts))), 128))
                    ], 40, Ss)), [
                      [J, $.value]
                    ]) : (m(), b("div", Rs, A(re(w(i).assigned_to) || "-"), 1))
                  ], 32)
                ])
              ])
            ])
          ]),
          a("div", As, [
            a("div", {
              class: "section-header",
              onClick: d[11] || (d[11] = (y) => Q.value = !Q.value)
            }, [
              a("h3", null, [
                a("span", zs, A(Q.value ? "▼" : "▶"), 1),
                d[21] || (d[21] = W(" History ", -1))
              ])
            ]),
            Q.value ? (m(), b("div", Cs, [
              w(x) ? (m(), b("div", Is, "Loading history...")) : w(g) && w(g).length > 0 ? (m(), b("div", Ls, [
                (m(!0), b(ue, null, pe(w(g), (y) => (m(), b("div", {
                  key: y.id,
                  class: "history-item"
                }, [
                  a("div", qs, [
                    a("strong", null, A(re(y.changed_by)), 1),
                    a("span", Ps, A(ke(y.changed_at)), 1)
                  ]),
                  a("div", Bs, [
                    d[25] || (d[25] = W(" Changed ", -1)),
                    a("strong", null, A(R(y.field_name)), 1),
                    a("span", Es, [
                      d[22] || (d[22] = W(' from "', -1)),
                      a("span", Ds, A(y.old_value), 1),
                      d[23] || (d[23] = W('" to "', -1)),
                      a("span", Ms, A(y.new_value), 1),
                      d[24] || (d[24] = W('" ', -1))
                    ])
                  ])
                ]))), 128))
              ])) : (m(), b("div", Fs, "No history yet"))
            ])) : ce("", !0)
          ]),
          a("div", Us, [
            d[27] || (d[27] = a("h3", null, "Comments", -1)),
            w(o) ? (m(), b("div", Hs, "Loading comments...")) : w(u) && w(u).length > 0 ? (m(), b("div", Zs, [
              (m(!0), b(ue, null, pe(w(u), (y) => (m(), b("div", {
                key: y.id,
                class: "comment-item"
              }, [
                a("div", Ns, [
                  a("strong", null, A(re(y.created_by)), 1),
                  a("span", Qs, A(ke(y.created_at)), 1)
                ]),
                y.created_by === "Analyze" ? (m(), b("div", {
                  key: 0,
                  class: "comment-text",
                  innerHTML: Re(y.comment)
                }, null, 8, Vs)) : (m(), b("div", {
                  key: 1,
                  class: "comment-text",
                  innerHTML: h(y.comment)
                }, null, 8, Os))
              ]))), 128))
            ])) : (m(), b("div", Ks, "No comments yet")),
            a("div", js, [
              B(a("textarea", {
                "onUpdate:modelValue": d[12] || (d[12] = (y) => C.value = y),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: G,
                disabled: M.value
              }, null, 40, Gs), [
                [te, C.value]
              ]),
              d[26] || (d[26] = a("small", null, "Paste images from clipboard", -1)),
              a("button", {
                onClick: ne,
                disabled: !C.value.trim() || M.value,
                class: "btn-primary"
              }, [
                M.value ? (m(), b("span", Xs, "Analyzing...")) : (m(), b("span", Js, "Add Comment"))
              ], 8, Ws)
            ])
          ])
        ])) : ce("", !0)
      ]);
    };
  }
}), ct = (t, e) => {
  const s = t.__vccOpts || t;
  for (const [n, r] of e)
    s[n] = r;
  return s;
}, en = /* @__PURE__ */ ct(Ys, [["__scopeId", "data-v-f8592afe"]]), tn = { class: "tasks-card" }, sn = {
  key: 0,
  class: "loading"
}, nn = {
  key: 1,
  class: "error"
}, rn = {
  key: 2,
  class: "tasks-container"
}, ln = { class: "tasks-header" }, an = { class: "tasks-header-actions" }, on = { class: "tasks-filters" }, cn = { class: "filter-checkbox" }, un = { class: "tasks-table-wrapper" }, pn = { class: "tasks-table" }, dn = {
  key: 0,
  class: "no-results"
}, hn = { class: "task-actions" }, gn = ["onClick"], kn = ["onClick", "title", "disabled"], fn = { key: 0 }, mn = { key: 1 }, bn = {
  key: 3,
  class: "task-form-container"
}, yn = { class: "form-body" }, xn = { class: "form-group" }, wn = { class: "form-group" }, vn = { class: "form-row" }, $n = { class: "form-group" }, _n = { class: "form-group" }, Sn = { class: "form-group" }, Tn = ["disabled"], Rn = ["value"], An = { class: "form-actions" }, zn = ["disabled"], Cn = /* @__PURE__ */ Ge({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(t, { emit: e }) {
    const s = t, n = e, r = L(""), i = L(""), c = L("list"), l = L(null);
    L(null), L(""), L(null);
    const u = L({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: s.userId
    }), o = L(!1), g = L(null);
    L(null);
    const x = ze(() => ({
      status: i.value || void 0
    })), { data: p, isLoading: z, error: k } = wt(x), $ = St(), q = We();
    Rt();
    const { data: C, isLoading: Q } = Xe(), M = ze(() => {
      if (!p.value) return [];
      const R = r.value.toLowerCase().trim();
      let h = p.value.filter((f) => o.value ? !!f.archived : !f.archived);
      return R ? h.filter((f) => {
        var d, I, K, j, y;
        const G = ((d = f.summary) == null ? void 0 : d.toLowerCase()) || "", fe = ((I = f.description) == null ? void 0 : I.toLowerCase()) || "", re = ((K = f.status) == null ? void 0 : K.toLowerCase().replace("_", " ")) || "", Re = ((j = f.priority) == null ? void 0 : j.toLowerCase()) || "", v = ((y = f.assigned_to) == null ? void 0 : y.toLowerCase()) || "";
        return G.includes(R) || fe.includes(R) || re.includes(R) || Re.includes(R) || v.includes(R);
      }) : h;
    });
    function O(R) {
      return new Date(R).toLocaleDateString();
    }
    async function se() {
      try {
        await $.mutateAsync(u.value), D(), c.value = "list";
      } catch (R) {
        console.error("Failed to create task:", R);
      }
    }
    function D() {
      u.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: s.userId
      };
    }
    function F() {
      D(), c.value = "create";
    }
    function U(R) {
      l.value = R, c.value = "detail";
    }
    function ne() {
      c.value = "list", l.value = null;
    }
    ft(() => {
      const h = new URLSearchParams(window.location.search).get("taskId");
      h && (l.value = h, c.value = "detail");
    }), mt([l, c], ([R, h]) => {
      const f = new URLSearchParams(window.location.search);
      h === "detail" && R ? f.set("taskId", R) : f.delete("taskId");
      const G = `${window.location.pathname}?${f.toString()}`;
      window.history.replaceState({}, "", G);
    });
    async function Te(R) {
      g.value = R.id;
      try {
        await q.mutateAsync({
          id: R.id,
          updates: { archived: !R.archived },
          userId: s.userId
        });
      } catch (h) {
        console.error("Failed to archive/unarchive task:", h);
      } finally {
        g.value = null;
      }
    }
    function ke(R) {
      if (!R || !C.value) return "";
      const h = C.value.find((f) => f.id === R);
      return (h == null ? void 0 : h.name) || R;
    }
    return (R, h) => (m(), b("div", tn, [
      w(z) && !w(p) ? (m(), b("div", sn, [...h[10] || (h[10] = [
        a("div", { class: "loading-spinner" }, null, -1),
        W(" Loading tasks... ", -1)
      ])])) : w(k) ? (m(), b("div", nn, [
        h[11] || (h[11] = a("h3", null, "Error loading tasks", -1)),
        a("p", null, A(w(k)), 1)
      ])) : c.value === "list" ? (m(), b("div", rn, [
        a("div", ln, [
          a("h2", {
            class: X({ "tasks-header-clickable": s.showHeaderLink }),
            onClick: h[0] || (h[0] = (f) => s.showHeaderLink && n("navigate"))
          }, " Tasks Management ", 2),
          a("div", an, [
            a("button", {
              class: "btn btn-add",
              onClick: F
            }, [...h[12] || (h[12] = [
              a("span", { class: "icon" }, "➕", -1)
            ])]),
            a("button", {
              class: "btn btn-minimize",
              onClick: h[1] || (h[1] = (f) => n("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        a("div", on, [
          B(a("input", {
            "onUpdate:modelValue": h[2] || (h[2] = (f) => r.value = f),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [te, r.value]
          ]),
          B(a("select", {
            "onUpdate:modelValue": h[3] || (h[3] = (f) => i.value = f),
            class: "filter-select"
          }, [...h[13] || (h[13] = [
            a("option", { value: "" }, "All Status", -1),
            a("option", { value: "open" }, "Open", -1),
            a("option", { value: "in_progress" }, "In Progress", -1),
            a("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [J, i.value]
          ]),
          a("label", cn, [
            B(a("input", {
              type: "checkbox",
              "onUpdate:modelValue": h[4] || (h[4] = (f) => o.value = f)
            }, null, 512), [
              [yt, o.value]
            ]),
            h[14] || (h[14] = W(" Show Archived ", -1))
          ])
        ]),
        a("div", un, [
          a("table", pn, [
            h[17] || (h[17] = a("thead", null, [
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
              M.value.length === 0 ? (m(), b("tr", dn, [...h[15] || (h[15] = [
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
              ])])) : ce("", !0),
              (m(!0), b(ue, null, pe(M.value, (f) => (m(), b("tr", {
                key: f.id
              }, [
                a("td", null, A(f.summary), 1),
                a("td", null, [
                  a("span", {
                    class: X(`status-badge status-${f.status}`)
                  }, A(f.status), 3)
                ]),
                a("td", null, [
                  a("span", {
                    class: X(`priority-badge priority-${f.priority}`)
                  }, A(f.priority), 3)
                ]),
                a("td", null, A(ke(f.assigned_to) || "-"), 1),
                a("td", null, A(O(f.created_at)), 1),
                a("td", hn, [
                  a("button", {
                    class: "btn btn-icon",
                    onClick: (G) => U(f.id),
                    title: "View details"
                  }, " 👁️ ", 8, gn),
                  a("button", {
                    class: X(["btn btn-icon", f.archived ? "btn-success" : "btn-danger"]),
                    onClick: (G) => Te(f),
                    title: f.archived ? "Unarchive task" : "Archive task",
                    disabled: g.value === f.id
                  }, [
                    g.value === f.id ? (m(), b("span", fn, [...h[16] || (h[16] = [
                      a("span", {
                        class: "loading-spinner",
                        style: { display: "inline-block", width: "1em", height: "1em", "border-width": "2px" }
                      }, null, -1)
                    ])])) : (m(), b("span", mn, A(f.archived ? "↩️" : "🗑️"), 1))
                  ], 10, kn)
                ])
              ]))), 128))
            ])
          ])
        ])
      ])) : c.value === "create" ? (m(), b("div", bn, [
        a("div", { class: "form-header" }, [
          a("button", {
            class: "btn btn-back",
            onClick: ne
          }, " ← Back to Tasks "),
          h[18] || (h[18] = a("h2", null, "Create New Task", -1))
        ]),
        a("div", yn, [
          a("div", xn, [
            h[19] || (h[19] = a("label", { for: "task-summary" }, "Summary *", -1)),
            B(a("input", {
              id: "task-summary",
              "onUpdate:modelValue": h[5] || (h[5] = (f) => u.value.summary = f),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [te, u.value.summary]
            ])
          ]),
          a("div", wn, [
            h[20] || (h[20] = a("label", { for: "task-description" }, "Description", -1)),
            B(a("textarea", {
              id: "task-description",
              "onUpdate:modelValue": h[6] || (h[6] = (f) => u.value.description = f),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [te, u.value.description]
            ])
          ]),
          a("div", vn, [
            a("div", $n, [
              h[22] || (h[22] = a("label", { for: "task-status" }, "Status", -1)),
              B(a("select", {
                id: "task-status",
                "onUpdate:modelValue": h[7] || (h[7] = (f) => u.value.status = f)
              }, [...h[21] || (h[21] = [
                a("option", { value: "open" }, "Open", -1),
                a("option", { value: "in_progress" }, "In Progress", -1),
                a("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [J, u.value.status]
              ])
            ]),
            a("div", _n, [
              h[24] || (h[24] = a("label", { for: "task-priority" }, "Priority", -1)),
              B(a("select", {
                id: "task-priority",
                "onUpdate:modelValue": h[8] || (h[8] = (f) => u.value.priority = f)
              }, [...h[23] || (h[23] = [
                a("option", { value: "low" }, "Low", -1),
                a("option", { value: "medium" }, "Medium", -1),
                a("option", { value: "high" }, "High", -1)
              ])], 512), [
                [J, u.value.priority]
              ])
            ])
          ]),
          a("div", Sn, [
            h[26] || (h[26] = a("label", { for: "task-assigned" }, "Assigned To", -1)),
            B(a("select", {
              id: "task-assigned",
              "onUpdate:modelValue": h[9] || (h[9] = (f) => u.value.assigned_to = f),
              disabled: w(Q)
            }, [
              h[25] || (h[25] = a("option", { value: "" }, "-- Select User --", -1)),
              (m(!0), b(ue, null, pe(w(C), (f) => (m(), b("option", {
                key: f.id,
                value: f.id
              }, A(f.name), 9, Rn))), 128))
            ], 8, Tn), [
              [J, u.value.assigned_to]
            ])
          ]),
          a("div", An, [
            a("button", {
              class: "btn btn-cancel",
              onClick: ne
            }, "Cancel"),
            a("button", {
              class: "btn btn-primary",
              onClick: se,
              disabled: !u.value.summary.trim()
            }, " Create Task ", 8, zn)
          ])
        ])
      ])) : c.value === "detail" && l.value ? (m(), bt(en, {
        key: 4,
        "task-id": l.value,
        "user-id": t.userId,
        onClose: ne
      }, null, 8, ["task-id", "user-id"])) : ce("", !0)
    ]));
  }
}), Pn = /* @__PURE__ */ ct(Cn, [["__scopeId", "data-v-6badfad4"]]);
export {
  en as TaskDetail,
  Pn as Tasks
};
