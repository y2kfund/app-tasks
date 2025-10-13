import { inject as ce, defineComponent as ae, ref as w, createElementBlock as a, openBlock as l, withModifiers as ee, createElementVNode as e, createCommentVNode as te, unref as u, toDisplayString as g, withDirectives as _, withKeys as q, vModelText as S, vModelSelect as B, normalizeClass as z, Fragment as se, renderList as ne, createTextVNode as j, nextTick as re, computed as le, createBlock as ve, createStaticVNode as me } from "vue";
import { useQuery as G, useQueryClient as J, useMutation as W } from "@tanstack/vue-query";
const pe = Symbol.for("y2kfund.supabase");
function A() {
  const i = ce(pe, null);
  if (!i) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return i;
}
const b = {
  all: ["tasks"],
  list: (i) => [...b.all, "list", i],
  detail: (i) => [...b.all, "detail", i],
  comments: (i) => [...b.all, "comments", i],
  history: (i) => [...b.all, "history", i]
};
function ye(i) {
  const d = A();
  return G({
    queryKey: b.list(i),
    queryFn: async () => {
      let r = d.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      i != null && i.status && (r = r.eq("status", i.status)), i != null && i.search && (r = r.or(`summary.ilike.%${i.search}%,description.ilike.%${i.search}%`));
      const { data: o, error: m } = await r;
      if (m) throw m;
      return o;
    }
  });
}
function fe(i) {
  const d = A();
  return G({
    queryKey: b.detail(i),
    queryFn: async () => {
      const { data: r, error: o } = await d.schema("hf").from("tasks").select("*").eq("id", i).single();
      if (o) throw o;
      return r;
    }
  });
}
function ge(i) {
  const d = A();
  return G({
    queryKey: b.comments(i),
    queryFn: async () => {
      const { data: r, error: o } = await d.schema("hf").from("task_comments").select("*").eq("task_id", i).order("created_at", { ascending: !0 });
      if (o) throw o;
      return r;
    }
  });
}
function ke(i) {
  const d = A();
  return G({
    queryKey: b.history(i),
    queryFn: async () => {
      const { data: r, error: o } = await d.schema("hf").from("task_history").select("*").eq("task_id", i).order("changed_at", { ascending: !1 });
      if (o) throw o;
      return r;
    }
  });
}
function _e() {
  const i = A(), d = J();
  return W({
    mutationFn: async (r) => {
      const { data: o, error: m } = await i.schema("hf").from("tasks").insert(r).select().single();
      if (m) throw m;
      return o;
    },
    onSuccess: () => {
      d.invalidateQueries({ queryKey: b.all });
    }
  });
}
function ue() {
  const i = A(), d = J();
  return W({
    mutationFn: async ({
      id: r,
      updates: o,
      userId: m
    }) => {
      const { data: D } = await i.schema("hf").from("tasks").select("*").eq("id", r).single(), { data: y, error: k } = await i.schema("hf").from("tasks").update({ ...o, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", r).select().single();
      if (k) throw k;
      if (D) {
        const $ = Object.entries(o).filter(([p]) => p !== "updated_at").map(([p, O]) => ({
          task_id: r,
          field_name: p,
          old_value: String(D[p] || ""),
          new_value: String(O || ""),
          changed_by: m
        }));
        $.length > 0 && await i.schema("hf").from("task_history").insert($);
      }
      return y;
    },
    onSuccess: (r, o) => {
      d.invalidateQueries({ queryKey: b.all }), d.invalidateQueries({ queryKey: b.detail(o.id) }), d.invalidateQueries({ queryKey: b.history(o.id) });
    }
  });
}
function be() {
  const i = A(), d = J();
  return W({
    mutationFn: async (r) => {
      const { error: o } = await i.schema("hf").from("tasks").delete().eq("id", r);
      if (o) throw o;
    },
    onSuccess: () => {
      d.invalidateQueries({ queryKey: b.all });
    }
  });
}
function $e() {
  const i = A(), d = J();
  return W({
    mutationFn: async (r) => {
      const { data: o, error: m } = await i.schema("hf").from("task_comments").insert(r).select().single();
      if (m) throw m;
      return o;
    },
    onSuccess: (r, o) => {
      d.invalidateQueries({ queryKey: b.comments(o.task_id) });
    }
  });
}
const we = { class: "detail-modal" }, he = { class: "detail-header" }, Ce = {
  key: 0,
  class: "loading"
}, Ie = {
  key: 1,
  class: "error"
}, De = {
  key: 2,
  class: "detail-content"
}, Te = { class: "task-info" }, Se = { class: "info-row" }, Ve = {
  key: 1,
  class: "info-value"
}, qe = { class: "info-row" }, Fe = ["innerHTML"], Le = { class: "info-row" }, Ue = { class: "info-row" }, Ke = { class: "info-row" }, Ae = {
  key: 1,
  class: "info-value"
}, Me = { class: "history-section" }, Be = {
  key: 0,
  class: "loading"
}, Pe = {
  key: 1,
  class: "history-list"
}, xe = { class: "history-meta" }, Ee = { class: "history-date" }, Qe = { class: "history-change" }, Ne = { class: "change-values" }, Oe = { class: "old-value" }, He = { class: "new-value" }, Re = {
  key: 2,
  class: "no-history"
}, je = { class: "comments-section" }, ze = {
  key: 0,
  class: "loading"
}, Ge = {
  key: 1,
  class: "comments-list"
}, Je = { class: "comment-meta" }, We = { class: "comment-date" }, Xe = ["innerHTML"], Ye = {
  key: 2,
  class: "no-comments"
}, Ze = { class: "add-comment" }, et = ["disabled"], tt = /* @__PURE__ */ ae({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(i, { emit: d }) {
    const r = i, { data: o, isLoading: m, error: D } = fe(r.taskId), { data: y, isLoading: k } = ge(r.taskId), { data: $, isLoading: p } = ke(r.taskId), O = ue(), X = $e(), h = w(null), f = w(""), F = w(null), V = w("");
    async function M(c, s) {
      h.value = c, f.value = s, await re();
      const t = F.value;
      t && typeof t.focus == "function" && t.focus();
    }
    function P() {
      h.value = null, f.value = "";
    }
    async function C() {
      if (!h.value || !o.value) return;
      const c = h.value, s = o.value[c];
      if (f.value !== s)
        try {
          await O.mutateAsync({
            id: r.taskId,
            updates: { [c]: f.value },
            userId: r.userId
          });
        } catch (t) {
          console.error("Failed to update task:", t);
        }
      P();
    }
    async function Y() {
      if (V.value.trim())
        try {
          await X.mutateAsync({
            task_id: r.taskId,
            comment: V.value,
            created_by: r.userId
          }), V.value = "";
        } catch (c) {
          console.error("Failed to add comment:", c);
        }
    }
    function H(c) {
      return new Date(c).toLocaleString();
    }
    function x(c) {
      return c.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
    }
    function E(c) {
      return c.replace(/!\[.*?\]\((data:image\/[^)]+)\)/g, '<img src="$1" style="max-width: 100%; margin: 0.5rem 0;" />');
    }
    async function T(c) {
      await R(c, (s) => {
        f.value += `
![image](${s})
`;
      });
    }
    async function Z(c) {
      await R(c, (s) => {
        V.value += `
![image](${s})
`;
      });
    }
    async function R(c, s) {
      var n;
      const t = (n = c.clipboardData) == null ? void 0 : n.items;
      if (t) {
        for (const I of t)
          if (I.type.indexOf("image") !== -1) {
            c.preventDefault();
            const L = I.getAsFile();
            if (L) {
              const U = new FileReader();
              U.onload = (Q) => {
                var K;
                const N = (K = Q.target) == null ? void 0 : K.result;
                s(N);
              }, U.readAsDataURL(L);
            }
          }
      }
    }
    return (c, s) => (l(), a("div", {
      class: "modal-overlay",
      onClick: s[12] || (s[12] = ee((t) => c.$emit("close"), ["self"]))
    }, [
      e("div", we, [
        e("div", he, [
          s[13] || (s[13] = e("h2", null, "Task Details", -1)),
          e("button", {
            onClick: s[0] || (s[0] = (t) => c.$emit("close")),
            class: "btn-close"
          }, "×")
        ]),
        u(m) ? (l(), a("div", Ce, "Loading...")) : u(D) ? (l(), a("div", Ie, "Error: " + g(u(D).message), 1)) : u(o) ? (l(), a("div", De, [
          e("div", Te, [
            e("div", Se, [
              s[14] || (s[14] = e("label", null, "Summary", -1)),
              e("div", {
                onDblclick: s[2] || (s[2] = (t) => M("summary", u(o).summary))
              }, [
                h.value === "summary" ? _((l(), a("input", {
                  key: 0,
                  "onUpdate:modelValue": s[1] || (s[1] = (t) => f.value = t),
                  onBlur: C,
                  onKeyup: [
                    q(C, ["enter"]),
                    q(P, ["esc"])
                  ],
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: F
                }, null, 544)), [
                  [S, f.value]
                ]) : (l(), a("div", Ve, g(u(o).summary), 1))
              ], 32)
            ]),
            e("div", qe, [
              s[15] || (s[15] = e("label", null, "Description", -1)),
              e("div", {
                onDblclick: s[4] || (s[4] = (t) => M("description", u(o).description || ""))
              }, [
                h.value === "description" ? _((l(), a("textarea", {
                  key: 0,
                  "onUpdate:modelValue": s[3] || (s[3] = (t) => f.value = t),
                  onBlur: C,
                  onKeyup: q(P, ["esc"]),
                  onPaste: T,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: F
                }, null, 544)), [
                  [S, f.value]
                ]) : (l(), a("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: E(u(o).description || "")
                }, null, 8, Fe))
              ], 32)
            ]),
            e("div", Le, [
              s[17] || (s[17] = e("label", null, "Status", -1)),
              e("div", {
                onDblclick: s[6] || (s[6] = (t) => M("status", u(o).status))
              }, [
                h.value === "status" ? _((l(), a("select", {
                  key: 0,
                  "onUpdate:modelValue": s[5] || (s[5] = (t) => f.value = t),
                  onBlur: C,
                  onChange: C,
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: F
                }, [...s[16] || (s[16] = [
                  e("option", { value: "open" }, "Open", -1),
                  e("option", { value: "in-progress" }, "In Progress", -1),
                  e("option", { value: "completed" }, "Completed", -1),
                  e("option", { value: "closed" }, "Closed", -1)
                ])], 544)), [
                  [B, f.value]
                ]) : (l(), a("span", {
                  key: 1,
                  class: z(`status-badge status-${u(o).status}`)
                }, g(u(o).status), 3))
              ], 32)
            ]),
            e("div", Ue, [
              s[19] || (s[19] = e("label", null, "Priority", -1)),
              e("div", {
                onDblclick: s[8] || (s[8] = (t) => M("priority", u(o).priority))
              }, [
                h.value === "priority" ? _((l(), a("select", {
                  key: 0,
                  "onUpdate:modelValue": s[7] || (s[7] = (t) => f.value = t),
                  onBlur: C,
                  onChange: C,
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: F
                }, [...s[18] || (s[18] = [
                  e("option", { value: "low" }, "Low", -1),
                  e("option", { value: "medium" }, "Medium", -1),
                  e("option", { value: "high" }, "High", -1),
                  e("option", { value: "critical" }, "Critical", -1)
                ])], 544)), [
                  [B, f.value]
                ]) : (l(), a("span", {
                  key: 1,
                  class: z(`priority-badge priority-${u(o).priority}`)
                }, g(u(o).priority), 3))
              ], 32)
            ]),
            e("div", Ke, [
              s[20] || (s[20] = e("label", null, "Assigned To", -1)),
              e("div", {
                onDblclick: s[10] || (s[10] = (t) => M("assigned_to", u(o).assigned_to || ""))
              }, [
                h.value === "assigned_to" ? _((l(), a("input", {
                  key: 0,
                  "onUpdate:modelValue": s[9] || (s[9] = (t) => f.value = t),
                  onBlur: C,
                  onKeyup: [
                    q(C, ["enter"]),
                    q(P, ["esc"])
                  ],
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: F
                }, null, 544)), [
                  [S, f.value]
                ]) : (l(), a("div", Ae, g(u(o).assigned_to || "-"), 1))
              ], 32)
            ])
          ]),
          e("div", Me, [
            s[25] || (s[25] = e("h3", null, "History", -1)),
            u(p) ? (l(), a("div", Be, "Loading history...")) : u($) && u($).length > 0 ? (l(), a("div", Pe, [
              (l(!0), a(se, null, ne(u($), (t) => (l(), a("div", {
                key: t.id,
                class: "history-item"
              }, [
                e("div", xe, [
                  e("strong", null, g(t.changed_by), 1),
                  e("span", Ee, g(H(t.changed_at)), 1)
                ]),
                e("div", Qe, [
                  s[24] || (s[24] = j(" Changed ", -1)),
                  e("strong", null, g(x(t.field_name)), 1),
                  e("span", Ne, [
                    s[21] || (s[21] = j(' from "', -1)),
                    e("span", Oe, g(t.old_value), 1),
                    s[22] || (s[22] = j('" to "', -1)),
                    e("span", He, g(t.new_value), 1),
                    s[23] || (s[23] = j('" ', -1))
                  ])
                ])
              ]))), 128))
            ])) : (l(), a("div", Re, "No history yet"))
          ]),
          e("div", je, [
            s[27] || (s[27] = e("h3", null, "Comments", -1)),
            u(k) ? (l(), a("div", ze, "Loading comments...")) : u(y) && u(y).length > 0 ? (l(), a("div", Ge, [
              (l(!0), a(se, null, ne(u(y), (t) => (l(), a("div", {
                key: t.id,
                class: "comment-item"
              }, [
                e("div", Je, [
                  e("strong", null, g(t.created_by), 1),
                  e("span", We, g(H(t.created_at)), 1)
                ]),
                e("div", {
                  class: "comment-text",
                  innerHTML: E(t.comment)
                }, null, 8, Xe)
              ]))), 128))
            ])) : (l(), a("div", Ye, "No comments yet")),
            e("div", Ze, [
              _(e("textarea", {
                "onUpdate:modelValue": s[11] || (s[11] = (t) => V.value = t),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: Z
              }, null, 544), [
                [S, V.value]
              ]),
              s[26] || (s[26] = e("small", null, "Paste images from clipboard", -1)),
              e("button", {
                onClick: Y,
                disabled: !V.value.trim(),
                class: "btn-primary"
              }, " Add Comment ", 8, et)
            ])
          ])
        ])) : te("", !0)
      ])
    ]));
  }
}), de = (i, d) => {
  const r = i.__vccOpts || i;
  for (const [o, m] of d)
    r[o] = m;
  return r;
}, st = /* @__PURE__ */ de(tt, [["__scopeId", "data-v-c2096c6b"]]), nt = { class: "tasks-container" }, ot = { class: "tasks-header" }, it = { class: "tasks-controls" }, lt = {
  key: 0,
  class: "loading"
}, at = {
  key: 1,
  class: "error"
}, rt = {
  key: 2,
  class: "tasks-table-wrapper"
}, ut = { class: "tasks-table" }, dt = ["onDblclick"], ct = { key: 0 }, vt = ["onBlur", "onKeyup"], mt = { key: 1 }, pt = ["onDblclick"], yt = { key: 0 }, ft = ["onBlur", "onChange"], gt = ["onDblclick"], kt = { key: 0 }, _t = ["onBlur", "onChange"], bt = ["onDblclick"], $t = { key: 0 }, wt = ["onBlur", "onKeyup"], ht = { key: 1 }, Ct = ["onClick"], It = ["onClick"], Dt = { class: "modal" }, Tt = { class: "form-group" }, St = { class: "form-group" }, Vt = { class: "form-group" }, qt = { class: "form-group" }, Ft = { class: "form-group" }, Lt = { class: "form-actions" }, Ut = /* @__PURE__ */ ae({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" }
  },
  setup(i) {
    const d = i, r = w(""), o = w(""), m = w(!1), D = w(null), y = w(null), k = w(""), $ = w(null), p = w({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: d.userId
    }), O = le(() => ({
      status: o.value || void 0,
      search: r.value || void 0
    })), { data: X, isLoading: h, error: f } = ye(O.value), F = _e(), V = ue(), M = be(), P = le(() => X.value || []);
    function C(s) {
      return new Date(s).toLocaleDateString();
    }
    async function Y() {
      try {
        await F.mutateAsync(p.value), m.value = !1, H();
      } catch (s) {
        console.error("Failed to create task:", s);
      }
    }
    function H() {
      p.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: d.userId
      };
    }
    async function x(s, t, n) {
      var I;
      y.value = { taskId: s, field: t }, k.value = n, await re(), (I = $.value) == null || I.focus();
    }
    function E() {
      y.value = null, k.value = "";
    }
    async function T(s) {
      if (!y.value) return;
      const { field: t } = y.value;
      if (k.value !== s[t])
        try {
          await V.mutateAsync({
            id: s.id,
            updates: { [t]: k.value },
            userId: d.userId
          });
        } catch (n) {
          console.error("Failed to update task:", n);
        }
      E();
    }
    function Z(s) {
      D.value = s;
    }
    async function R(s) {
      if (confirm("Are you sure you want to delete this task?"))
        try {
          await M.mutateAsync(s);
        } catch (t) {
          console.error("Failed to delete task:", t);
        }
    }
    async function c(s) {
      var n;
      const t = (n = s.clipboardData) == null ? void 0 : n.items;
      if (t) {
        for (const I of t)
          if (I.type.indexOf("image") !== -1) {
            s.preventDefault();
            const L = I.getAsFile();
            if (L) {
              const U = new FileReader();
              U.onload = (Q) => {
                var K;
                const N = (K = Q.target) == null ? void 0 : K.result;
                p.value.description += `
![image](${N})
`;
              }, U.readAsDataURL(L);
            }
          }
      }
    }
    return (s, t) => (l(), a("div", nt, [
      e("div", ot, [
        t[16] || (t[16] = e("h1", null, "Tasks", -1)),
        e("div", it, [
          _(e("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (n) => r.value = n),
            type: "text",
            placeholder: "Search tasks...",
            class: "search-input"
          }, null, 512), [
            [S, r.value]
          ]),
          _(e("select", {
            "onUpdate:modelValue": t[1] || (t[1] = (n) => o.value = n),
            class: "status-filter"
          }, [...t[15] || (t[15] = [
            me('<option value="" data-v-fed1b76f>All Statuses</option><option value="open" data-v-fed1b76f>Open</option><option value="in-progress" data-v-fed1b76f>In Progress</option><option value="completed" data-v-fed1b76f>Completed</option><option value="closed" data-v-fed1b76f>Closed</option>', 5)
          ])], 512), [
            [B, o.value]
          ]),
          e("button", {
            onClick: t[2] || (t[2] = (n) => m.value = !0),
            class: "btn-primary"
          }, " + New Task ")
        ])
      ]),
      u(h) ? (l(), a("div", lt, "Loading tasks...")) : u(f) ? (l(), a("div", at, " Error loading tasks: " + g(u(f).message), 1)) : (l(), a("div", rt, [
        e("table", ut, [
          t[19] || (t[19] = e("thead", null, [
            e("tr", null, [
              e("th", null, "Summary"),
              e("th", null, "Status"),
              e("th", null, "Priority"),
              e("th", null, "Assigned To"),
              e("th", null, "Created"),
              e("th", null, "Actions")
            ])
          ], -1)),
          e("tbody", null, [
            (l(!0), a(se, null, ne(P.value, (n) => {
              var I, L, U, Q, N, K, oe, ie;
              return l(), a("tr", {
                key: n.id
              }, [
                e("td", {
                  onDblclick: (v) => x(n.id, "summary", n.summary)
                }, [
                  ((I = y.value) == null ? void 0 : I.taskId) === n.id && ((L = y.value) == null ? void 0 : L.field) === "summary" ? (l(), a("div", ct, [
                    _(e("input", {
                      "onUpdate:modelValue": t[3] || (t[3] = (v) => k.value = v),
                      onBlur: (v) => T(n),
                      onKeyup: [
                        q((v) => T(n), ["enter"]),
                        q(E, ["esc"])
                      ],
                      class: "inline-edit",
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: $
                    }, null, 40, vt), [
                      [S, k.value]
                    ])
                  ])) : (l(), a("div", mt, g(n.summary), 1))
                ], 40, dt),
                e("td", {
                  onDblclick: (v) => x(n.id, "status", n.status)
                }, [
                  ((U = y.value) == null ? void 0 : U.taskId) === n.id && ((Q = y.value) == null ? void 0 : Q.field) === "status" ? (l(), a("div", yt, [
                    _(e("select", {
                      "onUpdate:modelValue": t[4] || (t[4] = (v) => k.value = v),
                      onBlur: (v) => T(n),
                      onChange: (v) => T(n),
                      class: "inline-edit",
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: $
                    }, [...t[17] || (t[17] = [
                      e("option", { value: "open" }, "Open", -1),
                      e("option", { value: "in-progress" }, "In Progress", -1),
                      e("option", { value: "completed" }, "Completed", -1),
                      e("option", { value: "closed" }, "Closed", -1)
                    ])], 40, ft), [
                      [B, k.value]
                    ])
                  ])) : (l(), a("span", {
                    key: 1,
                    class: z(`status-badge status-${n.status}`)
                  }, g(n.status), 3))
                ], 40, pt),
                e("td", {
                  onDblclick: (v) => x(n.id, "priority", n.priority)
                }, [
                  ((N = y.value) == null ? void 0 : N.taskId) === n.id && ((K = y.value) == null ? void 0 : K.field) === "priority" ? (l(), a("div", kt, [
                    _(e("select", {
                      "onUpdate:modelValue": t[5] || (t[5] = (v) => k.value = v),
                      onBlur: (v) => T(n),
                      onChange: (v) => T(n),
                      class: "inline-edit",
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: $
                    }, [...t[18] || (t[18] = [
                      e("option", { value: "low" }, "Low", -1),
                      e("option", { value: "medium" }, "Medium", -1),
                      e("option", { value: "high" }, "High", -1),
                      e("option", { value: "critical" }, "Critical", -1)
                    ])], 40, _t), [
                      [B, k.value]
                    ])
                  ])) : (l(), a("span", {
                    key: 1,
                    class: z(`priority-badge priority-${n.priority}`)
                  }, g(n.priority), 3))
                ], 40, gt),
                e("td", {
                  onDblclick: (v) => x(n.id, "assigned_to", n.assigned_to || "")
                }, [
                  ((oe = y.value) == null ? void 0 : oe.taskId) === n.id && ((ie = y.value) == null ? void 0 : ie.field) === "assigned_to" ? (l(), a("div", $t, [
                    _(e("input", {
                      "onUpdate:modelValue": t[6] || (t[6] = (v) => k.value = v),
                      onBlur: (v) => T(n),
                      onKeyup: [
                        q((v) => T(n), ["enter"]),
                        q(E, ["esc"])
                      ],
                      class: "inline-edit",
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: $
                    }, null, 40, wt), [
                      [S, k.value]
                    ])
                  ])) : (l(), a("div", ht, g(n.assigned_to || "-"), 1))
                ], 40, bt),
                e("td", null, g(C(n.created_at)), 1),
                e("td", null, [
                  e("button", {
                    onClick: (v) => Z(n.id),
                    class: "btn-icon",
                    title: "View Details"
                  }, " 🔍 ", 8, Ct),
                  e("button", {
                    onClick: (v) => R(n.id),
                    class: "btn-icon btn-danger",
                    title: "Delete"
                  }, " 🗑️ ", 8, It)
                ])
              ]);
            }), 128))
          ])
        ])
      ])),
      m.value ? (l(), a("div", {
        key: 3,
        class: "modal-overlay",
        onClick: t[13] || (t[13] = ee((n) => m.value = !1, ["self"]))
      }, [
        e("div", Dt, [
          t[29] || (t[29] = e("h2", null, "Create New Task", -1)),
          e("form", {
            onSubmit: ee(Y, ["prevent"])
          }, [
            e("div", Tt, [
              t[20] || (t[20] = e("label", null, "Summary *", -1)),
              _(e("input", {
                "onUpdate:modelValue": t[7] || (t[7] = (n) => p.value.summary = n),
                required: "",
                class: "form-input"
              }, null, 512), [
                [S, p.value.summary]
              ])
            ]),
            e("div", St, [
              t[21] || (t[21] = e("label", null, "Description", -1)),
              _(e("textarea", {
                "onUpdate:modelValue": t[8] || (t[8] = (n) => p.value.description = n),
                rows: "4",
                class: "form-input",
                onPaste: c
              }, null, 544), [
                [S, p.value.description]
              ]),
              t[22] || (t[22] = e("small", null, "Paste images from clipboard", -1))
            ]),
            e("div", Vt, [
              t[24] || (t[24] = e("label", null, "Status *", -1)),
              _(e("select", {
                "onUpdate:modelValue": t[9] || (t[9] = (n) => p.value.status = n),
                required: "",
                class: "form-input"
              }, [...t[23] || (t[23] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in-progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1),
                e("option", { value: "closed" }, "Closed", -1)
              ])], 512), [
                [B, p.value.status]
              ])
            ]),
            e("div", qt, [
              t[26] || (t[26] = e("label", null, "Priority *", -1)),
              _(e("select", {
                "onUpdate:modelValue": t[10] || (t[10] = (n) => p.value.priority = n),
                required: "",
                class: "form-input"
              }, [...t[25] || (t[25] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1),
                e("option", { value: "critical" }, "Critical", -1)
              ])], 512), [
                [B, p.value.priority]
              ])
            ]),
            e("div", Ft, [
              t[27] || (t[27] = e("label", null, "Assigned To", -1)),
              _(e("input", {
                "onUpdate:modelValue": t[11] || (t[11] = (n) => p.value.assigned_to = n),
                class: "form-input"
              }, null, 512), [
                [S, p.value.assigned_to]
              ])
            ]),
            e("div", Lt, [
              e("button", {
                type: "button",
                onClick: t[12] || (t[12] = (n) => m.value = !1),
                class: "btn-secondary"
              }, " Cancel "),
              t[28] || (t[28] = e("button", {
                type: "submit",
                class: "btn-primary"
              }, "Create Task", -1))
            ])
          ], 32)
        ])
      ])) : te("", !0),
      D.value ? (l(), ve(st, {
        key: 4,
        "task-id": D.value,
        "user-id": i.userId,
        onClose: t[14] || (t[14] = (n) => D.value = null)
      }, null, 8, ["task-id", "user-id"])) : te("", !0)
    ]));
  }
}), Mt = /* @__PURE__ */ de(Ut, [["__scopeId", "data-v-fed1b76f"]]);
export {
  st as TaskDetail,
  Mt as Tasks
};
