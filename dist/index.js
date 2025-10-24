var ut = Object.defineProperty;
var pt = (t, e, s) => e in t ? ut(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var R = (t, e, s) => pt(t, typeof e != "symbol" ? e + "" : e, s);
import { inject as ht, computed as Re, unref as w, defineComponent as je, ref as L, createElementBlock as b, openBlock as m, createElementVNode as a, createCommentVNode as fe, toDisplayString as A, normalizeClass as W, withDirectives as D, withKeys as dt, vModelText as ae, vModelSelect as X, Fragment as oe, renderList as ce, createTextVNode as G, nextTick as gt, onMounted as kt, watch as ft, createBlock as mt, vModelCheckbox as bt } from "vue";
import { useQuery as pe, useQueryClient as ye, useMutation as we } from "@tanstack/vue-query";
const xt = Symbol.for("y2kfund.supabase");
function Q() {
  const t = ht(xt, null);
  if (!t) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return t;
}
const B = {
  all: ["tasks"],
  list: (t) => [...B.all, "list", t],
  detail: (t) => [...B.all, "detail", t],
  comments: (t) => [...B.all, "comments", t],
  history: (t) => [...B.all, "history", t]
};
function yt(t) {
  const e = Q();
  return pe({
    queryKey: Re(() => {
      const s = t ? w(t) : {};
      return B.list(s);
    }),
    queryFn: async () => {
      const s = t ? w(t) : {};
      let r = e.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (s != null && s.status && (r = r.eq("status", s.status)), s != null && s.search && s.search.trim()) {
        const c = s.search.trim();
        r = r.or(`summary.ilike.%${c}%,description.ilike.%${c}%`);
      }
      const { data: n, error: l } = await r;
      if (l) throw l;
      return n;
    }
  });
}
function wt(t) {
  const e = Q();
  return pe({
    queryKey: B.detail(t),
    queryFn: async () => {
      const { data: s, error: r } = await e.schema("hf").from("tasks").select("*").eq("id", t).single();
      if (r) throw r;
      return s;
    },
    enabled: !!t
  });
}
function vt(t) {
  const e = Q();
  return pe({
    queryKey: B.comments(t),
    queryFn: async () => {
      const { data: s, error: r } = await e.schema("hf").from("task_comments").select("*").eq("task_id", t).order("created_at", { ascending: !1 });
      if (r) throw r;
      return s;
    },
    enabled: !!t
  });
}
function $t(t) {
  const e = Q();
  return pe({
    queryKey: B.history(t),
    queryFn: async () => {
      const { data: s, error: r } = await e.schema("hf").from("task_history").select("*").eq("task_id", t).order("changed_at", { ascending: !1 });
      if (r) throw r;
      return s;
    },
    enabled: !!t
  });
}
function _t() {
  const t = Q(), e = ye();
  return we({
    mutationFn: async (s) => {
      const { data: r, error: n } = await t.schema("hf").from("tasks").insert(s).select().single();
      if (n) throw n;
      return r;
    },
    onSuccess: () => {
      e.invalidateQueries({ queryKey: B.all });
    }
  });
}
function Ke() {
  const t = Q(), e = ye();
  return we({
    mutationFn: async ({
      id: s,
      updates: r,
      userId: n
    }) => {
      const { data: l, error: c } = await t.schema("hf").from("tasks").select("*").eq("id", s).single();
      if (c) throw c;
      const { data: i, error: u } = await t.schema("hf").from("tasks").update(r).eq("id", s).select().single();
      if (u) throw u;
      const o = Object.keys(r).filter((g) => l[g] !== r[g]).map((g) => ({
        task_id: s,
        field_name: g,
        old_value: String(l[g] || ""),
        new_value: String(r[g] || ""),
        changed_by: n
      }));
      if (o.length > 0) {
        const { error: g } = await t.schema("hf").from("task_history").insert(o);
        g && console.error("Failed to save history:", g);
      }
      return i;
    },
    onSuccess: (s) => {
      e.invalidateQueries({ queryKey: B.all }), e.invalidateQueries({ queryKey: B.detail(s.id) }), e.invalidateQueries({ queryKey: B.history(s.id) });
    }
  });
}
function St() {
  const t = Q(), e = ye();
  return we({
    mutationFn: async (s) => {
      const { data: r, error: n } = await t.schema("hf").from("task_comments").insert(s).select().single();
      if (n) throw n;
      return r;
    },
    onSuccess: (s) => {
      e.invalidateQueries({ queryKey: B.comments(s.task_id) });
    }
  });
}
function Tt() {
  const t = Q(), e = ye();
  return we({
    mutationFn: async (s) => {
      await t.schema("hf").from("task_comments").delete().eq("task_id", s), await t.schema("hf").from("task_history").delete().eq("task_id", s);
      const { error: r } = await t.schema("hf").from("tasks").delete().eq("id", s);
      if (r) throw r;
      return s;
    },
    onSuccess: () => {
      e.invalidateQueries({ queryKey: B.all });
    }
  });
}
function Ge() {
  const t = Q();
  return pe({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: e, error: s } = await t.from("users_view").select("id, email, name").order("email");
      if (s) throw s;
      return (e || []).map((r) => ({
        id: r.id,
        email: r.email,
        name: r.name || r.email
      }));
    },
    staleTime: 5 * 60 * 1e3
  });
}
function Ie() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Y = Ie();
function We(t) {
  Y = t;
}
var ue = { exec: () => null };
function $(t, e = "") {
  let s = typeof t == "string" ? t : t.source, r = { replace: (n, l) => {
    let c = typeof l == "string" ? l : l.source;
    return c = c.replace(P.caret, "$1"), s = s.replace(n, c), r;
  }, getRegex: () => new RegExp(s, e) };
  return r;
}
var P = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i") }, Rt = /^(?:[ \t]*(?:\n|$))+/, At = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, zt = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, he = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ct = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Le = /(?:[*+-]|\d{1,9}[.)])/, Xe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Je = $(Xe).replace(/bull/g, Le).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), It = $(Xe).replace(/bull/g, Le).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), qe = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Lt = /^[^\n]+/, Pe = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, qt = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Pe).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Pt = $(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Le).getRegex(), ve = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ee = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Et = $("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Ee).replace("tag", ve).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ye = $(qe).replace("hr", he).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ve).getRegex(), Bt = $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ye).getRegex(), Be = { blockquote: Bt, code: At, def: qt, fences: zt, heading: Ct, hr: he, html: Et, lheading: Je, list: Pt, newline: Rt, paragraph: Ye, table: ue, text: Lt }, He = $("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", he).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ve).getRegex(), Dt = { ...Be, lheading: It, table: He, paragraph: $(qe).replace("hr", he).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", He).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ve).getRegex() }, Mt = { ...Be, html: $(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Ee).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ue, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: $(qe).replace("hr", he).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Je).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Ft = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ut = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, et = /^( {2,}|\\)\n(?!\s*$)/, Ht = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, $e = /[\p{P}\p{S}]/u, De = /[\s\p{P}\p{S}]/u, tt = /[^\s\p{P}\p{S}]/u, Zt = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, De).getRegex(), st = /(?!~)[\p{P}\p{S}]/u, Nt = /(?!~)[\s\p{P}\p{S}]/u, Qt = /(?:[^\s\p{P}\p{S}]|~)/u, Ot = $(/link|code|html/, "g").replace("link", new RegExp("\\[(?:[^\\[\\]`]|(?<!`)(?<a>`+)[^`]+\\k<a>(?!`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)")).replace("code", new RegExp("(?<!`)(?<b>`+)[^`]+\\k<b>(?!`)")).replace("html", /<(?! )[^<>]*?>/).getRegex(), nt = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Vt = $(nt, "u").replace(/punct/g, $e).getRegex(), jt = $(nt, "u").replace(/punct/g, st).getRegex(), rt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Kt = $(rt, "gu").replace(/notPunctSpace/g, tt).replace(/punctSpace/g, De).replace(/punct/g, $e).getRegex(), Gt = $(rt, "gu").replace(/notPunctSpace/g, Qt).replace(/punctSpace/g, Nt).replace(/punct/g, st).getRegex(), Wt = $("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, tt).replace(/punctSpace/g, De).replace(/punct/g, $e).getRegex(), Xt = $(/\\(punct)/, "gu").replace(/punct/g, $e).getRegex(), Jt = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Yt = $(Ee).replace("(?:-->|$)", "-->").getRegex(), es = $("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Yt).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), me = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ts = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", me).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), it = $(/^!?\[(label)\]\[(ref)\]/).replace("label", me).replace("ref", Pe).getRegex(), lt = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", Pe).getRegex(), ss = $("reflink|nolink(?!\\()", "g").replace("reflink", it).replace("nolink", lt).getRegex(), Ze = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Me = { _backpedal: ue, anyPunctuation: Xt, autolink: Jt, blockSkip: Ot, br: et, code: Ut, del: ue, emStrongLDelim: Vt, emStrongRDelimAst: Kt, emStrongRDelimUnd: Wt, escape: Ft, link: ts, nolink: lt, punctuation: Zt, reflink: it, reflinkSearch: ss, tag: es, text: Ht, url: ue }, ns = { ...Me, link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", me).getRegex(), reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", me).getRegex() }, Ae = { ...Me, emStrongRDelimAst: Gt, emStrongLDelim: jt, url: $(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Ze).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: $(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Ze).getRegex() }, rs = { ...Ae, br: $(et).replace("{2,}", "*").getRegex(), text: $(Ae.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, ge = { normal: Be, gfm: Dt, pedantic: Mt }, re = { normal: Me, gfm: Ae, breaks: rs, pedantic: ns }, is = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ne = (t) => is[t];
function H(t, e) {
  if (e) {
    if (P.escapeTest.test(t)) return t.replace(P.escapeReplace, Ne);
  } else if (P.escapeTestNoEncode.test(t)) return t.replace(P.escapeReplaceNoEncode, Ne);
  return t;
}
function Qe(t) {
  try {
    t = encodeURI(t).replace(P.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function Oe(t, e) {
  var l;
  let s = t.replace(P.findPipe, (c, i, u) => {
    let o = !1, g = i;
    for (; --g >= 0 && u[g] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = s.split(P.splitPipe), n = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !((l = r.at(-1)) != null && l.trim()) && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; n < r.length; n++) r[n] = r[n].trim().replace(P.slashPipe, "|");
  return r;
}
function ie(t, e, s) {
  let r = t.length;
  if (r === 0) return "";
  let n = 0;
  for (; n < r && t.charAt(r - n - 1) === e; )
    n++;
  return t.slice(0, r - n);
}
function ls(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let s = 0;
  for (let r = 0; r < t.length; r++) if (t[r] === "\\") r++;
  else if (t[r] === e[0]) s++;
  else if (t[r] === e[1] && (s--, s < 0)) return r;
  return s > 0 ? -2 : -1;
}
function Ve(t, e, s, r, n) {
  let l = e.href, c = e.title || null, i = t[1].replace(n.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let u = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: s, href: l, title: c, text: i, tokens: r.inlineTokens(i) };
  return r.state.inLink = !1, u;
}
function as(t, e, s) {
  let r = t.match(s.other.indentCodeCompensation);
  if (r === null) return e;
  let n = r[1];
  return e.split(`
`).map((l) => {
    let c = l.match(s.other.beginningSpace);
    if (c === null) return l;
    let [i] = c;
    return i.length >= n.length ? l.slice(n.length) : l;
  }).join(`
`);
}
var be = class {
  constructor(t) {
    R(this, "options");
    R(this, "rules");
    R(this, "lexer");
    this.options = t || Y;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let s = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? s : ie(s, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let s = e[0], r = as(s, e[3] || "", this.rules);
      return { type: "code", raw: s, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let s = e[2].trim();
      if (this.rules.other.endingHash.test(s)) {
        let r = ie(s, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (s = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: s, tokens: this.lexer.inline(s) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: ie(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let s = ie(e[0], `
`).split(`
`), r = "", n = "", l = [];
      for (; s.length > 0; ) {
        let c = !1, i = [], u;
        for (u = 0; u < s.length; u++) if (this.rules.other.blockquoteStart.test(s[u])) i.push(s[u]), c = !0;
        else if (!c) i.push(s[u]);
        else break;
        s = s.slice(u);
        let o = i.join(`
`), g = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${o}` : o, n = n ? `${n}
${g}` : g;
        let y = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(g, l, !0), this.lexer.state.top = y, s.length === 0) break;
        let p = l.at(-1);
        if ((p == null ? void 0 : p.type) === "code") break;
        if ((p == null ? void 0 : p.type) === "blockquote") {
          let _ = p, k = _.raw + `
` + s.join(`
`), z = this.blockquote(k);
          l[l.length - 1] = z, r = r.substring(0, r.length - _.raw.length) + z.raw, n = n.substring(0, n.length - _.text.length) + z.text;
          break;
        } else if ((p == null ? void 0 : p.type) === "list") {
          let _ = p, k = _.raw + `
` + s.join(`
`), z = this.list(k);
          l[l.length - 1] = z, r = r.substring(0, r.length - p.raw.length) + z.raw, n = n.substring(0, n.length - _.raw.length) + z.raw, s = k.substring(l.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: l, text: n };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let s = e[1].trim(), r = s.length > 1, n = { type: "list", raw: "", ordered: r, start: r ? +s.slice(0, -1) : "", loose: !1, items: [] };
      s = r ? `\\d{1,9}\\${s.slice(-1)}` : `\\${s}`, this.options.pedantic && (s = r ? s : "[*+-]");
      let l = this.rules.other.listItemRegex(s), c = !1;
      for (; t; ) {
        let u = !1, o = "", g = "";
        if (!(e = l.exec(t)) || this.rules.block.hr.test(t)) break;
        o = e[0], t = t.substring(o.length);
        let y = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (E) => " ".repeat(3 * E.length)), p = t.split(`
`, 1)[0], _ = !y.trim(), k = 0;
        if (this.options.pedantic ? (k = 2, g = y.trimStart()) : _ ? k = e[1].length + 1 : (k = e[2].search(this.rules.other.nonSpaceChar), k = k > 4 ? 1 : k, g = y.slice(k), k += e[1].length), _ && this.rules.other.blankLine.test(p) && (o += p + `
`, t = t.substring(p.length + 1), u = !0), !u) {
          let E = this.rules.other.nextBulletRegex(k), U = this.rules.other.hrRegex(k), Z = this.rules.other.fencesBeginRegex(k), ee = this.rules.other.headingBeginRegex(k), O = this.rules.other.htmlBeginRegex(k);
          for (; t; ) {
            let N = t.split(`
`, 1)[0], q;
            if (p = N, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), q = p) : q = p.replace(this.rules.other.tabCharGlobal, "    "), Z.test(p) || ee.test(p) || O.test(p) || E.test(p) || U.test(p)) break;
            if (q.search(this.rules.other.nonSpaceChar) >= k || !p.trim()) g += `
` + q.slice(k);
            else {
              if (_ || y.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Z.test(y) || ee.test(y) || U.test(y)) break;
              g += `
` + p;
            }
            !_ && !p.trim() && (_ = !0), o += N + `
`, t = t.substring(N.length + 1), y = q.slice(k);
          }
        }
        n.loose || (c ? n.loose = !0 : this.rules.other.doubleBlankLine.test(o) && (c = !0));
        let z = null, C;
        this.options.gfm && (z = this.rules.other.listIsTask.exec(g), z && (C = z[0] !== "[ ] ", g = g.replace(this.rules.other.listReplaceTask, ""))), n.items.push({ type: "list_item", raw: o, task: !!z, checked: C, loose: !1, text: g, tokens: [] }), n.raw += o;
      }
      let i = n.items.at(-1);
      if (i) i.raw = i.raw.trimEnd(), i.text = i.text.trimEnd();
      else return;
      n.raw = n.raw.trimEnd();
      for (let u = 0; u < n.items.length; u++) if (this.lexer.state.top = !1, n.items[u].tokens = this.lexer.blockTokens(n.items[u].text, []), !n.loose) {
        let o = n.items[u].tokens.filter((y) => y.type === "space"), g = o.length > 0 && o.some((y) => this.rules.other.anyLine.test(y.raw));
        n.loose = g;
      }
      if (n.loose) for (let u = 0; u < n.items.length; u++) n.items[u].loose = !0;
      return n;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let s = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", n = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: s, raw: e[0], href: r, title: n };
    }
  }
  table(t) {
    var c;
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let s = Oe(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), n = (c = e[3]) != null && c.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (s.length === r.length) {
      for (let i of r) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < s.length; i++) l.header.push({ text: s[i], tokens: this.lexer.inline(s[i]), header: !0, align: l.align[i] });
      for (let i of n) l.rows.push(Oe(i, l.header.length).map((u, o) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: l.align[o] })));
      return l;
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
        let l = ie(s.slice(0, -1), "\\");
        if ((s.length - l.length) % 2 === 0) return;
      } else {
        let l = ls(e[2], "()");
        if (l === -2) return;
        if (l > -1) {
          let c = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + l;
          e[2] = e[2].substring(0, l), e[0] = e[0].substring(0, c).trim(), e[3] = "";
        }
      }
      let r = e[2], n = "";
      if (this.options.pedantic) {
        let l = this.rules.other.pedanticHrefTitle.exec(r);
        l && (r = l[1], n = l[3]);
      } else n = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(s) ? r = r.slice(1) : r = r.slice(1, -1)), Ve(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: n && n.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let s;
    if ((s = this.rules.inline.reflink.exec(t)) || (s = this.rules.inline.nolink.exec(t))) {
      let r = (s[2] || s[1]).replace(this.rules.other.multipleSpaceGlobal, " "), n = e[r.toLowerCase()];
      if (!n) {
        let l = s[0].charAt(0);
        return { type: "text", raw: l, text: l };
      }
      return Ve(s, n, s[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, s = "") {
    let r = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!r || r[3] && s.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[2]) || !s || this.rules.inline.punctuation.exec(s))) {
      let n = [...r[0]].length - 1, l, c, i = n, u = 0, o = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (o.lastIndex = 0, e = e.slice(-1 * t.length + n); (r = o.exec(e)) != null; ) {
        if (l = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !l) continue;
        if (c = [...l].length, r[3] || r[4]) {
          i += c;
          continue;
        } else if ((r[5] || r[6]) && n % 3 && !((n + c) % 3)) {
          u += c;
          continue;
        }
        if (i -= c, i > 0) continue;
        c = Math.min(c, c + i + u);
        let g = [...r[0]][0].length, y = t.slice(0, n + r.index + g + c);
        if (Math.min(n, c) % 2) {
          let _ = y.slice(1, -1);
          return { type: "em", raw: y, text: _, tokens: this.lexer.inlineTokens(_) };
        }
        let p = y.slice(2, -2);
        return { type: "strong", raw: y, text: p, tokens: this.lexer.inlineTokens(p) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let s = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(s), n = this.rules.other.startingSpaceChar.test(s) && this.rules.other.endingSpaceChar.test(s);
      return r && n && (s = s.substring(1, s.length - 1)), { type: "codespan", raw: e[0], text: s };
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
      let s, r;
      return e[2] === "@" ? (s = e[1], r = "mailto:" + s) : (s = e[1], r = s), { type: "link", raw: e[0], text: s, href: r, tokens: [{ type: "text", raw: s, text: s }] };
    }
  }
  url(t) {
    var s;
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let r, n;
      if (e[2] === "@") r = e[0], n = "mailto:" + r;
      else {
        let l;
        do
          l = e[0], e[0] = ((s = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : s[0]) ?? "";
        while (l !== e[0]);
        r = e[0], e[1] === "www." ? n = "http://" + e[0] : n = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let s = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: s };
    }
  }
}, M = class ze {
  constructor(e) {
    R(this, "tokens");
    R(this, "options");
    R(this, "state");
    R(this, "tokenizer");
    R(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Y, this.options.tokenizer = this.options.tokenizer || new be(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let s = { other: P, block: ge.normal, inline: re.normal };
    this.options.pedantic ? (s.block = ge.pedantic, s.inline = re.pedantic) : this.options.gfm && (s.block = ge.gfm, this.options.breaks ? s.inline = re.breaks : s.inline = re.gfm), this.tokenizer.rules = s;
  }
  static get rules() {
    return { block: ge, inline: re };
  }
  static lex(e, s) {
    return new ze(s).lex(e);
  }
  static lexInline(e, s) {
    return new ze(s).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(P.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let s = 0; s < this.inlineQueue.length; s++) {
      let r = this.inlineQueue[s];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, s = [], r = !1) {
    var n, l, c;
    for (this.options.pedantic && (e = e.replace(P.tabCharGlobal, "    ").replace(P.spaceLine, "")); e; ) {
      let i;
      if ((l = (n = this.options.extensions) == null ? void 0 : n.block) != null && l.some((o) => (i = o.call({ lexer: this }, e, s)) ? (e = e.substring(i.raw.length), s.push(i), !0) : !1)) continue;
      if (i = this.tokenizer.space(e)) {
        e = e.substring(i.raw.length);
        let o = s.at(-1);
        i.raw.length === 1 && o !== void 0 ? o.raw += `
` : s.push(i);
        continue;
      }
      if (i = this.tokenizer.code(e)) {
        e = e.substring(i.raw.length);
        let o = s.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.text, this.inlineQueue.at(-1).src = o.text) : s.push(i);
        continue;
      }
      if (i = this.tokenizer.fences(e)) {
        e = e.substring(i.raw.length), s.push(i);
        continue;
      }
      if (i = this.tokenizer.heading(e)) {
        e = e.substring(i.raw.length), s.push(i);
        continue;
      }
      if (i = this.tokenizer.hr(e)) {
        e = e.substring(i.raw.length), s.push(i);
        continue;
      }
      if (i = this.tokenizer.blockquote(e)) {
        e = e.substring(i.raw.length), s.push(i);
        continue;
      }
      if (i = this.tokenizer.list(e)) {
        e = e.substring(i.raw.length), s.push(i);
        continue;
      }
      if (i = this.tokenizer.html(e)) {
        e = e.substring(i.raw.length), s.push(i);
        continue;
      }
      if (i = this.tokenizer.def(e)) {
        e = e.substring(i.raw.length);
        let o = s.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[i.tag] || (this.tokens.links[i.tag] = { href: i.href, title: i.title }, s.push(i));
        continue;
      }
      if (i = this.tokenizer.table(e)) {
        e = e.substring(i.raw.length), s.push(i);
        continue;
      }
      if (i = this.tokenizer.lheading(e)) {
        e = e.substring(i.raw.length), s.push(i);
        continue;
      }
      let u = e;
      if ((c = this.options.extensions) != null && c.startBlock) {
        let o = 1 / 0, g = e.slice(1), y;
        this.options.extensions.startBlock.forEach((p) => {
          y = p.call({ lexer: this }, g), typeof y == "number" && y >= 0 && (o = Math.min(o, y));
        }), o < 1 / 0 && o >= 0 && (u = e.substring(0, o + 1));
      }
      if (this.state.top && (i = this.tokenizer.paragraph(u))) {
        let o = s.at(-1);
        r && (o == null ? void 0 : o.type) === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : s.push(i), r = u.length !== e.length, e = e.substring(i.raw.length);
        continue;
      }
      if (i = this.tokenizer.text(e)) {
        e = e.substring(i.raw.length);
        let o = s.at(-1);
        (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : s.push(i);
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
    var i, u, o, g, y;
    let r = e, n = null;
    if (this.tokens.links) {
      let p = Object.keys(this.tokens.links);
      if (p.length > 0) for (; (n = this.tokenizer.rules.inline.reflinkSearch.exec(r)) != null; ) p.includes(n[0].slice(n[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, n.index) + "[" + "a".repeat(n[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (n = this.tokenizer.rules.inline.anyPunctuation.exec(r)) != null; ) r = r.slice(0, n.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (n = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; ) r = r.slice(0, n.index) + "[" + "a".repeat(n[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = ((u = (i = this.options.hooks) == null ? void 0 : i.emStrongMask) == null ? void 0 : u.call({ lexer: this }, r)) ?? r;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
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
      if (p = this.tokenizer.emStrong(e, r, c)) {
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
      let _ = e;
      if ((y = this.options.extensions) != null && y.startInline) {
        let k = 1 / 0, z = e.slice(1), C;
        this.options.extensions.startInline.forEach((E) => {
          C = E.call({ lexer: this }, z), typeof C == "number" && C >= 0 && (k = Math.min(k, C));
        }), k < 1 / 0 && k >= 0 && (_ = e.substring(0, k + 1));
      }
      if (p = this.tokenizer.inlineText(_)) {
        e = e.substring(p.raw.length), p.raw.slice(-1) !== "_" && (c = p.raw.slice(-1)), l = !0;
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
}, xe = class {
  constructor(t) {
    R(this, "options");
    R(this, "parser");
    this.options = t || Y;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: s }) {
    var l;
    let r = (l = (e || "").match(P.notSpaceStart)) == null ? void 0 : l[0], n = t.replace(P.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + H(r) + '">' + (s ? n : H(n, !0)) + `</code></pre>
` : "<pre><code>" + (s ? n : H(n, !0)) + `</code></pre>
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
    let e = t.ordered, s = t.start, r = "";
    for (let c = 0; c < t.items.length; c++) {
      let i = t.items[c];
      r += this.listitem(i);
    }
    let n = e ? "ol" : "ul", l = e && s !== 1 ? ' start="' + s + '"' : "";
    return "<" + n + l + `>
` + r + "</" + n + `>
`;
  }
  listitem(t) {
    var s;
    let e = "";
    if (t.task) {
      let r = this.checkbox({ checked: !!t.checked });
      t.loose ? ((s = t.tokens[0]) == null ? void 0 : s.type) === "paragraph" ? (t.tokens[0].text = r + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = r + " " + H(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({ type: "text", raw: r + " ", text: r + " ", escaped: !0 }) : e += r + " ";
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
    for (let n = 0; n < t.header.length; n++) s += this.tablecell(t.header[n]);
    e += this.tablerow({ text: s });
    let r = "";
    for (let n = 0; n < t.rows.length; n++) {
      let l = t.rows[n];
      s = "";
      for (let c = 0; c < l.length; c++) s += this.tablecell(l[c]);
      r += this.tablerow({ text: s });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
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
    return `<code>${H(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: s }) {
    let r = this.parser.parseInline(s), n = Qe(t);
    if (n === null) return r;
    t = n;
    let l = '<a href="' + t + '"';
    return e && (l += ' title="' + H(e) + '"'), l += ">" + r + "</a>", l;
  }
  image({ href: t, title: e, text: s, tokens: r }) {
    r && (s = this.parser.parseInline(r, this.parser.textRenderer));
    let n = Qe(t);
    if (n === null) return H(s);
    t = n;
    let l = `<img src="${t}" alt="${s}"`;
    return e && (l += ` title="${H(e)}"`), l += ">", l;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : H(t.text);
  }
}, Fe = class {
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
}, F = class Ce {
  constructor(e) {
    R(this, "options");
    R(this, "renderer");
    R(this, "textRenderer");
    this.options = e || Y, this.options.renderer = this.options.renderer || new xe(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Fe();
  }
  static parse(e, s) {
    return new Ce(s).parse(e);
  }
  static parseInline(e, s) {
    return new Ce(s).parseInline(e);
  }
  parse(e, s = !0) {
    var n, l;
    let r = "";
    for (let c = 0; c < e.length; c++) {
      let i = e[c];
      if ((l = (n = this.options.extensions) == null ? void 0 : n.renderers) != null && l[i.type]) {
        let o = i, g = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (g !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o.type)) {
          r += g || "";
          continue;
        }
      }
      let u = i;
      switch (u.type) {
        case "space": {
          r += this.renderer.space(u);
          continue;
        }
        case "hr": {
          r += this.renderer.hr(u);
          continue;
        }
        case "heading": {
          r += this.renderer.heading(u);
          continue;
        }
        case "code": {
          r += this.renderer.code(u);
          continue;
        }
        case "table": {
          r += this.renderer.table(u);
          continue;
        }
        case "blockquote": {
          r += this.renderer.blockquote(u);
          continue;
        }
        case "list": {
          r += this.renderer.list(u);
          continue;
        }
        case "html": {
          r += this.renderer.html(u);
          continue;
        }
        case "def": {
          r += this.renderer.def(u);
          continue;
        }
        case "paragraph": {
          r += this.renderer.paragraph(u);
          continue;
        }
        case "text": {
          let o = u, g = this.renderer.text(o);
          for (; c + 1 < e.length && e[c + 1].type === "text"; ) o = e[++c], g += `
` + this.renderer.text(o);
          s ? r += this.renderer.paragraph({ type: "paragraph", raw: g, text: g, tokens: [{ type: "text", raw: g, text: g, escaped: !0 }] }) : r += g;
          continue;
        }
        default: {
          let o = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return r;
  }
  parseInline(e, s = this.renderer) {
    var n, l;
    let r = "";
    for (let c = 0; c < e.length; c++) {
      let i = e[c];
      if ((l = (n = this.options.extensions) == null ? void 0 : n.renderers) != null && l[i.type]) {
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          r += o || "";
          continue;
        }
      }
      let u = i;
      switch (u.type) {
        case "escape": {
          r += s.text(u);
          break;
        }
        case "html": {
          r += s.html(u);
          break;
        }
        case "link": {
          r += s.link(u);
          break;
        }
        case "image": {
          r += s.image(u);
          break;
        }
        case "strong": {
          r += s.strong(u);
          break;
        }
        case "em": {
          r += s.em(u);
          break;
        }
        case "codespan": {
          r += s.codespan(u);
          break;
        }
        case "br": {
          r += s.br(u);
          break;
        }
        case "del": {
          r += s.del(u);
          break;
        }
        case "text": {
          r += s.text(u);
          break;
        }
        default: {
          let o = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return r;
  }
}, ke, le = (ke = class {
  constructor(t) {
    R(this, "options");
    R(this, "block");
    this.options = t || Y;
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
    return this.block ? M.lex : M.lexInline;
  }
  provideParser() {
    return this.block ? F.parse : F.parseInline;
  }
}, R(ke, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), R(ke, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), ke), os = class {
  constructor(...t) {
    R(this, "defaults", Ie());
    R(this, "options", this.setOptions);
    R(this, "parse", this.parseMarkdown(!0));
    R(this, "parseInline", this.parseMarkdown(!1));
    R(this, "Parser", F);
    R(this, "Renderer", xe);
    R(this, "TextRenderer", Fe);
    R(this, "Lexer", M);
    R(this, "Tokenizer", be);
    R(this, "Hooks", le);
    this.use(...t);
  }
  walkTokens(t, e) {
    var r, n;
    let s = [];
    for (let l of t) switch (s = s.concat(e.call(this, l)), l.type) {
      case "table": {
        let c = l;
        for (let i of c.header) s = s.concat(this.walkTokens(i.tokens, e));
        for (let i of c.rows) for (let u of i) s = s.concat(this.walkTokens(u.tokens, e));
        break;
      }
      case "list": {
        let c = l;
        s = s.concat(this.walkTokens(c.items, e));
        break;
      }
      default: {
        let c = l;
        (n = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && n[c.type] ? this.defaults.extensions.childTokens[c.type].forEach((i) => {
          let u = c[i].flat(1 / 0);
          s = s.concat(this.walkTokens(u, e));
        }) : c.tokens && (s = s.concat(this.walkTokens(c.tokens, e)));
      }
    }
    return s;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((s) => {
      let r = { ...s };
      if (r.async = this.defaults.async || r.async || !1, s.extensions && (s.extensions.forEach((n) => {
        if (!n.name) throw new Error("extension name required");
        if ("renderer" in n) {
          let l = e.renderers[n.name];
          l ? e.renderers[n.name] = function(...c) {
            let i = n.renderer.apply(this, c);
            return i === !1 && (i = l.apply(this, c)), i;
          } : e.renderers[n.name] = n.renderer;
        }
        if ("tokenizer" in n) {
          if (!n.level || n.level !== "block" && n.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[n.level];
          l ? l.unshift(n.tokenizer) : e[n.level] = [n.tokenizer], n.start && (n.level === "block" ? e.startBlock ? e.startBlock.push(n.start) : e.startBlock = [n.start] : n.level === "inline" && (e.startInline ? e.startInline.push(n.start) : e.startInline = [n.start]));
        }
        "childTokens" in n && n.childTokens && (e.childTokens[n.name] = n.childTokens);
      }), r.extensions = e), s.renderer) {
        let n = this.defaults.renderer || new xe(this.defaults);
        for (let l in s.renderer) {
          if (!(l in n)) throw new Error(`renderer '${l}' does not exist`);
          if (["options", "parser"].includes(l)) continue;
          let c = l, i = s.renderer[c], u = n[c];
          n[c] = (...o) => {
            let g = i.apply(n, o);
            return g === !1 && (g = u.apply(n, o)), g || "";
          };
        }
        r.renderer = n;
      }
      if (s.tokenizer) {
        let n = this.defaults.tokenizer || new be(this.defaults);
        for (let l in s.tokenizer) {
          if (!(l in n)) throw new Error(`tokenizer '${l}' does not exist`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let c = l, i = s.tokenizer[c], u = n[c];
          n[c] = (...o) => {
            let g = i.apply(n, o);
            return g === !1 && (g = u.apply(n, o)), g;
          };
        }
        r.tokenizer = n;
      }
      if (s.hooks) {
        let n = this.defaults.hooks || new le();
        for (let l in s.hooks) {
          if (!(l in n)) throw new Error(`hook '${l}' does not exist`);
          if (["options", "block"].includes(l)) continue;
          let c = l, i = s.hooks[c], u = n[c];
          le.passThroughHooks.has(l) ? n[c] = (o) => {
            if (this.defaults.async && le.passThroughHooksRespectAsync.has(l)) return (async () => {
              let y = await i.call(n, o);
              return u.call(n, y);
            })();
            let g = i.call(n, o);
            return u.call(n, g);
          } : n[c] = (...o) => {
            if (this.defaults.async) return (async () => {
              let y = await i.apply(n, o);
              return y === !1 && (y = await u.apply(n, o)), y;
            })();
            let g = i.apply(n, o);
            return g === !1 && (g = u.apply(n, o)), g;
          };
        }
        r.hooks = n;
      }
      if (s.walkTokens) {
        let n = this.defaults.walkTokens, l = s.walkTokens;
        r.walkTokens = function(c) {
          let i = [];
          return i.push(l.call(this, c)), n && (i = i.concat(n.call(this, c))), i;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return M.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return F.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, s) => {
      let r = { ...s }, n = { ...this.defaults, ...r }, l = this.onError(!!n.silent, !!n.async);
      if (this.defaults.async === !0 && r.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (n.hooks && (n.hooks.options = n, n.hooks.block = t), n.async) return (async () => {
        let c = n.hooks ? await n.hooks.preprocess(e) : e, i = await (n.hooks ? await n.hooks.provideLexer() : t ? M.lex : M.lexInline)(c, n), u = n.hooks ? await n.hooks.processAllTokens(i) : i;
        n.walkTokens && await Promise.all(this.walkTokens(u, n.walkTokens));
        let o = await (n.hooks ? await n.hooks.provideParser() : t ? F.parse : F.parseInline)(u, n);
        return n.hooks ? await n.hooks.postprocess(o) : o;
      })().catch(l);
      try {
        n.hooks && (e = n.hooks.preprocess(e));
        let c = (n.hooks ? n.hooks.provideLexer() : t ? M.lex : M.lexInline)(e, n);
        n.hooks && (c = n.hooks.processAllTokens(c)), n.walkTokens && this.walkTokens(c, n.walkTokens);
        let i = (n.hooks ? n.hooks.provideParser() : t ? F.parse : F.parseInline)(c, n);
        return n.hooks && (i = n.hooks.postprocess(i)), i;
      } catch (c) {
        return l(c);
      }
    };
  }
  onError(t, e) {
    return (s) => {
      if (s.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let r = "<p>An error occurred:</p><pre>" + H(s.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(s);
      throw s;
    };
  }
}, J = new os();
function S(t, e) {
  return J.parse(t, e);
}
S.options = S.setOptions = function(t) {
  return J.setOptions(t), S.defaults = J.defaults, We(S.defaults), S;
};
S.getDefaults = Ie;
S.defaults = Y;
S.use = function(...t) {
  return J.use(...t), S.defaults = J.defaults, We(S.defaults), S;
};
S.walkTokens = function(t, e) {
  return J.walkTokens(t, e);
};
S.parseInline = J.parseInline;
S.Parser = F;
S.parser = F.parse;
S.Renderer = xe;
S.TextRenderer = Fe;
S.Lexer = M;
S.lexer = M.lex;
S.Tokenizer = be;
S.Hooks = le;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
F.parse;
M.lex;
const cs = { class: "detail-container" }, us = { class: "detail-header" }, ps = { class: "header-summary" }, hs = {
  key: 0,
  class: "loading"
}, ds = {
  key: 1,
  class: "error"
}, gs = {
  key: 2,
  class: "detail-content"
}, ks = { class: "task-info" }, fs = { class: "info-row" }, ms = ["innerHTML"], bs = { class: "info-row" }, xs = { class: "info-value details-row" }, ys = { class: "detail-item" }, ws = { class: "detail-item" }, vs = { class: "detail-item" }, $s = ["disabled"], _s = ["value"], Ss = {
  key: 1,
  class: "info-value"
}, Ts = { class: "history-section" }, Rs = { class: "expand-icon" }, As = { key: 0 }, zs = {
  key: 0,
  class: "loading"
}, Cs = {
  key: 1,
  class: "history-list"
}, Is = { class: "history-meta" }, Ls = { class: "history-date" }, qs = { class: "history-change" }, Ps = { class: "change-values" }, Es = { class: "old-value" }, Bs = { class: "new-value" }, Ds = {
  key: 2,
  class: "no-history"
}, Ms = { class: "comments-section" }, Fs = {
  key: 0,
  class: "loading"
}, Us = {
  key: 1,
  class: "comments-list"
}, Hs = { class: "comment-meta" }, Zs = { class: "comment-date" }, Ns = ["innerHTML"], Qs = ["innerHTML"], Os = {
  key: 2,
  class: "no-comments"
}, Vs = { class: "add-comment" }, js = ["disabled"], Ks = ["disabled"], Gs = { key: 0 }, Ws = { key: 1 }, Xs = /* @__PURE__ */ je({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(t, { emit: e }) {
    const s = t, r = e, { data: n, isLoading: l, error: c } = wt(s.taskId), { data: i, isLoading: u } = vt(s.taskId), { data: o, isLoading: g } = $t(s.taskId), y = Ke(), p = St(), _ = L(null), k = L(""), z = L(null), C = L(""), E = L(!1), U = L(!1), { data: Z, isLoading: ee } = Ge();
    async function O(v, h) {
      _.value = v, k.value = h, await gt();
      const I = z.value;
      I && typeof I.focus == "function" && I.focus();
    }
    function N() {
      _.value = null, k.value = "";
    }
    async function q() {
      if (!_.value || !n.value) return;
      const v = _.value, h = n.value[v];
      if (k.value !== h)
        try {
          await y.mutateAsync({
            id: s.taskId,
            updates: { [v]: k.value },
            userId: s.userId
          });
        } catch (I) {
          console.error("Failed to update task:", I);
        }
      N();
    }
    async function _e() {
      if (C.value.trim()) {
        if (C.value.trim().startsWith("@analyze")) {
          const v = C.value.trim().replace(/^@analyze\s*/, "");
          if (!v) return;
          U.value = !0;
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
            await p.mutateAsync({
              task_id: s.taskId,
              comment: `${I.reply}`,
              created_by: "Analyze"
              // or props.userId if you want to attribute to user
            }), C.value = "";
          } catch (h) {
            console.error("AI analysis failed:", h);
          } finally {
            U.value = !1;
          }
          return;
        }
        try {
          await p.mutateAsync({
            task_id: s.taskId,
            comment: C.value,
            created_by: s.userId
          }), C.value = "";
        } catch (v) {
          console.error("Failed to add comment:", v);
        }
      }
    }
    async function te() {
      if (n.value)
        try {
          await y.mutateAsync({
            id: n.value.id,
            updates: { archived: !n.value.archived },
            userId: s.userId
          });
        } catch (v) {
          console.error("Failed to archive/unarchive task:", v);
        }
    }
    function de(v) {
      return new Date(v).toLocaleString();
    }
    function Se(v) {
      return v.replace(/_/g, " ").replace(/\b\w/g, (h) => h.toUpperCase());
    }
    function T(v) {
      return v.replace(
        /!\[.*?\]\((https?:\/\/[^)]+|data:image\/[^)]+)\)/g,
        `<img src="$1" class="img-thumb" data-src="$1" onclick="window.open(this.dataset.src,'_blank')" />`
      ).replace(/\n/g, "<br/>");
    }
    async function d(v) {
      await V(v, (h) => {
        k.value += `
![image](${h})
`;
      });
    }
    async function f(v) {
      await V(v, (h) => {
        C.value += `
![image](${h})
`;
      });
    }
    async function V(v, h) {
      var j;
      const I = (j = v.clipboardData) == null ? void 0 : j.items;
      if (I) {
        for (const K of I)
          if (K.type.indexOf("image") !== -1) {
            v.preventDefault();
            const x = K.getAsFile();
            if (x) {
              const ne = new FileReader();
              ne.onload = (ot) => {
                var Ue;
                const ct = (Ue = ot.target) == null ? void 0 : Ue.result;
                h(ct);
              }, ne.readAsDataURL(x);
            }
          }
      }
    }
    function se(v) {
      if (!v || !Z.value) return "";
      const h = Z.value.find((I) => I.id === v);
      return (h == null ? void 0 : h.name) || v;
    }
    function Te(v) {
      return S.parse(v);
    }
    return (v, h) => {
      var I, j, K;
      return m(), b("div", cs, [
        a("div", us, [
          a("button", {
            class: "btn btn-back",
            onClick: h[0] || (h[0] = (x) => r("close"))
          }, " ← Back to Tasks "),
          a("h2", ps, A(((I = w(n)) == null ? void 0 : I.summary) || "Task Details"), 1),
          a("button", {
            class: W(["btn", (j = w(n)) != null && j.archived ? "btn-success" : "btn-danger"]),
            onClick: te
          }, A((K = w(n)) != null && K.archived ? "Unarchive" : "Archive") + " Task ", 3)
        ]),
        w(l) ? (m(), b("div", hs, "Loading task details...")) : w(c) ? (m(), b("div", ds, "Error: " + A(w(c)), 1)) : w(n) ? (m(), b("div", gs, [
          a("div", ks, [
            a("div", fs, [
              h[11] || (h[11] = a("label", null, "Description", -1)),
              a("div", {
                onDblclick: h[2] || (h[2] = (x) => O("description", w(n).description || ""))
              }, [
                _.value === "description" ? D((m(), b("textarea", {
                  key: 0,
                  "onUpdate:modelValue": h[1] || (h[1] = (x) => k.value = x),
                  onBlur: q,
                  onKeyup: dt(N, ["esc"]),
                  onPaste: d,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: z
                }, null, 544)), [
                  [ae, k.value]
                ]) : (m(), b("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: T(w(n).description || "")
                }, null, 8, ms))
              ], 32)
            ]),
            a("div", bs, [
              h[18] || (h[18] = a("label", null, "Details", -1)),
              a("div", xs, [
                a("div", ys, [
                  h[13] || (h[13] = a("div", { class: "small-label" }, "Status", -1)),
                  a("div", {
                    onDblclick: h[4] || (h[4] = (x) => O("status", w(n).status))
                  }, [
                    _.value === "status" ? D((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": h[3] || (h[3] = (x) => k.value = x),
                      onBlur: q,
                      onChange: q,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: z
                    }, [...h[12] || (h[12] = [
                      a("option", { value: "open" }, "Open", -1),
                      a("option", { value: "in-progress" }, "In Progress", -1),
                      a("option", { value: "completed" }, "Completed", -1),
                      a("option", { value: "closed" }, "Closed", -1)
                    ])], 544)), [
                      [X, k.value]
                    ]) : (m(), b("span", {
                      key: 1,
                      class: W(`status-badge status-${w(n).status}`)
                    }, A(w(n).status), 3))
                  ], 32)
                ]),
                a("div", ws, [
                  h[15] || (h[15] = a("div", { class: "small-label" }, "Priority", -1)),
                  a("div", {
                    onDblclick: h[6] || (h[6] = (x) => O("priority", w(n).priority))
                  }, [
                    _.value === "priority" ? D((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": h[5] || (h[5] = (x) => k.value = x),
                      onBlur: q,
                      onChange: q,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: z
                    }, [...h[14] || (h[14] = [
                      a("option", { value: "low" }, "Low", -1),
                      a("option", { value: "medium" }, "Medium", -1),
                      a("option", { value: "high" }, "High", -1),
                      a("option", { value: "critical" }, "Critical", -1)
                    ])], 544)), [
                      [X, k.value]
                    ]) : (m(), b("span", {
                      key: 1,
                      class: W(`priority-badge priority-${w(n).priority}`)
                    }, A(w(n).priority), 3))
                  ], 32)
                ]),
                a("div", vs, [
                  h[17] || (h[17] = a("div", { class: "small-label" }, "Assigned", -1)),
                  a("div", {
                    onDblclick: h[8] || (h[8] = (x) => O("assigned_to", w(n).assigned_to || ""))
                  }, [
                    _.value === "assigned_to" ? D((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": h[7] || (h[7] = (x) => k.value = x),
                      onBlur: q,
                      onChange: q,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: z,
                      disabled: w(ee)
                    }, [
                      h[16] || (h[16] = a("option", { value: "" }, "-- Unassigned --", -1)),
                      (m(!0), b(oe, null, ce(w(Z), (x) => (m(), b("option", {
                        key: x.id,
                        value: x.id
                      }, A(x.name), 9, _s))), 128))
                    ], 40, $s)), [
                      [X, k.value]
                    ]) : (m(), b("div", Ss, A(se(w(n).assigned_to) || "-"), 1))
                  ], 32)
                ])
              ])
            ])
          ]),
          a("div", Ts, [
            a("div", {
              class: "section-header",
              onClick: h[9] || (h[9] = (x) => E.value = !E.value)
            }, [
              a("h3", null, [
                a("span", Rs, A(E.value ? "▼" : "▶"), 1),
                h[19] || (h[19] = G(" History ", -1))
              ])
            ]),
            E.value ? (m(), b("div", As, [
              w(g) ? (m(), b("div", zs, "Loading history...")) : w(o) && w(o).length > 0 ? (m(), b("div", Cs, [
                (m(!0), b(oe, null, ce(w(o), (x) => (m(), b("div", {
                  key: x.id,
                  class: "history-item"
                }, [
                  a("div", Is, [
                    a("strong", null, A(se(x.changed_by)), 1),
                    a("span", Ls, A(de(x.changed_at)), 1)
                  ]),
                  a("div", qs, [
                    h[23] || (h[23] = G(" Changed ", -1)),
                    a("strong", null, A(Se(x.field_name)), 1),
                    a("span", Ps, [
                      h[20] || (h[20] = G(' from "', -1)),
                      a("span", Es, A(x.old_value), 1),
                      h[21] || (h[21] = G('" to "', -1)),
                      a("span", Bs, A(x.new_value), 1),
                      h[22] || (h[22] = G('" ', -1))
                    ])
                  ])
                ]))), 128))
              ])) : (m(), b("div", Ds, "No history yet"))
            ])) : fe("", !0)
          ]),
          a("div", Ms, [
            h[25] || (h[25] = a("h3", null, "Comments", -1)),
            w(u) ? (m(), b("div", Fs, "Loading comments...")) : w(i) && w(i).length > 0 ? (m(), b("div", Us, [
              (m(!0), b(oe, null, ce(w(i), (x) => (m(), b("div", {
                key: x.id,
                class: "comment-item"
              }, [
                a("div", Hs, [
                  a("strong", null, A(se(x.created_by)), 1),
                  a("span", Zs, A(de(x.created_at)), 1)
                ]),
                x.created_by === "Analyze" ? (m(), b("div", {
                  key: 0,
                  class: "comment-text",
                  innerHTML: Te(x.comment)
                }, null, 8, Ns)) : (m(), b("div", {
                  key: 1,
                  class: "comment-text",
                  innerHTML: T(x.comment)
                }, null, 8, Qs))
              ]))), 128))
            ])) : (m(), b("div", Os, "No comments yet")),
            a("div", Vs, [
              D(a("textarea", {
                "onUpdate:modelValue": h[10] || (h[10] = (x) => C.value = x),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: f,
                disabled: U.value
              }, null, 40, js), [
                [ae, C.value]
              ]),
              h[24] || (h[24] = a("small", null, "Paste images from clipboard", -1)),
              a("button", {
                onClick: _e,
                disabled: !C.value.trim() || U.value,
                class: "btn-primary"
              }, [
                U.value ? (m(), b("span", Gs, "Analyzing...")) : (m(), b("span", Ws, "Add Comment"))
              ], 8, Ks)
            ])
          ])
        ])) : fe("", !0)
      ]);
    };
  }
}), at = (t, e) => {
  const s = t.__vccOpts || t;
  for (const [r, n] of e)
    s[r] = n;
  return s;
}, Js = /* @__PURE__ */ at(Xs, [["__scopeId", "data-v-e766800c"]]), Ys = { class: "tasks-card" }, en = {
  key: 0,
  class: "loading"
}, tn = {
  key: 1,
  class: "error"
}, sn = {
  key: 2,
  class: "tasks-container"
}, nn = { class: "tasks-header" }, rn = { class: "tasks-header-actions" }, ln = { class: "tasks-filters" }, an = { class: "filter-checkbox" }, on = { class: "tasks-table-wrapper" }, cn = { class: "tasks-table" }, un = {
  key: 0,
  class: "no-results"
}, pn = { class: "task-actions" }, hn = ["onClick"], dn = ["onClick", "title", "disabled"], gn = { key: 0 }, kn = { key: 1 }, fn = {
  key: 3,
  class: "task-form-container"
}, mn = { class: "form-body" }, bn = { class: "form-group" }, xn = { class: "form-group" }, yn = { class: "form-row" }, wn = { class: "form-group" }, vn = { class: "form-group" }, $n = { class: "form-group" }, _n = ["disabled"], Sn = ["value"], Tn = { class: "form-actions" }, Rn = ["disabled"], An = /* @__PURE__ */ je({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(t, { emit: e }) {
    const s = t, r = e, n = L(""), l = L(""), c = L("list"), i = L(null);
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
    const y = Re(() => ({
      status: l.value || void 0
    })), { data: p, isLoading: _, error: k } = yt(y), z = _t(), C = Ke();
    Tt();
    const { data: E, isLoading: U } = Ge(), Z = Re(() => {
      if (!p.value) return [];
      const T = n.value.toLowerCase().trim();
      let d = p.value.filter((f) => o.value ? !!f.archived : !f.archived);
      return T ? d.filter((f) => {
        var I, j, K, x, ne;
        const V = ((I = f.summary) == null ? void 0 : I.toLowerCase()) || "", se = ((j = f.description) == null ? void 0 : j.toLowerCase()) || "", Te = ((K = f.status) == null ? void 0 : K.toLowerCase().replace("_", " ")) || "", v = ((x = f.priority) == null ? void 0 : x.toLowerCase()) || "", h = ((ne = f.assigned_to) == null ? void 0 : ne.toLowerCase()) || "";
        return V.includes(T) || se.includes(T) || Te.includes(T) || v.includes(T) || h.includes(T);
      }) : d;
    });
    function ee(T) {
      return new Date(T).toLocaleDateString();
    }
    async function O() {
      try {
        await z.mutateAsync(u.value), N(), c.value = "list";
      } catch (T) {
        console.error("Failed to create task:", T);
      }
    }
    function N() {
      u.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: s.userId
      };
    }
    function q() {
      N(), c.value = "create";
    }
    function _e(T) {
      i.value = T, c.value = "detail";
    }
    function te() {
      c.value = "list", i.value = null;
    }
    kt(() => {
      const d = new URLSearchParams(window.location.search).get("taskId");
      d && (i.value = d, c.value = "detail");
    }), ft([i, c], ([T, d]) => {
      const f = new URLSearchParams(window.location.search);
      d === "detail" && T ? f.set("taskId", T) : f.delete("taskId");
      const V = `${window.location.pathname}?${f.toString()}`;
      window.history.replaceState({}, "", V);
    });
    async function de(T) {
      g.value = T.id;
      try {
        await C.mutateAsync({
          id: T.id,
          updates: { archived: !T.archived },
          userId: s.userId
        });
      } catch (d) {
        console.error("Failed to archive/unarchive task:", d);
      } finally {
        g.value = null;
      }
    }
    function Se(T) {
      if (!T || !E.value) return "";
      const d = E.value.find((f) => f.id === T);
      return (d == null ? void 0 : d.name) || T;
    }
    return (T, d) => (m(), b("div", Ys, [
      w(_) && !w(p) ? (m(), b("div", en, [...d[10] || (d[10] = [
        a("div", { class: "loading-spinner" }, null, -1),
        G(" Loading tasks... ", -1)
      ])])) : w(k) ? (m(), b("div", tn, [
        d[11] || (d[11] = a("h3", null, "Error loading tasks", -1)),
        a("p", null, A(w(k)), 1)
      ])) : c.value === "list" ? (m(), b("div", sn, [
        a("div", nn, [
          a("h2", {
            class: W({ "tasks-header-clickable": s.showHeaderLink }),
            onClick: d[0] || (d[0] = (f) => s.showHeaderLink && r("navigate"))
          }, " Tasks Management ", 2),
          a("div", rn, [
            a("button", {
              class: "btn btn-add",
              onClick: q
            }, [...d[12] || (d[12] = [
              a("span", { class: "icon" }, "➕", -1)
            ])]),
            a("button", {
              class: "btn btn-minimize",
              onClick: d[1] || (d[1] = (f) => r("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        a("div", ln, [
          D(a("input", {
            "onUpdate:modelValue": d[2] || (d[2] = (f) => n.value = f),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [ae, n.value]
          ]),
          D(a("select", {
            "onUpdate:modelValue": d[3] || (d[3] = (f) => l.value = f),
            class: "filter-select"
          }, [...d[13] || (d[13] = [
            a("option", { value: "" }, "All Status", -1),
            a("option", { value: "open" }, "Open", -1),
            a("option", { value: "in_progress" }, "In Progress", -1),
            a("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [X, l.value]
          ]),
          a("label", an, [
            D(a("input", {
              type: "checkbox",
              "onUpdate:modelValue": d[4] || (d[4] = (f) => o.value = f)
            }, null, 512), [
              [bt, o.value]
            ]),
            d[14] || (d[14] = G(" Show Archived ", -1))
          ])
        ]),
        a("div", on, [
          a("table", cn, [
            d[17] || (d[17] = a("thead", null, [
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
              Z.value.length === 0 ? (m(), b("tr", un, [...d[15] || (d[15] = [
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
              ])])) : fe("", !0),
              (m(!0), b(oe, null, ce(Z.value, (f) => (m(), b("tr", {
                key: f.id
              }, [
                a("td", null, A(f.summary), 1),
                a("td", null, [
                  a("span", {
                    class: W(`status-badge status-${f.status}`)
                  }, A(f.status), 3)
                ]),
                a("td", null, [
                  a("span", {
                    class: W(`priority-badge priority-${f.priority}`)
                  }, A(f.priority), 3)
                ]),
                a("td", null, A(Se(f.assigned_to) || "-"), 1),
                a("td", null, A(ee(f.created_at)), 1),
                a("td", pn, [
                  a("button", {
                    class: "btn btn-icon",
                    onClick: (V) => _e(f.id),
                    title: "View details"
                  }, " 👁️ ", 8, hn),
                  a("button", {
                    class: W(["btn btn-icon", f.archived ? "btn-success" : "btn-danger"]),
                    onClick: (V) => de(f),
                    title: f.archived ? "Unarchive task" : "Archive task",
                    disabled: g.value === f.id
                  }, [
                    g.value === f.id ? (m(), b("span", gn, [...d[16] || (d[16] = [
                      a("span", {
                        class: "loading-spinner",
                        style: { display: "inline-block", width: "1em", height: "1em", "border-width": "2px" }
                      }, null, -1)
                    ])])) : (m(), b("span", kn, A(f.archived ? "↩️" : "🗑️"), 1))
                  ], 10, dn)
                ])
              ]))), 128))
            ])
          ])
        ])
      ])) : c.value === "create" ? (m(), b("div", fn, [
        a("div", { class: "form-header" }, [
          a("button", {
            class: "btn btn-back",
            onClick: te
          }, " ← Back to Tasks "),
          d[18] || (d[18] = a("h2", null, "Create New Task", -1))
        ]),
        a("div", mn, [
          a("div", bn, [
            d[19] || (d[19] = a("label", { for: "task-summary" }, "Summary *", -1)),
            D(a("input", {
              id: "task-summary",
              "onUpdate:modelValue": d[5] || (d[5] = (f) => u.value.summary = f),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [ae, u.value.summary]
            ])
          ]),
          a("div", xn, [
            d[20] || (d[20] = a("label", { for: "task-description" }, "Description", -1)),
            D(a("textarea", {
              id: "task-description",
              "onUpdate:modelValue": d[6] || (d[6] = (f) => u.value.description = f),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [ae, u.value.description]
            ])
          ]),
          a("div", yn, [
            a("div", wn, [
              d[22] || (d[22] = a("label", { for: "task-status" }, "Status", -1)),
              D(a("select", {
                id: "task-status",
                "onUpdate:modelValue": d[7] || (d[7] = (f) => u.value.status = f)
              }, [...d[21] || (d[21] = [
                a("option", { value: "open" }, "Open", -1),
                a("option", { value: "in_progress" }, "In Progress", -1),
                a("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [X, u.value.status]
              ])
            ]),
            a("div", vn, [
              d[24] || (d[24] = a("label", { for: "task-priority" }, "Priority", -1)),
              D(a("select", {
                id: "task-priority",
                "onUpdate:modelValue": d[8] || (d[8] = (f) => u.value.priority = f)
              }, [...d[23] || (d[23] = [
                a("option", { value: "low" }, "Low", -1),
                a("option", { value: "medium" }, "Medium", -1),
                a("option", { value: "high" }, "High", -1)
              ])], 512), [
                [X, u.value.priority]
              ])
            ])
          ]),
          a("div", $n, [
            d[26] || (d[26] = a("label", { for: "task-assigned" }, "Assigned To", -1)),
            D(a("select", {
              id: "task-assigned",
              "onUpdate:modelValue": d[9] || (d[9] = (f) => u.value.assigned_to = f),
              disabled: w(U)
            }, [
              d[25] || (d[25] = a("option", { value: "" }, "-- Select User --", -1)),
              (m(!0), b(oe, null, ce(w(E), (f) => (m(), b("option", {
                key: f.id,
                value: f.id
              }, A(f.name), 9, Sn))), 128))
            ], 8, _n), [
              [X, u.value.assigned_to]
            ])
          ]),
          a("div", Tn, [
            a("button", {
              class: "btn btn-cancel",
              onClick: te
            }, "Cancel"),
            a("button", {
              class: "btn btn-primary",
              onClick: O,
              disabled: !u.value.summary.trim()
            }, " Create Task ", 8, Rn)
          ])
        ])
      ])) : c.value === "detail" && i.value ? (m(), mt(Js, {
        key: 4,
        "task-id": i.value,
        "user-id": t.userId,
        onClose: te
      }, null, 8, ["task-id", "user-id"])) : fe("", !0)
    ]));
  }
}), Ln = /* @__PURE__ */ at(An, [["__scopeId", "data-v-6badfad4"]]);
export {
  Js as TaskDetail,
  Ln as Tasks
};
