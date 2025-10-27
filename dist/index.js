var xt = Object.defineProperty;
var wt = (s, e, t) => e in s ? xt(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var T = (s, e, t) => wt(s, typeof e != "symbol" ? e + "" : e, t);
import { inject as vt, computed as Ee, unref as v, defineComponent as tt, ref as z, createElementBlock as b, openBlock as m, createElementVNode as a, createCommentVNode as W, withDirectives as q, toDisplayString as C, withKeys as Pe, vModelText as J, normalizeClass as Y, vModelSelect as ee, Fragment as he, renderList as ke, createTextVNode as X, nextTick as $t, onMounted as _t, watch as St, createBlock as Tt, vModelCheckbox as Rt } from "vue";
import { useQuery as fe, useQueryClient as me, useMutation as be } from "@tanstack/vue-query";
const Ct = Symbol.for("y2kfund.supabase");
function K() {
  const s = vt(Ct, null);
  if (!s) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return s;
}
const P = {
  all: ["tasks"],
  list: (s) => [...P.all, "list", s],
  detail: (s) => [...P.all, "detail", s],
  comments: (s) => [...P.all, "comments", s],
  history: (s) => [...P.all, "history", s]
};
function At(s) {
  const e = K();
  return fe({
    queryKey: Ee(() => {
      const t = s ? v(s) : {};
      return P.list(t);
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
  const e = K();
  return fe({
    queryKey: P.detail(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("tasks").select("*").eq("id", s).single();
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function It(s) {
  const e = K();
  return fe({
    queryKey: P.comments(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("task_comments").select("*").eq("task_id", s).order("created_at", { ascending: !1 });
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function Lt(s) {
  const e = K();
  return fe({
    queryKey: P.history(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("task_history").select("*").eq("task_id", s).order("changed_at", { ascending: !1 });
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function qt() {
  const s = K(), e = me();
  return be({
    mutationFn: async (t) => {
      const { data: n, error: r } = await s.schema("hf").from("tasks").insert(t).select().single();
      if (r) throw r;
      return n;
    },
    onSuccess: () => {
      e.invalidateQueries({ queryKey: P.all });
    }
  });
}
function st() {
  const s = K(), e = me();
  return be({
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
      e.invalidateQueries({ queryKey: P.all }), e.invalidateQueries({ queryKey: P.detail(t.id) }), e.invalidateQueries({ queryKey: P.history(t.id) });
    }
  });
}
function Pt() {
  const s = K(), e = me();
  return be({
    mutationFn: async (t) => {
      const { data: n, error: r } = await s.schema("hf").from("task_comments").insert(t).select().single();
      if (r) throw r;
      return n;
    },
    onSuccess: (t) => {
      e.invalidateQueries({ queryKey: P.comments(t.task_id) });
    }
  });
}
function Et() {
  const s = K(), e = me();
  return be({
    mutationFn: async (t) => {
      await s.schema("hf").from("task_comments").delete().eq("task_id", t), await s.schema("hf").from("task_history").delete().eq("task_id", t);
      const { error: n } = await s.schema("hf").from("tasks").delete().eq("id", t);
      if (n) throw n;
      return t;
    },
    onSuccess: () => {
      e.invalidateQueries({ queryKey: P.all });
    }
  });
}
function Bt() {
  const s = K(), e = me();
  return be({
    mutationFn: async ({ id: t, comment: n }) => {
      const { data: r, error: l } = await s.schema("hf").from("task_comments").update({ comment: n }).eq("id", t).select().single();
      if (l) throw l;
      return r;
    },
    onSuccess: (t) => {
      e.invalidateQueries({ queryKey: P.comments(t.task_id) });
    }
  });
}
function nt() {
  const s = K();
  return fe({
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
function Fe() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var se = Fe();
function rt(s) {
  se = s;
}
var ge = { exec: () => null };
function _(s, e = "") {
  let t = typeof s == "string" ? s : s.source, n = { replace: (r, l) => {
    let c = typeof l == "string" ? l : l.source;
    return c = c.replace(E.caret, "$1"), t = t.replace(r, c), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var E = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i") }, Mt = /^(?:[ \t]*(?:\n|$))+/, Dt = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ft = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, ye = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ut = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ue = /(?:[*+-]|\d{1,9}[.)])/, it = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, lt = _(it).replace(/bull/g, Ue).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ht = _(it).replace(/bull/g, Ue).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), He = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Vt = /^[^\n]+/, Ve = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Zt = _(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ve).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Qt = _(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ue).getRegex(), Ae = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ze = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Nt = _("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Ze).replace("tag", Ae).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), at = _(He).replace("hr", ye).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ae).getRegex(), Ot = _(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", at).getRegex(), Qe = { blockquote: Ot, code: Dt, def: Zt, fences: Ft, heading: Ut, hr: ye, html: Nt, lheading: lt, list: Qt, newline: Mt, paragraph: at, table: ge, text: Vt }, Ge = _("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", ye).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ae).getRegex(), Kt = { ...Qe, lheading: Ht, table: Ge, paragraph: _(He).replace("hr", ye).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Ge).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ae).getRegex() }, jt = { ...Qe, html: _(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Ze).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ge, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: _(He).replace("hr", ye).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", lt).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Gt = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Wt = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ot = /^( {2,}|\\)\n(?!\s*$)/, Xt = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ze = /[\p{P}\p{S}]/u, Ne = /[\s\p{P}\p{S}]/u, ct = /[^\s\p{P}\p{S}]/u, Jt = _(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ne).getRegex(), ut = /(?!~)[\p{P}\p{S}]/u, Yt = /(?!~)[\s\p{P}\p{S}]/u, es = /(?:[^\s\p{P}\p{S}]|~)/u, ts = _(/link|code|html/, "g").replace("link", new RegExp("\\[(?:[^\\[\\]`]|(?<!`)(?<a>`+)[^`]+\\k<a>(?!`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)")).replace("code", new RegExp("(?<!`)(?<b>`+)[^`]+\\k<b>(?!`)")).replace("html", /<(?! )[^<>]*?>/).getRegex(), dt = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ss = _(dt, "u").replace(/punct/g, ze).getRegex(), ns = _(dt, "u").replace(/punct/g, ut).getRegex(), pt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", rs = _(pt, "gu").replace(/notPunctSpace/g, ct).replace(/punctSpace/g, Ne).replace(/punct/g, ze).getRegex(), is = _(pt, "gu").replace(/notPunctSpace/g, es).replace(/punctSpace/g, Yt).replace(/punct/g, ut).getRegex(), ls = _("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ct).replace(/punctSpace/g, Ne).replace(/punct/g, ze).getRegex(), as = _(/\\(punct)/, "gu").replace(/punct/g, ze).getRegex(), os = _(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), cs = _(Ze).replace("(?:-->|$)", "-->").getRegex(), us = _("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", cs).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Te = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ds = _(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Te).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ht = _(/^!?\[(label)\]\[(ref)\]/).replace("label", Te).replace("ref", Ve).getRegex(), kt = _(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ve).getRegex(), ps = _("reflink|nolink(?!\\()", "g").replace("reflink", ht).replace("nolink", kt).getRegex(), We = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Oe = { _backpedal: ge, anyPunctuation: as, autolink: os, blockSkip: ts, br: ot, code: Wt, del: ge, emStrongLDelim: ss, emStrongRDelimAst: rs, emStrongRDelimUnd: ls, escape: Gt, link: ds, nolink: kt, punctuation: Jt, reflink: ht, reflinkSearch: ps, tag: us, text: Xt, url: ge }, hs = { ...Oe, link: _(/^!?\[(label)\]\((.*?)\)/).replace("label", Te).getRegex(), reflink: _(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Te).getRegex() }, Be = { ...Oe, emStrongRDelimAst: is, emStrongLDelim: ns, url: _(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", We).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: _(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", We).getRegex() }, ks = { ...Be, br: _(ot).replace("{2,}", "*").getRegex(), text: _(Be.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, _e = { normal: Qe, gfm: Kt, pedantic: jt }, ue = { normal: Oe, gfm: Be, breaks: ks, pedantic: hs }, gs = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Xe = (s) => gs[s];
function O(s, e) {
  if (e) {
    if (E.escapeTest.test(s)) return s.replace(E.escapeReplace, Xe);
  } else if (E.escapeTestNoEncode.test(s)) return s.replace(E.escapeReplaceNoEncode, Xe);
  return s;
}
function Je(s) {
  try {
    s = encodeURI(s).replace(E.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function Ye(s, e) {
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
function de(s, e, t) {
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
function et(s, e, t, n, r) {
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
var Re = class {
  constructor(s) {
    T(this, "options");
    T(this, "rules");
    T(this, "lexer");
    this.options = s || se;
  }
  space(s) {
    let e = this.rules.block.newline.exec(s);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(s) {
    let e = this.rules.block.code.exec(s);
    if (e) {
      let t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? t : de(t, `
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
        let n = de(t, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (t = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: de(e[0], `
`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let t = de(e[0], `
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
        let d = l.at(-1);
        if ((d == null ? void 0 : d.type) === "code") break;
        if ((d == null ? void 0 : d.type) === "blockquote") {
          let R = d, f = R.raw + `
` + t.join(`
`), I = this.blockquote(f);
          l[l.length - 1] = I, n = n.substring(0, n.length - R.raw.length) + I.raw, r = r.substring(0, r.length - R.text.length) + I.text;
          break;
        } else if ((d == null ? void 0 : d.type) === "list") {
          let R = d, f = R.raw + `
` + t.join(`
`), I = this.list(f);
          l[l.length - 1] = I, n = n.substring(0, n.length - d.raw.length) + I.raw, r = r.substring(0, r.length - R.raw.length) + I.raw, t = f.substring(l.at(-1).raw.length).split(`
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
`, 1)[0].replace(this.rules.other.listReplaceTabs, (U) => " ".repeat(3 * U.length)), d = s.split(`
`, 1)[0], R = !x.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, k = x.trimStart()) : R ? f = e[1].length + 1 : (f = e[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, k = x.slice(f), f += e[1].length), R && this.rules.other.blankLine.test(d) && (o += d + `
`, s = s.substring(d.length + 1), u = !0), !u) {
          let U = this.rules.other.nextBulletRegex(f), B = this.rules.other.hrRegex(f), A = this.rules.other.fencesBeginRegex(f), H = this.rules.other.headingBeginRegex(f), M = this.rules.other.htmlBeginRegex(f);
          for (; s; ) {
            let V = s.split(`
`, 1)[0], D;
            if (d = V, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), D = d) : D = d.replace(this.rules.other.tabCharGlobal, "    "), A.test(d) || H.test(d) || M.test(d) || U.test(d) || B.test(d)) break;
            if (D.search(this.rules.other.nonSpaceChar) >= f || !d.trim()) k += `
` + D.slice(f);
            else {
              if (R || x.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || A.test(x) || H.test(x) || B.test(x)) break;
              k += `
` + d;
            }
            !R && !d.trim() && (R = !0), o += V + `
`, s = s.substring(V.length + 1), x = D.slice(f);
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
    let t = Ye(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = (c = e[3]) != null && c.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (t.length === n.length) {
      for (let i of n) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < t.length; i++) l.header.push({ text: t[i], tokens: this.lexer.inline(t[i]), header: !0, align: l.align[i] });
      for (let i of r) l.rows.push(Ye(i, l.header.length).map((u, o) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: l.align[o] })));
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
        let l = de(t.slice(0, -1), "\\");
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
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? n = n.slice(1) : n = n.slice(1, -1)), et(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return et(t, r, t[0], this.lexer, this.rules);
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
          let R = x.slice(1, -1);
          return { type: "em", raw: x, text: R, tokens: this.lexer.inlineTokens(R) };
        }
        let d = x.slice(2, -2);
        return { type: "strong", raw: x, text: d, tokens: this.lexer.inlineTokens(d) };
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
}, Z = class Me {
  constructor(e) {
    T(this, "tokens");
    T(this, "options");
    T(this, "state");
    T(this, "tokenizer");
    T(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || se, this.options.tokenizer = this.options.tokenizer || new Re(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: E, block: _e.normal, inline: ue.normal };
    this.options.pedantic ? (t.block = _e.pedantic, t.inline = ue.pedantic) : this.options.gfm && (t.block = _e.gfm, this.options.breaks ? t.inline = ue.breaks : t.inline = ue.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: _e, inline: ue };
  }
  static lex(e, t) {
    return new Me(t).lex(e);
  }
  static lexInline(e, t) {
    return new Me(t).inlineTokens(e);
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
        this.options.extensions.startBlock.forEach((d) => {
          x = d.call({ lexer: this }, k), typeof x == "number" && x >= 0 && (o = Math.min(o, x));
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
      let d = Object.keys(this.tokens.links);
      if (d.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) d.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = ((u = (i = this.options.hooks) == null ? void 0 : i.emStrongMask) == null ? void 0 : u.call({ lexer: this }, n)) ?? n;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let d;
      if ((k = (o = this.options.extensions) == null ? void 0 : o.inline) != null && k.some((f) => (d = f.call({ lexer: this }, e, t)) ? (e = e.substring(d.raw.length), t.push(d), !0) : !1)) continue;
      if (d = this.tokenizer.escape(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.tag(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.link(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(d.raw.length);
        let f = t.at(-1);
        d.type === "text" && (f == null ? void 0 : f.type) === "text" ? (f.raw += d.raw, f.text += d.text) : t.push(d);
        continue;
      }
      if (d = this.tokenizer.emStrong(e, n, c)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.codespan(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.br(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.del(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.autolink(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (!this.state.inLink && (d = this.tokenizer.url(e))) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      let R = e;
      if ((x = this.options.extensions) != null && x.startInline) {
        let f = 1 / 0, I = e.slice(1), F;
        this.options.extensions.startInline.forEach((U) => {
          F = U.call({ lexer: this }, I), typeof F == "number" && F >= 0 && (f = Math.min(f, F));
        }), f < 1 / 0 && f >= 0 && (R = e.substring(0, f + 1));
      }
      if (d = this.tokenizer.inlineText(R)) {
        e = e.substring(d.raw.length), d.raw.slice(-1) !== "_" && (c = d.raw.slice(-1)), l = !0;
        let f = t.at(-1);
        (f == null ? void 0 : f.type) === "text" ? (f.raw += d.raw, f.text += d.text) : t.push(d);
        continue;
      }
      if (e) {
        let f = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(f);
          break;
        } else throw new Error(f);
      }
    }
    return t;
  }
}, Ce = class {
  constructor(s) {
    T(this, "options");
    T(this, "parser");
    this.options = s || se;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: t }) {
    var l;
    let n = (l = (e || "").match(E.notSpaceStart)) == null ? void 0 : l[0], r = s.replace(E.endingNewline, "") + `
`;
    return n ? '<pre><code class="language-' + O(n) + '">' + (t ? r : O(r, !0)) + `</code></pre>
` : "<pre><code>" + (t ? r : O(r, !0)) + `</code></pre>
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
      s.loose ? ((t = s.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (s.tokens[0].text = n + " " + s.tokens[0].text, s.tokens[0].tokens && s.tokens[0].tokens.length > 0 && s.tokens[0].tokens[0].type === "text" && (s.tokens[0].tokens[0].text = n + " " + O(s.tokens[0].tokens[0].text), s.tokens[0].tokens[0].escaped = !0)) : s.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: !0 }) : e += n + " ";
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
    return `<code>${O(s, !0)}</code>`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return `<del>${this.parser.parseInline(s)}</del>`;
  }
  link({ href: s, title: e, tokens: t }) {
    let n = this.parser.parseInline(t), r = Je(s);
    if (r === null) return n;
    s = r;
    let l = '<a href="' + s + '"';
    return e && (l += ' title="' + O(e) + '"'), l += ">" + n + "</a>", l;
  }
  image({ href: s, title: e, text: t, tokens: n }) {
    n && (t = this.parser.parseInline(n, this.parser.textRenderer));
    let r = Je(s);
    if (r === null) return O(t);
    s = r;
    let l = `<img src="${s}" alt="${t}"`;
    return e && (l += ` title="${O(e)}"`), l += ">", l;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : O(s.text);
  }
}, Ke = class {
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
}, Q = class De {
  constructor(e) {
    T(this, "options");
    T(this, "renderer");
    T(this, "textRenderer");
    this.options = e || se, this.options.renderer = this.options.renderer || new Ce(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Ke();
  }
  static parse(e, t) {
    return new De(t).parse(e);
  }
  static parseInline(e, t) {
    return new De(t).parseInline(e);
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
}, Se, pe = (Se = class {
  constructor(s) {
    T(this, "options");
    T(this, "block");
    this.options = s || se;
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
    return this.block ? Z.lex : Z.lexInline;
  }
  provideParser() {
    return this.block ? Q.parse : Q.parseInline;
  }
}, T(Se, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), T(Se, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), Se), bs = class {
  constructor(...s) {
    T(this, "defaults", Fe());
    T(this, "options", this.setOptions);
    T(this, "parse", this.parseMarkdown(!0));
    T(this, "parseInline", this.parseMarkdown(!1));
    T(this, "Parser", Q);
    T(this, "Renderer", Ce);
    T(this, "TextRenderer", Ke);
    T(this, "Lexer", Z);
    T(this, "Tokenizer", Re);
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
        let r = this.defaults.renderer || new Ce(this.defaults);
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
        let r = this.defaults.tokenizer || new Re(this.defaults);
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
    return Z.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return Q.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, t) => {
      let n = { ...t }, r = { ...this.defaults, ...n }, l = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && n.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = s), r.async) return (async () => {
        let c = r.hooks ? await r.hooks.preprocess(e) : e, i = await (r.hooks ? await r.hooks.provideLexer() : s ? Z.lex : Z.lexInline)(c, r), u = r.hooks ? await r.hooks.processAllTokens(i) : i;
        r.walkTokens && await Promise.all(this.walkTokens(u, r.walkTokens));
        let o = await (r.hooks ? await r.hooks.provideParser() : s ? Q.parse : Q.parseInline)(u, r);
        return r.hooks ? await r.hooks.postprocess(o) : o;
      })().catch(l);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let c = (r.hooks ? r.hooks.provideLexer() : s ? Z.lex : Z.lexInline)(e, r);
        r.hooks && (c = r.hooks.processAllTokens(c)), r.walkTokens && this.walkTokens(c, r.walkTokens);
        let i = (r.hooks ? r.hooks.provideParser() : s ? Q.parse : Q.parseInline)(c, r);
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
        let n = "<p>An error occurred:</p><pre>" + O(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, te = new bs();
function S(s, e) {
  return te.parse(s, e);
}
S.options = S.setOptions = function(s) {
  return te.setOptions(s), S.defaults = te.defaults, rt(S.defaults), S;
};
S.getDefaults = Fe;
S.defaults = se;
S.use = function(...s) {
  return te.use(...s), S.defaults = te.defaults, rt(S.defaults), S;
};
S.walkTokens = function(s, e) {
  return te.walkTokens(s, e);
};
S.parseInline = te.parseInline;
S.Parser = Q;
S.parser = Q.parse;
S.Renderer = Ce;
S.TextRenderer = Ke;
S.Lexer = Z;
S.lexer = Z.lex;
S.Tokenizer = Re;
S.Hooks = pe;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
Q.parse;
Z.lex;
const ys = { class: "detail-container" }, xs = { class: "detail-header" }, ws = { style: { flex: "1" } }, vs = {
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
}, Ts = { class: "task-info" }, Rs = { class: "info-row" }, Cs = ["innerHTML"], As = { class: "info-row" }, zs = { class: "info-value details-row" }, Is = { class: "detail-item" }, Ls = { class: "detail-item" }, qs = { class: "detail-item" }, Ps = ["disabled"], Es = ["value"], Bs = {
  key: 1,
  class: "info-value"
}, Ms = { class: "history-section" }, Ds = { class: "expand-icon" }, Fs = { key: 0 }, Us = {
  key: 0,
  class: "loading"
}, Hs = {
  key: 1,
  class: "history-list"
}, Vs = { class: "history-meta" }, Zs = { class: "history-date" }, Qs = { class: "history-change" }, Ns = { class: "change-values" }, Os = { class: "old-value" }, Ks = { class: "new-value" }, js = {
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
}, dn = { class: "add-comment" }, pn = ["disabled"], hn = ["disabled"], kn = { key: 0 }, gn = { key: 1 }, fn = /* @__PURE__ */ tt({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = z(""), l = z(null), c = z(""), i = z(null), { data: u, isLoading: o, error: k } = zt(t.taskId), { data: x, isLoading: d } = It(t.taskId), { data: R, isLoading: f } = Lt(t.taskId), I = Bt(), F = st(), U = Pt(), B = z(null), A = z(""), H = z(null), M = z(""), V = z(!1), D = z(!1), { data: re, isLoading: ie } = nt();
    async function G(w, p) {
      B.value = w, A.value = p, await $t();
      const L = H.value;
      L && typeof L.focus == "function" && L.focus();
    }
    function le() {
      B.value = null, A.value = "";
    }
    async function $() {
      if (!B.value || !u.value) return;
      const w = B.value, p = u.value[w];
      if (A.value !== p)
        try {
          await F.mutateAsync({
            id: t.taskId,
            updates: { [w]: A.value },
            userId: t.userId
          }), r.value = "Saved!", setTimeout(() => {
            r.value = "";
          }, 1200);
        } catch (L) {
          console.error("Failed to update task:", L);
        }
      le();
    }
    async function h() {
      if (M.value.trim()) {
        if (M.value.trim().startsWith("@analyze")) {
          const w = M.value.trim().replace(/^@analyze\s*/, "");
          if (!w) return;
          D.value = !0;
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
            await U.mutateAsync({
              task_id: t.taskId,
              comment: `${L.reply}`,
              created_by: "Analyze"
              // or props.userId if you want to attribute to user
            }), M.value = "";
          } catch (p) {
            console.error("AI analysis failed:", p);
          } finally {
            D.value = !1;
          }
          return;
        }
        try {
          await U.mutateAsync({
            task_id: t.taskId,
            comment: M.value,
            created_by: t.userId
          }), M.value = "";
        } catch (w) {
          console.error("Failed to add comment:", w);
        }
      }
    }
    async function g() {
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
    function j(w) {
      return new Date(w).toLocaleString();
    }
    function Ie(w) {
      return w.replace(/_/g, " ").replace(/\b\w/g, (p) => p.toUpperCase());
    }
    function xe(w) {
      return w.replace(
        /!\[.*?\]\((https?:\/\/[^)]+|data:image\/[^)]+)\)/g,
        `<img src="$1" class="img-thumb" data-src="$1" onclick="window.open(this.dataset.src,'_blank')" />`
      ).replace(/\n/g, "<br/>");
    }
    async function Le(w) {
      await ae(w, (p) => {
        A.value += `
![image](${p})
`;
      });
    }
    async function qe(w) {
      await ae(w, (p) => {
        M.value += `
![image](${p})
`;
      });
    }
    async function ae(w, p) {
      var oe;
      const L = (oe = w.clipboardData) == null ? void 0 : oe.items;
      if (L) {
        for (const ce of L)
          if (ce.type.indexOf("image") !== -1) {
            w.preventDefault();
            const y = ce.getAsFile();
            if (y) {
              const N = new FileReader();
              N.onload = (bt) => {
                var je;
                const yt = (je = bt.target) == null ? void 0 : je.result;
                p(yt);
              }, N.readAsDataURL(y);
            }
          }
      }
    }
    function ne(w) {
      if (!w || !re.value) return "";
      const p = re.value.find((L) => L.id === w);
      return (p == null ? void 0 : p.name) || w;
    }
    function we(w) {
      return S.parse(w);
    }
    function ve(w) {
      i.value = i.value === w ? null : w;
    }
    function $e(w) {
      l.value = w.id, c.value = w.comment, i.value = null;
    }
    function ft() {
      l.value = null, c.value = "";
    }
    async function mt(w) {
      if (c.value.trim())
        try {
          await I.mutateAsync({
            id: w,
            comment: c.value
          }), l.value = null, c.value = "";
        } catch (p) {
          console.error("Failed to edit comment:", p);
        }
    }
    return (w, p) => {
      var L, oe, ce;
      return m(), b("div", ys, [
        a("div", xs, [
          a("button", {
            class: "btn btn-back",
            onClick: p[0] || (p[0] = (y) => n("close"))
          }, " ← Back to Tasks "),
          a("div", ws, [
            B.value !== "summary" ? (m(), b("h2", {
              key: 0,
              class: "header-summary",
              onDblclick: p[1] || (p[1] = (y) => {
                var N;
                return G("summary", ((N = v(u)) == null ? void 0 : N.summary) || "");
              }),
              title: "Double-click to edit summary"
            }, C(((L = v(u)) == null ? void 0 : L.summary) || "Task Details"), 33)) : q((m(), b("input", {
              key: 1,
              "onUpdate:modelValue": p[2] || (p[2] = (y) => A.value = y),
              onBlur: $,
              onKeyup: [
                Pe(le, ["esc"]),
                Pe($, ["enter"])
              ],
              ref_key: "editInput",
              ref: H,
              class: "inline-edit",
              style: { "font-size": "1rem", width: "100%" },
              placeholder: "Task Summary"
            }, null, 544)), [
              [J, A.value]
            ])
          ]),
          a("button", {
            class: Y(["btn", (oe = v(u)) != null && oe.archived ? "btn-success" : "btn-danger"]),
            onClick: g
          }, C((ce = v(u)) != null && ce.archived ? "Unarchive" : "Archive") + " Task ", 3)
        ]),
        r.value ? (m(), b("div", vs, C(r.value), 1)) : W("", !0),
        v(o) ? (m(), b("div", $s, "Loading task details...")) : v(k) ? (m(), b("div", _s, "Error: " + C(v(k)), 1)) : v(u) ? (m(), b("div", Ss, [
          a("div", Ts, [
            a("div", Rs, [
              p[14] || (p[14] = a("label", null, "Description", -1)),
              a("div", {
                onDblclick: p[4] || (p[4] = (y) => G("description", v(u).description || ""))
              }, [
                B.value === "description" ? q((m(), b("textarea", {
                  key: 0,
                  "onUpdate:modelValue": p[3] || (p[3] = (y) => A.value = y),
                  onBlur: $,
                  onKeyup: Pe(le, ["esc"]),
                  onPaste: Le,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: H
                }, null, 544)), [
                  [J, A.value]
                ]) : (m(), b("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: xe(v(u).description || "")
                }, null, 8, Cs))
              ], 32)
            ]),
            a("div", As, [
              p[21] || (p[21] = a("label", null, "Details", -1)),
              a("div", zs, [
                a("div", Is, [
                  p[16] || (p[16] = a("div", { class: "small-label" }, "Status", -1)),
                  a("div", {
                    onDblclick: p[6] || (p[6] = (y) => G("status", v(u).status))
                  }, [
                    B.value === "status" ? q((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": p[5] || (p[5] = (y) => A.value = y),
                      onBlur: $,
                      onChange: $,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H
                    }, [...p[15] || (p[15] = [
                      a("option", { value: "open" }, "Open", -1),
                      a("option", { value: "in-progress" }, "In Progress", -1),
                      a("option", { value: "completed" }, "Completed", -1),
                      a("option", { value: "closed" }, "Closed", -1)
                    ])], 544)), [
                      [ee, A.value]
                    ]) : (m(), b("span", {
                      key: 1,
                      class: Y(`status-badge status-${v(u).status}`)
                    }, C(v(u).status), 3))
                  ], 32)
                ]),
                a("div", Ls, [
                  p[18] || (p[18] = a("div", { class: "small-label" }, "Priority", -1)),
                  a("div", {
                    onDblclick: p[8] || (p[8] = (y) => G("priority", v(u).priority))
                  }, [
                    B.value === "priority" ? q((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": p[7] || (p[7] = (y) => A.value = y),
                      onBlur: $,
                      onChange: $,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H
                    }, [...p[17] || (p[17] = [
                      a("option", { value: "low" }, "Low", -1),
                      a("option", { value: "medium" }, "Medium", -1),
                      a("option", { value: "high" }, "High", -1),
                      a("option", { value: "critical" }, "Critical", -1)
                    ])], 544)), [
                      [ee, A.value]
                    ]) : (m(), b("span", {
                      key: 1,
                      class: Y(`priority-badge priority-${v(u).priority}`)
                    }, C(v(u).priority), 3))
                  ], 32)
                ]),
                a("div", qs, [
                  p[20] || (p[20] = a("div", { class: "small-label" }, "Assigned", -1)),
                  a("div", {
                    onDblclick: p[10] || (p[10] = (y) => G("assigned_to", v(u).assigned_to || ""))
                  }, [
                    B.value === "assigned_to" ? q((m(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": p[9] || (p[9] = (y) => A.value = y),
                      onBlur: $,
                      onChange: $,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H,
                      disabled: v(ie)
                    }, [
                      p[19] || (p[19] = a("option", { value: "" }, "-- Unassigned --", -1)),
                      (m(!0), b(he, null, ke(v(re), (y) => (m(), b("option", {
                        key: y.id,
                        value: y.id
                      }, C(y.name), 9, Es))), 128))
                    ], 40, Ps)), [
                      [ee, A.value]
                    ]) : (m(), b("div", Bs, C(ne(v(u).assigned_to) || "-"), 1))
                  ], 32)
                ])
              ])
            ])
          ]),
          a("div", Ms, [
            a("div", {
              class: "section-header",
              onClick: p[11] || (p[11] = (y) => V.value = !V.value)
            }, [
              a("h3", null, [
                a("span", Ds, C(V.value ? "▼" : "▶"), 1),
                p[22] || (p[22] = X(" History ", -1))
              ])
            ]),
            V.value ? (m(), b("div", Fs, [
              v(f) ? (m(), b("div", Us, "Loading history...")) : v(R) && v(R).length > 0 ? (m(), b("div", Hs, [
                (m(!0), b(he, null, ke(v(R), (y) => (m(), b("div", {
                  key: y.id,
                  class: "history-item"
                }, [
                  a("div", Vs, [
                    a("strong", null, C(ne(y.changed_by)), 1),
                    a("span", Zs, C(j(y.changed_at)), 1)
                  ]),
                  a("div", Qs, [
                    p[26] || (p[26] = X(" Changed ", -1)),
                    a("strong", null, C(Ie(y.field_name)), 1),
                    a("span", Ns, [
                      p[23] || (p[23] = X(' from "', -1)),
                      a("span", Os, C(y.old_value), 1),
                      p[24] || (p[24] = X('" to "', -1)),
                      a("span", Ks, C(y.new_value), 1),
                      p[25] || (p[25] = X('" ', -1))
                    ])
                  ])
                ]))), 128))
              ])) : (m(), b("div", js, "No history yet"))
            ])) : W("", !0)
          ]),
          a("div", Gs, [
            p[28] || (p[28] = a("h3", null, "Comments", -1)),
            v(d) ? (m(), b("div", Ws, "Loading comments...")) : v(x) && v(x).length > 0 ? (m(), b("div", Xs, [
              (m(!0), b(he, null, ke(v(x), (y) => (m(), b("div", {
                key: y.id,
                class: "comment-item"
              }, [
                a("div", Js, [
                  a("strong", null, C(ne(y.created_by)), 1),
                  a("span", Ys, C(j(y.created_at)), 1),
                  y.created_by === t.userId ? (m(), b("div", en, [
                    a("button", {
                      class: "menu-btn",
                      onClick: (N) => ve(y.id)
                    }, "⋮", 8, tn),
                    i.value === y.id ? (m(), b("div", sn, [
                      a("button", {
                        onClick: (N) => $e(y)
                      }, "Edit", 8, nn)
                    ])) : W("", !0)
                  ])) : W("", !0)
                ]),
                l.value === y.id ? (m(), b("div", rn, [
                  q(a("textarea", {
                    "onUpdate:modelValue": p[12] || (p[12] = (N) => c.value = N),
                    rows: "3",
                    class: "comment-input"
                  }, null, 512), [
                    [J, c.value]
                  ]),
                  a("button", {
                    class: "btn-primary",
                    onClick: (N) => mt(y.id)
                  }, "Save", 8, ln),
                  a("button", {
                    class: "btn",
                    onClick: ft
                  }, "Cancel")
                ])) : (m(), b("div", an, [
                  y.created_by === "Analyze" ? (m(), b("div", {
                    key: 0,
                    class: "comment-text",
                    innerHTML: we(y.comment)
                  }, null, 8, on)) : (m(), b("div", {
                    key: 1,
                    class: "comment-text",
                    innerHTML: xe(y.comment)
                  }, null, 8, cn))
                ]))
              ]))), 128))
            ])) : (m(), b("div", un, "No comments yet")),
            a("div", dn, [
              q(a("textarea", {
                "onUpdate:modelValue": p[13] || (p[13] = (y) => M.value = y),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: qe,
                disabled: D.value
              }, null, 40, pn), [
                [J, M.value]
              ]),
              p[27] || (p[27] = a("small", null, "Paste images from clipboard", -1)),
              a("button", {
                onClick: h,
                disabled: !M.value.trim() || D.value,
                class: "btn-primary"
              }, [
                D.value ? (m(), b("span", kn, "Analyzing...")) : (m(), b("span", gn, "Add Comment"))
              ], 8, hn)
            ])
          ])
        ])) : W("", !0)
      ]);
    };
  }
}), gt = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [n, r] of e)
    t[n] = r;
  return t;
}, mn = /* @__PURE__ */ gt(fn, [["__scopeId", "data-v-513d9a9f"]]), bn = { class: "tasks-card" }, yn = {
  key: 0,
  class: "loading"
}, xn = {
  key: 1,
  class: "error"
}, wn = {
  key: 2,
  class: "tasks-container"
}, vn = { class: "tasks-header" }, $n = { class: "tasks-header-actions" }, _n = { class: "tasks-filters" }, Sn = { class: "filter-checkbox" }, Tn = { class: "tasks-table-wrapper" }, Rn = { class: "tasks-table" }, Cn = {
  key: 0,
  class: "no-results"
}, An = { class: "task-actions" }, zn = ["onClick"], In = ["onClick", "title", "disabled"], Ln = { key: 0 }, qn = { key: 1 }, Pn = {
  key: 3,
  class: "task-form-container"
}, En = { class: "form-body" }, Bn = { class: "form-group" }, Mn = { class: "form-group" }, Dn = { class: "form-row" }, Fn = { class: "form-group" }, Un = { class: "form-group" }, Hn = { class: "form-group" }, Vn = ["disabled"], Zn = ["value"], Qn = { class: "form-actions" }, Nn = ["disabled"], On = /* @__PURE__ */ tt({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = z(""), l = z(""), c = z("list"), i = z(null);
    z(null), z(""), z(null);
    const u = z({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: t.userId
    }), o = z(!1), k = z(null);
    z(null);
    const x = Ee(() => ({
      status: l.value || void 0
    })), { data: d, isLoading: R, error: f } = At(x), I = qt(), F = st();
    Et();
    const { data: U, isLoading: B } = nt(), A = Ee(() => {
      if (!d.value) return [];
      const $ = r.value.toLowerCase().trim();
      let h = d.value.filter((g) => o.value ? !!g.archived : !g.archived);
      return $ ? h.filter((g) => {
        var ae, ne, we, ve, $e;
        const j = ((ae = g.summary) == null ? void 0 : ae.toLowerCase()) || "", Ie = ((ne = g.description) == null ? void 0 : ne.toLowerCase()) || "", xe = ((we = g.status) == null ? void 0 : we.toLowerCase().replace("_", " ")) || "", Le = ((ve = g.priority) == null ? void 0 : ve.toLowerCase()) || "", qe = (($e = g.assigned_to) == null ? void 0 : $e.toLowerCase()) || "";
        return j.includes($) || Ie.includes($) || xe.includes($) || Le.includes($) || qe.includes($);
      }) : h;
    });
    function H($) {
      return new Date($).toLocaleDateString();
    }
    async function M() {
      try {
        await I.mutateAsync(u.value), V(), c.value = "list";
      } catch ($) {
        console.error("Failed to create task:", $);
      }
    }
    function V() {
      u.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: t.userId
      };
    }
    function D() {
      V(), c.value = "create";
    }
    function re($) {
      i.value = $, c.value = "detail";
    }
    function ie() {
      c.value = "list", i.value = null;
    }
    _t(() => {
      const h = new URLSearchParams(window.location.search).get("taskId");
      h && (i.value = h, c.value = "detail");
    }), St([i, c], ([$, h]) => {
      const g = new URLSearchParams(window.location.search);
      h === "detail" && $ ? g.set("taskId", $) : g.delete("taskId");
      const j = `${window.location.pathname}?${g.toString()}`;
      window.history.replaceState({}, "", j);
    });
    async function G($) {
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
    function le($) {
      if (!$ || !U.value) return "";
      const h = U.value.find((g) => g.id === $);
      return (h == null ? void 0 : h.name) || $;
    }
    return ($, h) => (m(), b("div", bn, [
      v(R) && !v(d) ? (m(), b("div", yn, [...h[10] || (h[10] = [
        a("div", { class: "loading-spinner" }, null, -1),
        X(" Loading tasks... ", -1)
      ])])) : v(f) ? (m(), b("div", xn, [
        h[11] || (h[11] = a("h3", null, "Error loading tasks", -1)),
        a("p", null, C(v(f)), 1)
      ])) : c.value === "list" ? (m(), b("div", wn, [
        a("div", vn, [
          a("h2", {
            class: Y({ "tasks-header-clickable": t.showHeaderLink }),
            onClick: h[0] || (h[0] = (g) => t.showHeaderLink && n("navigate"))
          }, " Tasks Management ", 2),
          a("div", $n, [
            a("button", {
              class: "btn btn-add",
              onClick: D
            }, [...h[12] || (h[12] = [
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
          q(a("input", {
            "onUpdate:modelValue": h[2] || (h[2] = (g) => r.value = g),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [J, r.value]
          ]),
          q(a("select", {
            "onUpdate:modelValue": h[3] || (h[3] = (g) => l.value = g),
            class: "filter-select"
          }, [...h[13] || (h[13] = [
            a("option", { value: "" }, "All Status", -1),
            a("option", { value: "open" }, "Open", -1),
            a("option", { value: "in_progress" }, "In Progress", -1),
            a("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [ee, l.value]
          ]),
          a("label", Sn, [
            q(a("input", {
              type: "checkbox",
              "onUpdate:modelValue": h[4] || (h[4] = (g) => o.value = g)
            }, null, 512), [
              [Rt, o.value]
            ]),
            h[14] || (h[14] = X(" Show Archived ", -1))
          ])
        ]),
        a("div", Tn, [
          a("table", Rn, [
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
              A.value.length === 0 ? (m(), b("tr", Cn, [...h[15] || (h[15] = [
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
              ])])) : W("", !0),
              (m(!0), b(he, null, ke(A.value, (g) => (m(), b("tr", {
                key: g.id
              }, [
                a("td", null, C(g.summary), 1),
                a("td", null, [
                  a("span", {
                    class: Y(`status-badge status-${g.status}`)
                  }, C(g.status), 3)
                ]),
                a("td", null, [
                  a("span", {
                    class: Y(`priority-badge priority-${g.priority}`)
                  }, C(g.priority), 3)
                ]),
                a("td", null, C(le(g.assigned_to) || "-"), 1),
                a("td", null, C(H(g.created_at)), 1),
                a("td", An, [
                  a("button", {
                    class: "btn btn-icon",
                    onClick: (j) => re(g.id),
                    title: "View details"
                  }, " 👁️ ", 8, zn),
                  a("button", {
                    class: Y(["btn btn-icon", g.archived ? "btn-success" : "btn-danger"]),
                    onClick: (j) => G(g),
                    title: g.archived ? "Unarchive task" : "Archive task",
                    disabled: k.value === g.id
                  }, [
                    k.value === g.id ? (m(), b("span", Ln, [...h[16] || (h[16] = [
                      a("span", {
                        class: "loading-spinner",
                        style: { display: "inline-block", width: "1em", height: "1em", "border-width": "2px" }
                      }, null, -1)
                    ])])) : (m(), b("span", qn, C(g.archived ? "↩️" : "🗑️"), 1))
                  ], 10, In)
                ])
              ]))), 128))
            ])
          ])
        ])
      ])) : c.value === "create" ? (m(), b("div", Pn, [
        a("div", { class: "form-header" }, [
          a("button", {
            class: "btn btn-back",
            onClick: ie
          }, " ← Back to Tasks "),
          h[18] || (h[18] = a("h2", null, "Create New Task", -1))
        ]),
        a("div", En, [
          a("div", Bn, [
            h[19] || (h[19] = a("label", { for: "task-summary" }, "Summary *", -1)),
            q(a("input", {
              id: "task-summary",
              "onUpdate:modelValue": h[5] || (h[5] = (g) => u.value.summary = g),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [J, u.value.summary]
            ])
          ]),
          a("div", Mn, [
            h[20] || (h[20] = a("label", { for: "task-description" }, "Description", -1)),
            q(a("textarea", {
              id: "task-description",
              "onUpdate:modelValue": h[6] || (h[6] = (g) => u.value.description = g),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [J, u.value.description]
            ])
          ]),
          a("div", Dn, [
            a("div", Fn, [
              h[22] || (h[22] = a("label", { for: "task-status" }, "Status", -1)),
              q(a("select", {
                id: "task-status",
                "onUpdate:modelValue": h[7] || (h[7] = (g) => u.value.status = g)
              }, [...h[21] || (h[21] = [
                a("option", { value: "open" }, "Open", -1),
                a("option", { value: "in_progress" }, "In Progress", -1),
                a("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [ee, u.value.status]
              ])
            ]),
            a("div", Un, [
              h[24] || (h[24] = a("label", { for: "task-priority" }, "Priority", -1)),
              q(a("select", {
                id: "task-priority",
                "onUpdate:modelValue": h[8] || (h[8] = (g) => u.value.priority = g)
              }, [...h[23] || (h[23] = [
                a("option", { value: "low" }, "Low", -1),
                a("option", { value: "medium" }, "Medium", -1),
                a("option", { value: "high" }, "High", -1)
              ])], 512), [
                [ee, u.value.priority]
              ])
            ])
          ]),
          a("div", Hn, [
            h[26] || (h[26] = a("label", { for: "task-assigned" }, "Assigned To", -1)),
            q(a("select", {
              id: "task-assigned",
              "onUpdate:modelValue": h[9] || (h[9] = (g) => u.value.assigned_to = g),
              disabled: v(B)
            }, [
              h[25] || (h[25] = a("option", { value: "" }, "-- Select User --", -1)),
              (m(!0), b(he, null, ke(v(U), (g) => (m(), b("option", {
                key: g.id,
                value: g.id
              }, C(g.name), 9, Zn))), 128))
            ], 8, Vn), [
              [ee, u.value.assigned_to]
            ])
          ]),
          a("div", Qn, [
            a("button", {
              class: "btn btn-cancel",
              onClick: ie
            }, "Cancel"),
            a("button", {
              class: "btn btn-primary",
              onClick: M,
              disabled: !u.value.summary.trim()
            }, " Create Task ", 8, Nn)
          ])
        ])
      ])) : c.value === "detail" && i.value ? (m(), Tt(mn, {
        key: 4,
        "task-id": i.value,
        "user-id": s.userId,
        onClose: ie
      }, null, 8, ["task-id", "user-id"])) : W("", !0)
    ]));
  }
}), Wn = /* @__PURE__ */ gt(On, [["__scopeId", "data-v-6badfad4"]]);
export {
  mn as TaskDetail,
  Wn as Tasks
};
