import { inject as ye, computed as le, unref as c, defineComponent as de, ref as b, createElementBlock as l, openBlock as i, createElementVNode as e, createCommentVNode as ee, normalizeClass as K, toDisplayString as p, withDirectives as _, withKeys as ie, vModelText as Q, vModelSelect as E, Fragment as J, renderList as W, createTextVNode as V, nextTick as pe, onMounted as fe, watch as ke, createBlock as he, vModelCheckbox as ge } from "vue";
import { useQuery as G, useQueryClient as te, useMutation as se } from "@tanstack/vue-query";
const be = Symbol.for("y2kfund.supabase");
function A() {
  const o = ye(be, null);
  if (!o) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return o;
}
const $ = {
  all: ["tasks"],
  list: (o) => [...$.all, "list", o],
  detail: (o) => [...$.all, "detail", o],
  comments: (o) => [...$.all, "comments", o],
  history: (o) => [...$.all, "history", o]
};
function we(o) {
  const y = A();
  return G({
    queryKey: le(() => {
      const n = o ? c(o) : {};
      return $.list(n);
    }),
    queryFn: async () => {
      const n = o ? c(o) : {};
      let d = y.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (n != null && n.status && (d = d.eq("status", n.status)), n != null && n.search && n.search.trim()) {
        const f = n.search.trim();
        d = d.or(`summary.ilike.%${f}%,description.ilike.%${f}%`);
      }
      const { data: u, error: T } = await d;
      if (T) throw T;
      return u;
    }
  });
}
function _e(o) {
  const y = A();
  return G({
    queryKey: $.detail(o),
    queryFn: async () => {
      const { data: n, error: d } = await y.schema("hf").from("tasks").select("*").eq("id", o).single();
      if (d) throw d;
      return n;
    },
    enabled: !!o
  });
}
function $e(o) {
  const y = A();
  return G({
    queryKey: $.comments(o),
    queryFn: async () => {
      const { data: n, error: d } = await y.schema("hf").from("task_comments").select("*").eq("task_id", o).order("created_at", { ascending: !1 });
      if (d) throw d;
      return n;
    },
    enabled: !!o
  });
}
function Ce(o) {
  const y = A();
  return G({
    queryKey: $.history(o),
    queryFn: async () => {
      const { data: n, error: d } = await y.schema("hf").from("task_history").select("*").eq("task_id", o).order("changed_at", { ascending: !1 });
      if (d) throw d;
      return n;
    },
    enabled: !!o
  });
}
function Ie() {
  const o = A(), y = te();
  return se({
    mutationFn: async (n) => {
      const { data: d, error: u } = await o.schema("hf").from("tasks").insert(n).select().single();
      if (u) throw u;
      return d;
    },
    onSuccess: () => {
      y.invalidateQueries({ queryKey: $.all });
    }
  });
}
function ue() {
  const o = A(), y = te();
  return se({
    mutationFn: async ({
      id: n,
      updates: d,
      userId: u
    }) => {
      const { data: T, error: f } = await o.schema("hf").from("tasks").select("*").eq("id", n).single();
      if (f) throw f;
      const { data: C, error: k } = await o.schema("hf").from("tasks").update(d).eq("id", n).select().single();
      if (k) throw k;
      const q = Object.keys(d).filter((w) => T[w] !== d[w]).map((w) => ({
        task_id: n,
        field_name: w,
        old_value: String(T[w] || ""),
        new_value: String(d[w] || ""),
        changed_by: u
      }));
      if (q.length > 0) {
        const { error: w } = await o.schema("hf").from("task_history").insert(q);
        w && console.error("Failed to save history:", w);
      }
      return C;
    },
    onSuccess: (n) => {
      y.invalidateQueries({ queryKey: $.all }), y.invalidateQueries({ queryKey: $.detail(n.id) }), y.invalidateQueries({ queryKey: $.history(n.id) });
    }
  });
}
function Te() {
  const o = A(), y = te();
  return se({
    mutationFn: async (n) => {
      const { data: d, error: u } = await o.schema("hf").from("task_comments").insert(n).select().single();
      if (u) throw u;
      return d;
    },
    onSuccess: (n) => {
      y.invalidateQueries({ queryKey: $.comments(n.task_id) });
    }
  });
}
function Le() {
  const o = A(), y = te();
  return se({
    mutationFn: async (n) => {
      await o.schema("hf").from("task_comments").delete().eq("task_id", n), await o.schema("hf").from("task_history").delete().eq("task_id", n);
      const { error: d } = await o.schema("hf").from("tasks").delete().eq("id", n);
      if (d) throw d;
      return n;
    },
    onSuccess: () => {
      y.invalidateQueries({ queryKey: $.all });
    }
  });
}
function ce() {
  const o = A();
  return G({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: y, error: n } = await o.from("users_view").select("id, email, name").order("email");
      if (n) throw n;
      return (y || []).map((d) => ({
        id: d.id,
        email: d.email,
        name: d.name || d.email
      }));
    },
    staleTime: 5 * 60 * 1e3
  });
}
const Se = { class: "detail-container" }, qe = { class: "detail-header" }, Ae = {
  key: 0,
  class: "loading"
}, Ue = {
  key: 1,
  class: "error"
}, Fe = {
  key: 2,
  class: "detail-content"
}, xe = { class: "task-info" }, De = { class: "info-row" }, Ve = {
  key: 1,
  class: "info-value"
}, Me = { class: "info-row" }, Pe = ["innerHTML"], Ke = { class: "info-row" }, Ee = { class: "info-row" }, Ne = { class: "info-row" }, Be = ["disabled"], He = ["value"], Qe = {
  key: 1,
  class: "info-value"
}, ze = { class: "history-section" }, Oe = { class: "expand-icon" }, je = { key: 0 }, Re = {
  key: 0,
  class: "loading"
}, Je = {
  key: 1,
  class: "history-list"
}, We = { class: "history-meta" }, Ge = { class: "history-date" }, Xe = { class: "history-change" }, Ye = { class: "change-values" }, Ze = { class: "old-value" }, et = { class: "new-value" }, tt = {
  key: 2,
  class: "no-history"
}, st = { class: "comments-section" }, nt = {
  key: 0,
  class: "loading"
}, at = {
  key: 1,
  class: "comments-list"
}, ot = { class: "comment-meta" }, it = { class: "comment-date" }, lt = ["innerHTML"], rt = {
  key: 2,
  class: "no-comments"
}, dt = { class: "add-comment" }, ut = ["disabled"], ct = ["disabled"], mt = { key: 0 }, vt = { key: 1 }, yt = /* @__PURE__ */ de({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(o, { emit: y }) {
    const n = o, d = y, { data: u, isLoading: T, error: f } = _e(n.taskId), { data: C, isLoading: k } = $e(n.taskId), { data: q, isLoading: w } = Ce(n.taskId), X = ue(), N = Te(), L = b(null), h = b(""), U = b(null), I = b(""), F = b(!1), M = b(!1), { data: B, isLoading: ne } = ce();
    async function P(m, t) {
      L.value = m, h.value = t, await pe();
      const g = U.value;
      g && typeof g.focus == "function" && g.focus();
    }
    function H() {
      L.value = null, h.value = "";
    }
    async function S() {
      if (!L.value || !u.value) return;
      const m = L.value, t = u.value[m];
      if (h.value !== t)
        try {
          await X.mutateAsync({
            id: n.taskId,
            updates: { [m]: h.value },
            userId: n.userId
          });
        } catch (g) {
          console.error("Failed to update task:", g);
        }
      H();
    }
    async function ae() {
      if (I.value.trim()) {
        if (I.value.trim().startsWith("@analyze")) {
          const m = I.value.trim().replace(/^@analyze\s*/, "");
          if (!m) return;
          M.value = !0;
          try {
            const g = await (await fetch("https://www.y2k.fund/api/ai-analyze-task", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                taskId: n.taskId,
                userId: n.userId,
                question: m
              })
            })).json();
            await N.mutateAsync({
              task_id: n.taskId,
              comment: `**AI Analysis:**
${g.reply}`,
              created_by: "ai"
              // or props.userId if you want to attribute to user
            }), I.value = "";
          } catch (t) {
            console.error("AI analysis failed:", t);
          } finally {
            M.value = !1;
          }
          return;
        }
        try {
          await N.mutateAsync({
            task_id: n.taskId,
            comment: I.value,
            created_by: n.userId
          }), I.value = "";
        } catch (m) {
          console.error("Failed to add comment:", m);
        }
      }
    }
    async function z() {
      if (u.value)
        try {
          await X.mutateAsync({
            id: u.value.id,
            updates: { archived: !u.value.archived },
            userId: n.userId
          });
        } catch (m) {
          console.error("Failed to archive/unarchive task:", m);
        }
    }
    function Y(m) {
      return new Date(m).toLocaleString();
    }
    function oe(m) {
      return m.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
    }
    function v(m) {
      return m.replace(/!\[.*?\]\((data:image\/[^)]+)\)/g, '<img src="$1" style="max-width: 100%; margin: 0.5rem 0;" />');
    }
    async function s(m) {
      await x(m, (t) => {
        h.value += `
![image](${t})
`;
      });
    }
    async function a(m) {
      await x(m, (t) => {
        I.value += `
![image](${t})
`;
      });
    }
    async function x(m, t) {
      var D;
      const g = (D = m.clipboardData) == null ? void 0 : D.items;
      if (g) {
        for (const r of g)
          if (r.type.indexOf("image") !== -1) {
            m.preventDefault();
            const j = r.getAsFile();
            if (j) {
              const R = new FileReader();
              R.onload = (Z) => {
                var re;
                const ve = (re = Z.target) == null ? void 0 : re.result;
                t(ve);
              }, R.readAsDataURL(j);
            }
          }
      }
    }
    function O(m) {
      if (!m || !B.value) return "";
      const t = B.value.find((g) => g.id === m);
      return (t == null ? void 0 : t.name) || m;
    }
    return (m, t) => {
      var g, D;
      return i(), l("div", Se, [
        e("div", qe, [
          e("button", {
            class: "btn btn-back",
            onClick: t[0] || (t[0] = (r) => d("close"))
          }, " ← Back to Tasks "),
          t[13] || (t[13] = e("h2", null, "Task Details", -1)),
          e("button", {
            class: K(["btn", (g = c(u)) != null && g.archived ? "btn-success" : "btn-danger"]),
            onClick: z
          }, p((D = c(u)) != null && D.archived ? "Unarchive" : "Archive") + " Task ", 3)
        ]),
        c(T) ? (i(), l("div", Ae, "Loading task details...")) : c(f) ? (i(), l("div", Ue, "Error: " + p(c(f)), 1)) : c(u) ? (i(), l("div", Fe, [
          e("div", xe, [
            e("div", De, [
              t[14] || (t[14] = e("label", null, "Summary", -1)),
              e("div", {
                onDblclick: t[2] || (t[2] = (r) => P("summary", c(u).summary))
              }, [
                L.value === "summary" ? _((i(), l("input", {
                  key: 0,
                  "onUpdate:modelValue": t[1] || (t[1] = (r) => h.value = r),
                  onBlur: S,
                  onKeyup: [
                    ie(S, ["enter"]),
                    ie(H, ["esc"])
                  ],
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: U
                }, null, 544)), [
                  [Q, h.value]
                ]) : (i(), l("div", Ve, p(c(u).summary), 1))
              ], 32)
            ]),
            e("div", Me, [
              t[15] || (t[15] = e("label", null, "Description", -1)),
              e("div", {
                onDblclick: t[4] || (t[4] = (r) => P("description", c(u).description || ""))
              }, [
                L.value === "description" ? _((i(), l("textarea", {
                  key: 0,
                  "onUpdate:modelValue": t[3] || (t[3] = (r) => h.value = r),
                  onBlur: S,
                  onKeyup: ie(H, ["esc"]),
                  onPaste: s,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: U
                }, null, 544)), [
                  [Q, h.value]
                ]) : (i(), l("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: v(c(u).description || "")
                }, null, 8, Pe))
              ], 32)
            ]),
            e("div", Ke, [
              t[17] || (t[17] = e("label", null, "Status", -1)),
              e("div", {
                onDblclick: t[6] || (t[6] = (r) => P("status", c(u).status))
              }, [
                L.value === "status" ? _((i(), l("select", {
                  key: 0,
                  "onUpdate:modelValue": t[5] || (t[5] = (r) => h.value = r),
                  onBlur: S,
                  onChange: S,
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: U
                }, [...t[16] || (t[16] = [
                  e("option", { value: "open" }, "Open", -1),
                  e("option", { value: "in-progress" }, "In Progress", -1),
                  e("option", { value: "completed" }, "Completed", -1),
                  e("option", { value: "closed" }, "Closed", -1)
                ])], 544)), [
                  [E, h.value]
                ]) : (i(), l("span", {
                  key: 1,
                  class: K(`status-badge status-${c(u).status}`)
                }, p(c(u).status), 3))
              ], 32)
            ]),
            e("div", Ee, [
              t[19] || (t[19] = e("label", null, "Priority", -1)),
              e("div", {
                onDblclick: t[8] || (t[8] = (r) => P("priority", c(u).priority))
              }, [
                L.value === "priority" ? _((i(), l("select", {
                  key: 0,
                  "onUpdate:modelValue": t[7] || (t[7] = (r) => h.value = r),
                  onBlur: S,
                  onChange: S,
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: U
                }, [...t[18] || (t[18] = [
                  e("option", { value: "low" }, "Low", -1),
                  e("option", { value: "medium" }, "Medium", -1),
                  e("option", { value: "high" }, "High", -1),
                  e("option", { value: "critical" }, "Critical", -1)
                ])], 544)), [
                  [E, h.value]
                ]) : (i(), l("span", {
                  key: 1,
                  class: K(`priority-badge priority-${c(u).priority}`)
                }, p(c(u).priority), 3))
              ], 32)
            ]),
            e("div", Ne, [
              t[21] || (t[21] = e("label", null, "Assigned To", -1)),
              e("div", {
                onDblclick: t[10] || (t[10] = (r) => P("assigned_to", c(u).assigned_to || ""))
              }, [
                L.value === "assigned_to" ? _((i(), l("select", {
                  key: 0,
                  "onUpdate:modelValue": t[9] || (t[9] = (r) => h.value = r),
                  onBlur: S,
                  onChange: S,
                  class: "inline-edit",
                  ref_key: "editInput",
                  ref: U,
                  disabled: c(ne)
                }, [
                  t[20] || (t[20] = e("option", { value: "" }, "-- Unassigned --", -1)),
                  (i(!0), l(J, null, W(c(B), (r) => (i(), l("option", {
                    key: r.id,
                    value: r.id
                  }, p(r.name), 9, He))), 128))
                ], 40, Be)), [
                  [E, h.value]
                ]) : (i(), l("div", Qe, p(O(c(u).assigned_to) || "-"), 1))
              ], 32)
            ])
          ]),
          e("div", ze, [
            e("div", {
              class: "section-header",
              onClick: t[11] || (t[11] = (r) => F.value = !F.value)
            }, [
              e("h3", null, [
                e("span", Oe, p(F.value ? "▼" : "▶"), 1),
                t[22] || (t[22] = V(" History ", -1))
              ])
            ]),
            F.value ? (i(), l("div", je, [
              c(w) ? (i(), l("div", Re, "Loading history...")) : c(q) && c(q).length > 0 ? (i(), l("div", Je, [
                (i(!0), l(J, null, W(c(q), (r) => (i(), l("div", {
                  key: r.id,
                  class: "history-item"
                }, [
                  e("div", We, [
                    e("strong", null, p(O(r.changed_by)), 1),
                    e("span", Ge, p(Y(r.changed_at)), 1)
                  ]),
                  e("div", Xe, [
                    t[26] || (t[26] = V(" Changed ", -1)),
                    e("strong", null, p(oe(r.field_name)), 1),
                    e("span", Ye, [
                      t[23] || (t[23] = V(' from "', -1)),
                      e("span", Ze, p(r.old_value), 1),
                      t[24] || (t[24] = V('" to "', -1)),
                      e("span", et, p(r.new_value), 1),
                      t[25] || (t[25] = V('" ', -1))
                    ])
                  ])
                ]))), 128))
              ])) : (i(), l("div", tt, "No history yet"))
            ])) : ee("", !0)
          ]),
          e("div", st, [
            t[28] || (t[28] = e("h3", null, "Comments", -1)),
            c(k) ? (i(), l("div", nt, "Loading comments...")) : c(C) && c(C).length > 0 ? (i(), l("div", at, [
              (i(!0), l(J, null, W(c(C), (r) => (i(), l("div", {
                key: r.id,
                class: "comment-item"
              }, [
                e("div", ot, [
                  e("strong", null, p(O(r.created_by)), 1),
                  e("span", it, p(Y(r.created_at)), 1)
                ]),
                e("div", {
                  class: "comment-text",
                  innerHTML: v(r.comment)
                }, null, 8, lt)
              ]))), 128))
            ])) : (i(), l("div", rt, "No comments yet")),
            e("div", dt, [
              _(e("textarea", {
                "onUpdate:modelValue": t[12] || (t[12] = (r) => I.value = r),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: a,
                disabled: M.value
              }, null, 40, ut), [
                [Q, I.value]
              ]),
              t[27] || (t[27] = e("small", null, "Paste images from clipboard", -1)),
              e("button", {
                onClick: ae,
                disabled: !I.value.trim() || M.value,
                class: "btn-primary"
              }, [
                M.value ? (i(), l("span", mt, "Analyzing...")) : (i(), l("span", vt, "Add Comment"))
              ], 8, ct)
            ])
          ])
        ])) : ee("", !0)
      ]);
    };
  }
}), me = (o, y) => {
  const n = o.__vccOpts || o;
  for (const [d, u] of y)
    n[d] = u;
  return n;
}, pt = /* @__PURE__ */ me(yt, [["__scopeId", "data-v-01912df4"]]), ft = { class: "tasks-card" }, kt = {
  key: 0,
  class: "loading"
}, ht = {
  key: 1,
  class: "error"
}, gt = {
  key: 2,
  class: "tasks-container"
}, bt = { class: "tasks-header" }, wt = { class: "tasks-header-actions" }, _t = { class: "tasks-filters" }, $t = { class: "filter-checkbox" }, Ct = { class: "tasks-table-wrapper" }, It = { class: "tasks-table" }, Tt = {
  key: 0,
  class: "no-results"
}, Lt = { class: "task-actions" }, St = ["onClick"], qt = ["onClick", "title", "disabled"], At = { key: 0 }, Ut = { key: 1 }, Ft = {
  key: 3,
  class: "task-form-container"
}, xt = { class: "form-body" }, Dt = { class: "form-group" }, Vt = { class: "form-group" }, Mt = { class: "form-row" }, Pt = { class: "form-group" }, Kt = { class: "form-group" }, Et = { class: "form-group" }, Nt = ["disabled"], Bt = ["value"], Ht = { class: "form-actions" }, Qt = ["disabled"], zt = /* @__PURE__ */ de({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(o, { emit: y }) {
    const n = o, d = y, u = b(""), T = b(""), f = b("list"), C = b(null);
    b(null), b(""), b(null);
    const k = b({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: n.userId
    }), q = b(!1), w = b(null);
    b(null);
    const X = le(() => ({
      status: T.value || void 0
    })), { data: N, isLoading: L, error: h } = we(X), U = Ie(), I = ue();
    Le();
    const { data: F, isLoading: M } = ce(), B = le(() => {
      if (!N.value) return [];
      const v = u.value.toLowerCase().trim();
      let s = N.value.filter((a) => q.value ? !!a.archived : !a.archived);
      return v ? s.filter((a) => {
        var D, r, j, R, Z;
        const x = ((D = a.summary) == null ? void 0 : D.toLowerCase()) || "", O = ((r = a.description) == null ? void 0 : r.toLowerCase()) || "", m = ((j = a.status) == null ? void 0 : j.toLowerCase().replace("_", " ")) || "", t = ((R = a.priority) == null ? void 0 : R.toLowerCase()) || "", g = ((Z = a.assigned_to) == null ? void 0 : Z.toLowerCase()) || "";
        return x.includes(v) || O.includes(v) || m.includes(v) || t.includes(v) || g.includes(v);
      }) : s;
    });
    function ne(v) {
      return new Date(v).toLocaleDateString();
    }
    async function P() {
      try {
        await U.mutateAsync(k.value), H(), f.value = "list";
      } catch (v) {
        console.error("Failed to create task:", v);
      }
    }
    function H() {
      k.value = {
        summary: "",
        description: "",
        status: "open",
        priority: "medium",
        assigned_to: "",
        created_by: n.userId
      };
    }
    function S() {
      H(), f.value = "create";
    }
    function ae(v) {
      C.value = v, f.value = "detail";
    }
    function z() {
      f.value = "list", C.value = null;
    }
    fe(() => {
      const s = new URLSearchParams(window.location.search).get("taskId");
      s && (C.value = s, f.value = "detail");
    }), ke([C, f], ([v, s]) => {
      const a = new URLSearchParams(window.location.search);
      s === "detail" && v ? a.set("taskId", v) : a.delete("taskId");
      const x = `${window.location.pathname}?${a.toString()}`;
      window.history.replaceState({}, "", x);
    });
    async function Y(v) {
      w.value = v.id;
      try {
        await I.mutateAsync({
          id: v.id,
          updates: { archived: !v.archived },
          userId: n.userId
        });
      } catch (s) {
        console.error("Failed to archive/unarchive task:", s);
      } finally {
        w.value = null;
      }
    }
    function oe(v) {
      if (!v || !F.value) return "";
      const s = F.value.find((a) => a.id === v);
      return (s == null ? void 0 : s.name) || v;
    }
    return (v, s) => (i(), l("div", ft, [
      c(L) && !c(N) ? (i(), l("div", kt, [...s[10] || (s[10] = [
        e("div", { class: "loading-spinner" }, null, -1),
        V(" Loading tasks... ", -1)
      ])])) : c(h) ? (i(), l("div", ht, [
        s[11] || (s[11] = e("h3", null, "Error loading tasks", -1)),
        e("p", null, p(c(h)), 1)
      ])) : f.value === "list" ? (i(), l("div", gt, [
        e("div", bt, [
          e("h2", {
            class: K({ "tasks-header-clickable": n.showHeaderLink }),
            onClick: s[0] || (s[0] = (a) => n.showHeaderLink && d("navigate"))
          }, " Tasks Management ", 2),
          e("div", wt, [
            e("button", {
              class: "btn btn-primary",
              onClick: S
            }, [...s[12] || (s[12] = [
              e("span", { class: "icon" }, "➕", -1),
              V(" New Task ", -1)
            ])]),
            e("button", {
              class: "btn btn-minimize",
              onClick: s[1] || (s[1] = (a) => d("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        e("div", _t, [
          _(e("input", {
            "onUpdate:modelValue": s[2] || (s[2] = (a) => u.value = a),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [Q, u.value]
          ]),
          _(e("select", {
            "onUpdate:modelValue": s[3] || (s[3] = (a) => T.value = a),
            class: "filter-select"
          }, [...s[13] || (s[13] = [
            e("option", { value: "" }, "All Status", -1),
            e("option", { value: "open" }, "Open", -1),
            e("option", { value: "in_progress" }, "In Progress", -1),
            e("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [E, T.value]
          ]),
          e("label", $t, [
            _(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": s[4] || (s[4] = (a) => q.value = a)
            }, null, 512), [
              [ge, q.value]
            ]),
            s[14] || (s[14] = V(" Show Archived ", -1))
          ])
        ]),
        e("div", Ct, [
          e("table", It, [
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
              B.value.length === 0 ? (i(), l("tr", Tt, [...s[15] || (s[15] = [
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
              (i(!0), l(J, null, W(B.value, (a) => (i(), l("tr", {
                key: a.id
              }, [
                e("td", null, p(a.summary), 1),
                e("td", null, [
                  e("span", {
                    class: K(`status-badge status-${a.status}`)
                  }, p(a.status), 3)
                ]),
                e("td", null, [
                  e("span", {
                    class: K(`priority-badge priority-${a.priority}`)
                  }, p(a.priority), 3)
                ]),
                e("td", null, p(oe(a.assigned_to) || "-"), 1),
                e("td", null, p(ne(a.created_at)), 1),
                e("td", Lt, [
                  e("button", {
                    class: "btn btn-icon",
                    onClick: (x) => ae(a.id),
                    title: "View details"
                  }, " 👁️ ", 8, St),
                  e("button", {
                    class: K(["btn btn-icon", a.archived ? "btn-success" : "btn-danger"]),
                    onClick: (x) => Y(a),
                    title: a.archived ? "Unarchive task" : "Archive task",
                    disabled: w.value === a.id
                  }, [
                    w.value === a.id ? (i(), l("span", At, [...s[16] || (s[16] = [
                      e("span", {
                        class: "loading-spinner",
                        style: { display: "inline-block", width: "1em", height: "1em", "border-width": "2px" }
                      }, null, -1)
                    ])])) : (i(), l("span", Ut, p(a.archived ? "↩️" : "🗑️"), 1))
                  ], 10, qt)
                ])
              ]))), 128))
            ])
          ])
        ])
      ])) : f.value === "create" ? (i(), l("div", Ft, [
        e("div", { class: "form-header" }, [
          e("button", {
            class: "btn btn-back",
            onClick: z
          }, " ← Back to Tasks "),
          s[18] || (s[18] = e("h2", null, "Create New Task", -1))
        ]),
        e("div", xt, [
          e("div", Dt, [
            s[19] || (s[19] = e("label", { for: "task-summary" }, "Summary *", -1)),
            _(e("input", {
              id: "task-summary",
              "onUpdate:modelValue": s[5] || (s[5] = (a) => k.value.summary = a),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [Q, k.value.summary]
            ])
          ]),
          e("div", Vt, [
            s[20] || (s[20] = e("label", { for: "task-description" }, "Description", -1)),
            _(e("textarea", {
              id: "task-description",
              "onUpdate:modelValue": s[6] || (s[6] = (a) => k.value.description = a),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [Q, k.value.description]
            ])
          ]),
          e("div", Mt, [
            e("div", Pt, [
              s[22] || (s[22] = e("label", { for: "task-status" }, "Status", -1)),
              _(e("select", {
                id: "task-status",
                "onUpdate:modelValue": s[7] || (s[7] = (a) => k.value.status = a)
              }, [...s[21] || (s[21] = [
                e("option", { value: "open" }, "Open", -1),
                e("option", { value: "in_progress" }, "In Progress", -1),
                e("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [E, k.value.status]
              ])
            ]),
            e("div", Kt, [
              s[24] || (s[24] = e("label", { for: "task-priority" }, "Priority", -1)),
              _(e("select", {
                id: "task-priority",
                "onUpdate:modelValue": s[8] || (s[8] = (a) => k.value.priority = a)
              }, [...s[23] || (s[23] = [
                e("option", { value: "low" }, "Low", -1),
                e("option", { value: "medium" }, "Medium", -1),
                e("option", { value: "high" }, "High", -1)
              ])], 512), [
                [E, k.value.priority]
              ])
            ])
          ]),
          e("div", Et, [
            s[26] || (s[26] = e("label", { for: "task-assigned" }, "Assigned To", -1)),
            _(e("select", {
              id: "task-assigned",
              "onUpdate:modelValue": s[9] || (s[9] = (a) => k.value.assigned_to = a),
              disabled: c(M)
            }, [
              s[25] || (s[25] = e("option", { value: "" }, "-- Select User --", -1)),
              (i(!0), l(J, null, W(c(F), (a) => (i(), l("option", {
                key: a.id,
                value: a.id
              }, p(a.name), 9, Bt))), 128))
            ], 8, Nt), [
              [E, k.value.assigned_to]
            ])
          ]),
          e("div", Ht, [
            e("button", {
              class: "btn btn-cancel",
              onClick: z
            }, "Cancel"),
            e("button", {
              class: "btn btn-primary",
              onClick: P,
              disabled: !k.value.summary.trim()
            }, " Create Task ", 8, Qt)
          ])
        ])
      ])) : f.value === "detail" && C.value ? (i(), he(pt, {
        key: 4,
        "task-id": C.value,
        "user-id": o.userId,
        onClose: z
      }, null, 8, ["task-id", "user-id"])) : ee("", !0)
    ]));
  }
}), Rt = /* @__PURE__ */ me(zt, [["__scopeId", "data-v-b7f19e01"]]);
export {
  pt as TaskDetail,
  Rt as Tasks
};
