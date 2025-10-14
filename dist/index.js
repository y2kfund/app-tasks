import { inject as vt, defineComponent as rt, ref as C, createElementBlock as r, openBlock as i, createElementVNode as t, createCommentVNode as ut, unref as c, toDisplayString as f, withDirectives as g, withKeys as q, vModelText as V, vModelSelect as x, normalizeClass as N, Fragment as et, renderList as st, createTextVNode as E, nextTick as dt, computed as lt, createBlock as pt } from "vue";
import { useQuery as J, useQueryClient as W, useMutation as X } from "@tanstack/vue-query";
const yt = Symbol.for("y2kfund.supabase");
function B() {
  const o = vt(yt, null);
  if (!o) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return o;
}
const w = {
  all: ["tasks"],
  list: (o) => [...w.all, "list", o],
  detail: (o) => [...w.all, "detail", o],
  comments: (o) => [...w.all, "comments", o],
  history: (o) => [...w.all, "history", o]
};
function ft(o) {
  const v = B();
  return J({
    queryKey: w.list(o),
    queryFn: async () => {
      let l = v.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      o != null && o.status && (l = l.eq("status", o.status)), o != null && o.search && (l = l.or(`summary.ilike.%${o.search}%,description.ilike.%${o.search}%`));
      const { data: u, error: d } = await l;
      if (d) throw d;
      return u;
    }
  });
}
function kt(o) {
  const v = B();
  return J({
    queryKey: w.detail(o),
    queryFn: async () => {
      const { data: l, error: u } = await v.schema("hf").from("tasks").select("*").eq("id", o).single();
      if (u) throw u;
      return l;
    }
  });
}
function gt(o) {
  const v = B();
  return J({
    queryKey: w.comments(o),
    queryFn: async () => {
      const { data: l, error: u } = await v.schema("hf").from("task_comments").select("*").eq("task_id", o).order("created_at", { ascending: !0 });
      if (u) throw u;
      return l;
    }
  });
}
function bt(o) {
  const v = B();
  return J({
    queryKey: w.history(o),
    queryFn: async () => {
      const { data: l, error: u } = await v.schema("hf").from("task_history").select("*").eq("task_id", o).order("changed_at", { ascending: !1 });
      if (u) throw u;
      return l;
    }
  });
}
function _t() {
  const o = B(), v = W();
  return X({
    mutationFn: async (l) => {
      const { data: u, error: d } = await o.schema("hf").from("tasks").insert(l).select().single();
      if (d) throw d;
      return u;
    },
    onSuccess: () => {
      v.invalidateQueries({ queryKey: w.all });
    }
  });
}
function ct() {
  const o = B(), v = W();
  return X({
    mutationFn: async ({
      id: l,
      updates: u,
      userId: d
    }) => {
      const { data: F } = await o.schema("hf").from("tasks").select("*").eq("id", l).single(), { data: $, error: I } = await o.schema("hf").from("tasks").update({ ...u, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", l).select().single();
      if (I) throw I;
      if (F) {
        const b = Object.entries(u).filter(([y]) => y !== "updated_at").map(([y, K]) => ({
          task_id: l,
          field_name: y,
          old_value: String(F[y] || ""),
          new_value: String(K || ""),
          changed_by: d
        }));
        b.length > 0 && await o.schema("hf").from("task_history").insert(b);
      }
      return $;
    },
    onSuccess: (l, u) => {
      v.invalidateQueries({ queryKey: w.all }), v.invalidateQueries({ queryKey: w.detail(u.id) }), v.invalidateQueries({ queryKey: w.history(u.id) });
    }
  });
}
function ht() {
  const o = B(), v = W();
  return X({
    mutationFn: async (l) => {
      const { error: u } = await o.schema("hf").from("tasks").delete().eq("id", l);
      if (u) throw u;
    },
    onSuccess: () => {
      v.invalidateQueries({ queryKey: w.all });
    }
  });
}
function wt() {
  const o = B(), v = W();
  return X({
    mutationFn: async (l) => {
      const { data: u, error: d } = await o.schema("hf").from("task_comments").insert(l).select().single();
      if (d) throw d;
      return u;
    },
    onSuccess: (l, u) => {
      v.invalidateQueries({ queryKey: w.comments(u.task_id) });
    }
  });
}
const $t = { class: "detail-container" }, Ct = { class: "detail-header" }, It = {
  key: 0,
  class: "loading"
}, Dt = {
  key: 1,
  class: "error"
}, Tt = {
  key: 2,
  class: "detail-content"
}, Vt = { class: "task-info" }, Lt = { class: "info-row" }, St = {
  key: 1,
  class: "info-value"
}, qt = { class: "info-row" }, Ft = ["innerHTML"], Bt = { class: "info-row" }, Kt = { class: "info-row" }, Ut = { class: "info-row" }, Mt = {
  key: 1,
  class: "info-value"
}, xt = { class: "history-section" }, At = {
  key: 0,
  class: "loading"
}, Et = {
  key: 1,
  class: "history-list"
}, Pt = { class: "history-meta" }, Ht = { class: "history-date" }, Qt = { class: "history-change" }, Nt = { class: "change-values" }, Ot = { class: "old-value" }, zt = { class: "new-value" }, jt = {
  key: 2,
  class: "no-history"
}, Rt = { class: "comments-section" }, Gt = {
  key: 0,
  class: "loading"
}, Jt = {
  key: 1,
  class: "comments-list"
}, Wt = { class: "comment-meta" }, Xt = { class: "comment-date" }, Yt = ["innerHTML"], Zt = {
  key: 2,
  class: "no-comments"
}, te = { class: "add-comment" }, ee = ["disabled"], se = /* @__PURE__ */ rt({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(o, { emit: v }) {
    const l = o, u = v, { data: d, isLoading: F, error: $ } = kt(l.taskId), { data: I, isLoading: b } = gt(l.taskId), { data: y, isLoading: K } = bt(l.taskId), h = ct(), Y = wt(), D = C(null), k = C(""), L = C(null), S = C("");
    async function U(m, e) {
      D.value = m, k.value = e, await dt();
      const a = L.value;
      a && typeof a.focus == "function" && a.focus();
    }
    function A() {
      D.value = null, k.value = "";
    }
    async function T() {
      if (!D.value || !d.value) return;
      const m = D.value, e = d.value[m];
      if (k.value !== e)
        try {
          await h.mutateAsync({
            id: l.taskId,
            updates: { [m]: k.value },
            userId: l.userId
          });
        } catch (a) {
          console.error("Failed to update task:", a);
        }
      A();
    }
    async function Z() {
      if (S.value.trim())
        try {
          await Y.mutateAsync({
            task_id: l.taskId,
            comment: S.value,
            created_by: l.userId
          }), S.value = "";
        } catch (m) {
          console.error("Failed to add comment:", m);
        }
    }
    function O(m) {
      return new Date(m).toLocaleString();
    }
    function z(m) {
      return m.replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
    }
    function j(m) {
      return m.replace(/!\[.*?\]\((data:image\/[^)]+)\)/g, '<img src="$1" style="max-width: 100%; margin: 0.5rem 0;" />');
    }
    async function tt(m) {
      await M(m, (e) => {
        k.value += `
![image](${e})
`;
      });
    }
    async function P(m) {
      await M(m, (e) => {
        S.value += `
![image](${e})
`;
      });
    }
    async function M(m, e) {
      var _;
      const a = (_ = m.clipboardData) == null ? void 0 : _.items;
      if (a) {
        for (const s of a)
          if (s.type.indexOf("image") !== -1) {
            m.preventDefault();
            const n = s.getAsFile();
            if (n) {
              const H = new FileReader();
              H.onload = (R) => {
                var Q;
                const G = (Q = R.target) == null ? void 0 : Q.result;
                e(G);
              }, H.readAsDataURL(n);
            }
          }
      }
    }
    return (m, e) => (i(), r("div", $t, [
      t("div", Ct, [
        t("button", {
          class: "btn btn-back",
          onClick: e[0] || (e[0] = (a) => u("close"))
        }, " ← Back to Tasks "),
        e[13] || (e[13] = t("h2", null, "Task Details", -1)),
        t("button", {
          class: "btn btn-danger",
          onClick: e[1] || (e[1] = //@ts-ignore
          (...a) => m.deleteTask && m.deleteTask(...a))
        }, "Delete Task")
      ]),
      c(F) ? (i(), r("div", It, "Loading task details...")) : c($) ? (i(), r("div", Dt, "Error: " + f(c($)), 1)) : c(d) ? (i(), r("div", Tt, [
        t("div", Vt, [
          t("div", Lt, [
            e[14] || (e[14] = t("label", null, "Summary", -1)),
            t("div", {
              onDblclick: e[3] || (e[3] = (a) => U("summary", c(d).summary))
            }, [
              D.value === "summary" ? g((i(), r("input", {
                key: 0,
                "onUpdate:modelValue": e[2] || (e[2] = (a) => k.value = a),
                onBlur: T,
                onKeyup: [
                  q(T, ["enter"]),
                  q(A, ["esc"])
                ],
                class: "inline-edit",
                ref_key: "editInput",
                ref: L
              }, null, 544)), [
                [V, k.value]
              ]) : (i(), r("div", St, f(c(d).summary), 1))
            ], 32)
          ]),
          t("div", qt, [
            e[15] || (e[15] = t("label", null, "Description", -1)),
            t("div", {
              onDblclick: e[5] || (e[5] = (a) => U("description", c(d).description || ""))
            }, [
              D.value === "description" ? g((i(), r("textarea", {
                key: 0,
                "onUpdate:modelValue": e[4] || (e[4] = (a) => k.value = a),
                onBlur: T,
                onKeyup: q(A, ["esc"]),
                onPaste: tt,
                class: "inline-edit",
                rows: "4",
                ref_key: "editInput",
                ref: L
              }, null, 544)), [
                [V, k.value]
              ]) : (i(), r("div", {
                key: 1,
                class: "info-value",
                innerHTML: j(c(d).description || "")
              }, null, 8, Ft))
            ], 32)
          ]),
          t("div", Bt, [
            e[17] || (e[17] = t("label", null, "Status", -1)),
            t("div", {
              onDblclick: e[7] || (e[7] = (a) => U("status", c(d).status))
            }, [
              D.value === "status" ? g((i(), r("select", {
                key: 0,
                "onUpdate:modelValue": e[6] || (e[6] = (a) => k.value = a),
                onBlur: T,
                onChange: T,
                class: "inline-edit",
                ref_key: "editInput",
                ref: L
              }, [...e[16] || (e[16] = [
                t("option", { value: "open" }, "Open", -1),
                t("option", { value: "in-progress" }, "In Progress", -1),
                t("option", { value: "completed" }, "Completed", -1),
                t("option", { value: "closed" }, "Closed", -1)
              ])], 544)), [
                [x, k.value]
              ]) : (i(), r("span", {
                key: 1,
                class: N(`status-badge status-${c(d).status}`)
              }, f(c(d).status), 3))
            ], 32)
          ]),
          t("div", Kt, [
            e[19] || (e[19] = t("label", null, "Priority", -1)),
            t("div", {
              onDblclick: e[9] || (e[9] = (a) => U("priority", c(d).priority))
            }, [
              D.value === "priority" ? g((i(), r("select", {
                key: 0,
                "onUpdate:modelValue": e[8] || (e[8] = (a) => k.value = a),
                onBlur: T,
                onChange: T,
                class: "inline-edit",
                ref_key: "editInput",
                ref: L
              }, [...e[18] || (e[18] = [
                t("option", { value: "low" }, "Low", -1),
                t("option", { value: "medium" }, "Medium", -1),
                t("option", { value: "high" }, "High", -1),
                t("option", { value: "critical" }, "Critical", -1)
              ])], 544)), [
                [x, k.value]
              ]) : (i(), r("span", {
                key: 1,
                class: N(`priority-badge priority-${c(d).priority}`)
              }, f(c(d).priority), 3))
            ], 32)
          ]),
          t("div", Ut, [
            e[20] || (e[20] = t("label", null, "Assigned To", -1)),
            t("div", {
              onDblclick: e[11] || (e[11] = (a) => U("assigned_to", c(d).assigned_to || ""))
            }, [
              D.value === "assigned_to" ? g((i(), r("input", {
                key: 0,
                "onUpdate:modelValue": e[10] || (e[10] = (a) => k.value = a),
                onBlur: T,
                onKeyup: [
                  q(T, ["enter"]),
                  q(A, ["esc"])
                ],
                class: "inline-edit",
                ref_key: "editInput",
                ref: L
              }, null, 544)), [
                [V, k.value]
              ]) : (i(), r("div", Mt, f(c(d).assigned_to || "-"), 1))
            ], 32)
          ])
        ]),
        t("div", xt, [
          e[25] || (e[25] = t("h3", null, "History", -1)),
          c(K) ? (i(), r("div", At, "Loading history...")) : c(y) && c(y).length > 0 ? (i(), r("div", Et, [
            (i(!0), r(et, null, st(c(y), (a) => (i(), r("div", {
              key: a.id,
              class: "history-item"
            }, [
              t("div", Pt, [
                t("strong", null, f(a.changed_by), 1),
                t("span", Ht, f(O(a.changed_at)), 1)
              ]),
              t("div", Qt, [
                e[24] || (e[24] = E(" Changed ", -1)),
                t("strong", null, f(z(a.field_name)), 1),
                t("span", Nt, [
                  e[21] || (e[21] = E(' from "', -1)),
                  t("span", Ot, f(a.old_value), 1),
                  e[22] || (e[22] = E('" to "', -1)),
                  t("span", zt, f(a.new_value), 1),
                  e[23] || (e[23] = E('" ', -1))
                ])
              ])
            ]))), 128))
          ])) : (i(), r("div", jt, "No history yet"))
        ]),
        t("div", Rt, [
          e[27] || (e[27] = t("h3", null, "Comments", -1)),
          c(b) ? (i(), r("div", Gt, "Loading comments...")) : c(I) && c(I).length > 0 ? (i(), r("div", Jt, [
            (i(!0), r(et, null, st(c(I), (a) => (i(), r("div", {
              key: a.id,
              class: "comment-item"
            }, [
              t("div", Wt, [
                t("strong", null, f(a.created_by), 1),
                t("span", Xt, f(O(a.created_at)), 1)
              ]),
              t("div", {
                class: "comment-text",
                innerHTML: j(a.comment)
              }, null, 8, Yt)
            ]))), 128))
          ])) : (i(), r("div", Zt, "No comments yet")),
          t("div", te, [
            g(t("textarea", {
              "onUpdate:modelValue": e[12] || (e[12] = (a) => S.value = a),
              placeholder: "Add a comment...",
              rows: "3",
              class: "comment-input",
              onPaste: P
            }, null, 544), [
              [V, S.value]
            ]),
            e[26] || (e[26] = t("small", null, "Paste images from clipboard", -1)),
            t("button", {
              onClick: Z,
              disabled: !S.value.trim(),
              class: "btn-primary"
            }, " Add Comment ", 8, ee)
          ])
        ])
      ])) : ut("", !0)
    ]));
  }
}), mt = (o, v) => {
  const l = o.__vccOpts || o;
  for (const [u, d] of v)
    l[u] = d;
  return l;
}, ne = /* @__PURE__ */ mt(se, [["__scopeId", "data-v-096af415"]]), oe = { class: "tasks-card" }, ae = {
  key: 0,
  class: "loading"
}, ie = {
  key: 1,
  class: "error"
}, le = {
  key: 2,
  class: "tasks-container"
}, re = { class: "tasks-header" }, ue = { class: "tasks-header-actions" }, de = { class: "tasks-filters" }, ce = { class: "tasks-table-wrapper" }, me = { class: "tasks-table" }, ve = ["onDblclick"], pe = ["onBlur", "onKeyup"], ye = { key: 1 }, fe = ["onDblclick"], ke = ["onBlur", "onChange"], ge = ["onDblclick"], be = ["onBlur", "onChange"], _e = ["onDblclick"], he = ["onBlur", "onKeyup"], we = { key: 1 }, $e = { class: "task-actions" }, Ce = ["onClick"], Ie = ["onClick"], De = {
  key: 3,
  class: "task-form-container"
}, Te = { class: "form-body" }, Ve = { class: "form-group" }, Le = { class: "form-group" }, Se = { class: "form-row" }, qe = { class: "form-group" }, Fe = { class: "form-group" }, Be = { class: "form-group" }, Ke = { class: "form-actions" }, Ue = ["disabled"], Me = /* @__PURE__ */ rt({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(o, { emit: v }) {
    const l = o, u = v, d = C(""), F = C(""), $ = C("list"), I = C(null), b = C(null), y = C(""), K = C(null), h = C({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: l.userId
    }), Y = lt(() => ({
      status: F.value || void 0,
      search: d.value || void 0
    })), { data: D, isLoading: k, error: L } = ft(Y.value), S = _t(), U = ct(), A = ht(), T = lt(() => D.value || []);
    function Z(_) {
      return new Date(_).toLocaleDateString();
    }
    async function O() {
      try {
        await S.mutateAsync(h.value), z(), $.value = "list";
      } catch (_) {
        console.error("Failed to create task:", _);
      }
    }
    function z() {
      h.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: l.userId
      };
    }
    function j() {
      z(), $.value = "create";
    }
    function tt(_) {
      I.value = _, $.value = "detail";
    }
    function P() {
      $.value = "list", I.value = null;
    }
    async function M(_, s) {
      var n;
      b.value = { taskId: _.id, field: s }, y.value = String(_[s] || ""), await dt(), (n = K.value) == null || n.focus();
    }
    function m() {
      b.value = null, y.value = "";
    }
    async function e(_, s) {
      if (b.value)
        try {
          await U.mutateAsync({
            id: _.id,
            [s]: y.value
          }), m();
        } catch (n) {
          console.error("Failed to update task:", n);
        }
    }
    async function a(_) {
      if (confirm("Are you sure you want to delete this task?"))
        try {
          await A.mutateAsync(_);
        } catch (s) {
          console.error("Failed to delete task:", s);
        }
    }
    return (_, s) => (i(), r("div", oe, [
      c(k) ? (i(), r("div", ae, [...s[13] || (s[13] = [
        t("div", { class: "loading-spinner" }, null, -1),
        E(" Loading tasks... ", -1)
      ])])) : c(L) ? (i(), r("div", ie, [
        s[14] || (s[14] = t("h3", null, "Error loading tasks", -1)),
        t("p", null, f(c(L)), 1)
      ])) : $.value === "list" ? (i(), r("div", le, [
        t("div", re, [
          t("h2", {
            class: N({ "tasks-header-clickable": l.showHeaderLink }),
            onClick: s[0] || (s[0] = (n) => l.showHeaderLink && u("navigate"))
          }, " Tasks Management ", 2),
          t("div", ue, [
            t("button", {
              class: "btn btn-primary",
              onClick: j
            }, [...s[15] || (s[15] = [
              t("span", { class: "icon" }, "➕", -1),
              E(" New Task ", -1)
            ])]),
            t("button", {
              class: "btn btn-minimize",
              onClick: s[1] || (s[1] = (n) => u("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        t("div", de, [
          g(t("input", {
            "onUpdate:modelValue": s[2] || (s[2] = (n) => d.value = n),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [V, d.value]
          ]),
          g(t("select", {
            "onUpdate:modelValue": s[3] || (s[3] = (n) => F.value = n),
            class: "filter-select"
          }, [...s[16] || (s[16] = [
            t("option", { value: "" }, "All Status", -1),
            t("option", { value: "open" }, "Open", -1),
            t("option", { value: "in_progress" }, "In Progress", -1),
            t("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [x, F.value]
          ])
        ]),
        t("div", ce, [
          t("table", me, [
            s[19] || (s[19] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Summary"),
                t("th", null, "Status"),
                t("th", null, "Priority"),
                t("th", null, "Assigned To"),
                t("th", null, "Created"),
                t("th", null, "Actions")
              ])
            ], -1)),
            t("tbody", null, [
              (i(!0), r(et, null, st(T.value, (n) => {
                var H, R, G, Q, nt, ot, at, it;
                return i(), r("tr", {
                  key: n.id
                }, [
                  t("td", {
                    class: "editable-cell",
                    onDblclick: (p) => M(n, "summary")
                  }, [
                    ((H = b.value) == null ? void 0 : H.taskId) === n.id && ((R = b.value) == null ? void 0 : R.field) === "summary" ? g((i(), r("input", {
                      key: 0,
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: K,
                      "onUpdate:modelValue": s[4] || (s[4] = (p) => y.value = p),
                      type: "text",
                      onBlur: (p) => e(n, "summary"),
                      onKeyup: [
                        q((p) => e(n, "summary"), ["enter"]),
                        q(m, ["escape"])
                      ]
                    }, null, 40, pe)), [
                      [V, y.value]
                    ]) : (i(), r("span", ye, f(n.summary), 1))
                  ], 40, ve),
                  t("td", {
                    class: "editable-cell",
                    onDblclick: (p) => M(n, "status")
                  }, [
                    ((G = b.value) == null ? void 0 : G.taskId) === n.id && ((Q = b.value) == null ? void 0 : Q.field) === "status" ? g((i(), r("select", {
                      key: 0,
                      "onUpdate:modelValue": s[5] || (s[5] = (p) => y.value = p),
                      onBlur: (p) => e(n, "status"),
                      onChange: (p) => e(n, "status"),
                      autofocus: ""
                    }, [...s[17] || (s[17] = [
                      t("option", { value: "open" }, "Open", -1),
                      t("option", { value: "in_progress" }, "In Progress", -1),
                      t("option", { value: "completed" }, "Completed", -1)
                    ])], 40, ke)), [
                      [x, y.value]
                    ]) : (i(), r("span", {
                      key: 1,
                      class: N(`status-badge status-${n.status}`)
                    }, f(n.status.replace("_", " ")), 3))
                  ], 40, fe),
                  t("td", {
                    class: "editable-cell",
                    onDblclick: (p) => M(n, "priority")
                  }, [
                    ((nt = b.value) == null ? void 0 : nt.taskId) === n.id && ((ot = b.value) == null ? void 0 : ot.field) === "priority" ? g((i(), r("select", {
                      key: 0,
                      "onUpdate:modelValue": s[6] || (s[6] = (p) => y.value = p),
                      onBlur: (p) => e(n, "priority"),
                      onChange: (p) => e(n, "priority"),
                      autofocus: ""
                    }, [...s[18] || (s[18] = [
                      t("option", { value: "low" }, "Low", -1),
                      t("option", { value: "medium" }, "Medium", -1),
                      t("option", { value: "high" }, "High", -1)
                    ])], 40, be)), [
                      [x, y.value]
                    ]) : (i(), r("span", {
                      key: 1,
                      class: N(`priority-badge priority-${n.priority}`)
                    }, f(n.priority), 3))
                  ], 40, ge),
                  t("td", {
                    class: "editable-cell",
                    onDblclick: (p) => M(n, "assigned_to")
                  }, [
                    ((at = b.value) == null ? void 0 : at.taskId) === n.id && ((it = b.value) == null ? void 0 : it.field) === "assigned_to" ? g((i(), r("input", {
                      key: 0,
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: K,
                      "onUpdate:modelValue": s[7] || (s[7] = (p) => y.value = p),
                      type: "text",
                      onBlur: (p) => e(n, "assigned_to"),
                      onKeyup: [
                        q((p) => e(n, "assigned_to"), ["enter"]),
                        q(m, ["escape"])
                      ]
                    }, null, 40, he)), [
                      [V, y.value]
                    ]) : (i(), r("span", we, f(n.assigned_to || "-"), 1))
                  ], 40, _e),
                  t("td", null, f(Z(n.created_at)), 1),
                  t("td", $e, [
                    t("button", {
                      class: "btn btn-icon",
                      onClick: (p) => tt(n.id),
                      title: "View details"
                    }, " 👁️ ", 8, Ce),
                    t("button", {
                      class: "btn btn-icon btn-danger",
                      onClick: (p) => a(n.id),
                      title: "Delete task"
                    }, " 🗑️ ", 8, Ie)
                  ])
                ]);
              }), 128))
            ])
          ])
        ])
      ])) : $.value === "create" ? (i(), r("div", De, [
        t("div", { class: "form-header" }, [
          t("button", {
            class: "btn btn-back",
            onClick: P
          }, " ← Back to Tasks "),
          s[20] || (s[20] = t("h2", null, "Create New Task", -1))
        ]),
        t("div", Te, [
          t("div", Ve, [
            s[21] || (s[21] = t("label", { for: "task-summary" }, "Summary *", -1)),
            g(t("input", {
              id: "task-summary",
              "onUpdate:modelValue": s[8] || (s[8] = (n) => h.value.summary = n),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [V, h.value.summary]
            ])
          ]),
          t("div", Le, [
            s[22] || (s[22] = t("label", { for: "task-description" }, "Description", -1)),
            g(t("textarea", {
              id: "task-description",
              "onUpdate:modelValue": s[9] || (s[9] = (n) => h.value.description = n),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [V, h.value.description]
            ])
          ]),
          t("div", Se, [
            t("div", qe, [
              s[24] || (s[24] = t("label", { for: "task-status" }, "Status", -1)),
              g(t("select", {
                id: "task-status",
                "onUpdate:modelValue": s[10] || (s[10] = (n) => h.value.status = n)
              }, [...s[23] || (s[23] = [
                t("option", { value: "open" }, "Open", -1),
                t("option", { value: "in_progress" }, "In Progress", -1),
                t("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [x, h.value.status]
              ])
            ]),
            t("div", Fe, [
              s[26] || (s[26] = t("label", { for: "task-priority" }, "Priority", -1)),
              g(t("select", {
                id: "task-priority",
                "onUpdate:modelValue": s[11] || (s[11] = (n) => h.value.priority = n)
              }, [...s[25] || (s[25] = [
                t("option", { value: "low" }, "Low", -1),
                t("option", { value: "medium" }, "Medium", -1),
                t("option", { value: "high" }, "High", -1)
              ])], 512), [
                [x, h.value.priority]
              ])
            ])
          ]),
          t("div", Be, [
            s[27] || (s[27] = t("label", { for: "task-assigned" }, "Assigned To", -1)),
            g(t("input", {
              id: "task-assigned",
              "onUpdate:modelValue": s[12] || (s[12] = (n) => h.value.assigned_to = n),
              type: "text",
              placeholder: "Enter assignee"
            }, null, 512), [
              [V, h.value.assigned_to]
            ])
          ]),
          t("div", Ke, [
            t("button", {
              class: "btn btn-cancel",
              onClick: P
            }, "Cancel"),
            t("button", {
              class: "btn btn-primary",
              onClick: O,
              disabled: !h.value.summary.trim()
            }, " Create Task ", 8, Ue)
          ])
        ])
      ])) : $.value === "detail" && I.value ? (i(), pt(ne, {
        key: 4,
        "task-id": I.value,
        "user-id": o.userId,
        onClose: P
      }, null, 8, ["task-id", "user-id"])) : ut("", !0)
    ]));
  }
}), Ee = /* @__PURE__ */ mt(Me, [["__scopeId", "data-v-5178812b"]]);
export {
  ne as TaskDetail,
  Ee as Tasks
};
