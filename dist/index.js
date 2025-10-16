import { inject as ve, computed as le, unref as c, defineComponent as de, ref as _, createElementBlock as r, openBlock as l, createElementVNode as e, createCommentVNode as ee, normalizeClass as K, toDisplayString as p, withDirectives as w, withKeys as ie, vModelText as B, vModelSelect as E, Fragment as j, renderList as R, createTextVNode as U, nextTick as ye, createBlock as pe, vModelCheckbox as fe } from "vue";
import { useQuery as G, useQueryClient as te, useMutation as se } from "@tanstack/vue-query";
const ke = Symbol.for("y2kfund.supabase");
function S() {
  const a = ve(ke, null);
  if (!a) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return a;
}
const $ = {
  all: ["tasks"],
  list: (a) => [...$.all, "list", a],
  detail: (a) => [...$.all, "detail", a],
  comments: (a) => [...$.all, "comments", a],
  history: (a) => [...$.all, "history", a]
};
function ge(a) {
  const v = S();
  return G({
    queryKey: le(() => {
      const n = a ? c(a) : {};
      return $.list(n);
    }),
    queryFn: async () => {
      const n = a ? c(a) : {};
      let d = v.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (n != null && n.status && (d = d.eq("status", n.status)), n != null && n.search && n.search.trim()) {
        const g = n.search.trim();
        d = d.or(`summary.ilike.%${g}%,description.ilike.%${g}%`);
      }
      const { data: u, error: T } = await d;
      if (T) throw T;
      return u;
    }
  });
}
function he(a) {
  const v = S();
  return G({
    queryKey: $.detail(a),
    queryFn: async () => {
      const { data: n, error: d } = await v.schema("hf").from("tasks").select("*").eq("id", a).single();
      if (d) throw d;
      return n;
    },
    enabled: !!a
  });
}
function be(a) {
  const v = S();
  return G({
    queryKey: $.comments(a),
    queryFn: async () => {
      const { data: n, error: d } = await v.schema("hf").from("task_comments").select("*").eq("task_id", a).order("created_at", { ascending: !1 });
      if (d) throw d;
      return n;
    },
    enabled: !!a
  });
}
function _e(a) {
  const v = S();
  return G({
    queryKey: $.history(a),
    queryFn: async () => {
      const { data: n, error: d } = await v.schema("hf").from("task_history").select("*").eq("task_id", a).order("changed_at", { ascending: !1 });
      if (d) throw d;
      return n;
    },
    enabled: !!a
  });
}
function we() {
  const a = S(), v = te();
  return se({
    mutationFn: async (n) => {
      const { data: d, error: u } = await a.schema("hf").from("tasks").insert(n).select().single();
      if (u) throw u;
      return d;
    },
    onSuccess: () => {
      v.invalidateQueries({ queryKey: $.all });
    }
  });
}
function ue() {
  const a = S(), v = te();
  return se({
    mutationFn: async ({
      id: n,
      updates: d,
      userId: u
    }) => {
      const { data: T, error: g } = await a.schema("hf").from("tasks").select("*").eq("id", n).single();
      if (g) throw g;
      const { data: I, error: f } = await a.schema("hf").from("tasks").update(d).eq("id", n).select().single();
      if (f) throw f;
      const q = Object.keys(d).filter((h) => T[h] !== d[h]).map((h) => ({
        task_id: n,
        field_name: h,
        old_value: String(T[h] || ""),
        new_value: String(d[h] || ""),
        changed_by: u
      }));
      if (q.length > 0) {
        const { error: h } = await a.schema("hf").from("task_history").insert(q);
        h && console.error("Failed to save history:", h);
      }
      return I;
    },
    onSuccess: (n) => {
      v.invalidateQueries({ queryKey: $.all }), v.invalidateQueries({ queryKey: $.detail(n.id) }), v.invalidateQueries({ queryKey: $.history(n.id) });
    }
  });
}
function $e() {
  const a = S(), v = te();
  return se({
    mutationFn: async (n) => {
      const { data: d, error: u } = await a.schema("hf").from("task_comments").insert(n).select().single();
      if (u) throw u;
      return d;
    },
    onSuccess: (n) => {
      v.invalidateQueries({ queryKey: $.comments(n.task_id) });
    }
  });
}
function Ce() {
  const a = S(), v = te();
  return se({
    mutationFn: async (n) => {
      await a.schema("hf").from("task_comments").delete().eq("task_id", n), await a.schema("hf").from("task_history").delete().eq("task_id", n);
      const { error: d } = await a.schema("hf").from("tasks").delete().eq("id", n);
      if (d) throw d;
      return n;
    },
    onSuccess: () => {
      v.invalidateQueries({ queryKey: $.all });
    }
  });
}
function ce() {
  const a = S();
  return G({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: v, error: n } = await a.from("users_view").select("id, email, name").order("email");
      if (n) throw n;
      return (v || []).map((d) => ({
        id: d.id,
        email: d.email,
        name: d.name || d.email
      }));
    },
    staleTime: 5 * 60 * 1e3
  });
}
const Te = { class: "detail-container" }, Le = { class: "detail-header" }, Ie = {
  key: 0,
  class: "loading"
}, qe = {
  key: 1,
  class: "error"
}, Fe = {
  key: 2,
  class: "detail-content"
}, Se = { class: "task-info" }, xe = { class: "info-row" }, De = {
  key: 1,
  class: "info-value"
}, Ue = { class: "info-row" }, Ve = ["innerHTML"], Ae = { class: "info-row" }, Me = { class: "info-row" }, Ke = { class: "info-row" }, Ee = ["disabled"], Pe = ["value"], Be = {
  key: 1,
  class: "info-value"
}, He = { class: "history-section" }, Ne = { class: "expand-icon" }, Qe = { key: 0 }, Oe = {
  key: 0,
  class: "loading"
}, ze = {
  key: 1,
  class: "history-list"
}, je = { class: "history-meta" }, Re = { class: "history-date" }, Ge = { class: "history-change" }, Je = { class: "change-values" }, We = { class: "old-value" }, Xe = { class: "new-value" }, Ye = {
  key: 2,
  class: "no-history"
}, Ze = { class: "comments-section" }, et = {
  key: 0,
  class: "loading"
}, tt = {
  key: 1,
  class: "comments-list"
}, st = { class: "comment-meta" }, nt = { class: "comment-date" }, ot = ["innerHTML"], at = {
  key: 2,
  class: "no-comments"
}, it = { class: "add-comment" }, lt = ["disabled"], rt = /* @__PURE__ */ de({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(a, { emit: v }) {
    const n = a, d = v, { data: u, isLoading: T, error: g } = he(n.taskId), { data: I, isLoading: f } = be(n.taskId), { data: q, isLoading: h } = _e(n.taskId), J = ue(), H = $e(), L = _(null), k = _(""), x = _(null), F = _(""), D = _(!1), { data: N, isLoading: W } = ce();
    async function V(m, t) {
      L.value = m, k.value = t, await ye();
      const b = x.value;
      b && typeof b.focus == "function" && b.focus();
    }
    function Q() {
      L.value = null, k.value = "";
    }
    async function C() {
      if (!L.value || !u.value) return;
      const m = L.value, t = u.value[m];
      if (k.value !== t)
        try {
          await J.mutateAsync({
            id: n.taskId,
            updates: { [m]: k.value },
            userId: n.userId
          });
        } catch (b) {
          console.error("Failed to update task:", b);
        }
      Q();
    }
    async function ne() {
      if (F.value.trim())
        try {
          await H.mutateAsync({
            task_id: n.taskId,
            comment: F.value,
            created_by: n.userId
          }), F.value = "";
        } catch (m) {
          console.error("Failed to add comment:", m);
        }
    }
    async function oe() {
      if (u.value)
        try {
          await J.mutateAsync({
            id: u.value.id,
            updates: { archived: !u.value.archived },
            userId: n.userId
          });
        } catch (m) {
          console.error("Failed to archive/unarchive task:", m);
        }
    }
    function P(m) {
      return new Date(m).toLocaleString();
    }
    function ae(m) {
      return m.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
    }
    function X(m) {
      return m.replace(/!\[.*?\]\((data:image\/[^)]+)\)/g, '<img src="$1" style="max-width: 100%; margin: 0.5rem 0;" />');
    }
    async function y(m) {
      await o(m, (t) => {
        k.value += `
![image](${t})
`;
      });
    }
    async function s(m) {
      await o(m, (t) => {
        F.value += `
![image](${t})
`;
      });
    }
    async function o(m, t) {
      var M;
      const b = (M = m.clipboardData) == null ? void 0 : M.items;
      if (b) {
        for (const i of b)
          if (i.type.indexOf("image") !== -1) {
            m.preventDefault();
            const O = i.getAsFile();
            if (O) {
              const z = new FileReader();
              z.onload = (Y) => {
                var re;
                const Z = (re = Y.target) == null ? void 0 : re.result;
                t(Z);
              }, z.readAsDataURL(O);
            }
          }
      }
    }
    function A(m) {
      if (!m || !N.value) return "";
      const t = N.value.find((b) => b.id === m);
      return (t == null ? void 0 : t.name) || m;
    }
    return (m, t) => {
      var b, M;
      return l(), r("div", Te, [
        e("div", Le, [
          e("button", {
            class: "btn btn-back",
            onClick: t[0] || (t[0] = (i) => d("close"))
          }, " ← Back to Tasks "),
          t[13] || (t[13] = e("h2", null, "Task Details", -1)),
          e("button", {
            class: K(["btn", (b = c(u)) != null && b.archived ? "btn-success" : "btn-danger"]),
            onClick: oe
          }, p((M = c(u)) != null && M.archived ? "Unarchive" : "Archive") + " Task ", 3)
        ]),
        c(T) ? (l(), r("div", Ie, "Loading task details...")) : c(g) ? (l(), r("div", qe, "Error: " + p(c(g)), 1)) : c(u) ? (l(), r("div", Fe, [
          e("div", Se, [
            e("div", xe, [
              t[14] || (t[14] = e("label", null, "Summary", -1)),
              e("div", {
                onDblclick: t[2] || (t[2] = (i) => V("summary", c(u).summary))
              }, [
                L.value === "summary" ? w((l(), r("input", {
                  key: 0,
                  "onUpdate:modelValue": t[1] || (t[1] = (i) => k.value = i),
                  onBlur: C,
                  onKeyup: [
                    ie(C, ["enter"]),
                    ie(Q, ["esc"])
                  ],
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: x
                }, null, 544)), [
                  [B, k.value]
                ]) : (l(), r("div", De, p(c(u).summary), 1))
              ], 32)
            ]),
            e("div", Ue, [
              t[15] || (t[15] = e("label", null, "Description", -1)),
              e("div", {
                onDblclick: t[4] || (t[4] = (i) => V("description", c(u).description || ""))
              }, [
                L.value === "description" ? w((l(), r("textarea", {
                  key: 0,
                  "onUpdate:modelValue": t[3] || (t[3] = (i) => k.value = i),
                  onBlur: C,
                  onKeyup: ie(Q, ["esc"]),
                  onPaste: y,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: x
                }, null, 544)), [
                  [B, k.value]
                ]) : (l(), r("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: X(c(u).description || "")
                }, null, 8, Ve))
              ], 32)
            ]),
            e("div", Ae, [
              t[17] || (t[17] = e("label", null, "Status", -1)),
              e("div", {
                onDblclick: t[6] || (t[6] = (i) => V("status", c(u).status))
              }, [
                L.value === "status" ? w((l(), r("select", {
                  key: 0,
                  "onUpdate:modelValue": t[5] || (t[5] = (i) => k.value = i),
                  onBlur: C,
                  onChange: C,
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: x
                }, [...t[16] || (t[16] = [
                  e("option", { value: "open" }, "Open", -1),
                  e("option", { value: "in-progress" }, "In Progress", -1),
                  e("option", { value: "completed" }, "Completed", -1),
                  e("option", { value: "closed" }, "Closed", -1)
                ])], 544)), [
                  [E, k.value]
                ]) : (l(), r("span", {
                  key: 1,
                  class: K(`status-badge status-${c(u).status}`)
                }, p(c(u).status), 3))
              ], 32)
            ]),
            e("div", Me, [
              t[19] || (t[19] = e("label", null, "Priority", -1)),
              e("div", {
                onDblclick: t[8] || (t[8] = (i) => V("priority", c(u).priority))
              }, [
                L.value === "priority" ? w((l(), r("select", {
                  key: 0,
                  "onUpdate:modelValue": t[7] || (t[7] = (i) => k.value = i),
                  onBlur: C,
                  onChange: C,
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: x
                }, [...t[18] || (t[18] = [
                  e("option", { value: "low" }, "Low", -1),
                  e("option", { value: "medium" }, "Medium", -1),
                  e("option", { value: "high" }, "High", -1),
                  e("option", { value: "critical" }, "Critical", -1)
                ])], 544)), [
                  [E, k.value]
                ]) : (l(), r("span", {
                  key: 1,
                  class: K(`priority-badge priority-${c(u).priority}`)
                }, p(c(u).priority), 3))
              ], 32)
            ]),
            e("div", Ke, [
              t[21] || (t[21] = e("label", null, "Assigned To", -1)),
              e("div", {
                onDblclick: t[10] || (t[10] = (i) => V("assigned_to", c(u).assigned_to || ""))
              }, [
                L.value === "assigned_to" ? w((l(), r("select", {
                  key: 0,
                  "onUpdate:modelValue": t[9] || (t[9] = (i) => k.value = i),
                  onBlur: C,
                  onChange: C,
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: x,
                  disabled: c(W)
                }, [
                  t[20] || (t[20] = e("option", { value: "" }, "-- Unassigned --", -1)),
                  (l(!0), r(j, null, R(c(N), (i) => (l(), r("option", {
                    key: i.id,
                    value: i.id
                  }, p(i.name), 9, Pe))), 128))
                ], 40, Ee)), [
                  [E, k.value]
                ]) : (l(), r("div", Be, p(A(c(u).assigned_to) || "-"), 1))
              ], 32)
            ])
          ]),
          e("div", He, [
            e("div", {
              class: "section-header",
              onClick: t[11] || (t[11] = (i) => D.value = !D.value)
            }, [
              e("h3", null, [
                e("span", Ne, p(D.value ? "▼" : "▶"), 1),
                t[22] || (t[22] = U(" History ", -1))
              ])
            ]),
            D.value ? (l(), r("div", Qe, [
              c(h) ? (l(), r("div", Oe, "Loading history...")) : c(q) && c(q).length > 0 ? (l(), r("div", ze, [
                (l(!0), r(j, null, R(c(q), (i) => (l(), r("div", {
                  key: i.id,
                  class: "history-item"
                }, [
                  e("div", je, [
                    e("strong", null, p(A(i.changed_by)), 1),
                    e("span", Re, p(P(i.changed_at)), 1)
                  ]),
                  e("div", Ge, [
                    t[26] || (t[26] = U(" Changed ", -1)),
                    e("strong", null, p(ae(i.field_name)), 1),
                    e("span", Je, [
                      t[23] || (t[23] = U(' from "', -1)),
                      e("span", We, p(i.old_value), 1),
                      t[24] || (t[24] = U('" to "', -1)),
                      e("span", Xe, p(i.new_value), 1),
                      t[25] || (t[25] = U('" ', -1))
                    ])
                  ])
                ]))), 128))
              ])) : (l(), r("div", Ye, "No history yet"))
            ])) : ee("", !0)
          ]),
          e("div", Ze, [
            t[28] || (t[28] = e("h3", null, "Comments", -1)),
            c(f) ? (l(), r("div", et, "Loading comments...")) : c(I) && c(I).length > 0 ? (l(), r("div", tt, [
              (l(!0), r(j, null, R(c(I), (i) => (l(), r("div", {
                key: i.id,
                class: "comment-item"
              }, [
                e("div", st, [
                  e("strong", null, p(A(i.created_by)), 1),
                  e("span", nt, p(P(i.created_at)), 1)
                ]),
                e("div", {
                  class: "comment-text",
                  innerHTML: X(i.comment)
                }, null, 8, ot)
              ]))), 128))
            ])) : (l(), r("div", at, "No comments yet")),
            e("div", it, [
              w(e("textarea", {
                "onUpdate:modelValue": t[12] || (t[12] = (i) => F.value = i),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: s
              }, null, 544), [
                [B, F.value]
              ]),
              t[27] || (t[27] = e("small", null, "Paste images from clipboard", -1)),
              e("button", {
                onClick: ne,
                disabled: !F.value.trim(),
                class: "btn-primary"
              }, " Add Comment ", 8, lt)
            ])
          ])
        ])) : ee("", !0)
      ]);
    };
  }
}), me = (a, v) => {
  const n = a.__vccOpts || a;
  for (const [d, u] of v)
    n[d] = u;
  return n;
}, dt = /* @__PURE__ */ me(rt, [["__scopeId", "data-v-33f5db08"]]), ut = { class: "tasks-card" }, ct = {
  key: 0,
  class: "loading"
}, mt = {
  key: 1,
  class: "error"
}, vt = {
  key: 2,
  class: "tasks-container"
}, yt = { class: "tasks-header" }, pt = { class: "tasks-header-actions" }, ft = { class: "tasks-filters" }, kt = { class: "filter-checkbox" }, gt = { class: "tasks-table-wrapper" }, ht = { class: "tasks-table" }, bt = {
  key: 0,
  class: "no-results"
}, _t = { class: "task-actions" }, wt = ["onClick"], $t = ["onClick", "title", "disabled"], Ct = { key: 0 }, Tt = { key: 1 }, Lt = {
  key: 3,
  class: "task-form-container"
}, It = { class: "form-body" }, qt = { class: "form-group" }, Ft = { class: "form-group" }, St = { class: "form-row" }, xt = { class: "form-group" }, Dt = { class: "form-group" }, Ut = { class: "form-group" }, Vt = ["disabled"], At = ["value"], Mt = { class: "form-actions" }, Kt = ["disabled"], Et = /* @__PURE__ */ de({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(a, { emit: v }) {
    const n = a, d = v, u = _(""), T = _(""), g = _("list"), I = _(null);
    _(null), _(""), _(null);
    const f = _({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: n.userId
    }), q = _(!1), h = _(null), J = le(() => ({
      status: T.value || void 0
    })), { data: H, isLoading: L, error: k } = ge(J), x = we(), F = ue();
    Ce();
    const { data: D, isLoading: N } = ce(), W = le(() => {
      if (!H.value) return [];
      const y = u.value.toLowerCase().trim();
      let s = H.value.filter((o) => q.value ? !!o.archived : !o.archived);
      return y ? s.filter((o) => {
        var i, O, z, Y, Z;
        const A = ((i = o.summary) == null ? void 0 : i.toLowerCase()) || "", m = ((O = o.description) == null ? void 0 : O.toLowerCase()) || "", t = ((z = o.status) == null ? void 0 : z.toLowerCase().replace("_", " ")) || "", b = ((Y = o.priority) == null ? void 0 : Y.toLowerCase()) || "", M = ((Z = o.assigned_to) == null ? void 0 : Z.toLowerCase()) || "";
        return A.includes(y) || m.includes(y) || t.includes(y) || b.includes(y) || M.includes(y);
      }) : s;
    });
    function V(y) {
      return new Date(y).toLocaleDateString();
    }
    async function Q() {
      try {
        await x.mutateAsync(f.value), C(), g.value = "list";
      } catch (y) {
        console.error("Failed to create task:", y);
      }
    }
    function C() {
      f.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: n.userId
      };
    }
    function ne() {
      C(), g.value = "create";
    }
    function oe(y) {
      I.value = y, g.value = "detail";
    }
    function P() {
      g.value = "list", I.value = null;
    }
    async function ae(y) {
      h.value = y.id;
      try {
        await F.mutateAsync({
          id: y.id,
          updates: { archived: !y.archived },
          userId: n.userId
        });
      } catch (s) {
        console.error("Failed to archive/unarchive task:", s);
      } finally {
        h.value = null;
      }
    }
    function X(y) {
      if (!y || !D.value) return "";
      const s = D.value.find((o) => o.id === y);
      return (s == null ? void 0 : s.name) || y;
    }
    return (y, s) => (l(), r("div", ut, [
      c(L) && !c(H) ? (l(), r("div", ct, [...s[10] || (s[10] = [
        e("div", { class: "loading-spinner" }, null, -1),
        U(" Loading tasks... ", -1)
      ])])) : c(k) ? (l(), r("div", mt, [
        s[11] || (s[11] = e("h3", null, "Error loading tasks", -1)),
        e("p", null, p(c(k)), 1)
      ])) : g.value === "list" ? (l(), r("div", vt, [
        e("div", yt, [
          e("h2", {
            class: K({ "tasks-header-clickable": n.showHeaderLink }),
            onClick: s[0] || (s[0] = (o) => n.showHeaderLink && d("navigate"))
          }, " Tasks Management ", 2),
          e("div", pt, [
            e("button", {
              class: "btn btn-primary",
              onClick: ne
            }, [...s[12] || (s[12] = [
              e("span", { class: "icon" }, "➕", -1),
              U(" New Task ", -1)
            ])]),
            e("button", {
              class: "btn btn-minimize",
              onClick: s[1] || (s[1] = (o) => d("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        e("div", ft, [
          w(e("input", {
            "onUpdate:modelValue": s[2] || (s[2] = (o) => u.value = o),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [B, u.value]
          ]),
          w(e("select", {
            "onUpdate:modelValue": s[3] || (s[3] = (o) => T.value = o),
            class: "filter-select"
          }, [...s[13] || (s[13] = [
            e("option", { value: "" }, "All Status", -1),
            e("option", { value: "open" }, "Open", -1),
            e("option", { value: "in_progress" }, "In Progress", -1),
            e("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [E, T.value]
          ]),
          e("label", kt, [
            w(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": s[4] || (s[4] = (o) => q.value = o)
            }, null, 512), [
              [fe, q.value]
            ]),
            s[14] || (s[14] = U(" Show Archived ", -1))
          ])
        ]),
        e("div", gt, [
          e("table", ht, [
            s[17] || (s[17] = e("thead", null, [
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
              W.value.length === 0 ? (l(), r("tr", bt, [...s[15] || (s[15] = [
                e("td", {
                  colspan: "6",
                  class: "no-results-cell"
                }, [
                  e("div", { class: "no-results-content" }, [
                    e("span", { class: "no-results-icon" }, "🗂️"),
                    e("span", { class: "no-results-text" }, [
                      e("strong", null, "No tasks found.")
                    ])
                  ])
                ], -1)
              ])])) : ee("", !0),
              (l(!0), r(j, null, R(W.value, (o) => (l(), r("tr", {
                key: o.id
              }, [
                e("td", null, p(o.summary), 1),
                e("td", null, [
                  e("span", {
                    class: K(`status-badge status-${o.status}`)
                  }, p(o.status), 3)
                ]),
                e("td", null, [
                  e("span", {
                    class: K(`priority-badge priority-${o.priority}`)
                  }, p(o.priority), 3)
                ]),
                e("td", null, p(X(o.assigned_to) || "-"), 1),
                e("td", null, p(V(o.created_at)), 1),
                e("td", _t, [
                  e("button", {
                    class: "btn btn-icon",
                    onClick: (A) => oe(o.id),
                    title: "View details"
                  }, " 👁️ ", 8, wt),
                  e("button", {
                    class: K(["btn btn-icon", o.archived ? "btn-success" : "btn-danger"]),
                    onClick: (A) => ae(o),
                    title: o.archived ? "Unarchive task" : "Archive task",
                    disabled: h.value === o.id
                  }, [
                    h.value === o.id ? (l(), r("span", Ct, [...s[16] || (s[16] = [
                      e("span", {
                        class: "loading-spinner",
                        style: { display: "inline-block", width: "1em", height: "1em", "border-width": "2px" }
                      }, null, -1)
                    ])])) : (l(), r("span", Tt, p(o.archived ? "↩️" : "🗑️"), 1))
                  ], 10, $t)
                ])
              ]))), 128))
            ])
          ])
        ])
      ])) : g.value === "create" ? (l(), r("div", Lt, [
        e("div", { class: "form-header" }, [
          e("button", {
            class: "btn btn-back",
            onClick: P
          }, " ← Back to Tasks "),
          s[18] || (s[18] = e("h2", null, "Create New Task", -1))
        ]),
        e("div", It, [
          e("div", qt, [
            s[19] || (s[19] = e("label", { for: "task-summary" }, "Summary *", -1)),
            w(e("input", {
              id: "task-summary",
              "onUpdate:modelValue": s[5] || (s[5] = (o) => f.value.summary = o),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [B, f.value.summary]
            ])
          ]),
          e("div", Ft, [
            s[20] || (s[20] = e("label", { for: "task-description" }, "Description", -1)),
            w(e("textarea", {
              id: "task-description",
              "onUpdate:modelValue": s[6] || (s[6] = (o) => f.value.description = o),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [B, f.value.description]
            ])
          ]),
          e("div", St, [
            e("div", xt, [
              s[22] || (s[22] = e("label", { for: "task-status" }, "Status", -1)),
              w(e("select", {
                id: "task-status",
                "onUpdate:modelValue": s[7] || (s[7] = (o) => f.value.status = o)
              }, [...s[21] || (s[21] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in_progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [E, f.value.status]
              ])
            ]),
            e("div", Dt, [
              s[24] || (s[24] = e("label", { for: "task-priority" }, "Priority", -1)),
              w(e("select", {
                id: "task-priority",
                "onUpdate:modelValue": s[8] || (s[8] = (o) => f.value.priority = o)
              }, [...s[23] || (s[23] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1)
              ])], 512), [
                [E, f.value.priority]
              ])
            ])
          ]),
          e("div", Ut, [
            s[26] || (s[26] = e("label", { for: "task-assigned" }, "Assigned To", -1)),
            w(e("select", {
              id: "task-assigned",
              "onUpdate:modelValue": s[9] || (s[9] = (o) => f.value.assigned_to = o),
              disabled: c(N)
            }, [
              s[25] || (s[25] = e("option", { value: "" }, "-- Select User --", -1)),
              (l(!0), r(j, null, R(c(D), (o) => (l(), r("option", {
                key: o.id,
                value: o.id
              }, p(o.name), 9, At))), 128))
            ], 8, Vt), [
              [E, f.value.assigned_to]
            ])
          ]),
          e("div", Mt, [
            e("button", {
              class: "btn btn-cancel",
              onClick: P
            }, "Cancel"),
            e("button", {
              class: "btn btn-primary",
              onClick: Q,
              disabled: !f.value.summary.trim()
            }, " Create Task ", 8, Kt)
          ])
        ])
      ])) : g.value === "detail" && I.value ? (l(), pe(dt, {
        key: 4,
        "task-id": I.value,
        "user-id": a.userId,
        onClose: P
      }, null, 8, ["task-id", "user-id"])) : ee("", !0)
    ]));
  }
}), Ht = /* @__PURE__ */ me(Et, [["__scopeId", "data-v-4e541454"]]);
export {
  dt as TaskDetail,
  Ht as Tasks
};
