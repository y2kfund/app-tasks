import { inject as ke, computed as de, unref as d, defineComponent as me, ref as D, createElementBlock as l, openBlock as i, createElementVNode as e, createCommentVNode as ce, toDisplayString as f, withDirectives as b, withKeys as X, vModelText as N, vModelSelect as U, normalizeClass as Y, Fragment as M, renderList as O, createTextVNode as q, nextTick as ve, createBlock as ge } from "vue";
import { useQuery as Z, useQueryClient as oe, useMutation as ie } from "@tanstack/vue-query";
const be = Symbol.for("y2kfund.supabase");
function K() {
  const a = ke(be, null);
  if (!a) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return a;
}
const T = {
  all: ["tasks"],
  list: (a) => [...T.all, "list", a],
  detail: (a) => [...T.all, "detail", a],
  comments: (a) => [...T.all, "comments", a],
  history: (a) => [...T.all, "history", a]
};
function _e(a) {
  const p = K();
  return Z({
    queryKey: de(() => {
      const o = a ? d(a) : {};
      return T.list(o);
    }),
    queryFn: async () => {
      const o = a ? d(a) : {};
      let u = p.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (o != null && o.status && (u = u.eq("status", o.status)), o != null && o.search && o.search.trim()) {
        const _ = o.search.trim();
        u = u.or(`summary.ilike.%${_}%,description.ilike.%${_}%`);
      }
      const { data: m, error: L } = await u;
      if (L) throw L;
      return m;
    }
  });
}
function we(a) {
  const p = K();
  return Z({
    queryKey: T.detail(a),
    queryFn: async () => {
      const { data: o, error: u } = await p.schema("hf").from("tasks").select("*").eq("id", a).single();
      if (u) throw u;
      return o;
    },
    enabled: !!a
  });
}
function he(a) {
  const p = K();
  return Z({
    queryKey: T.comments(a),
    queryFn: async () => {
      const { data: o, error: u } = await p.schema("hf").from("task_comments").select("*").eq("task_id", a).order("created_at", { ascending: !1 });
      if (u) throw u;
      return o;
    },
    enabled: !!a
  });
}
function $e(a) {
  const p = K();
  return Z({
    queryKey: T.history(a),
    queryFn: async () => {
      const { data: o, error: u } = await p.schema("hf").from("task_history").select("*").eq("task_id", a).order("changed_at", { ascending: !1 });
      if (u) throw u;
      return o;
    },
    enabled: !!a
  });
}
function Ce() {
  const a = K(), p = oe();
  return ie({
    mutationFn: async (o) => {
      const { data: u, error: m } = await a.schema("hf").from("tasks").insert(o).select().single();
      if (m) throw m;
      return u;
    },
    onSuccess: () => {
      p.invalidateQueries({ queryKey: T.all });
    }
  });
}
function ye() {
  const a = K(), p = oe();
  return ie({
    mutationFn: async ({
      id: o,
      updates: u,
      userId: m
    }) => {
      const { data: L, error: _ } = await a.schema("hf").from("tasks").select("*").eq("id", o).single();
      if (_) throw _;
      const { data: V, error: w } = await a.schema("hf").from("tasks").update(u).eq("id", o).select().single();
      if (w) throw w;
      const k = Object.keys(u).filter(($) => L[$] !== u[$]).map(($) => ({
        task_id: o,
        field_name: $,
        old_value: String(L[$] || ""),
        new_value: String(u[$] || ""),
        changed_by: m
      }));
      if (k.length > 0) {
        const { error: $ } = await a.schema("hf").from("task_history").insert(k);
        $ && console.error("Failed to save history:", $);
      }
      return V;
    },
    onSuccess: (o) => {
      p.invalidateQueries({ queryKey: T.all }), p.invalidateQueries({ queryKey: T.detail(o.id) }), p.invalidateQueries({ queryKey: T.history(o.id) });
    }
  });
}
function Te() {
  const a = K(), p = oe();
  return ie({
    mutationFn: async (o) => {
      const { data: u, error: m } = await a.schema("hf").from("task_comments").insert(o).select().single();
      if (m) throw m;
      return u;
    },
    onSuccess: (o) => {
      p.invalidateQueries({ queryKey: T.comments(o.task_id) });
    }
  });
}
function Le() {
  const a = K(), p = oe();
  return ie({
    mutationFn: async (o) => {
      await a.schema("hf").from("task_comments").delete().eq("task_id", o), await a.schema("hf").from("task_history").delete().eq("task_id", o);
      const { error: u } = await a.schema("hf").from("tasks").delete().eq("id", o);
      if (u) throw u;
      return o;
    },
    onSuccess: () => {
      p.invalidateQueries({ queryKey: T.all });
    }
  });
}
function pe() {
  const a = K();
  return Z({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: p, error: o } = await a.from("users_view").select("id, email, name").order("email");
      if (o) throw o;
      return (p || []).map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name || u.email
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
}, Me = { class: "info-row" }, Ke = ["innerHTML"], xe = { class: "info-row" }, Ae = { class: "info-row" }, Ee = { class: "info-row" }, Ne = ["disabled"], Pe = ["value"], He = {
  key: 1,
  class: "info-value"
}, Qe = { class: "history-section" }, Oe = {
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
}, st = { class: "comment-meta" }, nt = { class: "comment-date" }, ot = ["innerHTML"], it = {
  key: 2,
  class: "no-comments"
}, at = { class: "add-comment" }, lt = ["disabled"], rt = /* @__PURE__ */ me({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(a, { emit: p }) {
    const o = a, u = p, { data: m, isLoading: L, error: _ } = we(o.taskId), { data: V, isLoading: w } = he(o.taskId), { data: k, isLoading: $ } = $e(o.taskId), h = ye(), ae = Te(), C = D(null), g = D(""), S = D(null), B = D(""), { data: z, isLoading: le } = pe();
    async function F(c, s) {
      C.value = c, g.value = s, await ve();
      const r = S.value;
      r && typeof r.focus == "function" && r.focus();
    }
    function P() {
      C.value = null, g.value = "";
    }
    async function I() {
      if (!C.value || !m.value) return;
      const c = C.value, s = m.value[c];
      if (g.value !== s)
        try {
          await h.mutateAsync({
            id: o.taskId,
            updates: { [c]: g.value },
            userId: o.userId
          });
        } catch (r) {
          console.error("Failed to update task:", r);
        }
      P();
    }
    async function re() {
      if (B.value.trim())
        try {
          await ae.mutateAsync({
            task_id: o.taskId,
            comment: B.value,
            created_by: o.userId
          }), B.value = "";
        } catch (c) {
          console.error("Failed to add comment:", c);
        }
    }
    function ee(c) {
      return new Date(c).toLocaleString();
    }
    function te(c) {
      return c.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
    }
    function se(c) {
      return c.replace(/!\[.*?\]\((data:image\/[^)]+)\)/g, '<img src="$1" style="max-width: 100%; margin: 0.5rem 0;" />');
    }
    async function ue(c) {
      await x(c, (s) => {
        g.value += `
![image](${s})
`;
      });
    }
    async function j(c) {
      await x(c, (s) => {
        B.value += `
![image](${s})
`;
      });
    }
    async function x(c, s) {
      var y;
      const r = (y = c.clipboardData) == null ? void 0 : y.items;
      if (r) {
        for (const t of r)
          if (t.type.indexOf("image") !== -1) {
            c.preventDefault();
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
    function ne(c) {
      if (!c || !z.value) return "";
      const s = z.value.find((r) => r.id === c);
      return (s == null ? void 0 : s.name) || c;
    }
    return (c, s) => (i(), l("div", Ie, [
      e("div", De, [
        e("button", {
          class: "btn btn-back",
          onClick: s[0] || (s[0] = (r) => u("close"))
        }, " ← Back to Tasks "),
        s[13] || (s[13] = e("h2", null, "Task Details", -1)),
        e("button", {
          class: "btn btn-danger",
          onClick: s[1] || (s[1] = //@ts-ignore
          (...r) => c.deleteTask && c.deleteTask(...r))
        }, "Delete Task")
      ]),
      d(L) ? (i(), l("div", qe, "Loading task details...")) : d(_) ? (i(), l("div", Ve, "Error: " + f(d(_)), 1)) : d(m) ? (i(), l("div", Fe, [
        e("div", Ue, [
          e("div", Se, [
            s[14] || (s[14] = e("label", null, "Summary", -1)),
            e("div", {
              onDblclick: s[3] || (s[3] = (r) => F("summary", d(m).summary))
            }, [
              C.value === "summary" ? b((i(), l("input", {
                key: 0,
                "onUpdate:modelValue": s[2] || (s[2] = (r) => g.value = r),
                onBlur: I,
                onKeyup: [
                  X(I, ["enter"]),
                  X(P, ["esc"])
                ],
                class: "inline-edit",
                ref_key: "editInput",
                ref: S
              }, null, 544)), [
                [N, g.value]
              ]) : (i(), l("div", Be, f(d(m).summary), 1))
            ], 32)
          ]),
          e("div", Me, [
            s[15] || (s[15] = e("label", null, "Description", -1)),
            e("div", {
              onDblclick: s[5] || (s[5] = (r) => F("description", d(m).description || ""))
            }, [
              C.value === "description" ? b((i(), l("textarea", {
                key: 0,
                "onUpdate:modelValue": s[4] || (s[4] = (r) => g.value = r),
                onBlur: I,
                onKeyup: X(P, ["esc"]),
                onPaste: ue,
                class: "inline-edit",
                rows: "4",
                ref_key: "editInput",
                ref: S
              }, null, 544)), [
                [N, g.value]
              ]) : (i(), l("div", {
                key: 1,
                class: "info-value",
                innerHTML: se(d(m).description || "")
              }, null, 8, Ke))
            ], 32)
          ]),
          e("div", xe, [
            s[17] || (s[17] = e("label", null, "Status", -1)),
            e("div", {
              onDblclick: s[7] || (s[7] = (r) => F("status", d(m).status))
            }, [
              C.value === "status" ? b((i(), l("select", {
                key: 0,
                "onUpdate:modelValue": s[6] || (s[6] = (r) => g.value = r),
                onBlur: I,
                onChange: I,
                class: "inline-edit",
                ref_key: "editInput",
                ref: S
              }, [...s[16] || (s[16] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in-progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1),
                e("option", { value: "closed" }, "Closed", -1)
              ])], 544)), [
                [U, g.value]
              ]) : (i(), l("span", {
                key: 1,
                class: Y(`status-badge status-${d(m).status}`)
              }, f(d(m).status), 3))
            ], 32)
          ]),
          e("div", Ae, [
            s[19] || (s[19] = e("label", null, "Priority", -1)),
            e("div", {
              onDblclick: s[9] || (s[9] = (r) => F("priority", d(m).priority))
            }, [
              C.value === "priority" ? b((i(), l("select", {
                key: 0,
                "onUpdate:modelValue": s[8] || (s[8] = (r) => g.value = r),
                onBlur: I,
                onChange: I,
                class: "inline-edit",
                ref_key: "editInput",
                ref: S
              }, [...s[18] || (s[18] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1),
                e("option", { value: "critical" }, "Critical", -1)
              ])], 544)), [
                [U, g.value]
              ]) : (i(), l("span", {
                key: 1,
                class: Y(`priority-badge priority-${d(m).priority}`)
              }, f(d(m).priority), 3))
            ], 32)
          ]),
          e("div", Ee, [
            s[21] || (s[21] = e("label", null, "Assigned To", -1)),
            e("div", {
              onDblclick: s[11] || (s[11] = (r) => F("assigned_to", d(m).assigned_to || ""))
            }, [
              C.value === "assigned_to" ? b((i(), l("select", {
                key: 0,
                "onUpdate:modelValue": s[10] || (s[10] = (r) => g.value = r),
                onBlur: I,
                onChange: I,
                class: "inline-edit",
                ref_key: "editInput",
                ref: S,
                disabled: d(le)
              }, [
                s[20] || (s[20] = e("option", { value: "" }, "-- Unassigned --", -1)),
                (i(!0), l(M, null, O(d(z), (r) => (i(), l("option", {
                  key: r.id,
                  value: r.id
                }, f(r.name), 9, Pe))), 128))
              ], 40, Ne)), [
                [U, g.value]
              ]) : (i(), l("div", He, f(ne(d(m).assigned_to) || "-"), 1))
            ], 32)
          ])
        ]),
        e("div", Qe, [
          s[26] || (s[26] = e("h3", null, "History", -1)),
          d($) ? (i(), l("div", Oe, "Loading history...")) : d(k) && d(k).length > 0 ? (i(), l("div", ze, [
            (i(!0), l(M, null, O(d(k), (r) => (i(), l("div", {
              key: r.id,
              class: "history-item"
            }, [
              e("div", je, [
                e("strong", null, f(r.changed_by), 1),
                e("span", Re, f(ee(r.changed_at)), 1)
              ]),
              e("div", Ge, [
                s[25] || (s[25] = q(" Changed ", -1)),
                e("strong", null, f(te(r.field_name)), 1),
                e("span", Je, [
                  s[22] || (s[22] = q(' from "', -1)),
                  e("span", We, f(r.old_value), 1),
                  s[23] || (s[23] = q('" to "', -1)),
                  e("span", Xe, f(r.new_value), 1),
                  s[24] || (s[24] = q('" ', -1))
                ])
              ])
            ]))), 128))
          ])) : (i(), l("div", Ye, "No history yet"))
        ]),
        e("div", Ze, [
          s[28] || (s[28] = e("h3", null, "Comments", -1)),
          d(w) ? (i(), l("div", et, "Loading comments...")) : d(V) && d(V).length > 0 ? (i(), l("div", tt, [
            (i(!0), l(M, null, O(d(V), (r) => (i(), l("div", {
              key: r.id,
              class: "comment-item"
            }, [
              e("div", st, [
                e("strong", null, f(r.created_by), 1),
                e("span", nt, f(ee(r.created_at)), 1)
              ]),
              e("div", {
                class: "comment-text",
                innerHTML: se(r.comment)
              }, null, 8, ot)
            ]))), 128))
          ])) : (i(), l("div", it, "No comments yet")),
          e("div", at, [
            b(e("textarea", {
              "onUpdate:modelValue": s[12] || (s[12] = (r) => B.value = r),
              placeholder: "Add a comment...",
              rows: "3",
              class: "comment-input",
              onPaste: j
            }, null, 544), [
              [N, B.value]
            ]),
            s[27] || (s[27] = e("small", null, "Paste images from clipboard", -1)),
            e("button", {
              onClick: re,
              disabled: !B.value.trim(),
              class: "btn-primary"
            }, " Add Comment ", 8, lt)
          ])
        ])
      ])) : ce("", !0)
    ]));
  }
}), fe = (a, p) => {
  const o = a.__vccOpts || a;
  for (const [u, m] of p)
    o[u] = m;
  return o;
}, ut = /* @__PURE__ */ fe(rt, [["__scopeId", "data-v-ea5c211c"]]), dt = { class: "tasks-card" }, ct = {
  key: 0,
  class: "loading"
}, mt = {
  key: 1,
  class: "error"
}, vt = {
  key: 2,
  class: "tasks-container"
}, yt = { class: "tasks-header" }, pt = { class: "tasks-header-actions" }, ft = { class: "tasks-filters" }, kt = { class: "tasks-table-wrapper" }, gt = { class: "tasks-table" }, bt = {
  key: 0,
  class: "no-results"
}, _t = {
  colspan: "6",
  class: "no-results-cell"
}, wt = { class: "no-results-content" }, ht = { class: "no-results-text" }, $t = ["onDblclick"], Ct = ["onBlur", "onKeyup"], Tt = { key: 1 }, Lt = ["onDblclick"], It = ["onBlur", "onChange"], Dt = ["onDblclick"], qt = ["onBlur", "onChange"], Vt = ["onDblclick"], Ft = ["onBlur", "onChange", "disabled"], Ut = ["value"], St = { key: 1 }, Bt = { class: "task-actions" }, Mt = ["onClick"], Kt = ["onClick"], xt = {
  key: 3,
  class: "task-form-container"
}, At = { class: "form-body" }, Et = { class: "form-group" }, Nt = { class: "form-group" }, Pt = { class: "form-row" }, Ht = { class: "form-group" }, Qt = { class: "form-group" }, Ot = { class: "form-group" }, zt = ["disabled"], jt = ["value"], Rt = { class: "form-actions" }, Gt = ["disabled"], Jt = /* @__PURE__ */ me({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(a, { emit: p }) {
    const o = a, u = p, m = D(""), L = D(""), _ = D("list"), V = D(null), w = D(null), k = D(""), $ = D(null), h = D({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: o.userId
    }), ae = de(() => ({
      status: L.value || void 0
    })), { data: C, isLoading: g, error: S } = _e(ae), B = Ce(), z = ye(), le = Le(), { data: F, isLoading: P } = pe(), I = de(() => {
      if (!C.value) return [];
      const y = m.value.toLowerCase().trim();
      return y ? C.value.filter((t) => {
        var R, G, J, W, v;
        const n = ((R = t.summary) == null ? void 0 : R.toLowerCase()) || "", A = ((G = t.description) == null ? void 0 : G.toLowerCase()) || "", H = ((J = t.status) == null ? void 0 : J.toLowerCase().replace("_", " ")) || "", Q = ((W = t.priority) == null ? void 0 : W.toLowerCase()) || "", E = ((v = t.assigned_to) == null ? void 0 : v.toLowerCase()) || "";
        return n.includes(y) || A.includes(y) || H.includes(y) || Q.includes(y) || E.includes(y);
      }) : C.value;
    });
    function re(y) {
      return new Date(y).toLocaleDateString();
    }
    async function ee() {
      try {
        await B.mutateAsync(h.value), te(), _.value = "list";
      } catch (y) {
        console.error("Failed to create task:", y);
      }
    }
    function te() {
      h.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: o.userId
      };
    }
    function se() {
      te(), _.value = "create";
    }
    function ue(y) {
      V.value = y, _.value = "detail";
    }
    function j() {
      _.value = "list", V.value = null;
    }
    async function x(y, t) {
      var n;
      w.value = { taskId: y.id, field: t }, k.value = String(y[t] || ""), await ve(), (n = $.value) == null || n.focus();
    }
    function ne() {
      w.value = null, k.value = "";
    }
    async function c(y, t) {
      if (w.value)
        try {
          await z.mutateAsync({
            id: y.id,
            updates: { [t]: k.value },
            userId: o.userId
            // Add userId
          }), ne();
        } catch (n) {
          console.error("Failed to update task:", n);
        }
    }
    async function s(y) {
      if (confirm("Are you sure you want to delete this task?"))
        try {
          await le.mutateAsync(y);
        } catch (t) {
          console.error("Failed to delete task:", t);
        }
    }
    function r(y) {
      if (!y || !F.value) return "";
      const t = F.value.find((n) => n.id === y);
      return (t == null ? void 0 : t.name) || y;
    }
    return (y, t) => (i(), l("div", dt, [
      d(g) && !d(C) ? (i(), l("div", ct, [...t[13] || (t[13] = [
        e("div", { class: "loading-spinner" }, null, -1),
        q(" Loading tasks... ", -1)
      ])])) : d(S) ? (i(), l("div", mt, [
        t[14] || (t[14] = e("h3", null, "Error loading tasks", -1)),
        e("p", null, f(d(S)), 1)
      ])) : _.value === "list" ? (i(), l("div", vt, [
        e("div", yt, [
          e("h2", {
            class: Y({ "tasks-header-clickable": o.showHeaderLink }),
            onClick: t[0] || (t[0] = (n) => o.showHeaderLink && u("navigate"))
          }, " Tasks Management ", 2),
          e("div", pt, [
            e("button", {
              class: "btn btn-primary",
              onClick: se
            }, [...t[15] || (t[15] = [
              e("span", { class: "icon" }, "➕", -1),
              q(" New Task ", -1)
            ])]),
            e("button", {
              class: "btn btn-minimize",
              onClick: t[1] || (t[1] = (n) => u("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        e("div", ft, [
          b(e("input", {
            "onUpdate:modelValue": t[2] || (t[2] = (n) => m.value = n),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [N, m.value]
          ]),
          b(e("select", {
            "onUpdate:modelValue": t[3] || (t[3] = (n) => L.value = n),
            class: "filter-select"
          }, [...t[16] || (t[16] = [
            e("option", { value: "" }, "All Status", -1),
            e("option", { value: "open" }, "Open", -1),
            e("option", { value: "in-progress" }, "In Progress", -1),
            e("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [U, L.value]
          ])
        ]),
        e("div", kt, [
          e("table", gt, [
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
              I.value.length === 0 ? (i(), l("tr", bt, [
                e("td", _t, [
                  e("div", wt, [
                    t[21] || (t[21] = e("span", { class: "no-results-icon" }, "🔍", -1)),
                    e("p", ht, [
                      m.value ? (i(), l(M, { key: 0 }, [
                        t[17] || (t[17] = q(' No tasks found matching "', -1)),
                        e("strong", null, f(m.value), 1),
                        t[18] || (t[18] = q('" ', -1))
                      ], 64)) : L.value ? (i(), l(M, { key: 1 }, [
                        t[19] || (t[19] = q(' No tasks found with status "', -1)),
                        e("strong", null, f(L.value.replace("_", " ")), 1),
                        t[20] || (t[20] = q('" ', -1))
                      ], 64)) : (i(), l(M, { key: 2 }, [
                        q(' No tasks found. Click "New Task" to create one. ')
                      ], 64))
                    ])
                  ])
                ])
              ])) : ce("", !0),
              (i(!0), l(M, null, O(I.value, (n) => {
                var A, H, Q, E, R, G, J, W;
                return i(), l("tr", {
                  key: n.id
                }, [
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => x(n, "summary")
                  }, [
                    ((A = w.value) == null ? void 0 : A.taskId) === n.id && ((H = w.value) == null ? void 0 : H.field) === "summary" ? b((i(), l("input", {
                      key: 0,
                      ref_for: !0,
                      ref_key: "editInput",
                      ref: $,
                      "onUpdate:modelValue": t[4] || (t[4] = (v) => k.value = v),
                      type: "text",
                      onBlur: (v) => c(n, "summary"),
                      onKeyup: [
                        X((v) => c(n, "summary"), ["enter"]),
                        X(ne, ["escape"])
                      ]
                    }, null, 40, Ct)), [
                      [N, k.value]
                    ]) : (i(), l("span", Tt, f(n.summary), 1))
                  ], 40, $t),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => x(n, "status")
                  }, [
                    ((Q = w.value) == null ? void 0 : Q.taskId) === n.id && ((E = w.value) == null ? void 0 : E.field) === "status" ? b((i(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": t[5] || (t[5] = (v) => k.value = v),
                      onBlur: (v) => c(n, "status"),
                      onChange: (v) => c(n, "status"),
                      autofocus: ""
                    }, [...t[22] || (t[22] = [
                      e("option", { value: "open" }, "Open", -1),
                      e("option", { value: "in_progress" }, "In Progress", -1),
                      e("option", { value: "completed" }, "Completed", -1)
                    ])], 40, It)), [
                      [U, k.value]
                    ]) : (i(), l("span", {
                      key: 1,
                      class: Y(`status-badge status-${n.status}`)
                    }, f(n.status.replace("_", " ")), 3))
                  ], 40, Lt),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => x(n, "priority")
                  }, [
                    ((R = w.value) == null ? void 0 : R.taskId) === n.id && ((G = w.value) == null ? void 0 : G.field) === "priority" ? b((i(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": t[6] || (t[6] = (v) => k.value = v),
                      onBlur: (v) => c(n, "priority"),
                      onChange: (v) => c(n, "priority"),
                      autofocus: ""
                    }, [...t[23] || (t[23] = [
                      e("option", { value: "low" }, "Low", -1),
                      e("option", { value: "medium" }, "Medium", -1),
                      e("option", { value: "high" }, "High", -1)
                    ])], 40, qt)), [
                      [U, k.value]
                    ]) : (i(), l("span", {
                      key: 1,
                      class: Y(`priority-badge priority-${n.priority}`)
                    }, f(n.priority), 3))
                  ], 40, Dt),
                  e("td", {
                    class: "editable-cell",
                    onDblclick: (v) => x(n, "assigned_to")
                  }, [
                    ((J = w.value) == null ? void 0 : J.taskId) === n.id && ((W = w.value) == null ? void 0 : W.field) === "assigned_to" ? b((i(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": t[7] || (t[7] = (v) => k.value = v),
                      onBlur: (v) => c(n, "assigned_to"),
                      onChange: (v) => c(n, "assigned_to"),
                      autofocus: "",
                      disabled: d(P)
                    }, [
                      t[24] || (t[24] = e("option", { value: "" }, "-- Unassigned --", -1)),
                      (i(!0), l(M, null, O(d(F), (v) => (i(), l("option", {
                        key: v.id,
                        value: v.id
                      }, f(v.name), 9, Ut))), 128))
                    ], 40, Ft)), [
                      [U, k.value]
                    ]) : (i(), l("span", St, f(r(n.assigned_to) || "-"), 1))
                  ], 40, Vt),
                  e("td", null, f(re(n.created_at)), 1),
                  e("td", Bt, [
                    e("button", {
                      class: "btn btn-icon",
                      onClick: (v) => ue(n.id),
                      title: "View details"
                    }, " 👁️ ", 8, Mt),
                    e("button", {
                      class: "btn btn-icon btn-danger",
                      onClick: (v) => s(n.id),
                      title: "Delete task"
                    }, " 🗑️ ", 8, Kt)
                  ])
                ]);
              }), 128))
            ])
          ])
        ])
      ])) : _.value === "create" ? (i(), l("div", xt, [
        e("div", { class: "form-header" }, [
          e("button", {
            class: "btn btn-back",
            onClick: j
          }, " ← Back to Tasks "),
          t[26] || (t[26] = e("h2", null, "Create New Task", -1))
        ]),
        e("div", At, [
          e("div", Et, [
            t[27] || (t[27] = e("label", { for: "task-summary" }, "Summary *", -1)),
            b(e("input", {
              id: "task-summary",
              "onUpdate:modelValue": t[8] || (t[8] = (n) => h.value.summary = n),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [N, h.value.summary]
            ])
          ]),
          e("div", Nt, [
            t[28] || (t[28] = e("label", { for: "task-description" }, "Description", -1)),
            b(e("textarea", {
              id: "task-description",
              "onUpdate:modelValue": t[9] || (t[9] = (n) => h.value.description = n),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [N, h.value.description]
            ])
          ]),
          e("div", Pt, [
            e("div", Ht, [
              t[30] || (t[30] = e("label", { for: "task-status" }, "Status", -1)),
              b(e("select", {
                id: "task-status",
                "onUpdate:modelValue": t[10] || (t[10] = (n) => h.value.status = n)
              }, [...t[29] || (t[29] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in_progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [U, h.value.status]
              ])
            ]),
            e("div", Qt, [
              t[32] || (t[32] = e("label", { for: "task-priority" }, "Priority", -1)),
              b(e("select", {
                id: "task-priority",
                "onUpdate:modelValue": t[11] || (t[11] = (n) => h.value.priority = n)
              }, [...t[31] || (t[31] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1)
              ])], 512), [
                [U, h.value.priority]
              ])
            ])
          ]),
          e("div", Ot, [
            t[34] || (t[34] = e("label", { for: "task-assigned" }, "Assigned To", -1)),
            b(e("select", {
              id: "task-assigned",
              "onUpdate:modelValue": t[12] || (t[12] = (n) => h.value.assigned_to = n),
              disabled: d(P)
            }, [
              t[33] || (t[33] = e("option", { value: "" }, "-- Select User --", -1)),
              (i(!0), l(M, null, O(d(F), (n) => (i(), l("option", {
                key: n.id,
                value: n.id
              }, f(n.name), 9, jt))), 128))
            ], 8, zt), [
              [U, h.value.assigned_to]
            ])
          ]),
          e("div", Rt, [
            e("button", {
              class: "btn btn-cancel",
              onClick: j
            }, "Cancel"),
            e("button", {
              class: "btn btn-primary",
              onClick: ee,
              disabled: !h.value.summary.trim()
            }, " Create Task ", 8, Gt)
          ])
        ])
      ])) : _.value === "detail" && V.value ? (i(), ge(ut, {
        key: 4,
        "task-id": V.value,
        "user-id": a.userId,
        onClose: j
      }, null, 8, ["task-id", "user-id"])) : ce("", !0)
    ]));
  }
}), Yt = /* @__PURE__ */ fe(Jt, [["__scopeId", "data-v-953abf9c"]]);
export {
  ut as TaskDetail,
  Yt as Tasks
};
