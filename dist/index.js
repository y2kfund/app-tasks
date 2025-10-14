import { inject as ve, computed as ae, unref as c, defineComponent as ue, ref as L, createElementBlock as l, openBlock as a, createElementVNode as e, createCommentVNode as le, toDisplayString as f, withDirectives as b, withKeys as K, vModelText as F, vModelSelect as P, normalizeClass as W, Fragment as O, renderList as re, createTextVNode as V, nextTick as de, createBlock as pe } from "vue";
import { useQuery as ee, useQueryClient as te, useMutation as se } from "@tanstack/vue-query";
const ye = Symbol.for("y2kfund.supabase");
function U() {
  const i = ve(ye, null);
  if (!i) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return i;
}
const I = {
  all: ["tasks"],
  list: (i) => [...I.all, "list", i],
  detail: (i) => [...I.all, "detail", i],
  comments: (i) => [...I.all, "comments", i],
  history: (i) => [...I.all, "history", i]
};
function fe(i) {
  const p = U();
  return ee({
    queryKey: ae(() => {
      const o = i ? c(i) : {};
      return I.list(o);
    }),
    queryFn: async () => {
      const o = i ? c(i) : {};
      let u = p.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (o != null && o.status && (u = u.eq("status", o.status)), o != null && o.search && o.search.trim()) {
        const _ = o.search.trim();
        u = u.or(`summary.ilike.%${_}%,description.ilike.%${_}%`);
      }
      const { data: d, error: T } = await u;
      if (T) throw T;
      return d;
    }
  });
}
function ke(i) {
  const p = U();
  return ee({
    queryKey: I.detail(i),
    queryFn: async () => {
      const { data: o, error: u } = await p.schema("hf").from("tasks").select("*").eq("id", i).single();
      if (u) throw u;
      return o;
    },
    enabled: !!i
  });
}
function ge(i) {
  const p = U();
  return ee({
    queryKey: I.comments(i),
    queryFn: async () => {
      const { data: o, error: u } = await p.schema("hf").from("task_comments").select("*").eq("task_id", i).order("created_at", { ascending: !1 });
      if (u) throw u;
      return o;
    },
    enabled: !!i
  });
}
function be(i) {
  const p = U();
  return ee({
    queryKey: I.history(i),
    queryFn: async () => {
      const { data: o, error: u } = await p.schema("hf").from("task_history").select("*").eq("task_id", i).order("changed_at", { ascending: !1 });
      if (u) throw u;
      return o;
    },
    enabled: !!i
  });
}
function _e() {
  const i = U(), p = te();
  return se({
    mutationFn: async (o) => {
      const { data: u, error: d } = await i.schema("hf").from("tasks").insert(o).select().single();
      if (d) throw d;
      return u;
    },
    onSuccess: () => {
      p.invalidateQueries({ queryKey: I.all });
    }
  });
}
function ce() {
  const i = U(), p = te();
  return se({
    mutationFn: async ({
      id: o,
      updates: u,
      userId: d
    }) => {
      const { data: T, error: _ } = await i.schema("hf").from("tasks").select("*").eq("id", o).single();
      if (_) throw _;
      const { data: q, error: w } = await i.schema("hf").from("tasks").update(u).eq("id", o).select().single();
      if (w) throw w;
      const k = Object.keys(u).filter((h) => T[h] !== u[h]).map((h) => ({
        task_id: o,
        field_name: h,
        old_value: String(T[h] || ""),
        new_value: String(u[h] || ""),
        changed_by: d
      }));
      if (k.length > 0) {
        const { error: h } = await i.schema("hf").from("task_history").insert(k);
        h && console.error("Failed to save history:", h);
      }
      return q;
    },
    onSuccess: (o) => {
      p.invalidateQueries({ queryKey: I.all }), p.invalidateQueries({ queryKey: I.detail(o.id) }), p.invalidateQueries({ queryKey: I.history(o.id) });
    }
  });
}
function we() {
  const i = U(), p = te();
  return se({
    mutationFn: async (o) => {
      const { data: u, error: d } = await i.schema("hf").from("task_comments").insert(o).select().single();
      if (d) throw d;
      return u;
    },
    onSuccess: (o) => {
      p.invalidateQueries({ queryKey: I.comments(o.task_id) });
    }
  });
}
function he() {
  const i = U(), p = te();
  return se({
    mutationFn: async (o) => {
      await i.schema("hf").from("task_comments").delete().eq("task_id", o), await i.schema("hf").from("task_history").delete().eq("task_id", o);
      const { error: u } = await i.schema("hf").from("tasks").delete().eq("id", o);
      if (u) throw u;
      return o;
    },
    onSuccess: () => {
      p.invalidateQueries({ queryKey: I.all });
    }
  });
}
const $e = { class: "detail-container" }, Ce = { class: "detail-header" }, Ie = {
  key: 0,
  class: "loading"
}, Te = {
  key: 1,
  class: "error"
}, De = {
  key: 2,
  class: "detail-content"
}, Le = { class: "task-info" }, Ve = { class: "info-row" }, qe = {
  key: 1,
  class: "info-value"
}, Fe = { class: "info-row" }, Se = ["innerHTML"], Be = { class: "info-row" }, Ke = { class: "info-row" }, Ue = { class: "info-row" }, Me = {
  key: 1,
  class: "info-value"
}, xe = { class: "history-section" }, Ae = {
  key: 0,
  class: "loading"
}, Ee = {
  key: 1,
  class: "history-list"
}, Pe = { class: "history-meta" }, Ne = { class: "history-date" }, He = { class: "history-change" }, Qe = { class: "change-values" }, Oe = { class: "old-value" }, ze = { class: "new-value" }, je = {
  key: 2,
  class: "no-history"
}, Re = { class: "comments-section" }, Ge = {
  key: 0,
  class: "loading"
}, Je = {
  key: 1,
  class: "comments-list"
}, We = { class: "comment-meta" }, Xe = { class: "comment-date" }, Ye = ["innerHTML"], Ze = {
  key: 2,
  class: "no-comments"
}, et = { class: "add-comment" }, tt = ["disabled"], st = /* @__PURE__ */ ue({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(i, { emit: p }) {
    const o = i, u = p, { data: d, isLoading: T, error: _ } = ke(o.taskId), { data: q, isLoading: w } = ge(o.taskId), { data: k, isLoading: h } = be(o.taskId), $ = ce(), ne = we(), C = L(null), g = L(""), S = L(null), B = L("");
    async function M(m, s) {
      C.value = m, g.value = s, await de();
      const r = S.value;
      r && typeof r.focus == "function" && r.focus();
    }
    function N() {
      C.value = null, g.value = "";
    }
    async function D() {
      if (!C.value || !d.value) return;
      const m = C.value, s = d.value[m];
      if (g.value !== s)
        try {
          await $.mutateAsync({
            id: o.taskId,
            updates: { [m]: g.value },
            userId: o.userId
          });
        } catch (r) {
          console.error("Failed to update task:", r);
        }
      N();
    }
    async function oe() {
      if (B.value.trim())
        try {
          await ne.mutateAsync({
            task_id: o.taskId,
            comment: B.value,
            created_by: o.userId
          }), B.value = "";
        } catch (m) {
          console.error("Failed to add comment:", m);
        }
    }
    function X(m) {
      return new Date(m).toLocaleString();
    }
    function Y(m) {
      return m.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
    }
    function Z(m) {
      return m.replace(/!\[.*?\]\((data:image\/[^)]+)\)/g, '<img src="$1" style="max-width: 100%; margin: 0.5rem 0;" />');
    }
    async function ie(m) {
      await x(m, (s) => {
        g.value += `
![image](${s})
`;
      });
    }
    async function z(m) {
      await x(m, (s) => {
        B.value += `
![image](${s})
`;
      });
    }
    async function x(m, s) {
      var y;
      const r = (y = m.clipboardData) == null ? void 0 : y.items;
      if (r) {
        for (const t of r)
          if (t.type.indexOf("image") !== -1) {
            m.preventDefault();
            const n = t.getAsFile();
            if (n) {
              const A = new FileReader();
              A.onload = (H) => {
                var E;
                const Q = (E = H.target) == null ? void 0 : E.result;
                s(Q);
              }, A.readAsDataURL(n);
            }
          }
      }
    }
    return (m, s) => (a(), l("div", $e, [
      e("div", Ce, [
        e("button", {
          class: "btn btn-back",
          onClick: s[0] || (s[0] = (r) => u("close"))
        }, " ← Back to Tasks "),
        s[13] || (s[13] = e("h2", null, "Task Details", -1)),
        e("button", {
          class: "btn btn-danger",
          onClick: s[1] || (s[1] = //@ts-ignore
          (...r) => m.deleteTask && m.deleteTask(...r))
        }, "Delete Task")
      ]),
      c(T) ? (a(), l("div", Ie, "Loading task details...")) : c(_) ? (a(), l("div", Te, "Error: " + f(c(_)), 1)) : c(d) ? (a(), l("div", De, [
        e("div", Le, [
          e("div", Ve, [
            s[14] || (s[14] = e("label", null, "Summary", -1)),
            e("div", {
              onDblclick: s[3] || (s[3] = (r) => M("summary", c(d).summary))
            }, [
              C.value === "summary" ? b((a(), l("input", {
                key: 0,
                "onUpdate:modelValue": s[2] || (s[2] = (r) => g.value = r),
                onBlur: D,
                onKeyup: [
                  K(D, ["enter"]),
                  K(N, ["esc"])
                ],
                class: "inline-edit",
                ref_key: "editInput",
                ref: S
              }, null, 544)), [
                [F, g.value]
              ]) : (a(), l("div", qe, f(c(d).summary), 1))
            ], 32)
          ]),
          e("div", Fe, [
            s[15] || (s[15] = e("label", null, "Description", -1)),
            e("div", {
              onDblclick: s[5] || (s[5] = (r) => M("description", c(d).description || ""))
            }, [
              C.value === "description" ? b((a(), l("textarea", {
                key: 0,
                "onUpdate:modelValue": s[4] || (s[4] = (r) => g.value = r),
                onBlur: D,
                onKeyup: K(N, ["esc"]),
                onPaste: ie,
                class: "inline-edit",
                rows: "4",
                ref_key: "editInput",
                ref: S
              }, null, 544)), [
                [F, g.value]
              ]) : (a(), l("div", {
                key: 1,
                class: "info-value",
                innerHTML: Z(c(d).description || "")
              }, null, 8, Se))
            ], 32)
          ]),
          e("div", Be, [
            s[17] || (s[17] = e("label", null, "Status", -1)),
            e("div", {
              onDblclick: s[7] || (s[7] = (r) => M("status", c(d).status))
            }, [
              C.value === "status" ? b((a(), l("select", {
                key: 0,
                "onUpdate:modelValue": s[6] || (s[6] = (r) => g.value = r),
                onBlur: D,
                onChange: D,
                class: "inline-edit",
                ref_key: "editInput",
                ref: S
              }, [...s[16] || (s[16] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in-progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1),
                e("option", { value: "closed" }, "Closed", -1)
              ])], 544)), [
                [P, g.value]
              ]) : (a(), l("span", {
                key: 1,
                class: W(`status-badge status-${c(d).status}`)
              }, f(c(d).status), 3))
            ], 32)
          ]),
          e("div", Ke, [
            s[19] || (s[19] = e("label", null, "Priority", -1)),
            e("div", {
              onDblclick: s[9] || (s[9] = (r) => M("priority", c(d).priority))
            }, [
              C.value === "priority" ? b((a(), l("select", {
                key: 0,
                "onUpdate:modelValue": s[8] || (s[8] = (r) => g.value = r),
                onBlur: D,
                onChange: D,
                class: "inline-edit",
                ref_key: "editInput",
                ref: S
              }, [...s[18] || (s[18] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1),
                e("option", { value: "critical" }, "Critical", -1)
              ])], 544)), [
                [P, g.value]
              ]) : (a(), l("span", {
                key: 1,
                class: W(`priority-badge priority-${c(d).priority}`)
              }, f(c(d).priority), 3))
            ], 32)
          ]),
          e("div", Ue, [
            s[20] || (s[20] = e("label", null, "Assigned To", -1)),
            e("div", {
              onDblclick: s[11] || (s[11] = (r) => M("assigned_to", c(d).assigned_to || ""))
            }, [
              C.value === "assigned_to" ? b((a(), l("input", {
                key: 0,
                "onUpdate:modelValue": s[10] || (s[10] = (r) => g.value = r),
                onBlur: D,
                onKeyup: [
                  K(D, ["enter"]),
                  K(N, ["esc"])
                ],
                class: "inline-edit",
                ref_key: "editInput",
                ref: S
              }, null, 544)), [
                [F, g.value]
              ]) : (a(), l("div", Me, f(c(d).assigned_to || "-"), 1))
            ], 32)
          ])
        ]),
        e("div", xe, [
          s[25] || (s[25] = e("h3", null, "History", -1)),
          c(h) ? (a(), l("div", Ae, "Loading history...")) : c(k) && c(k).length > 0 ? (a(), l("div", Ee, [
            (a(!0), l(O, null, re(c(k), (r) => (a(), l("div", {
              key: r.id,
              class: "history-item"
            }, [
              e("div", Pe, [
                e("strong", null, f(r.changed_by), 1),
                e("span", Ne, f(X(r.changed_at)), 1)
              ]),
              e("div", He, [
                s[24] || (s[24] = V(" Changed ", -1)),
                e("strong", null, f(Y(r.field_name)), 1),
                e("span", Qe, [
                  s[21] || (s[21] = V(' from "', -1)),
                  e("span", Oe, f(r.old_value), 1),
                  s[22] || (s[22] = V('" to "', -1)),
                  e("span", ze, f(r.new_value), 1),
                  s[23] || (s[23] = V('" ', -1))
                ])
              ])
            ]))), 128))
          ])) : (a(), l("div", je, "No history yet"))
        ]),
        e("div", Re, [
          s[27] || (s[27] = e("h3", null, "Comments", -1)),
          c(w) ? (a(), l("div", Ge, "Loading comments...")) : c(q) && c(q).length > 0 ? (a(), l("div", Je, [
            (a(!0), l(O, null, re(c(q), (r) => (a(), l("div", {
              key: r.id,
              class: "comment-item"
            }, [
              e("div", We, [
                e("strong", null, f(r.created_by), 1),
                e("span", Xe, f(X(r.created_at)), 1)
              ]),
              e("div", {
                class: "comment-text",
                innerHTML: Z(r.comment)
              }, null, 8, Ye)
            ]))), 128))
          ])) : (a(), l("div", Ze, "No comments yet")),
          e("div", et, [
            b(e("textarea", {
              "onUpdate:modelValue": s[12] || (s[12] = (r) => B.value = r),
              placeholder: "Add a comment...",
              rows: "3",
              class: "comment-input",
              onPaste: z
            }, null, 544), [
              [F, B.value]
            ]),
            s[26] || (s[26] = e("small", null, "Paste images from clipboard", -1)),
            e("button", {
              onClick: oe,
              disabled: !B.value.trim(),
              class: "btn-primary"
            }, " Add Comment ", 8, tt)
          ])
        ])
      ])) : le("", !0)
    ]));
  }
}), me = (i, p) => {
  const o = i.__vccOpts || i;
  for (const [u, d] of p)
    o[u] = d;
  return o;
}, nt = /* @__PURE__ */ me(st, [["__scopeId", "data-v-fdc6048d"]]), ot = { class: "tasks-card" }, it = {
  key: 0,
  class: "loading"
}, at = {
  key: 1,
  class: "error"
}, lt = {
  key: 2,
  class: "tasks-container"
}, rt = { class: "tasks-header" }, ut = { class: "tasks-header-actions" }, dt = { class: "tasks-filters" }, ct = { class: "tasks-table-wrapper" }, mt = { class: "tasks-table" }, vt = {
  key: 0,
  class: "no-results"
}, pt = {
  colspan: "6",
  class: "no-results-cell"
}, yt = { class: "no-results-content" }, ft = { class: "no-results-text" }, kt = ["onDblclick"], gt = ["onBlur", "onKeyup"], bt = { key: 1 }, _t = ["onDblclick"], wt = ["onBlur", "onChange"], ht = ["onDblclick"], $t = ["onBlur", "onChange"], Ct = ["onDblclick"], It = ["onBlur", "onKeyup"], Tt = { key: 1 }, Dt = { class: "task-actions" }, Lt = ["onClick"], Vt = ["onClick"], qt = {
  key: 3,
  class: "task-form-container"
}, Ft = { class: "form-body" }, St = { class: "form-group" }, Bt = { class: "form-group" }, Kt = { class: "form-row" }, Ut = { class: "form-group" }, Mt = { class: "form-group" }, xt = { class: "form-group" }, At = { class: "form-actions" }, Et = ["disabled"], Pt = /* @__PURE__ */ ue({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(i, { emit: p }) {
    const o = i, u = p, d = L(""), T = L(""), _ = L("list"), q = L(null), w = L(null), k = L(""), h = L(null), $ = L({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: o.userId
    }), ne = ae(() => ({
      status: T.value || void 0
    })), { data: C, isLoading: g, error: S } = fe(ne), B = _e(), M = ce(), N = he(), D = ae(() => {
      if (!C.value) return [];
      const y = d.value.toLowerCase().trim();
      return y ? C.value.filter((t) => {
        var j, R, G, J, v;
        const n = ((j = t.summary) == null ? void 0 : j.toLowerCase()) || "", A = ((R = t.description) == null ? void 0 : R.toLowerCase()) || "", H = ((G = t.status) == null ? void 0 : G.toLowerCase().replace("_", " ")) || "", Q = ((J = t.priority) == null ? void 0 : J.toLowerCase()) || "", E = ((v = t.assigned_to) == null ? void 0 : v.toLowerCase()) || "";
        return n.includes(y) || A.includes(y) || H.includes(y) || Q.includes(y) || E.includes(y);
      }) : C.value;
    });
    function oe(y) {
      return new Date(y).toLocaleDateString();
    }
    async function X() {
      try {
        await B.mutateAsync($.value), Y(), _.value = "list";
      } catch (y) {
        console.error("Failed to create task:", y);
      }
    }
    function Y() {
      $.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: o.userId
      };
    }
    function Z() {
      Y(), _.value = "create";
    }
    function ie(y) {
      q.value = y, _.value = "detail";
    }
    function z() {
      _.value = "list", q.value = null;
    }
    async function x(y, t) {
      var n;
      w.value = { taskId: y.id, field: t }, k.value = String(y[t] || ""), await de(), (n = h.value) == null || n.focus();
    }
    function m() {
      w.value = null, k.value = "";
    }
    async function s(y, t) {
      if (w.value)
        try {
          await M.mutateAsync({
            id: y.id,
            updates: { [t]: k.value },
            userId: o.userId
            // Add userId
          }), m();
        } catch (n) {
          console.error("Failed to update task:", n);
        }
    }
    async function r(y) {
      if (confirm("Are you sure you want to delete this task?"))
        try {
          await N.mutateAsync(y);
        } catch (t) {
          console.error("Failed to delete task:", t);
        }
    }
    return (y, t) => (a(), l("div", ot, [
      c(g) && !c(C) ? (a(), l("div", it, [...t[13] || (t[13] = [
        e("div", { class: "loading-spinner" }, null, -1),
        V(" Loading tasks... ", -1)
      ])])) : c(S) ? (a(), l("div", at, [
        t[14] || (t[14] = e("h3", null, "Error loading tasks", -1)),
        e("p", null, f(c(S)), 1)
      ])) : _.value === "list" ? (a(), l("div", lt, [
        e("div", rt, [
          e("h2", {
            class: W({ "tasks-header-clickable": o.showHeaderLink }),
            onClick: t[0] || (t[0] = (n) => o.showHeaderLink && u("navigate"))
          }, " Tasks Management ", 2),
          e("div", ut, [
            e("button", {
              class: "btn btn-primary",
              onClick: Z
            }, [...t[15] || (t[15] = [
              e("span", { class: "icon" }, "➕", -1),
              V(" New Task ", -1)
            ])]),
            e("button", {
              class: "btn btn-minimize",
              onClick: t[1] || (t[1] = (n) => u("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        e("div", dt, [
          b(e("input", {
            "onUpdate:modelValue": t[2] || (t[2] = (n) => d.value = n),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [F, d.value]
          ]),
          b(e("select", {
            "onUpdate:modelValue": t[3] || (t[3] = (n) => T.value = n),
            class: "filter-select"
          }, [...t[16] || (t[16] = [
            e("option", { value: "" }, "All Status", -1),
            e("option", { value: "open" }, "Open", -1),
            e("option", { value: "in-progress" }, "In Progress", -1),
            e("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [P, T.value]
          ])
        ]),
        e("div", ct, [
          e("table", mt, [
            t[24] || (t[24] = e("thead", null, [
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
              D.value.length === 0 ? (a(), l("tr", vt, [
                e("td", pt, [
                  e("div", yt, [
                    t[21] || (t[21] = e("span", { class: "no-results-icon" }, "🔍", -1)),
                    e("p", ft, [
                      d.value ? (a(), l(O, { key: 0 }, [
                        t[17] || (t[17] = V(' No tasks found matching "', -1)),
                        e("strong", null, f(d.value), 1),
                        t[18] || (t[18] = V('" ', -1))
                      ], 64)) : T.value ? (a(), l(O, { key: 1 }, [
                        t[19] || (t[19] = V(' No tasks found with status "', -1)),
                        e("strong", null, f(T.value.replace("_", " ")), 1),
                        t[20] || (t[20] = V('" ', -1))
                      ], 64)) : (a(), l(O, { key: 2 }, [
                        V(' No tasks found. Click "New Task" to create one. ')
                      ], 64))
                    ])
                  ])
                ])
              ])) : le("", !0),
              (a(!0), l(O, null, re(D.value, (n) => {
                var A, H, Q, E, j, R, G, J;
                return a(), l("tr", {
                  key: n.id
                }, [
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => x(n, "summary")
                  }, [
                    ((A = w.value) == null ? void 0 : A.taskId) === n.id && ((H = w.value) == null ? void 0 : H.field) === "summary" ? b((a(), l("input", {
                      key: 0,
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: h,
                      "onUpdate:modelValue": t[4] || (t[4] = (v) => k.value = v),
                      type: "text",
                      onBlur: (v) => s(n, "summary"),
                      onKeyup: [
                        K((v) => s(n, "summary"), ["enter"]),
                        K(m, ["escape"])
                      ]
                    }, null, 40, gt)), [
                      [F, k.value]
                    ]) : (a(), l("span", bt, f(n.summary), 1))
                  ], 40, kt),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => x(n, "status")
                  }, [
                    ((Q = w.value) == null ? void 0 : Q.taskId) === n.id && ((E = w.value) == null ? void 0 : E.field) === "status" ? b((a(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": t[5] || (t[5] = (v) => k.value = v),
                      onBlur: (v) => s(n, "status"),
                      onChange: (v) => s(n, "status"),
                      autofocus: ""
                    }, [...t[22] || (t[22] = [
                      e("option", { value: "open" }, "Open", -1),
                      e("option", { value: "in_progress" }, "In Progress", -1),
                      e("option", { value: "completed" }, "Completed", -1)
                    ])], 40, wt)), [
                      [P, k.value]
                    ]) : (a(), l("span", {
                      key: 1,
                      class: W(`status-badge status-${n.status}`)
                    }, f(n.status.replace("_", " ")), 3))
                  ], 40, _t),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => x(n, "priority")
                  }, [
                    ((j = w.value) == null ? void 0 : j.taskId) === n.id && ((R = w.value) == null ? void 0 : R.field) === "priority" ? b((a(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": t[6] || (t[6] = (v) => k.value = v),
                      onBlur: (v) => s(n, "priority"),
                      onChange: (v) => s(n, "priority"),
                      autofocus: ""
                    }, [...t[23] || (t[23] = [
                      e("option", { value: "low" }, "Low", -1),
                      e("option", { value: "medium" }, "Medium", -1),
                      e("option", { value: "high" }, "High", -1)
                    ])], 40, $t)), [
                      [P, k.value]
                    ]) : (a(), l("span", {
                      key: 1,
                      class: W(`priority-badge priority-${n.priority}`)
                    }, f(n.priority), 3))
                  ], 40, ht),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => x(n, "assigned_to")
                  }, [
                    ((G = w.value) == null ? void 0 : G.taskId) === n.id && ((J = w.value) == null ? void 0 : J.field) === "assigned_to" ? b((a(), l("input", {
                      key: 0,
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: h,
                      "onUpdate:modelValue": t[7] || (t[7] = (v) => k.value = v),
                      type: "text",
                      onBlur: (v) => s(n, "assigned_to"),
                      onKeyup: [
                        K((v) => s(n, "assigned_to"), ["enter"]),
                        K(m, ["escape"])
                      ]
                    }, null, 40, It)), [
                      [F, k.value]
                    ]) : (a(), l("span", Tt, f(n.assigned_to || "-"), 1))
                  ], 40, Ct),
                  e("td", null, f(oe(n.created_at)), 1),
                  e("td", Dt, [
                    e("button", {
                      class: "btn btn-icon",
                      onClick: (v) => ie(n.id),
                      title: "View details"
                    }, " 👁️ ", 8, Lt),
                    e("button", {
                      class: "btn btn-icon btn-danger",
                      onClick: (v) => r(n.id),
                      title: "Delete task"
                    }, " 🗑️ ", 8, Vt)
                  ])
                ]);
              }), 128))
            ])
          ])
        ])
      ])) : _.value === "create" ? (a(), l("div", qt, [
        e("div", { class: "form-header" }, [
          e("button", {
            class: "btn btn-back",
            onClick: z
          }, " ← Back to Tasks "),
          t[25] || (t[25] = e("h2", null, "Create New Task", -1))
        ]),
        e("div", Ft, [
          e("div", St, [
            t[26] || (t[26] = e("label", { for: "task-summary" }, "Summary *", -1)),
            b(e("input", {
              id: "task-summary",
              "onUpdate:modelValue": t[8] || (t[8] = (n) => $.value.summary = n),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [F, $.value.summary]
            ])
          ]),
          e("div", Bt, [
            t[27] || (t[27] = e("label", { for: "task-description" }, "Description", -1)),
            b(e("textarea", {
              id: "task-description",
              "onUpdate:modelValue": t[9] || (t[9] = (n) => $.value.description = n),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [F, $.value.description]
            ])
          ]),
          e("div", Kt, [
            e("div", Ut, [
              t[29] || (t[29] = e("label", { for: "task-status" }, "Status", -1)),
              b(e("select", {
                id: "task-status",
                "onUpdate:modelValue": t[10] || (t[10] = (n) => $.value.status = n)
              }, [...t[28] || (t[28] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in_progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [P, $.value.status]
              ])
            ]),
            e("div", Mt, [
              t[31] || (t[31] = e("label", { for: "task-priority" }, "Priority", -1)),
              b(e("select", {
                id: "task-priority",
                "onUpdate:modelValue": t[11] || (t[11] = (n) => $.value.priority = n)
              }, [...t[30] || (t[30] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1)
              ])], 512), [
                [P, $.value.priority]
              ])
            ])
          ]),
          e("div", xt, [
            t[32] || (t[32] = e("label", { for: "task-assigned" }, "Assigned To", -1)),
            b(e("input", {
              id: "task-assigned",
              "onUpdate:modelValue": t[12] || (t[12] = (n) => $.value.assigned_to = n),
              type: "text",
              placeholder: "Enter assignee"
            }, null, 512), [
              [F, $.value.assigned_to]
            ])
          ]),
          e("div", At, [
            e("button", {
              class: "btn btn-cancel",
              onClick: z
            }, "Cancel"),
            e("button", {
              class: "btn btn-primary",
              onClick: X,
              disabled: !$.value.summary.trim()
            }, " Create Task ", 8, Et)
          ])
        ])
      ])) : _.value === "detail" && q.value ? (a(), pe(nt, {
        key: 4,
        "task-id": q.value,
        "user-id": i.userId,
        onClose: z
      }, null, 8, ["task-id", "user-id"])) : le("", !0)
    ]));
  }
}), Qt = /* @__PURE__ */ me(Pt, [["__scopeId", "data-v-707a3627"]]);
export {
  nt as TaskDetail,
  Qt as Tasks
};
