var vt = Object.defineProperty;
var wt = (s, e, t) => e in s ? vt(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var T = (s, e, t) => wt(s, typeof e != "symbol" ? e + "" : e, t);
import { inject as xt, computed as Me, unref as $, defineComponent as nt, ref as A, createElementBlock as b, openBlock as f, createElementVNode as a, createCommentVNode as ee, withDirectives as P, toDisplayString as R, withKeys as Be, vModelText as te, normalizeClass as ne, vModelSelect as re, Fragment as he, renderList as ke, createTextVNode as se, nextTick as $t, onMounted as _t, watch as St, createBlock as Tt, createStaticVNode as Rt, vModelCheckbox as Ct } from "vue";
import { useQuery as fe, useQueryClient as me, useMutation as be } from "@tanstack/vue-query";
const At = Symbol.for("y2kfund.supabase");
function W() {
  const s = xt(At, null);
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
function zt(s) {
  const e = W();
  return fe({
    queryKey: Me(() => {
      const t = s ? $(s) : {};
      return q.list(t);
    }),
    queryFn: async () => {
      const t = s ? $(s) : {};
      let n = e.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (t != null && t.status && (n = n.eq("status", t.status)), t != null && t.search && t.search.trim()) {
        const u = t.search.trim();
        n = n.or(`summary.ilike.%${u}%,description.ilike.%${u}%`);
      }
      const { data: r, error: l } = await n;
      if (l) throw l;
      return r;
    }
  });
}
function It(s) {
  const e = W();
  return fe({
    queryKey: q.detail(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("tasks").select("*").eq("id", s).single();
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function Lt(s) {
  const e = W();
  return fe({
    queryKey: q.comments(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("task_comments").select("*").eq("task_id", s).order("created_at", { ascending: !1 });
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function Pt(s) {
  const e = W();
  return fe({
    queryKey: q.history(s),
    queryFn: async () => {
      const { data: t, error: n } = await e.schema("hf").from("task_history").select("*").eq("task_id", s).order("changed_at", { ascending: !1 });
      if (n) throw n;
      return t;
    },
    enabled: !!s
  });
}
function qt() {
  const s = W(), e = me();
  return be({
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
  const s = W(), e = me();
  return be({
    mutationFn: async ({
      id: t,
      updates: n,
      userId: r
    }) => {
      const { data: l, error: u } = await s.schema("hf").from("tasks").select("*").eq("id", t).single();
      if (u) throw u;
      const { data: i, error: c } = await s.schema("hf").from("tasks").update(n).eq("id", t).select().single();
      if (c) throw c;
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
function Et() {
  const s = W(), e = me();
  return be({
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
function Bt() {
  const s = W(), e = me();
  return be({
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
function Mt() {
  const s = W(), e = me();
  return be({
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
function lt() {
  const s = W();
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
function Ne() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ie = Ne();
function it(s) {
  ie = s;
}
var ge = { exec: () => null };
function _(s, e = "") {
  let t = typeof s == "string" ? s : s.source, n = { replace: (r, l) => {
    let u = typeof l == "string" ? l : l.source;
    return u = u.replace(E.caret, "$1"), t = t.replace(r, u), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var E = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i") }, Dt = /^(?:[ \t]*(?:\n|$))+/, Ut = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ft = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, ye = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Nt = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ve = /(?:[*+-]|\d{1,9}[.)])/, at = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ot = _(at).replace(/bull/g, Ve).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Vt = _(at).replace(/bull/g, Ve).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), He = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ht = /^[^\n]+/, Ze = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Zt = _(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ze).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Qt = _(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ve).getRegex(), Ce = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Qe = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ot = _("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Qe).replace("tag", Ce).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ut = _(He).replace("hr", ye).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ce).getRegex(), Kt = _(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ut).getRegex(), Oe = { blockquote: Kt, code: Ut, def: Zt, fences: Ft, heading: Nt, hr: ye, html: Ot, lheading: ot, list: Qt, newline: Dt, paragraph: ut, table: ge, text: Ht }, Xe = _("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", ye).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ce).getRegex(), jt = { ...Oe, lheading: Vt, table: Xe, paragraph: _(He).replace("hr", ye).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Xe).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ce).getRegex() }, Gt = { ...Oe, html: _(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Qe).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ge, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: _(He).replace("hr", ye).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ot).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Wt = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Xt = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ct = /^( {2,}|\\)\n(?!\s*$)/, Jt = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Ae = /[\p{P}\p{S}]/u, Ke = /[\s\p{P}\p{S}]/u, pt = /[^\s\p{P}\p{S}]/u, Yt = _(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ke).getRegex(), dt = /(?!~)[\p{P}\p{S}]/u, es = /(?!~)[\s\p{P}\p{S}]/u, ts = /(?:[^\s\p{P}\p{S}]|~)/u, ss = _(/link|code|html/, "g").replace("link", new RegExp("\\[(?:[^\\[\\]`]|(?<!`)(?<a>`+)[^`]+\\k<a>(?!`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)")).replace("code", new RegExp("(?<!`)(?<b>`+)[^`]+\\k<b>(?!`)")).replace("html", /<(?! )[^<>]*?>/).getRegex(), ht = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ns = _(ht, "u").replace(/punct/g, Ae).getRegex(), rs = _(ht, "u").replace(/punct/g, dt).getRegex(), kt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ls = _(kt, "gu").replace(/notPunctSpace/g, pt).replace(/punctSpace/g, Ke).replace(/punct/g, Ae).getRegex(), is = _(kt, "gu").replace(/notPunctSpace/g, ts).replace(/punctSpace/g, es).replace(/punct/g, dt).getRegex(), as = _("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, pt).replace(/punctSpace/g, Ke).replace(/punct/g, Ae).getRegex(), os = _(/\\(punct)/, "gu").replace(/punct/g, Ae).getRegex(), us = _(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), cs = _(Qe).replace("(?:-->|$)", "-->").getRegex(), ps = _("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", cs).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Se = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ds = _(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Se).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), gt = _(/^!?\[(label)\]\[(ref)\]/).replace("label", Se).replace("ref", Ze).getRegex(), ft = _(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ze).getRegex(), hs = _("reflink|nolink(?!\\()", "g").replace("reflink", gt).replace("nolink", ft).getRegex(), Je = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, je = { _backpedal: ge, anyPunctuation: os, autolink: us, blockSkip: ss, br: ct, code: Xt, del: ge, emStrongLDelim: ns, emStrongRDelimAst: ls, emStrongRDelimUnd: as, escape: Wt, link: ds, nolink: ft, punctuation: Yt, reflink: gt, reflinkSearch: hs, tag: ps, text: Jt, url: ge }, ks = { ...je, link: _(/^!?\[(label)\]\((.*?)\)/).replace("label", Se).getRegex(), reflink: _(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Se).getRegex() }, De = { ...je, emStrongRDelimAst: is, emStrongLDelim: rs, url: _(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Je).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: _(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Je).getRegex() }, gs = { ...De, br: _(ct).replace("{2,}", "*").getRegex(), text: _(De.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, $e = { normal: Oe, gfm: jt, pedantic: Gt }, ce = { normal: je, gfm: De, breaks: gs, pedantic: ks }, fs = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ye = (s) => fs[s];
function G(s, e) {
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
  let t = s.replace(E.findPipe, (u, i, c) => {
    let o = !1, k = i;
    for (; --k >= 0 && c[k] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), n = t.split(E.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !((l = n.at(-1)) != null && l.trim()) && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(E.slashPipe, "|");
  return n;
}
function pe(s, e, t) {
  let n = s.length;
  if (n === 0) return "";
  let r = 0;
  for (; r < n && s.charAt(n - r - 1) === e; )
    r++;
  return s.slice(0, n - r);
}
function ms(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < s.length; n++) if (s[n] === "\\") n++;
  else if (s[n] === e[0]) t++;
  else if (s[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
function st(s, e, t, n, r) {
  let l = e.href, u = e.title || null, i = s[1].replace(r.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let c = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: t, href: l, title: u, text: i, tokens: n.inlineTokens(i) };
  return n.state.inLink = !1, c;
}
function bs(s, e, t) {
  let n = s.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let r = n[1];
  return e.split(`
`).map((l) => {
    let u = l.match(t.other.beginningSpace);
    if (u === null) return l;
    let [i] = u;
    return i.length >= r.length ? l.slice(r.length) : l;
  }).join(`
`);
}
var Te = class {
  constructor(s) {
    T(this, "options");
    T(this, "rules");
    T(this, "lexer");
    this.options = s || ie;
  }
  space(s) {
    let e = this.rules.block.newline.exec(s);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(s) {
    let e = this.rules.block.code.exec(s);
    if (e) {
      let t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? t : pe(t, `
`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let t = e[0], n = bs(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let n = pe(t, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (t = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: pe(e[0], `
`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let t = pe(e[0], `
`).split(`
`), n = "", r = "", l = [];
      for (; t.length > 0; ) {
        let u = !1, i = [], c;
        for (c = 0; c < t.length; c++) if (this.rules.other.blockquoteStart.test(t[c])) i.push(t[c]), u = !0;
        else if (!u) i.push(t[c]);
        else break;
        t = t.slice(c);
        let o = i.join(`
`), k = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? `${n}
${o}` : o, r = r ? `${r}
${k}` : k;
        let w = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(k, l, !0), this.lexer.state.top = w, t.length === 0) break;
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
      let l = this.rules.other.listItemRegex(t), u = !1;
      for (; s; ) {
        let c = !1, o = "", k = "";
        if (!(e = l.exec(s)) || this.rules.block.hr.test(s)) break;
        o = e[0], s = s.substring(o.length);
        let w = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (N) => " ".repeat(3 * N.length)), p = s.split(`
`, 1)[0], C = !w.trim(), m = 0;
        if (this.options.pedantic ? (m = 2, k = w.trimStart()) : C ? m = e[1].length + 1 : (m = e[2].search(this.rules.other.nonSpaceChar), m = m > 4 ? 1 : m, k = w.slice(m), m += e[1].length), C && this.rules.other.blankLine.test(p) && (o += p + `
`, s = s.substring(p.length + 1), c = !0), !c) {
          let N = this.rules.other.nextBulletRegex(m), B = this.rules.other.hrRegex(m), z = this.rules.other.fencesBeginRegex(m), H = this.rules.other.headingBeginRegex(m), M = this.rules.other.htmlBeginRegex(m);
          for (; s; ) {
            let Z = s.split(`
`, 1)[0], U;
            if (p = Z, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), U = p) : U = p.replace(this.rules.other.tabCharGlobal, "    "), z.test(p) || H.test(p) || M.test(p) || N.test(p) || B.test(p)) break;
            if (U.search(this.rules.other.nonSpaceChar) >= m || !p.trim()) k += `
` + U.slice(m);
            else {
              if (C || w.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || z.test(w) || H.test(w) || B.test(w)) break;
              k += `
` + p;
            }
            !C && !p.trim() && (C = !0), o += Z + `
`, s = s.substring(Z.length + 1), w = U.slice(m);
          }
        }
        r.loose || (u ? r.loose = !0 : this.rules.other.doubleBlankLine.test(o) && (u = !0));
        let I = null, F;
        this.options.gfm && (I = this.rules.other.listIsTask.exec(k), I && (F = I[0] !== "[ ] ", k = k.replace(this.rules.other.listReplaceTask, ""))), r.items.push({ type: "list_item", raw: o, task: !!I, checked: F, loose: !1, text: k, tokens: [] }), r.raw += o;
      }
      let i = r.items.at(-1);
      if (i) i.raw = i.raw.trimEnd(), i.text = i.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let c = 0; c < r.items.length; c++) if (this.lexer.state.top = !1, r.items[c].tokens = this.lexer.blockTokens(r.items[c].text, []), !r.loose) {
        let o = r.items[c].tokens.filter((w) => w.type === "space"), k = o.length > 0 && o.some((w) => this.rules.other.anyLine.test(w.raw));
        r.loose = k;
      }
      if (r.loose) for (let c = 0; c < r.items.length; c++) r.items[c].loose = !0;
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
    var u;
    let e = this.rules.block.table.exec(s);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = tt(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = (u = e[3]) != null && u.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (t.length === n.length) {
      for (let i of n) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < t.length; i++) l.header.push({ text: t[i], tokens: this.lexer.inline(t[i]), header: !0, align: l.align[i] });
      for (let i of r) l.rows.push(tt(i, l.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: l.align[o] })));
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
        let l = pe(t.slice(0, -1), "\\");
        if ((t.length - l.length) % 2 === 0) return;
      } else {
        let l = ms(e[2], "()");
        if (l === -2) return;
        if (l > -1) {
          let u = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + l;
          e[2] = e[2].substring(0, l), e[0] = e[0].substring(0, u).trim(), e[3] = "";
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
      let r = [...n[0]].length - 1, l, u, i = r, c = 0, o = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (o.lastIndex = 0, e = e.slice(-1 * s.length + r); (n = o.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l) continue;
        if (u = [...l].length, n[3] || n[4]) {
          i += u;
          continue;
        } else if ((n[5] || n[6]) && r % 3 && !((r + u) % 3)) {
          c += u;
          continue;
        }
        if (i -= u, i > 0) continue;
        u = Math.min(u, u + i + c);
        let k = [...n[0]][0].length, w = s.slice(0, r + n.index + k + u);
        if (Math.min(r, u) % 2) {
          let C = w.slice(1, -1);
          return { type: "em", raw: w, text: C, tokens: this.lexer.inlineTokens(C) };
        }
        let p = w.slice(2, -2);
        return { type: "strong", raw: w, text: p, tokens: this.lexer.inlineTokens(p) };
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
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ie, this.options.tokenizer = this.options.tokenizer || new Te(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: E, block: $e.normal, inline: ce.normal };
    this.options.pedantic ? (t.block = $e.pedantic, t.inline = ce.pedantic) : this.options.gfm && (t.block = $e.gfm, this.options.breaks ? t.inline = ce.breaks : t.inline = ce.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: $e, inline: ce };
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
    var r, l, u;
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
      let c = e;
      if ((u = this.options.extensions) != null && u.startBlock) {
        let o = 1 / 0, k = e.slice(1), w;
        this.options.extensions.startBlock.forEach((p) => {
          w = p.call({ lexer: this }, k), typeof w == "number" && w >= 0 && (o = Math.min(o, w));
        }), o < 1 / 0 && o >= 0 && (c = e.substring(0, o + 1));
      }
      if (this.state.top && (i = this.tokenizer.paragraph(c))) {
        let o = t.at(-1);
        n && (o == null ? void 0 : o.type) === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + i.raw, o.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(i), n = c.length !== e.length, e = e.substring(i.raw.length);
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
    var i, c, o, k, w;
    let n = e, r = null;
    if (this.tokens.links) {
      let p = Object.keys(this.tokens.links);
      if (p.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) p.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = ((c = (i = this.options.hooks) == null ? void 0 : i.emStrongMask) == null ? void 0 : c.call({ lexer: this }, n)) ?? n;
    let l = !1, u = "";
    for (; e; ) {
      l || (u = ""), l = !1;
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
      if (p = this.tokenizer.emStrong(e, n, u)) {
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
      if ((w = this.options.extensions) != null && w.startInline) {
        let m = 1 / 0, I = e.slice(1), F;
        this.options.extensions.startInline.forEach((N) => {
          F = N.call({ lexer: this }, I), typeof F == "number" && F >= 0 && (m = Math.min(m, F));
        }), m < 1 / 0 && m >= 0 && (C = e.substring(0, m + 1));
      }
      if (p = this.tokenizer.inlineText(C)) {
        e = e.substring(p.raw.length), p.raw.slice(-1) !== "_" && (u = p.raw.slice(-1)), l = !0;
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
}, Re = class {
  constructor(s) {
    T(this, "options");
    T(this, "parser");
    this.options = s || ie;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: t }) {
    var l;
    let n = (l = (e || "").match(E.notSpaceStart)) == null ? void 0 : l[0], r = s.replace(E.endingNewline, "") + `
`;
    return n ? '<pre><code class="language-' + G(n) + '">' + (t ? r : G(r, !0)) + `</code></pre>
` : "<pre><code>" + (t ? r : G(r, !0)) + `</code></pre>
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
    for (let u = 0; u < s.items.length; u++) {
      let i = s.items[u];
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
      s.loose ? ((t = s.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (s.tokens[0].text = n + " " + s.tokens[0].text, s.tokens[0].tokens && s.tokens[0].tokens.length > 0 && s.tokens[0].tokens[0].type === "text" && (s.tokens[0].tokens[0].text = n + " " + G(s.tokens[0].tokens[0].text), s.tokens[0].tokens[0].escaped = !0)) : s.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: !0 }) : e += n + " ";
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
      for (let u = 0; u < l.length; u++) t += this.tablecell(l[u]);
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
    return `<code>${G(s, !0)}</code>`;
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
    return e && (l += ' title="' + G(e) + '"'), l += ">" + n + "</a>", l;
  }
  image({ href: s, title: e, text: t, tokens: n }) {
    n && (t = this.parser.parseInline(n, this.parser.textRenderer));
    let r = et(s);
    if (r === null) return G(t);
    s = r;
    let l = `<img src="${s}" alt="${t}"`;
    return e && (l += ` title="${G(e)}"`), l += ">", l;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : G(s.text);
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
    this.options = e || ie, this.options.renderer = this.options.renderer || new Re(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Ge();
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
    for (let u = 0; u < e.length; u++) {
      let i = e[u];
      if ((l = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && l[i.type]) {
        let o = i, k = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (k !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o.type)) {
          n += k || "";
          continue;
        }
      }
      let c = i;
      switch (c.type) {
        case "space": {
          n += this.renderer.space(c);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(c);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(c);
          continue;
        }
        case "code": {
          n += this.renderer.code(c);
          continue;
        }
        case "table": {
          n += this.renderer.table(c);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(c);
          continue;
        }
        case "list": {
          n += this.renderer.list(c);
          continue;
        }
        case "html": {
          n += this.renderer.html(c);
          continue;
        }
        case "def": {
          n += this.renderer.def(c);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(c);
          continue;
        }
        case "text": {
          let o = c, k = this.renderer.text(o);
          for (; u + 1 < e.length && e[u + 1].type === "text"; ) o = e[++u], k += `
` + this.renderer.text(o);
          t ? n += this.renderer.paragraph({ type: "paragraph", raw: k, text: k, tokens: [{ type: "text", raw: k, text: k, escaped: !0 }] }) : n += k;
          continue;
        }
        default: {
          let o = 'Token with "' + c.type + '" type was not found.';
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
    for (let u = 0; u < e.length; u++) {
      let i = e[u];
      if ((l = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && l[i.type]) {
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += o || "";
          continue;
        }
      }
      let c = i;
      switch (c.type) {
        case "escape": {
          n += t.text(c);
          break;
        }
        case "html": {
          n += t.html(c);
          break;
        }
        case "link": {
          n += t.link(c);
          break;
        }
        case "image": {
          n += t.image(c);
          break;
        }
        case "strong": {
          n += t.strong(c);
          break;
        }
        case "em": {
          n += t.em(c);
          break;
        }
        case "codespan": {
          n += t.codespan(c);
          break;
        }
        case "br": {
          n += t.br(c);
          break;
        }
        case "del": {
          n += t.del(c);
          break;
        }
        case "text": {
          n += t.text(c);
          break;
        }
        default: {
          let o = 'Token with "' + c.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
}, _e, de = (_e = class {
  constructor(s) {
    T(this, "options");
    T(this, "block");
    this.options = s || ie;
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
}, T(_e, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), T(_e, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _e), ys = class {
  constructor(...s) {
    T(this, "defaults", Ne());
    T(this, "options", this.setOptions);
    T(this, "parse", this.parseMarkdown(!0));
    T(this, "parseInline", this.parseMarkdown(!1));
    T(this, "Parser", O);
    T(this, "Renderer", Re);
    T(this, "TextRenderer", Ge);
    T(this, "Lexer", Q);
    T(this, "Tokenizer", Te);
    T(this, "Hooks", de);
    this.use(...s);
  }
  walkTokens(s, e) {
    var n, r;
    let t = [];
    for (let l of s) switch (t = t.concat(e.call(this, l)), l.type) {
      case "table": {
        let u = l;
        for (let i of u.header) t = t.concat(this.walkTokens(i.tokens, e));
        for (let i of u.rows) for (let c of i) t = t.concat(this.walkTokens(c.tokens, e));
        break;
      }
      case "list": {
        let u = l;
        t = t.concat(this.walkTokens(u.items, e));
        break;
      }
      default: {
        let u = l;
        (r = (n = this.defaults.extensions) == null ? void 0 : n.childTokens) != null && r[u.type] ? this.defaults.extensions.childTokens[u.type].forEach((i) => {
          let c = u[i].flat(1 / 0);
          t = t.concat(this.walkTokens(c, e));
        }) : u.tokens && (t = t.concat(this.walkTokens(u.tokens, e)));
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
          l ? e.renderers[r.name] = function(...u) {
            let i = r.renderer.apply(this, u);
            return i === !1 && (i = l.apply(this, u)), i;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[r.level];
          l ? l.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), n.extensions = e), t.renderer) {
        let r = this.defaults.renderer || new Re(this.defaults);
        for (let l in t.renderer) {
          if (!(l in r)) throw new Error(`renderer '${l}' does not exist`);
          if (["options", "parser"].includes(l)) continue;
          let u = l, i = t.renderer[u], c = r[u];
          r[u] = (...o) => {
            let k = i.apply(r, o);
            return k === !1 && (k = c.apply(r, o)), k || "";
          };
        }
        n.renderer = r;
      }
      if (t.tokenizer) {
        let r = this.defaults.tokenizer || new Te(this.defaults);
        for (let l in t.tokenizer) {
          if (!(l in r)) throw new Error(`tokenizer '${l}' does not exist`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let u = l, i = t.tokenizer[u], c = r[u];
          r[u] = (...o) => {
            let k = i.apply(r, o);
            return k === !1 && (k = c.apply(r, o)), k;
          };
        }
        n.tokenizer = r;
      }
      if (t.hooks) {
        let r = this.defaults.hooks || new de();
        for (let l in t.hooks) {
          if (!(l in r)) throw new Error(`hook '${l}' does not exist`);
          if (["options", "block"].includes(l)) continue;
          let u = l, i = t.hooks[u], c = r[u];
          de.passThroughHooks.has(l) ? r[u] = (o) => {
            if (this.defaults.async && de.passThroughHooksRespectAsync.has(l)) return (async () => {
              let w = await i.call(r, o);
              return c.call(r, w);
            })();
            let k = i.call(r, o);
            return c.call(r, k);
          } : r[u] = (...o) => {
            if (this.defaults.async) return (async () => {
              let w = await i.apply(r, o);
              return w === !1 && (w = await c.apply(r, o)), w;
            })();
            let k = i.apply(r, o);
            return k === !1 && (k = c.apply(r, o)), k;
          };
        }
        n.hooks = r;
      }
      if (t.walkTokens) {
        let r = this.defaults.walkTokens, l = t.walkTokens;
        n.walkTokens = function(u) {
          let i = [];
          return i.push(l.call(this, u)), r && (i = i.concat(r.call(this, u))), i;
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
        let u = r.hooks ? await r.hooks.preprocess(e) : e, i = await (r.hooks ? await r.hooks.provideLexer() : s ? Q.lex : Q.lexInline)(u, r), c = r.hooks ? await r.hooks.processAllTokens(i) : i;
        r.walkTokens && await Promise.all(this.walkTokens(c, r.walkTokens));
        let o = await (r.hooks ? await r.hooks.provideParser() : s ? O.parse : O.parseInline)(c, r);
        return r.hooks ? await r.hooks.postprocess(o) : o;
      })().catch(l);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let u = (r.hooks ? r.hooks.provideLexer() : s ? Q.lex : Q.lexInline)(e, r);
        r.hooks && (u = r.hooks.processAllTokens(u)), r.walkTokens && this.walkTokens(u, r.walkTokens);
        let i = (r.hooks ? r.hooks.provideParser() : s ? O.parse : O.parseInline)(u, r);
        return r.hooks && (i = r.hooks.postprocess(i)), i;
      } catch (u) {
        return l(u);
      }
    };
  }
  onError(s, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, s) {
        let n = "<p>An error occurred:</p><pre>" + G(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, le = new ys();
function S(s, e) {
  return le.parse(s, e);
}
S.options = S.setOptions = function(s) {
  return le.setOptions(s), S.defaults = le.defaults, it(S.defaults), S;
};
S.getDefaults = Ne;
S.defaults = ie;
S.use = function(...s) {
  return le.use(...s), S.defaults = le.defaults, it(S.defaults), S;
};
S.walkTokens = function(s, e) {
  return le.walkTokens(s, e);
};
S.parseInline = le.parseInline;
S.Parser = O;
S.parser = O.parse;
S.Renderer = Re;
S.TextRenderer = Ge;
S.Lexer = Q;
S.lexer = Q.lex;
S.Tokenizer = Te;
S.Hooks = de;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
O.parse;
Q.lex;
const vs = { class: "detail-container" }, ws = { class: "detail-header" }, xs = { style: { flex: "1" } }, $s = {
  key: 0,
  class: "saved-message"
}, _s = {
  key: 1,
  class: "loading"
}, Ss = {
  key: 2,
  class: "error"
}, Ts = {
  key: 3,
  class: "detail-content"
}, Rs = { class: "task-info" }, Cs = { class: "info-row" }, As = ["innerHTML"], zs = { class: "info-row" }, Is = { class: "info-value details-row" }, Ls = { class: "detail-item" }, Ps = { class: "detail-item" }, qs = { class: "detail-item" }, Es = ["disabled"], Bs = ["value"], Ms = {
  key: 1,
  class: "info-value"
}, Ds = { class: "history-section" }, Us = { class: "expand-icon" }, Fs = { key: 0 }, Ns = {
  key: 0,
  class: "loading"
}, Vs = {
  key: 1,
  class: "history-list"
}, Hs = { class: "history-meta" }, Zs = { class: "history-date" }, Qs = { class: "history-change" }, Os = { class: "change-values" }, Ks = { class: "old-value" }, js = { class: "new-value" }, Gs = {
  key: 2,
  class: "no-history"
}, Ws = { class: "comments-section" }, Xs = {
  key: 0,
  class: "loading"
}, Js = {
  key: 1,
  class: "comments-list"
}, Ys = { class: "comment-meta" }, en = { class: "comment-date" }, tn = {
  key: 0,
  class: "comment-menu"
}, sn = ["onClick"], nn = {
  key: 0,
  class: "menu-dropdown"
}, rn = ["onClick"], ln = { key: 0 }, an = ["onClick"], on = { key: 1 }, un = ["innerHTML"], cn = ["innerHTML"], pn = {
  key: 2,
  class: "no-comments"
}, dn = { class: "add-comment" }, hn = ["disabled"], kn = ["disabled"], gn = { key: 0 }, fn = { key: 1 }, mn = /* @__PURE__ */ nt({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = A(""), l = A(null), u = A(""), i = A(null), { data: c, isLoading: o, error: k } = It(t.taskId), { data: w, isLoading: p } = Lt(t.taskId), { data: C, isLoading: m } = Pt(t.taskId), I = Mt(), F = rt(), N = Et(), B = A(null), z = A(""), H = A(null), M = A(""), Z = A(!1), U = A(!1), { data: ae, isLoading: oe } = lt();
    async function V(v, h) {
      B.value = v, z.value = h, await $t();
      const L = H.value;
      L && typeof L.focus == "function" && L.focus();
    }
    function X() {
      B.value = null, z.value = "";
    }
    async function D() {
      if (!B.value || !c.value) return;
      const v = B.value, h = c.value[v];
      if (z.value !== h)
        try {
          await F.mutateAsync({
            id: t.taskId,
            updates: { [v]: z.value },
            userId: t.userId
          }), r.value = "Saved!", setTimeout(() => {
            r.value = "";
          }, 1200);
        } catch (L) {
          console.error("Failed to update task:", L);
        }
      X();
    }
    async function ve() {
      if (M.value.trim()) {
        if (M.value.trim().startsWith("@analyze")) {
          const v = M.value.trim().replace(/^@analyze\s*/, "");
          if (!v) return;
          U.value = !0;
          try {
            const L = await (await fetch("https://www.y2k.fund/api/ai-analyze-task", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                taskId: t.taskId,
                userId: t.userId,
                question: v
              })
            })).json();
            await N.mutateAsync({
              task_id: t.taskId,
              comment: `${L.reply}`,
              created_by: "Analyze"
              // or props.userId if you want to attribute to user
            }), M.value = "";
          } catch (h) {
            console.error("AI analysis failed:", h);
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
        } catch (v) {
          console.error("Failed to add comment:", v);
        }
      }
    }
    async function ze() {
      if (c.value)
        try {
          await F.mutateAsync({
            id: c.value.id,
            updates: { archived: !c.value.archived },
            userId: t.userId
          });
        } catch (v) {
          console.error("Failed to archive/unarchive task:", v);
        }
    }
    function we(v) {
      return new Date(v).toLocaleString();
    }
    function Ie(v) {
      return v.replace(/_/g, " ").replace(/\b\w/g, (h) => h.toUpperCase());
    }
    function xe(v) {
      return v.replace(
        /!\[.*?\]\((https?:\/\/[^)]+|data:image\/[^)]+)\)/g,
        `<img src="$1" class="img-thumb" data-src="$1" onclick="window.open(this.dataset.src,'_blank')" />`
      ).replace(/\n/g, "<br/>");
    }
    async function Le(v) {
      await d(v, (h) => {
        z.value += `
![image](${h})
`;
      });
    }
    async function x(v) {
      await d(v, (h) => {
        M.value += `
![image](${h})
`;
      });
    }
    async function d(v, h) {
      var J;
      const L = (J = v.clipboardData) == null ? void 0 : J.items;
      if (L) {
        for (const Y of L)
          if (Y.type.indexOf("image") !== -1) {
            v.preventDefault();
            const y = Y.getAsFile();
            if (y) {
              const j = new FileReader();
              j.onload = (bt) => {
                var We;
                const yt = (We = bt.target) == null ? void 0 : We.result;
                h(yt);
              }, j.readAsDataURL(y);
            }
          }
      }
    }
    function g(v) {
      if (!v || !ae.value) return "";
      const h = ae.value.find((L) => L.id === v);
      return (h == null ? void 0 : h.name) || v;
    }
    function K(v) {
      return S.parse(v);
    }
    function ue(v) {
      i.value = i.value === v ? null : v;
    }
    function Pe(v) {
      l.value = v.id, u.value = v.comment, i.value = null;
    }
    function qe() {
      l.value = null, u.value = "";
    }
    async function Ee(v) {
      if (u.value.trim())
        try {
          await I.mutateAsync({
            id: v,
            comment: u.value
          }), l.value = null, u.value = "";
        } catch (h) {
          console.error("Failed to edit comment:", h);
        }
    }
    return (v, h) => {
      var L, J, Y;
      return f(), b("div", vs, [
        a("div", ws, [
          a("button", {
            class: "btn btn-back",
            onClick: h[0] || (h[0] = (y) => n("close"))
          }, " ← Back to Tasks "),
          a("div", xs, [
            B.value !== "summary" ? (f(), b("h2", {
              key: 0,
              class: "header-summary",
              onDblclick: h[1] || (h[1] = (y) => {
                var j;
                return V("summary", ((j = $(c)) == null ? void 0 : j.summary) || "");
              }),
              title: "Double-click to edit summary"
            }, R(((L = $(c)) == null ? void 0 : L.summary) || "Task Details"), 33)) : P((f(), b("input", {
              key: 1,
              "onUpdate:modelValue": h[2] || (h[2] = (y) => z.value = y),
              onBlur: D,
              onKeyup: [
                Be(X, ["esc"]),
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
            class: ne(["btn", (J = $(c)) != null && J.archived ? "btn-success" : "btn-danger"]),
            onClick: ze
          }, R((Y = $(c)) != null && Y.archived ? "Unarchive" : "Archive") + " Task ", 3)
        ]),
        r.value ? (f(), b("div", $s, R(r.value), 1)) : ee("", !0),
        $(o) ? (f(), b("div", _s, "Loading task details...")) : $(k) ? (f(), b("div", Ss, "Error: " + R($(k)), 1)) : $(c) ? (f(), b("div", Ts, [
          a("div", Rs, [
            a("div", Cs, [
              h[14] || (h[14] = a("label", null, "Description", -1)),
              a("div", {
                onDblclick: h[4] || (h[4] = (y) => V("description", $(c).description || ""))
              }, [
                B.value === "description" ? P((f(), b("textarea", {
                  key: 0,
                  "onUpdate:modelValue": h[3] || (h[3] = (y) => z.value = y),
                  onBlur: D,
                  onKeyup: Be(X, ["esc"]),
                  onPaste: Le,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: H
                }, null, 544)), [
                  [te, z.value]
                ]) : (f(), b("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: xe($(c).description || "")
                }, null, 8, As))
              ], 32)
            ]),
            a("div", zs, [
              h[21] || (h[21] = a("label", null, "Details", -1)),
              a("div", Is, [
                a("div", Ls, [
                  h[16] || (h[16] = a("div", { class: "small-label" }, "Status", -1)),
                  a("div", {
                    onDblclick: h[6] || (h[6] = (y) => V("status", $(c).status))
                  }, [
                    B.value === "status" ? P((f(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": h[5] || (h[5] = (y) => z.value = y),
                      onBlur: D,
                      onChange: D,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H
                    }, [...h[15] || (h[15] = [
                      a("option", { value: "open" }, "Open", -1),
                      a("option", { value: "in-progress" }, "In Progress", -1),
                      a("option", { value: "completed" }, "Completed", -1),
                      a("option", { value: "closed" }, "Closed", -1)
                    ])], 544)), [
                      [re, z.value]
                    ]) : (f(), b("span", {
                      key: 1,
                      class: ne(`status-badge status-${$(c).status}`)
                    }, R($(c).status), 3))
                  ], 32)
                ]),
                a("div", Ps, [
                  h[18] || (h[18] = a("div", { class: "small-label" }, "Priority", -1)),
                  a("div", {
                    onDblclick: h[8] || (h[8] = (y) => V("priority", $(c).priority))
                  }, [
                    B.value === "priority" ? P((f(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": h[7] || (h[7] = (y) => z.value = y),
                      onBlur: D,
                      onChange: D,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H
                    }, [...h[17] || (h[17] = [
                      a("option", { value: "low" }, "Low", -1),
                      a("option", { value: "medium" }, "Medium", -1),
                      a("option", { value: "high" }, "High", -1),
                      a("option", { value: "critical" }, "Critical", -1)
                    ])], 544)), [
                      [re, z.value]
                    ]) : (f(), b("span", {
                      key: 1,
                      class: ne(`priority-badge priority-${$(c).priority}`)
                    }, R($(c).priority), 3))
                  ], 32)
                ]),
                a("div", qs, [
                  h[20] || (h[20] = a("div", { class: "small-label" }, "Assigned", -1)),
                  a("div", {
                    onDblclick: h[10] || (h[10] = (y) => V("assigned_to", $(c).assigned_to || ""))
                  }, [
                    B.value === "assigned_to" ? P((f(), b("select", {
                      key: 0,
                      "onUpdate:modelValue": h[9] || (h[9] = (y) => z.value = y),
                      onBlur: D,
                      onChange: D,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: H,
                      disabled: $(oe)
                    }, [
                      h[19] || (h[19] = a("option", { value: "" }, "-- Unassigned --", -1)),
                      (f(!0), b(he, null, ke($(ae), (y) => (f(), b("option", {
                        key: y.id,
                        value: y.id
                      }, R(y.name), 9, Bs))), 128))
                    ], 40, Es)), [
                      [re, z.value]
                    ]) : (f(), b("div", Ms, R(g($(c).assigned_to) || "-"), 1))
                  ], 32)
                ])
              ])
            ])
          ]),
          a("div", Ds, [
            a("div", {
              class: "section-header",
              onClick: h[11] || (h[11] = (y) => Z.value = !Z.value)
            }, [
              a("h3", null, [
                a("span", Us, R(Z.value ? "▼" : "▶"), 1),
                h[22] || (h[22] = se(" History ", -1))
              ])
            ]),
            Z.value ? (f(), b("div", Fs, [
              $(m) ? (f(), b("div", Ns, "Loading history...")) : $(C) && $(C).length > 0 ? (f(), b("div", Vs, [
                (f(!0), b(he, null, ke($(C), (y) => (f(), b("div", {
                  key: y.id,
                  class: "history-item"
                }, [
                  a("div", Hs, [
                    a("strong", null, R(g(y.changed_by)), 1),
                    a("span", Zs, R(we(y.changed_at)), 1)
                  ]),
                  a("div", Qs, [
                    h[26] || (h[26] = se(" Changed ", -1)),
                    a("strong", null, R(Ie(y.field_name)), 1),
                    a("span", Os, [
                      h[23] || (h[23] = se(' from "', -1)),
                      a("span", Ks, R(y.old_value), 1),
                      h[24] || (h[24] = se('" to "', -1)),
                      a("span", js, R(y.new_value), 1),
                      h[25] || (h[25] = se('" ', -1))
                    ])
                  ])
                ]))), 128))
              ])) : (f(), b("div", Gs, "No history yet"))
            ])) : ee("", !0)
          ]),
          a("div", Ws, [
            h[28] || (h[28] = a("h3", null, "Comments", -1)),
            $(p) ? (f(), b("div", Xs, "Loading comments...")) : $(w) && $(w).length > 0 ? (f(), b("div", Js, [
              (f(!0), b(he, null, ke($(w), (y) => (f(), b("div", {
                key: y.id,
                class: "comment-item"
              }, [
                a("div", Ys, [
                  a("strong", null, R(g(y.created_by)), 1),
                  a("span", en, R(we(y.created_at)), 1),
                  y.created_by === t.userId ? (f(), b("div", tn, [
                    a("button", {
                      class: "menu-btn",
                      onClick: (j) => ue(y.id)
                    }, "⋮", 8, sn),
                    i.value === y.id ? (f(), b("div", nn, [
                      a("button", {
                        onClick: (j) => Pe(y)
                      }, "Edit", 8, rn)
                    ])) : ee("", !0)
                  ])) : ee("", !0)
                ]),
                l.value === y.id ? (f(), b("div", ln, [
                  P(a("textarea", {
                    "onUpdate:modelValue": h[12] || (h[12] = (j) => u.value = j),
                    rows: "3",
                    class: "comment-input"
                  }, null, 512), [
                    [te, u.value]
                  ]),
                  a("button", {
                    class: "btn-primary",
                    onClick: (j) => Ee(y.id)
                  }, "Save", 8, an),
                  a("button", {
                    class: "btn",
                    onClick: qe
                  }, "Cancel")
                ])) : (f(), b("div", on, [
                  y.created_by === "Analyze" ? (f(), b("div", {
                    key: 0,
                    class: "comment-text",
                    innerHTML: K(y.comment)
                  }, null, 8, un)) : (f(), b("div", {
                    key: 1,
                    class: "comment-text",
                    innerHTML: xe(y.comment)
                  }, null, 8, cn))
                ]))
              ]))), 128))
            ])) : (f(), b("div", pn, "No comments yet")),
            a("div", dn, [
              P(a("textarea", {
                "onUpdate:modelValue": h[13] || (h[13] = (y) => M.value = y),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: x,
                disabled: U.value
              }, null, 40, hn), [
                [te, M.value]
              ]),
              h[27] || (h[27] = a("small", null, "Paste images from clipboard", -1)),
              a("button", {
                onClick: ve,
                disabled: !M.value.trim() || U.value,
                class: "btn-primary"
              }, [
                U.value ? (f(), b("span", gn, "Analyzing...")) : (f(), b("span", fn, "Add Comment"))
              ], 8, kn)
            ])
          ])
        ])) : ee("", !0)
      ]);
    };
  }
}), mt = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [n, r] of e)
    t[n] = r;
  return t;
}, bn = /* @__PURE__ */ mt(mn, [["__scopeId", "data-v-513d9a9f"]]), yn = { class: "tasks-card" }, vn = {
  key: 0,
  class: "loading"
}, wn = {
  key: 1,
  class: "error"
}, xn = {
  key: 2,
  class: "tasks-container"
}, $n = { class: "tasks-header" }, _n = { class: "tasks-header-actions" }, Sn = { class: "tasks-filters" }, Tn = { class: "filter-checkbox" }, Rn = { class: "tasks-table-wrapper" }, Cn = { class: "tasks-table" }, An = {
  key: 0,
  class: "no-results"
}, zn = { class: "task-actions" }, In = ["onClick"], Ln = ["onClick", "title", "disabled"], Pn = { key: 0 }, qn = { key: 1 }, En = {
  key: 3,
  class: "task-form-container"
}, Bn = { class: "form-body" }, Mn = { class: "form-group" }, Dn = { class: "form-group" }, Un = { class: "form-row" }, Fn = { class: "form-group" }, Nn = { class: "form-group" }, Vn = { class: "form-group" }, Hn = ["disabled"], Zn = ["value"], Qn = { class: "form-actions" }, On = ["disabled"], Kn = {
  key: 5,
  class: "rename-dialog-backdrop"
}, jn = { class: "rename-dialog" }, Gn = { class: "dialog-actions" }, Wn = /* @__PURE__ */ nt({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate", "maximize"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = A(""), l = A("not_completed"), u = A("list"), i = A(null);
    A(null), A(""), A(null);
    const c = A({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: t.userId
    }), o = A(!1), k = A(null);
    A(null);
    const w = Me(() => ({
      status: l.value && l.value !== "not_completed" ? l.value : void 0
    })), { data: p, isLoading: C, error: m } = zt(w), I = qt(), F = rt();
    Bt();
    const { data: N, isLoading: B } = lt(), z = Me(() => {
      if (!p.value) return [];
      const x = r.value.toLowerCase().trim();
      let d = p.value.filter((g) => o.value ? !!g.archived : !g.archived);
      return l.value === "not_completed" ? d = d.filter((g) => g.status !== "completed" && g.status !== "closed") : l.value && (d = d.filter((g) => g.status === l.value)), x ? d.filter((g) => {
        var v, h, L, J, Y;
        const K = ((v = g.summary) == null ? void 0 : v.toLowerCase()) || "", ue = ((h = g.description) == null ? void 0 : h.toLowerCase()) || "", Pe = ((L = g.status) == null ? void 0 : L.toLowerCase().replace("_", " ")) || "", qe = ((J = g.priority) == null ? void 0 : J.toLowerCase()) || "", Ee = ((Y = g.assigned_to) == null ? void 0 : Y.toLowerCase()) || "";
        return K.includes(x) || ue.includes(x) || Pe.includes(x) || qe.includes(x) || Ee.includes(x);
      }) : d;
    });
    function H(x) {
      return new Date(x).toLocaleDateString();
    }
    async function M() {
      try {
        await I.mutateAsync(c.value), Z(), u.value = "list";
      } catch (x) {
        console.error("Failed to create task:", x);
      }
    }
    function Z() {
      c.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: t.userId
      };
    }
    function U() {
      Z(), u.value = "create";
    }
    function ae(x) {
      i.value = x, u.value = "detail";
    }
    function oe() {
      u.value = "list", i.value = null;
    }
    const V = A("Task Management"), X = A(!1), D = A("");
    function ve() {
      return new URL(window.location.href).searchParams.get("task_app_name") || "Task Management";
    }
    function ze(x) {
      const d = new URL(window.location.href);
      x && x.trim() && x !== "Task Management" ? d.searchParams.set("task_app_name", x.trim()) : d.searchParams.delete("task_app_name"), window.history.replaceState({}, "", d.toString());
    }
    function we() {
      D.value = V.value, X.value = !0;
    }
    function Ie() {
      V.value = D.value.trim() || "Task Management", ze(V.value), X.value = !1;
    }
    _t(() => {
      const x = new URLSearchParams(window.location.search), d = x.get("taskId");
      d && (i.value = d, u.value = "detail"), V.value = ve(), x.has("task_status") && (l.value = x.get("task_status") ?? ""), window.addEventListener("popstate", () => {
        V.value = ve();
        const g = new URLSearchParams(window.location.search);
        l.value = g.has("task_status") ? g.get("task_status") ?? "" : "not_completed";
      });
    }), St([i, u, l], ([x, d, g]) => {
      const K = new URLSearchParams(window.location.search);
      d === "detail" && x ? K.set("taskId", x) : K.delete("taskId"), K.set("task_status", g);
      const ue = `${window.location.pathname}?${K.toString()}`;
      window.history.replaceState({}, "", ue);
    });
    async function xe(x) {
      k.value = x.id;
      try {
        await F.mutateAsync({
          id: x.id,
          updates: { archived: !x.archived },
          userId: t.userId
        });
      } catch (d) {
        console.error("Failed to archive/unarchive task:", d);
      } finally {
        k.value = null;
      }
    }
    function Le(x) {
      if (!x || !N.value) return "";
      const d = N.value.find((g) => g.id === x);
      return (d == null ? void 0 : d.name) || x;
    }
    return (x, d) => (f(), b("div", yn, [
      $(C) && !$(p) ? (f(), b("div", vn, [...d[13] || (d[13] = [
        a("div", { class: "loading-spinner" }, null, -1),
        se(" Loading tasks... ", -1)
      ])])) : $(m) ? (f(), b("div", wn, [
        d[14] || (d[14] = a("h3", null, "Error loading tasks", -1)),
        a("p", null, R($(m)), 1)
      ])) : u.value === "list" ? (f(), b("div", xn, [
        a("div", $n, [
          a("h2", null, [
            a("span", {
              class: ne({ "tasks-header-clickable": t.showHeaderLink }),
              onClick: d[0] || (d[0] = (g) => t.showHeaderLink && n("navigate"))
            }, R(V.value), 3),
            a("button", {
              class: "appname-rename-btn",
              onClick: we,
              title: "Rename app",
              style: { width: "auto", padding: "2px 7px", "font-size": "13px", background: "none", border: "none", color: "#888", cursor: "pointer" }
            }, "✎")
          ]),
          a("div", _n, [
            a("button", {
              class: "btn btn-add",
              onClick: U
            }, [...d[15] || (d[15] = [
              a("span", { class: "icon" }, "➕", -1)
            ])]),
            a("button", {
              onClick: d[1] || (d[1] = (g) => n("maximize")),
              class: "btn btn-minimize",
              title: "Maximize"
            }, " ⤢ "),
            a("button", {
              class: "btn btn-minimize",
              onClick: d[2] || (d[2] = (g) => n("minimize")),
              title: "Close"
            }, " X ")
          ])
        ]),
        a("div", Sn, [
          P(a("input", {
            "onUpdate:modelValue": d[3] || (d[3] = (g) => r.value = g),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [te, r.value]
          ]),
          P(a("select", {
            "onUpdate:modelValue": d[4] || (d[4] = (g) => l.value = g),
            class: "filter-select"
          }, [...d[16] || (d[16] = [
            Rt('<option value="not_completed" data-v-4f3fa363>All not completed</option><option value="" data-v-4f3fa363>All Status</option><option value="open" data-v-4f3fa363>Open</option><option value="in-progress" data-v-4f3fa363>In Progress</option><option value="completed" data-v-4f3fa363>Completed</option>', 5)
          ])], 512), [
            [re, l.value]
          ]),
          a("label", Tn, [
            P(a("input", {
              type: "checkbox",
              "onUpdate:modelValue": d[5] || (d[5] = (g) => o.value = g)
            }, null, 512), [
              [Ct, o.value]
            ]),
            d[17] || (d[17] = se(" Show Archived ", -1))
          ])
        ]),
        a("div", Rn, [
          a("table", Cn, [
            d[20] || (d[20] = a("thead", null, [
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
              z.value.length === 0 ? (f(), b("tr", An, [...d[18] || (d[18] = [
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
              ])])) : ee("", !0),
              (f(!0), b(he, null, ke(z.value, (g) => (f(), b("tr", {
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
                a("td", null, R(Le(g.assigned_to) || "-"), 1),
                a("td", null, R(H(g.created_at)), 1),
                a("td", zn, [
                  a("button", {
                    class: "btn btn-icon",
                    onClick: (K) => ae(g.id),
                    title: "View details"
                  }, " 👁️ ", 8, In),
                  a("button", {
                    class: ne(["btn btn-icon", g.archived ? "btn-success" : "btn-danger"]),
                    onClick: (K) => xe(g),
                    title: g.archived ? "Unarchive task" : "Archive task",
                    disabled: k.value === g.id
                  }, [
                    k.value === g.id ? (f(), b("span", Pn, [...d[19] || (d[19] = [
                      a("span", {
                        class: "loading-spinner",
                        style: { display: "inline-block", width: "1em", height: "1em", "border-width": "2px" }
                      }, null, -1)
                    ])])) : (f(), b("span", qn, R(g.archived ? "↩️" : "🗑️"), 1))
                  ], 10, Ln)
                ])
              ]))), 128))
            ])
          ])
        ])
      ])) : u.value === "create" ? (f(), b("div", En, [
        a("div", { class: "form-header" }, [
          a("button", {
            class: "btn btn-back",
            onClick: oe
          }, " ← Back to Tasks "),
          d[21] || (d[21] = a("h2", null, "Create New Task", -1))
        ]),
        a("div", Bn, [
          a("div", Mn, [
            d[22] || (d[22] = a("label", { for: "task-summary" }, "Summary *", -1)),
            P(a("input", {
              id: "task-summary",
              "onUpdate:modelValue": d[6] || (d[6] = (g) => c.value.summary = g),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [te, c.value.summary]
            ])
          ]),
          a("div", Dn, [
            d[23] || (d[23] = a("label", { for: "task-description" }, "Description", -1)),
            P(a("textarea", {
              id: "task-description",
              "onUpdate:modelValue": d[7] || (d[7] = (g) => c.value.description = g),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [te, c.value.description]
            ])
          ]),
          a("div", Un, [
            a("div", Fn, [
              d[25] || (d[25] = a("label", { for: "task-status" }, "Status", -1)),
              P(a("select", {
                id: "task-status",
                "onUpdate:modelValue": d[8] || (d[8] = (g) => c.value.status = g)
              }, [...d[24] || (d[24] = [
                a("option", { value: "open" }, "Open", -1),
                a("option", { value: "in-progress" }, "In Progress", -1),
                a("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [re, c.value.status]
              ])
            ]),
            a("div", Nn, [
              d[27] || (d[27] = a("label", { for: "task-priority" }, "Priority", -1)),
              P(a("select", {
                id: "task-priority",
                "onUpdate:modelValue": d[9] || (d[9] = (g) => c.value.priority = g)
              }, [...d[26] || (d[26] = [
                a("option", { value: "low" }, "Low", -1),
                a("option", { value: "medium" }, "Medium", -1),
                a("option", { value: "high" }, "High", -1)
              ])], 512), [
                [re, c.value.priority]
              ])
            ])
          ]),
          a("div", Vn, [
            d[29] || (d[29] = a("label", { for: "task-assigned" }, "Assigned To", -1)),
            P(a("select", {
              id: "task-assigned",
              "onUpdate:modelValue": d[10] || (d[10] = (g) => c.value.assigned_to = g),
              disabled: $(B)
            }, [
              d[28] || (d[28] = a("option", { value: "" }, "-- Select User --", -1)),
              (f(!0), b(he, null, ke($(N), (g) => (f(), b("option", {
                key: g.id,
                value: g.id
              }, R(g.name), 9, Zn))), 128))
            ], 8, Hn), [
              [re, c.value.assigned_to]
            ])
          ]),
          a("div", Qn, [
            a("button", {
              class: "btn btn-cancel",
              onClick: oe
            }, "Cancel"),
            a("button", {
              class: "btn btn-primary",
              onClick: M,
              disabled: !c.value.summary.trim()
            }, " Create Task ", 8, On)
          ])
        ])
      ])) : u.value === "detail" && i.value ? (f(), Tt(bn, {
        key: 4,
        "task-id": i.value,
        "user-id": s.userId,
        onClose: oe
      }, null, 8, ["task-id", "user-id"])) : ee("", !0),
      X.value ? (f(), b("div", Kn, [
        a("div", jn, [
          d[30] || (d[30] = a("h3", null, "Rename App", -1)),
          P(a("input", {
            "onUpdate:modelValue": d[11] || (d[11] = (g) => D.value = g),
            placeholder: "App name"
          }, null, 512), [
            [te, D.value]
          ]),
          a("div", Gn, [
            a("button", { onClick: Ie }, "Save"),
            a("button", {
              onClick: d[12] || (d[12] = (g) => X.value = !1)
            }, "Cancel")
          ])
        ])
      ])) : ee("", !0)
    ]));
  }
}), er = /* @__PURE__ */ mt(Wn, [["__scopeId", "data-v-4f3fa363"]]);
export {
  bn as TaskDetail,
  er as Tasks
};
