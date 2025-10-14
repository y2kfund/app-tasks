import { inject as ke, computed as ce, unref as u, defineComponent as me, ref as L, createElementBlock as l, openBlock as a, createElementVNode as e, createCommentVNode as ie, toDisplayString as p, withDirectives as g, withKeys as te, vModelText as N, vModelSelect as F, normalizeClass as se, Fragment as B, renderList as R, createTextVNode as D, nextTick as ve, createBlock as ge } from "vue";
import { useQuery as ne, useQueryClient as ae, useMutation as le } from "@tanstack/vue-query";
const be = Symbol.for("y2kfund.supabase");
function M() {
  const r = ke(be, null);
  if (!r) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return r;
}
const C = {
  all: ["tasks"],
  list: (r) => [...C.all, "list", r],
  detail: (r) => [...C.all, "detail", r],
  comments: (r) => [...C.all, "comments", r],
  history: (r) => [...C.all, "history", r]
};
function _e(r) {
  const y = M();
  return ne({
    queryKey: ce(() => {
      const i = r ? u(r) : {};
      return C.list(i);
    }),
    queryFn: async () => {
      const i = r ? u(r) : {};
      let d = y.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (i != null && i.status && (d = d.eq("status", i.status)), i != null && i.search && i.search.trim()) {
        const b = i.search.trim();
        d = d.or(`summary.ilike.%${b}%,description.ilike.%${b}%`);
      }
      const { data: c, error: T } = await d;
      if (T) throw T;
      return c;
    }
  });
}
function we(r) {
  const y = M();
  return ne({
    queryKey: C.detail(r),
    queryFn: async () => {
      const { data: i, error: d } = await y.schema("hf").from("tasks").select("*").eq("id", r).single();
      if (d) throw d;
      return i;
    },
    enabled: !!r
  });
}
function he(r) {
  const y = M();
  return ne({
    queryKey: C.comments(r),
    queryFn: async () => {
      const { data: i, error: d } = await y.schema("hf").from("task_comments").select("*").eq("task_id", r).order("created_at", { ascending: !1 });
      if (d) throw d;
      return i;
    },
    enabled: !!r
  });
}
function $e(r) {
  const y = M();
  return ne({
    queryKey: C.history(r),
    queryFn: async () => {
      const { data: i, error: d } = await y.schema("hf").from("task_history").select("*").eq("task_id", r).order("changed_at", { ascending: !1 });
      if (d) throw d;
      return i;
    },
    enabled: !!r
  });
}
function Ce() {
  const r = M(), y = ae();
  return le({
    mutationFn: async (i) => {
      const { data: d, error: c } = await r.schema("hf").from("tasks").insert(i).select().single();
      if (c) throw c;
      return d;
    },
    onSuccess: () => {
      y.invalidateQueries({ queryKey: C.all });
    }
  });
}
function ye() {
  const r = M(), y = ae();
  return le({
    mutationFn: async ({
      id: i,
      updates: d,
      userId: c
    }) => {
      const { data: T, error: b } = await r.schema("hf").from("tasks").select("*").eq("id", i).single();
      if (b) throw b;
      const { data: V, error: _ } = await r.schema("hf").from("tasks").update(d).eq("id", i).select().single();
      if (_) throw _;
      const f = Object.keys(d).filter((h) => T[h] !== d[h]).map((h) => ({
        task_id: i,
        field_name: h,
        old_value: String(T[h] || ""),
        new_value: String(d[h] || ""),
        changed_by: c
      }));
      if (f.length > 0) {
        const { error: h } = await r.schema("hf").from("task_history").insert(f);
        h && console.error("Failed to save history:", h);
      }
      return V;
    },
    onSuccess: (i) => {
      y.invalidateQueries({ queryKey: C.all }), y.invalidateQueries({ queryKey: C.detail(i.id) }), y.invalidateQueries({ queryKey: C.history(i.id) });
    }
  });
}
function Te() {
  const r = M(), y = ae();
  return le({
    mutationFn: async (i) => {
      const { data: d, error: c } = await r.schema("hf").from("task_comments").insert(i).select().single();
      if (c) throw c;
      return d;
    },
    onSuccess: (i) => {
      y.invalidateQueries({ queryKey: C.comments(i.task_id) });
    }
  });
}
function Le() {
  const r = M(), y = ae();
  return le({
    mutationFn: async (i) => {
      await r.schema("hf").from("task_comments").delete().eq("task_id", i), await r.schema("hf").from("task_history").delete().eq("task_id", i);
      const { error: d } = await r.schema("hf").from("tasks").delete().eq("id", i);
      if (d) throw d;
      return i;
    },
    onSuccess: () => {
      y.invalidateQueries({ queryKey: C.all });
    }
  });
}
function pe() {
  const r = M();
  return ne({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: y, error: i } = await r.from("users_view").select("id, email, name").order("email");
      if (i) throw i;
      return (y || []).map((d) => ({
        id: d.id,
        email: d.email,
        name: d.name || d.email
      }));
    },
    staleTime: 5 * 60 * 1e3
  });
}
const Ie = { class: "detail-container" }, De = { class: "detail-header" }, qe = {
  key: 0,
  class: "loading"
}, Ve = {
  key: 1,
  class: "error"
}, Fe = {
  key: 2,
  class: "detail-content"
}, Ue = { class: "task-info" }, Se = { class: "info-row" }, Be = {
  key: 1,
  class: "info-value"
}, Me = { class: "info-row" }, xe = ["innerHTML"], Ke = { class: "info-row" }, Ae = { class: "info-row" }, Ee = { class: "info-row" }, Ne = ["disabled"], Pe = ["value"], He = {
  key: 1,
  class: "info-value"
}, Qe = { class: "history-section" }, Oe = { class: "expand-icon" }, ze = { key: 0 }, je = {
  key: 0,
  class: "loading"
}, Re = {
  key: 1,
  class: "history-list"
}, Ge = { class: "history-meta" }, Je = { class: "history-date" }, We = { class: "history-change" }, Xe = { class: "change-values" }, Ye = { class: "old-value" }, Ze = { class: "new-value" }, et = {
  key: 2,
  class: "no-history"
}, tt = { class: "comments-section" }, st = {
  key: 0,
  class: "loading"
}, nt = {
  key: 1,
  class: "comments-list"
}, ot = { class: "comment-meta" }, it = { class: "comment-date" }, at = ["innerHTML"], lt = {
  key: 2,
  class: "no-comments"
}, rt = { class: "add-comment" }, dt = ["disabled"], ut = /* @__PURE__ */ me({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(r, { emit: y }) {
    const i = r, d = y, { data: c, isLoading: T, error: b } = we(i.taskId), { data: V, isLoading: _ } = he(i.taskId), { data: f, isLoading: h } = $e(i.taskId), w = ye(), re = Te(), $ = L(null), k = L(""), U = L(null), S = L(""), P = L(!1), { data: G, isLoading: H } = pe();
    async function x(m, s) {
      $.value = m, k.value = s, await ve();
      const n = U.value;
      n && typeof n.focus == "function" && n.focus();
    }
    function Q() {
      $.value = null, k.value = "";
    }
    async function q() {
      if (!$.value || !c.value) return;
      const m = $.value, s = c.value[m];
      if (k.value !== s)
        try {
          await w.mutateAsync({
            id: i.taskId,
            updates: { [m]: k.value },
            userId: i.userId
          });
        } catch (n) {
          console.error("Failed to update task:", n);
        }
      Q();
    }
    async function de() {
      if (S.value.trim())
        try {
          await re.mutateAsync({
            task_id: i.taskId,
            comment: S.value,
            created_by: i.userId
          }), S.value = "";
        } catch (m) {
          console.error("Failed to add comment:", m);
        }
    }
    function J(m) {
      return new Date(m).toLocaleString();
    }
    function ue(m) {
      return m.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
    }
    function oe(m) {
      return m.replace(/!\[.*?\]\((data:image\/[^)]+)\)/g, '<img src="$1" style="max-width: 100%; margin: 0.5rem 0;" />');
    }
    async function W(m) {
      await X(m, (s) => {
        k.value += `
![image](${s})
`;
      });
    }
    async function O(m) {
      await X(m, (s) => {
        S.value += `
![image](${s})
`;
      });
    }
    async function X(m, s) {
      var t;
      const n = (t = m.clipboardData) == null ? void 0 : t.items;
      if (n) {
        for (const o of n)
          if (o.type.indexOf("image") !== -1) {
            m.preventDefault();
            const A = o.getAsFile();
            if (A) {
              const E = new FileReader();
              E.onload = (z) => {
                var K;
                const j = (K = z.target) == null ? void 0 : K.result;
                s(j);
              }, E.readAsDataURL(A);
            }
          }
      }
    }
    function I(m) {
      if (!m || !G.value) return "";
      const s = G.value.find((n) => n.id === m);
      return (s == null ? void 0 : s.name) || m;
    }
    return (m, s) => (a(), l("div", Ie, [
      e("div", De, [
        e("button", {
          class: "btn btn-back",
          onClick: s[0] || (s[0] = (n) => d("close"))
        }, " ← Back to Tasks "),
        s[14] || (s[14] = e("h2", null, "Task Details", -1)),
        e("button", {
          class: "btn btn-danger",
          onClick: s[1] || (s[1] = //@ts-ignore
          (...n) => m.deleteTask && m.deleteTask(...n))
        }, "Delete Task")
      ]),
      u(T) ? (a(), l("div", qe, "Loading task details...")) : u(b) ? (a(), l("div", Ve, "Error: " + p(u(b)), 1)) : u(c) ? (a(), l("div", Fe, [
        e("div", Ue, [
          e("div", Se, [
            s[15] || (s[15] = e("label", null, "Summary", -1)),
            e("div", {
              onDblclick: s[3] || (s[3] = (n) => x("summary", u(c).summary))
            }, [
              $.value === "summary" ? g((a(), l("input", {
                key: 0,
                "onUpdate:modelValue": s[2] || (s[2] = (n) => k.value = n),
                onBlur: q,
                onKeyup: [
                  te(q, ["enter"]),
                  te(Q, ["esc"])
                ],
                class: "inline-edit",
                ref_key: "editInput",
                ref: U
              }, null, 544)), [
                [N, k.value]
              ]) : (a(), l("div", Be, p(u(c).summary), 1))
            ], 32)
          ]),
          e("div", Me, [
            s[16] || (s[16] = e("label", null, "Description", -1)),
            e("div", {
              onDblclick: s[5] || (s[5] = (n) => x("description", u(c).description || ""))
            }, [
              $.value === "description" ? g((a(), l("textarea", {
                key: 0,
                "onUpdate:modelValue": s[4] || (s[4] = (n) => k.value = n),
                onBlur: q,
                onKeyup: te(Q, ["esc"]),
                onPaste: W,
                class: "inline-edit",
                rows: "4",
                ref_key: "editInput",
                ref: U
              }, null, 544)), [
                [N, k.value]
              ]) : (a(), l("div", {
                key: 1,
                class: "info-value",
                innerHTML: oe(u(c).description || "")
              }, null, 8, xe))
            ], 32)
          ]),
          e("div", Ke, [
            s[18] || (s[18] = e("label", null, "Status", -1)),
            e("div", {
              onDblclick: s[7] || (s[7] = (n) => x("status", u(c).status))
            }, [
              $.value === "status" ? g((a(), l("select", {
                key: 0,
                "onUpdate:modelValue": s[6] || (s[6] = (n) => k.value = n),
                onBlur: q,
                onChange: q,
                class: "inline-edit",
                ref_key: "editInput",
                ref: U
              }, [...s[17] || (s[17] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in-progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1),
                e("option", { value: "closed" }, "Closed", -1)
              ])], 544)), [
                [F, k.value]
              ]) : (a(), l("span", {
                key: 1,
                class: se(`status-badge status-${u(c).status}`)
              }, p(u(c).status), 3))
            ], 32)
          ]),
          e("div", Ae, [
            s[20] || (s[20] = e("label", null, "Priority", -1)),
            e("div", {
              onDblclick: s[9] || (s[9] = (n) => x("priority", u(c).priority))
            }, [
              $.value === "priority" ? g((a(), l("select", {
                key: 0,
                "onUpdate:modelValue": s[8] || (s[8] = (n) => k.value = n),
                onBlur: q,
                onChange: q,
                class: "inline-edit",
                ref_key: "editInput",
                ref: U
              }, [...s[19] || (s[19] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1),
                e("option", { value: "critical" }, "Critical", -1)
              ])], 544)), [
                [F, k.value]
              ]) : (a(), l("span", {
                key: 1,
                class: se(`priority-badge priority-${u(c).priority}`)
              }, p(u(c).priority), 3))
            ], 32)
          ]),
          e("div", Ee, [
            s[22] || (s[22] = e("label", null, "Assigned To", -1)),
            e("div", {
              onDblclick: s[11] || (s[11] = (n) => x("assigned_to", u(c).assigned_to || ""))
            }, [
              $.value === "assigned_to" ? g((a(), l("select", {
                key: 0,
                "onUpdate:modelValue": s[10] || (s[10] = (n) => k.value = n),
                onBlur: q,
                onChange: q,
                class: "inline-edit",
                ref_key: "editInput",
                ref: U,
                disabled: u(H)
              }, [
                s[21] || (s[21] = e("option", { value: "" }, "-- Unassigned --", -1)),
                (a(!0), l(B, null, R(u(G), (n) => (a(), l("option", {
                  key: n.id,
                  value: n.id
                }, p(n.name), 9, Pe))), 128))
              ], 40, Ne)), [
                [F, k.value]
              ]) : (a(), l("div", He, p(I(u(c).assigned_to) || "-"), 1))
            ], 32)
          ])
        ]),
        e("div", Qe, [
          e("div", {
            class: "section-header",
            onClick: s[12] || (s[12] = (n) => P.value = !P.value)
          }, [
            e("h3", null, [
              e("span", Oe, p(P.value ? "▼" : "▶"), 1),
              s[23] || (s[23] = D(" History ", -1))
            ])
          ]),
          P.value ? (a(), l("div", ze, [
            u(h) ? (a(), l("div", je, "Loading history...")) : u(f) && u(f).length > 0 ? (a(), l("div", Re, [
              (a(!0), l(B, null, R(u(f), (n) => (a(), l("div", {
                key: n.id,
                class: "history-item"
              }, [
                e("div", Ge, [
                  e("strong", null, p(I(n.changed_by)), 1),
                  e("span", Je, p(J(n.changed_at)), 1)
                ]),
                e("div", We, [
                  s[27] || (s[27] = D(" Changed ", -1)),
                  e("strong", null, p(ue(n.field_name)), 1),
                  e("span", Xe, [
                    s[24] || (s[24] = D(' from "', -1)),
                    e("span", Ye, p(n.old_value), 1),
                    s[25] || (s[25] = D('" to "', -1)),
                    e("span", Ze, p(n.new_value), 1),
                    s[26] || (s[26] = D('" ', -1))
                  ])
                ])
              ]))), 128))
            ])) : (a(), l("div", et, "No history yet"))
          ])) : ie("", !0)
        ]),
        e("div", tt, [
          s[29] || (s[29] = e("h3", null, "Comments", -1)),
          u(_) ? (a(), l("div", st, "Loading comments...")) : u(V) && u(V).length > 0 ? (a(), l("div", nt, [
            (a(!0), l(B, null, R(u(V), (n) => (a(), l("div", {
              key: n.id,
              class: "comment-item"
            }, [
              e("div", ot, [
                e("strong", null, p(I(n.created_by)), 1),
                e("span", it, p(J(n.created_at)), 1)
              ]),
              e("div", {
                class: "comment-text",
                innerHTML: oe(n.comment)
              }, null, 8, at)
            ]))), 128))
          ])) : (a(), l("div", lt, "No comments yet")),
          e("div", rt, [
            g(e("textarea", {
              "onUpdate:modelValue": s[13] || (s[13] = (n) => S.value = n),
              placeholder: "Add a comment...",
              rows: "3",
              class: "comment-input",
              onPaste: O
            }, null, 544), [
              [N, S.value]
            ]),
            s[28] || (s[28] = e("small", null, "Paste images from clipboard", -1)),
            e("button", {
              onClick: de,
              disabled: !S.value.trim(),
              class: "btn-primary"
            }, " Add Comment ", 8, dt)
          ])
        ])
      ])) : ie("", !0)
    ]));
  }
}), fe = (r, y) => {
  const i = r.__vccOpts || r;
  for (const [d, c] of y)
    i[d] = c;
  return i;
}, ct = /* @__PURE__ */ fe(ut, [["__scopeId", "data-v-e63412c5"]]), mt = { class: "tasks-card" }, vt = {
  key: 0,
  class: "loading"
}, yt = {
  key: 1,
  class: "error"
}, pt = {
  key: 2,
  class: "tasks-container"
}, ft = { class: "tasks-header" }, kt = { class: "tasks-header-actions" }, gt = { class: "tasks-filters" }, bt = { class: "tasks-table-wrapper" }, _t = { class: "tasks-table" }, wt = {
  key: 0,
  class: "no-results"
}, ht = {
  colspan: "6",
  class: "no-results-cell"
}, $t = { class: "no-results-content" }, Ct = { class: "no-results-text" }, Tt = ["onDblclick"], Lt = ["onBlur", "onKeyup"], It = { key: 1 }, Dt = ["onDblclick"], qt = ["onBlur", "onChange"], Vt = ["onDblclick"], Ft = ["onBlur", "onChange"], Ut = ["onDblclick"], St = ["onBlur", "onChange", "disabled"], Bt = ["value"], Mt = { key: 1 }, xt = { class: "task-actions" }, Kt = ["onClick"], At = ["onClick"], Et = {
  key: 3,
  class: "task-form-container"
}, Nt = { class: "form-body" }, Pt = { class: "form-group" }, Ht = { class: "form-group" }, Qt = { class: "form-row" }, Ot = { class: "form-group" }, zt = { class: "form-group" }, jt = { class: "form-group" }, Rt = ["disabled"], Gt = ["value"], Jt = { class: "form-actions" }, Wt = ["disabled"], Xt = /* @__PURE__ */ me({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(r, { emit: y }) {
    const i = r, d = y, c = L(""), T = L(""), b = L("list"), V = L(null), _ = L(null), f = L(""), h = L(null), w = L({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: i.userId
    }), re = ce(() => ({
      status: T.value || void 0
    })), { data: $, isLoading: k, error: U } = _e(re), S = Ce(), P = ye(), G = Le(), { data: H, isLoading: x } = pe(), Q = ce(() => {
      if (!$.value) return [];
      const n = c.value.toLowerCase().trim();
      return n ? $.value.filter((t) => {
        var K, Y, Z, ee, v;
        const o = ((K = t.summary) == null ? void 0 : K.toLowerCase()) || "", A = ((Y = t.description) == null ? void 0 : Y.toLowerCase()) || "", E = ((Z = t.status) == null ? void 0 : Z.toLowerCase().replace("_", " ")) || "", z = ((ee = t.priority) == null ? void 0 : ee.toLowerCase()) || "", j = ((v = t.assigned_to) == null ? void 0 : v.toLowerCase()) || "";
        return o.includes(n) || A.includes(n) || E.includes(n) || z.includes(n) || j.includes(n);
      }) : $.value;
    });
    function q(n) {
      return new Date(n).toLocaleDateString();
    }
    async function de() {
      try {
        await S.mutateAsync(w.value), J(), b.value = "list";
      } catch (n) {
        console.error("Failed to create task:", n);
      }
    }
    function J() {
      w.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: i.userId
      };
    }
    function ue() {
      J(), b.value = "create";
    }
    function oe(n) {
      V.value = n, b.value = "detail";
    }
    function W() {
      b.value = "list", V.value = null;
    }
    async function O(n, t) {
      var o;
      _.value = { taskId: n.id, field: t }, f.value = String(n[t] || ""), await ve(), (o = h.value) == null || o.focus();
    }
    function X() {
      _.value = null, f.value = "";
    }
    async function I(n, t) {
      if (_.value)
        try {
          await P.mutateAsync({
            id: n.id,
            updates: { [t]: f.value },
            userId: i.userId
            // Add userId
          }), X();
        } catch (o) {
          console.error("Failed to update task:", o);
        }
    }
    async function m(n) {
      if (confirm("Are you sure you want to delete this task?"))
        try {
          await G.mutateAsync(n);
        } catch (t) {
          console.error("Failed to delete task:", t);
        }
    }
    function s(n) {
      if (!n || !H.value) return "";
      const t = H.value.find((o) => o.id === n);
      return (t == null ? void 0 : t.name) || n;
    }
    return (n, t) => (a(), l("div", mt, [
      u(k) && !u($) ? (a(), l("div", vt, [...t[13] || (t[13] = [
        e("div", { class: "loading-spinner" }, null, -1),
        D(" Loading tasks... ", -1)
      ])])) : u(U) ? (a(), l("div", yt, [
        t[14] || (t[14] = e("h3", null, "Error loading tasks", -1)),
        e("p", null, p(u(U)), 1)
      ])) : b.value === "list" ? (a(), l("div", pt, [
        e("div", ft, [
          e("h2", {
            class: se({ "tasks-header-clickable": i.showHeaderLink }),
            onClick: t[0] || (t[0] = (o) => i.showHeaderLink && d("navigate"))
          }, " Tasks Management ", 2),
          e("div", kt, [
            e("button", {
              class: "btn btn-primary",
              onClick: ue
            }, [...t[15] || (t[15] = [
              e("span", { class: "icon" }, "➕", -1),
              D(" New Task ", -1)
            ])]),
            e("button", {
              class: "btn btn-minimize",
              onClick: t[1] || (t[1] = (o) => d("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        e("div", gt, [
          g(e("input", {
            "onUpdate:modelValue": t[2] || (t[2] = (o) => c.value = o),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [N, c.value]
          ]),
          g(e("select", {
            "onUpdate:modelValue": t[3] || (t[3] = (o) => T.value = o),
            class: "filter-select"
          }, [...t[16] || (t[16] = [
            e("option", { value: "" }, "All Status", -1),
            e("option", { value: "open" }, "Open", -1),
            e("option", { value: "in-progress" }, "In Progress", -1),
            e("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [F, T.value]
          ])
        ]),
        e("div", bt, [
          e("table", _t, [
            t[25] || (t[25] = e("thead", null, [
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
              Q.value.length === 0 ? (a(), l("tr", wt, [
                e("td", ht, [
                  e("div", $t, [
                    t[21] || (t[21] = e("span", { class: "no-results-icon" }, "🔍", -1)),
                    e("p", Ct, [
                      c.value ? (a(), l(B, { key: 0 }, [
                        t[17] || (t[17] = D(' No tasks found matching "', -1)),
                        e("strong", null, p(c.value), 1),
                        t[18] || (t[18] = D('" ', -1))
                      ], 64)) : T.value ? (a(), l(B, { key: 1 }, [
                        t[19] || (t[19] = D(' No tasks found with status "', -1)),
                        e("strong", null, p(T.value.replace("_", " ")), 1),
                        t[20] || (t[20] = D('" ', -1))
                      ], 64)) : (a(), l(B, { key: 2 }, [
                        D(' No tasks found. Click "New Task" to create one. ')
                      ], 64))
                    ])
                  ])
                ])
              ])) : ie("", !0),
              (a(!0), l(B, null, R(Q.value, (o) => {
                var A, E, z, j, K, Y, Z, ee;
                return a(), l("tr", {
                  key: o.id
                }, [
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => O(o, "summary")
                  }, [
                    ((A = _.value) == null ? void 0 : A.taskId) === o.id && ((E = _.value) == null ? void 0 : E.field) === "summary" ? g((a(), l("input", {
                      key: 0,
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: h,
                      "onUpdate:modelValue": t[4] || (t[4] = (v) => f.value = v),
                      type: "text",
                      onBlur: (v) => I(o, "summary"),
                      onKeyup: [
                        te((v) => I(o, "summary"), ["enter"]),
                        te(X, ["escape"])
                      ]
                    }, null, 40, Lt)), [
                      [N, f.value]
                    ]) : (a(), l("span", It, p(o.summary), 1))
                  ], 40, Tt),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => O(o, "status")
                  }, [
                    ((z = _.value) == null ? void 0 : z.taskId) === o.id && ((j = _.value) == null ? void 0 : j.field) === "status" ? g((a(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": t[5] || (t[5] = (v) => f.value = v),
                      onBlur: (v) => I(o, "status"),
                      onChange: (v) => I(o, "status"),
                      autofocus: ""
                    }, [...t[22] || (t[22] = [
                      e("option", { value: "open" }, "Open", -1),
                      e("option", { value: "in_progress" }, "In Progress", -1),
                      e("option", { value: "completed" }, "Completed", -1)
                    ])], 40, qt)), [
                      [F, f.value]
                    ]) : (a(), l("span", {
                      key: 1,
                      class: se(`status-badge status-${o.status}`)
                    }, p(o.status.replace("_", " ")), 3))
                  ], 40, Dt),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => O(o, "priority")
                  }, [
                    ((K = _.value) == null ? void 0 : K.taskId) === o.id && ((Y = _.value) == null ? void 0 : Y.field) === "priority" ? g((a(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": t[6] || (t[6] = (v) => f.value = v),
                      onBlur: (v) => I(o, "priority"),
                      onChange: (v) => I(o, "priority"),
                      autofocus: ""
                    }, [...t[23] || (t[23] = [
                      e("option", { value: "low" }, "Low", -1),
                      e("option", { value: "medium" }, "Medium", -1),
                      e("option", { value: "high" }, "High", -1)
                    ])], 40, Ft)), [
                      [F, f.value]
                    ]) : (a(), l("span", {
                      key: 1,
                      class: se(`priority-badge priority-${o.priority}`)
                    }, p(o.priority), 3))
                  ], 40, Vt),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => O(o, "assigned_to")
                  }, [
                    ((Z = _.value) == null ? void 0 : Z.taskId) === o.id && ((ee = _.value) == null ? void 0 : ee.field) === "assigned_to" ? g((a(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": t[7] || (t[7] = (v) => f.value = v),
                      onBlur: (v) => I(o, "assigned_to"),
                      onChange: (v) => I(o, "assigned_to"),
                      autofocus: "",
                      disabled: u(x)
                    }, [
                      t[24] || (t[24] = e("option", { value: "" }, "-- Unassigned --", -1)),
                      (a(!0), l(B, null, R(u(H), (v) => (a(), l("option", {
                        key: v.id,
                        value: v.id
                      }, p(v.name), 9, Bt))), 128))
                    ], 40, St)), [
                      [F, f.value]
                    ]) : (a(), l("span", Mt, p(s(o.assigned_to) || "-"), 1))
                  ], 40, Ut),
                  e("td", null, p(q(o.created_at)), 1),
                  e("td", xt, [
                    e("button", {
                      class: "btn btn-icon",
                      onClick: (v) => oe(o.id),
                      title: "View details"
                    }, " 👁️ ", 8, Kt),
                    e("button", {
                      class: "btn btn-icon btn-danger",
                      onClick: (v) => m(o.id),
                      title: "Delete task"
                    }, " 🗑️ ", 8, At)
                  ])
                ]);
              }), 128))
            ])
          ])
        ])
      ])) : b.value === "create" ? (a(), l("div", Et, [
        e("div", { class: "form-header" }, [
          e("button", {
            class: "btn btn-back",
            onClick: W
          }, " ← Back to Tasks "),
          t[26] || (t[26] = e("h2", null, "Create New Task", -1))
        ]),
        e("div", Nt, [
          e("div", Pt, [
            t[27] || (t[27] = e("label", { for: "task-summary" }, "Summary *", -1)),
            g(e("input", {
              id: "task-summary",
              "onUpdate:modelValue": t[8] || (t[8] = (o) => w.value.summary = o),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [N, w.value.summary]
            ])
          ]),
          e("div", Ht, [
            t[28] || (t[28] = e("label", { for: "task-description" }, "Description", -1)),
            g(e("textarea", {
              id: "task-description",
              "onUpdate:modelValue": t[9] || (t[9] = (o) => w.value.description = o),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [N, w.value.description]
            ])
          ]),
          e("div", Qt, [
            e("div", Ot, [
              t[30] || (t[30] = e("label", { for: "task-status" }, "Status", -1)),
              g(e("select", {
                id: "task-status",
                "onUpdate:modelValue": t[10] || (t[10] = (o) => w.value.status = o)
              }, [...t[29] || (t[29] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in_progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [F, w.value.status]
              ])
            ]),
            e("div", zt, [
              t[32] || (t[32] = e("label", { for: "task-priority" }, "Priority", -1)),
              g(e("select", {
                id: "task-priority",
                "onUpdate:modelValue": t[11] || (t[11] = (o) => w.value.priority = o)
              }, [...t[31] || (t[31] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1)
              ])], 512), [
                [F, w.value.priority]
              ])
            ])
          ]),
          e("div", jt, [
            t[34] || (t[34] = e("label", { for: "task-assigned" }, "Assigned To", -1)),
            g(e("select", {
              id: "task-assigned",
              "onUpdate:modelValue": t[12] || (t[12] = (o) => w.value.assigned_to = o),
              disabled: u(x)
            }, [
              t[33] || (t[33] = e("option", { value: "" }, "-- Select User --", -1)),
              (a(!0), l(B, null, R(u(H), (o) => (a(), l("option", {
                key: o.id,
                value: o.id
              }, p(o.name), 9, Gt))), 128))
            ], 8, Rt), [
              [F, w.value.assigned_to]
            ])
          ]),
          e("div", Jt, [
            e("button", {
              class: "btn btn-cancel",
              onClick: W
            }, "Cancel"),
            e("button", {
              class: "btn btn-primary",
              onClick: de,
              disabled: !w.value.summary.trim()
            }, " Create Task ", 8, Wt)
          ])
        ])
      ])) : b.value === "detail" && V.value ? (a(), ge(ct, {
        key: 4,
        "task-id": V.value,
        "user-id": r.userId,
        onClose: W
      }, null, 8, ["task-id", "user-id"])) : ie("", !0)
    ]));
  }
}), es = /* @__PURE__ */ fe(Xt, [["__scopeId", "data-v-3b7d968c"]]);
export {
  ct as TaskDetail,
  es as Tasks
};
