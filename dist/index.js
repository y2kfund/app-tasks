import { inject as vt, computed as it, unref as c, defineComponent as rt, ref as g, createElementBlock as l, openBlock as i, createElementVNode as t, createCommentVNode as tt, toDisplayString as p, normalizeClass as K, withDirectives as $, withKeys as yt, vModelText as R, vModelSelect as E, Fragment as J, renderList as W, createTextVNode as V, nextTick as pt, onMounted as ft, watch as kt, createBlock as ht, vModelCheckbox as gt } from "vue";
import { useQuery as G, useQueryClient as et, useMutation as st } from "@tanstack/vue-query";
const bt = Symbol.for("y2kfund.supabase");
function A() {
  const o = vt(bt, null);
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
function _t(o) {
  const y = A();
  return G({
    queryKey: it(() => {
      const n = o ? c(o) : {};
      return w.list(n);
    }),
    queryFn: async () => {
      const n = o ? c(o) : {};
      let r = y.schema("hf").from("tasks").select("*").order("created_at", { ascending: !1 });
      if (n != null && n.status && (r = r.eq("status", n.status)), n != null && n.search && n.search.trim()) {
        const f = n.search.trim();
        r = r.or(`summary.ilike.%${f}%,description.ilike.%${f}%`);
      }
      const { data: u, error: L } = await r;
      if (L) throw L;
      return u;
    }
  });
}
function wt(o) {
  const y = A();
  return G({
    queryKey: w.detail(o),
    queryFn: async () => {
      const { data: n, error: r } = await y.schema("hf").from("tasks").select("*").eq("id", o).single();
      if (r) throw r;
      return n;
    },
    enabled: !!o
  });
}
function $t(o) {
  const y = A();
  return G({
    queryKey: w.comments(o),
    queryFn: async () => {
      const { data: n, error: r } = await y.schema("hf").from("task_comments").select("*").eq("task_id", o).order("created_at", { ascending: !1 });
      if (r) throw r;
      return n;
    },
    enabled: !!o
  });
}
function Ct(o) {
  const y = A();
  return G({
    queryKey: w.history(o),
    queryFn: async () => {
      const { data: n, error: r } = await y.schema("hf").from("task_history").select("*").eq("task_id", o).order("changed_at", { ascending: !1 });
      if (r) throw r;
      return n;
    },
    enabled: !!o
  });
}
function It() {
  const o = A(), y = et();
  return st({
    mutationFn: async (n) => {
      const { data: r, error: u } = await o.schema("hf").from("tasks").insert(n).select().single();
      if (u) throw u;
      return r;
    },
    onSuccess: () => {
      y.invalidateQueries({ queryKey: w.all });
    }
  });
}
function dt() {
  const o = A(), y = et();
  return st({
    mutationFn: async ({
      id: n,
      updates: r,
      userId: u
    }) => {
      const { data: L, error: f } = await o.schema("hf").from("tasks").select("*").eq("id", n).single();
      if (f) throw f;
      const { data: C, error: k } = await o.schema("hf").from("tasks").update(r).eq("id", n).select().single();
      if (k) throw k;
      const T = Object.keys(r).filter((b) => L[b] !== r[b]).map((b) => ({
        task_id: n,
        field_name: b,
        old_value: String(L[b] || ""),
        new_value: String(r[b] || ""),
        changed_by: u
      }));
      if (T.length > 0) {
        const { error: b } = await o.schema("hf").from("task_history").insert(T);
        b && console.error("Failed to save history:", b);
      }
      return C;
    },
    onSuccess: (n) => {
      y.invalidateQueries({ queryKey: w.all }), y.invalidateQueries({ queryKey: w.detail(n.id) }), y.invalidateQueries({ queryKey: w.history(n.id) });
    }
  });
}
function Lt() {
  const o = A(), y = et();
  return st({
    mutationFn: async (n) => {
      const { data: r, error: u } = await o.schema("hf").from("task_comments").insert(n).select().single();
      if (u) throw u;
      return r;
    },
    onSuccess: (n) => {
      y.invalidateQueries({ queryKey: w.comments(n.task_id) });
    }
  });
}
function Tt() {
  const o = A(), y = et();
  return st({
    mutationFn: async (n) => {
      await o.schema("hf").from("task_comments").delete().eq("task_id", n), await o.schema("hf").from("task_history").delete().eq("task_id", n);
      const { error: r } = await o.schema("hf").from("tasks").delete().eq("id", n);
      if (r) throw r;
      return n;
    },
    onSuccess: () => {
      y.invalidateQueries({ queryKey: w.all });
    }
  });
}
function ut() {
  const o = A();
  return G({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: y, error: n } = await o.from("users_view").select("id, email, name").order("email");
      if (n) throw n;
      return (y || []).map((r) => ({
        id: r.id,
        email: r.email,
        name: r.name || r.email
      }));
    },
    staleTime: 5 * 60 * 1e3
  });
}
const qt = { class: "detail-container" }, St = { class: "detail-header" }, At = { class: "header-summary" }, Ut = {
  key: 0,
  class: "loading"
}, Ft = {
  key: 1,
  class: "error"
}, Dt = {
  key: 2,
  class: "detail-content"
}, xt = { class: "task-info" }, Vt = { class: "info-row" }, Mt = ["innerHTML"], Pt = { class: "info-row" }, Kt = { class: "info-value details-row" }, Et = { class: "detail-item" }, Nt = { class: "detail-item" }, Ht = { class: "detail-item" }, Bt = ["disabled"], Qt = ["value"], zt = {
  key: 1,
  class: "info-value"
}, Ot = { class: "history-section" }, jt = { class: "expand-icon" }, Rt = { key: 0 }, Jt = {
  key: 0,
  class: "loading"
}, Wt = {
  key: 1,
  class: "history-list"
}, Gt = { class: "history-meta" }, Xt = { class: "history-date" }, Yt = { class: "history-change" }, Zt = { class: "change-values" }, te = { class: "old-value" }, ee = { class: "new-value" }, se = {
  key: 2,
  class: "no-history"
}, ne = { class: "comments-section" }, ae = {
  key: 0,
  class: "loading"
}, oe = {
  key: 1,
  class: "comments-list"
}, ie = { class: "comment-meta" }, le = { class: "comment-date" }, re = ["innerHTML"], de = {
  key: 2,
  class: "no-comments"
}, ue = { class: "add-comment" }, ce = ["disabled"], me = ["disabled"], ve = { key: 0 }, ye = { key: 1 }, pe = /* @__PURE__ */ rt({
  __name: "TaskDetail",
  props: {
    taskId: {},
    userId: {}
  },
  emits: ["close"],
  setup(o, { emit: y }) {
    const n = o, r = y, { data: u, isLoading: L, error: f } = wt(n.taskId), { data: C, isLoading: k } = $t(n.taskId), { data: T, isLoading: b } = Ct(n.taskId), X = dt(), N = Lt(), q = g(null), _ = g(""), M = g(null), I = g(""), U = g(!1), P = g(!1), { data: H, isLoading: nt } = ut();
    async function B(m, e) {
      q.value = m, _.value = e, await pt();
      const h = M.value;
      h && typeof h.focus == "function" && h.focus();
    }
    function Q() {
      q.value = null, _.value = "";
    }
    async function S() {
      if (!q.value || !u.value) return;
      const m = q.value, e = u.value[m];
      if (_.value !== e)
        try {
          await X.mutateAsync({
            id: n.taskId,
            updates: { [m]: _.value },
            userId: n.userId
          });
        } catch (h) {
          console.error("Failed to update task:", h);
        }
      Q();
    }
    async function at() {
      if (I.value.trim()) {
        if (I.value.trim().startsWith("@analyze")) {
          const m = I.value.trim().replace(/^@analyze\s*/, "");
          if (!m) return;
          P.value = !0;
          try {
            const h = await (await fetch("https://www.y2k.fund/api/ai-analyze-task", {
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
${h.reply}`,
              created_by: "ai"
              // or props.userId if you want to attribute to user
            }), I.value = "";
          } catch (e) {
            console.error("AI analysis failed:", e);
          } finally {
            P.value = !1;
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
    function ot(m) {
      return m.replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
    }
    function v(m) {
      return m.replace(
        /!\[.*?\]\((https?:\/\/[^)]+|data:image\/[^)]+)\)/g,
        `<img src="$1" class="img-thumb" data-src="$1" onclick="window.open(this.dataset.src,'_blank')" />`
      ).replace(/\n/g, "<br/>");
    }
    async function s(m) {
      await F(m, (e) => {
        _.value += `
![image](${e})
`;
      });
    }
    async function a(m) {
      await F(m, (e) => {
        I.value += `
![image](${e})
`;
      });
    }
    async function F(m, e) {
      var D;
      const h = (D = m.clipboardData) == null ? void 0 : D.items;
      if (h) {
        for (const x of h)
          if (x.type.indexOf("image") !== -1) {
            m.preventDefault();
            const d = x.getAsFile();
            if (d) {
              const j = new FileReader();
              j.onload = (Z) => {
                var lt;
                const mt = (lt = Z.target) == null ? void 0 : lt.result;
                e(mt);
              }, j.readAsDataURL(d);
            }
          }
      }
    }
    function O(m) {
      if (!m || !H.value) return "";
      const e = H.value.find((h) => h.id === m);
      return (e == null ? void 0 : e.name) || m;
    }
    return (m, e) => {
      var h, D, x;
      return i(), l("div", qt, [
        t("div", St, [
          t("button", {
            class: "btn btn-back",
            onClick: e[0] || (e[0] = (d) => r("close"))
          }, " ← Back to Tasks "),
          t("h2", At, p(((h = c(u)) == null ? void 0 : h.summary) || "Task Details"), 1),
          t("button", {
            class: K(["btn", (D = c(u)) != null && D.archived ? "btn-success" : "btn-danger"]),
            onClick: z
          }, p((x = c(u)) != null && x.archived ? "Unarchive" : "Archive") + " Task ", 3)
        ]),
        c(L) ? (i(), l("div", Ut, "Loading task details...")) : c(f) ? (i(), l("div", Ft, "Error: " + p(c(f)), 1)) : c(u) ? (i(), l("div", Dt, [
          t("div", xt, [
            t("div", Vt, [
              e[11] || (e[11] = t("label", null, "Description", -1)),
              t("div", {
                onDblclick: e[2] || (e[2] = (d) => B("description", c(u).description || ""))
              }, [
                q.value === "description" ? $((i(), l("textarea", {
                  key: 0,
                  "onUpdate:modelValue": e[1] || (e[1] = (d) => _.value = d),
                  onBlur: S,
                  onKeyup: yt(Q, ["esc"]),
                  onPaste: s,
                  class: "inline-edit",
                  rows: "4",
                  ref_key: "editInput",
                  ref: M
                }, null, 544)), [
                  [R, _.value]
                ]) : (i(), l("div", {
                  key: 1,
                  class: "info-value",
                  innerHTML: v(c(u).description || "")
                }, null, 8, Mt))
              ], 32)
            ]),
            t("div", Pt, [
              e[18] || (e[18] = t("label", null, "Details", -1)),
              t("div", Kt, [
                t("div", Et, [
                  e[13] || (e[13] = t("div", { class: "small-label" }, "Status", -1)),
                  t("div", {
                    onDblclick: e[4] || (e[4] = (d) => B("status", c(u).status))
                  }, [
                    q.value === "status" ? $((i(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": e[3] || (e[3] = (d) => _.value = d),
                      onBlur: S,
                      onChange: S,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: M
                    }, [...e[12] || (e[12] = [
                      t("option", { value: "open" }, "Open", -1),
                      t("option", { value: "in-progress" }, "In Progress", -1),
                      t("option", { value: "completed" }, "Completed", -1),
                      t("option", { value: "closed" }, "Closed", -1)
                    ])], 544)), [
                      [E, _.value]
                    ]) : (i(), l("span", {
                      key: 1,
                      class: K(`status-badge status-${c(u).status}`)
                    }, p(c(u).status), 3))
                  ], 32)
                ]),
                t("div", Nt, [
                  e[15] || (e[15] = t("div", { class: "small-label" }, "Priority", -1)),
                  t("div", {
                    onDblclick: e[6] || (e[6] = (d) => B("priority", c(u).priority))
                  }, [
                    q.value === "priority" ? $((i(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": e[5] || (e[5] = (d) => _.value = d),
                      onBlur: S,
                      onChange: S,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: M
                    }, [...e[14] || (e[14] = [
                      t("option", { value: "low" }, "Low", -1),
                      t("option", { value: "medium" }, "Medium", -1),
                      t("option", { value: "high" }, "High", -1),
                      t("option", { value: "critical" }, "Critical", -1)
                    ])], 544)), [
                      [E, _.value]
                    ]) : (i(), l("span", {
                      key: 1,
                      class: K(`priority-badge priority-${c(u).priority}`)
                    }, p(c(u).priority), 3))
                  ], 32)
                ]),
                t("div", Ht, [
                  e[17] || (e[17] = t("div", { class: "small-label" }, "Assigned", -1)),
                  t("div", {
                    onDblclick: e[8] || (e[8] = (d) => B("assigned_to", c(u).assigned_to || ""))
                  }, [
                    q.value === "assigned_to" ? $((i(), l("select", {
                      key: 0,
                      "onUpdate:modelValue": e[7] || (e[7] = (d) => _.value = d),
                      onBlur: S,
                      onChange: S,
                      class: "inline-edit",
                      ref_key: "editInput",
                      ref: M,
                      disabled: c(nt)
                    }, [
                      e[16] || (e[16] = t("option", { value: "" }, "-- Unassigned --", -1)),
                      (i(!0), l(J, null, W(c(H), (d) => (i(), l("option", {
                        key: d.id,
                        value: d.id
                      }, p(d.name), 9, Qt))), 128))
                    ], 40, Bt)), [
                      [E, _.value]
                    ]) : (i(), l("div", zt, p(O(c(u).assigned_to) || "-"), 1))
                  ], 32)
                ])
              ])
            ])
          ]),
          t("div", Ot, [
            t("div", {
              class: "section-header",
              onClick: e[9] || (e[9] = (d) => U.value = !U.value)
            }, [
              t("h3", null, [
                t("span", jt, p(U.value ? "▼" : "▶"), 1),
                e[19] || (e[19] = V(" History ", -1))
              ])
            ]),
            U.value ? (i(), l("div", Rt, [
              c(b) ? (i(), l("div", Jt, "Loading history...")) : c(T) && c(T).length > 0 ? (i(), l("div", Wt, [
                (i(!0), l(J, null, W(c(T), (d) => (i(), l("div", {
                  key: d.id,
                  class: "history-item"
                }, [
                  t("div", Gt, [
                    t("strong", null, p(O(d.changed_by)), 1),
                    t("span", Xt, p(Y(d.changed_at)), 1)
                  ]),
                  t("div", Yt, [
                    e[23] || (e[23] = V(" Changed ", -1)),
                    t("strong", null, p(ot(d.field_name)), 1),
                    t("span", Zt, [
                      e[20] || (e[20] = V(' from "', -1)),
                      t("span", te, p(d.old_value), 1),
                      e[21] || (e[21] = V('" to "', -1)),
                      t("span", ee, p(d.new_value), 1),
                      e[22] || (e[22] = V('" ', -1))
                    ])
                  ])
                ]))), 128))
              ])) : (i(), l("div", se, "No history yet"))
            ])) : tt("", !0)
          ]),
          t("div", ne, [
            e[25] || (e[25] = t("h3", null, "Comments", -1)),
            c(k) ? (i(), l("div", ae, "Loading comments...")) : c(C) && c(C).length > 0 ? (i(), l("div", oe, [
              (i(!0), l(J, null, W(c(C), (d) => (i(), l("div", {
                key: d.id,
                class: "comment-item"
              }, [
                t("div", ie, [
                  t("strong", null, p(O(d.created_by)), 1),
                  t("span", le, p(Y(d.created_at)), 1)
                ]),
                t("div", {
                  class: "comment-text",
                  innerHTML: v(d.comment)
                }, null, 8, re)
              ]))), 128))
            ])) : (i(), l("div", de, "No comments yet")),
            t("div", ue, [
              $(t("textarea", {
                "onUpdate:modelValue": e[10] || (e[10] = (d) => I.value = d),
                placeholder: "Add a comment...",
                rows: "3",
                class: "comment-input",
                onPaste: a,
                disabled: P.value
              }, null, 40, ce), [
                [R, I.value]
              ]),
              e[24] || (e[24] = t("small", null, "Paste images from clipboard", -1)),
              t("button", {
                onClick: at,
                disabled: !I.value.trim() || P.value,
                class: "btn-primary"
              }, [
                P.value ? (i(), l("span", ve, "Analyzing...")) : (i(), l("span", ye, "Add Comment"))
              ], 8, me)
            ])
          ])
        ])) : tt("", !0)
      ]);
    };
  }
}), ct = (o, y) => {
  const n = o.__vccOpts || o;
  for (const [r, u] of y)
    n[r] = u;
  return n;
}, fe = /* @__PURE__ */ ct(pe, [["__scopeId", "data-v-59cbdd1e"]]), ke = { class: "tasks-card" }, he = {
  key: 0,
  class: "loading"
}, ge = {
  key: 1,
  class: "error"
}, be = {
  key: 2,
  class: "tasks-container"
}, _e = { class: "tasks-header" }, we = { class: "tasks-header-actions" }, $e = { class: "tasks-filters" }, Ce = { class: "filter-checkbox" }, Ie = { class: "tasks-table-wrapper" }, Le = { class: "tasks-table" }, Te = {
  key: 0,
  class: "no-results"
}, qe = { class: "task-actions" }, Se = ["onClick"], Ae = ["onClick", "title", "disabled"], Ue = { key: 0 }, Fe = { key: 1 }, De = {
  key: 3,
  class: "task-form-container"
}, xe = { class: "form-body" }, Ve = { class: "form-group" }, Me = { class: "form-group" }, Pe = { class: "form-row" }, Ke = { class: "form-group" }, Ee = { class: "form-group" }, Ne = { class: "form-group" }, He = ["disabled"], Be = ["value"], Qe = { class: "form-actions" }, ze = ["disabled"], Oe = /* @__PURE__ */ rt({
  __name: "Tasks",
  props: {
    userId: { default: "default-user" },
    showHeaderLink: { type: Boolean, default: !1 }
  },
  emits: ["minimize", "navigate"],
  setup(o, { emit: y }) {
    const n = o, r = y, u = g(""), L = g(""), f = g("list"), C = g(null);
    g(null), g(""), g(null);
    const k = g({
      summary: "",
      description: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      created_by: n.userId
    }), T = g(!1), b = g(null);
    g(null);
    const X = it(() => ({
      status: L.value || void 0
    })), { data: N, isLoading: q, error: _ } = _t(X), M = It(), I = dt();
    Tt();
    const { data: U, isLoading: P } = ut(), H = it(() => {
      if (!N.value) return [];
      const v = u.value.toLowerCase().trim();
      let s = N.value.filter((a) => T.value ? !!a.archived : !a.archived);
      return v ? s.filter((a) => {
        var D, x, d, j, Z;
        const F = ((D = a.summary) == null ? void 0 : D.toLowerCase()) || "", O = ((x = a.description) == null ? void 0 : x.toLowerCase()) || "", m = ((d = a.status) == null ? void 0 : d.toLowerCase().replace("_", " ")) || "", e = ((j = a.priority) == null ? void 0 : j.toLowerCase()) || "", h = ((Z = a.assigned_to) == null ? void 0 : Z.toLowerCase()) || "";
        return F.includes(v) || O.includes(v) || m.includes(v) || e.includes(v) || h.includes(v);
      }) : s;
    });
    function nt(v) {
      return new Date(v).toLocaleDateString();
    }
    async function B() {
      try {
        await M.mutateAsync(k.value), Q(), f.value = "list";
      } catch (v) {
        console.error("Failed to create task:", v);
      }
    }
    function Q() {
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
      Q(), f.value = "create";
    }
    function at(v) {
      C.value = v, f.value = "detail";
    }
    function z() {
      f.value = "list", C.value = null;
    }
    ft(() => {
      const s = new URLSearchParams(window.location.search).get("taskId");
      s && (C.value = s, f.value = "detail");
    }), kt([C, f], ([v, s]) => {
      const a = new URLSearchParams(window.location.search);
      s === "detail" && v ? a.set("taskId", v) : a.delete("taskId");
      const F = `${window.location.pathname}?${a.toString()}`;
      window.history.replaceState({}, "", F);
    });
    async function Y(v) {
      b.value = v.id;
      try {
        await I.mutateAsync({
          id: v.id,
          updates: { archived: !v.archived },
          userId: n.userId
        });
      } catch (s) {
        console.error("Failed to archive/unarchive task:", s);
      } finally {
        b.value = null;
      }
    }
    function ot(v) {
      if (!v || !U.value) return "";
      const s = U.value.find((a) => a.id === v);
      return (s == null ? void 0 : s.name) || v;
    }
    return (v, s) => (i(), l("div", ke, [
      c(q) && !c(N) ? (i(), l("div", he, [...s[10] || (s[10] = [
        t("div", { class: "loading-spinner" }, null, -1),
        V(" Loading tasks... ", -1)
      ])])) : c(_) ? (i(), l("div", ge, [
        s[11] || (s[11] = t("h3", null, "Error loading tasks", -1)),
        t("p", null, p(c(_)), 1)
      ])) : f.value === "list" ? (i(), l("div", be, [
        t("div", _e, [
          t("h2", {
            class: K({ "tasks-header-clickable": n.showHeaderLink }),
            onClick: s[0] || (s[0] = (a) => n.showHeaderLink && r("navigate"))
          }, " Tasks Management ", 2),
          t("div", we, [
            t("button", {
              class: "btn btn-primary",
              onClick: S
            }, [...s[12] || (s[12] = [
              t("span", { class: "icon" }, "➕", -1),
              V(" New Task ", -1)
            ])]),
            t("button", {
              class: "btn btn-minimize",
              onClick: s[1] || (s[1] = (a) => r("minimize")),
              title: "Minimize"
            }, " ➖ ")
          ])
        ]),
        t("div", $e, [
          $(t("input", {
            "onUpdate:modelValue": s[2] || (s[2] = (a) => u.value = a),
            type: "text",
            placeholder: "Search tasks...",
            class: "filter-input"
          }, null, 512), [
            [R, u.value]
          ]),
          $(t("select", {
            "onUpdate:modelValue": s[3] || (s[3] = (a) => L.value = a),
            class: "filter-select"
          }, [...s[13] || (s[13] = [
            t("option", { value: "" }, "All Status", -1),
            t("option", { value: "open" }, "Open", -1),
            t("option", { value: "in_progress" }, "In Progress", -1),
            t("option", { value: "completed" }, "Completed", -1)
          ])], 512), [
            [E, L.value]
          ]),
          t("label", Ce, [
            $(t("input", {
              type: "checkbox",
              "onUpdate:modelValue": s[4] || (s[4] = (a) => T.value = a)
            }, null, 512), [
              [gt, T.value]
            ]),
            s[14] || (s[14] = V(" Show Archived ", -1))
          ])
        ]),
        t("div", Ie, [
          t("table", Le, [
            s[17] || (s[17] = t("thead", null, [
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
              H.value.length === 0 ? (i(), l("tr", Te, [...s[15] || (s[15] = [
                t("td", {
                  colspan: "6",
                  class: "no-results-cell"
                }, [
                  t("div", { class: "no-results-content" }, [
                    t("span", { class: "no-results-icon" }, "🗂️"),
                    t("span", { class: "no-results-text" }, [
                      t("strong", null, "No tasks found.")
                    ])
                  ])
                ], -1)
              ])])) : tt("", !0),
              (i(!0), l(J, null, W(H.value, (a) => (i(), l("tr", {
                key: a.id
              }, [
                t("td", null, p(a.summary), 1),
                t("td", null, [
                  t("span", {
                    class: K(`status-badge status-${a.status}`)
                  }, p(a.status), 3)
                ]),
                t("td", null, [
                  t("span", {
                    class: K(`priority-badge priority-${a.priority}`)
                  }, p(a.priority), 3)
                ]),
                t("td", null, p(ot(a.assigned_to) || "-"), 1),
                t("td", null, p(nt(a.created_at)), 1),
                t("td", qe, [
                  t("button", {
                    class: "btn btn-icon",
                    onClick: (F) => at(a.id),
                    title: "View details"
                  }, " 👁️ ", 8, Se),
                  t("button", {
                    class: K(["btn btn-icon", a.archived ? "btn-success" : "btn-danger"]),
                    onClick: (F) => Y(a),
                    title: a.archived ? "Unarchive task" : "Archive task",
                    disabled: b.value === a.id
                  }, [
                    b.value === a.id ? (i(), l("span", Ue, [...s[16] || (s[16] = [
                      t("span", {
                        class: "loading-spinner",
                        style: { display: "inline-block", width: "1em", height: "1em", "border-width": "2px" }
                      }, null, -1)
                    ])])) : (i(), l("span", Fe, p(a.archived ? "↩️" : "🗑️"), 1))
                  ], 10, Ae)
                ])
              ]))), 128))
            ])
          ])
        ])
      ])) : f.value === "create" ? (i(), l("div", De, [
        t("div", { class: "form-header" }, [
          t("button", {
            class: "btn btn-back",
            onClick: z
          }, " ← Back to Tasks "),
          s[18] || (s[18] = t("h2", null, "Create New Task", -1))
        ]),
        t("div", xe, [
          t("div", Ve, [
            s[19] || (s[19] = t("label", { for: "task-summary" }, "Summary *", -1)),
            $(t("input", {
              id: "task-summary",
              "onUpdate:modelValue": s[5] || (s[5] = (a) => k.value.summary = a),
              type: "text",
              placeholder: "Enter task summary",
              autofocus: ""
            }, null, 512), [
              [R, k.value.summary]
            ])
          ]),
          t("div", Me, [
            s[20] || (s[20] = t("label", { for: "task-description" }, "Description", -1)),
            $(t("textarea", {
              id: "task-description",
              "onUpdate:modelValue": s[6] || (s[6] = (a) => k.value.description = a),
              placeholder: "Enter task description",
              rows: "6"
            }, null, 512), [
              [R, k.value.description]
            ])
          ]),
          t("div", Pe, [
            t("div", Ke, [
              s[22] || (s[22] = t("label", { for: "task-status" }, "Status", -1)),
              $(t("select", {
                id: "task-status",
                "onUpdate:modelValue": s[7] || (s[7] = (a) => k.value.status = a)
              }, [...s[21] || (s[21] = [
                t("option", { value: "open" }, "Open", -1),
                t("option", { value: "in_progress" }, "In Progress", -1),
                t("option", { value: "completed" }, "Completed", -1)
              ])], 512), [
                [E, k.value.status]
              ])
            ]),
            t("div", Ee, [
              s[24] || (s[24] = t("label", { for: "task-priority" }, "Priority", -1)),
              $(t("select", {
                id: "task-priority",
                "onUpdate:modelValue": s[8] || (s[8] = (a) => k.value.priority = a)
              }, [...s[23] || (s[23] = [
                t("option", { value: "low" }, "Low", -1),
                t("option", { value: "medium" }, "Medium", -1),
                t("option", { value: "high" }, "High", -1)
              ])], 512), [
                [E, k.value.priority]
              ])
            ])
          ]),
          t("div", Ne, [
            s[26] || (s[26] = t("label", { for: "task-assigned" }, "Assigned To", -1)),
            $(t("select", {
              id: "task-assigned",
              "onUpdate:modelValue": s[9] || (s[9] = (a) => k.value.assigned_to = a),
              disabled: c(P)
            }, [
              s[25] || (s[25] = t("option", { value: "" }, "-- Select User --", -1)),
              (i(!0), l(J, null, W(c(U), (a) => (i(), l("option", {
                key: a.id,
                value: a.id
              }, p(a.name), 9, Be))), 128))
            ], 8, He), [
              [E, k.value.assigned_to]
            ])
          ]),
          t("div", Qe, [
            t("button", {
              class: "btn btn-cancel",
              onClick: z
            }, "Cancel"),
            t("button", {
              class: "btn btn-primary",
              onClick: B,
              disabled: !k.value.summary.trim()
            }, " Create Task ", 8, ze)
          ])
        ])
      ])) : f.value === "detail" && C.value ? (i(), ht(fe, {
        key: 4,
        "task-id": C.value,
        "user-id": o.userId,
        onClose: z
      }, null, 8, ["task-id", "user-id"])) : tt("", !0)
    ]));
  }
}), Je = /* @__PURE__ */ ct(Oe, [["__scopeId", "data-v-b7f19e01"]]);
export {
  fe as TaskDetail,
  Je as Tasks
};
