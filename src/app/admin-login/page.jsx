"use client";

import { useEffect, useState } from "react";
import { loadCurrentUser } from "@/lib/currentUser";

const LOGIN_INIT = { employeeId: "", password: "" };

export default function AdminLoginPage() {
  const [login, setLogin] = useState(LOGIN_INIT);
  const [showPwd, setShowPwd] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [loginLoad, setLoginLoad] = useState(false);

  useEffect(() => {
    loadCurrentUser().then((user) => {
      if (user) window.location.href = "/admin_dashboard";
    });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginErr("");
    if (!login.employeeId.trim() || !login.password) {
      setLoginErr("Please enter both Employee ID and Password.");
      return;
    }
    setLoginLoad(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: login.employeeId,
          password: login.password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginErr(data.message || "Invalid Employee ID or Password.");
        setLoginLoad(false);
        return;
      }
      sessionStorage.setItem("currentUser", JSON.stringify(data.user));
      window.location.href = data.redirectTo;
    } catch {
      setLoginErr("Could not reach the server. Please try again.");
      setLoginLoad(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b1830] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="card-shadow flex flex-col overflow-hidden rounded-3xl bg-white">
          <div className="card-header relative overflow-hidden px-5 py-5">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-white shadow-lg border border-white/30">
                <img src="/images/nisir_bank_logo.svg" alt="Nisir Bank S.C." className="h-12 w-12 object-contain" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200/80">
                  Nisir Bank S.C.
                </p>
                <p className="hg text-lg font-bold text-white leading-tight">Admin Portal</p>
                <p className="text-[11px] text-white/60 mt-0.5">SETA Research Administration</p>
              </div>
            </div>
          </div>

          <div className="card-form px-5 pb-5 pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginErr && <StatusMessage type="err" text={loginErr} />}

              <FormField label="Employee ID" htmlFor="employee-id" icon="badge">
                <input
                  id="employee-id"
                  type="text"
                  placeholder="e.g. ADMIN"
                  className="inp"
                  value={login.employeeId}
                  onChange={(e) => setLogin({ ...login, employeeId: e.target.value })}
                />
              </FormField>

              <FormField label="Password" htmlFor="password" icon="lock">
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    className="inp"
                    style={{ paddingRight: "48px" }}
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    onPointerDown={() => setShowPwd(true)}
                    onPointerUp={() => setShowPwd(false)}
                    onPointerCancel={() => setShowPwd(false)}
                    onPointerLeave={() => setShowPwd(false)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPwd ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </FormField>

              <button type="submit" className="btn-primary mt-1 w-full" disabled={loginLoad}>
                {loginLoad ? (
                  <>
                    <span className="material-symbols-outlined spin text-base">progress_activity</span>
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex items-center justify-center border-t border-gray-100 bg-gray-50 px-5 py-3">
            <p className="text-[11px] text-gray-400">© 2026 Nisir Bank S.C.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function FormField({ label, htmlFor, icon, children }) {
  return (
    <div>
      <label className="card-label mb-1.5 block" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </span>
        {children}
      </div>
    </div>
  );
}

function StatusMessage({ type, text }) {
  return (
    <div className={type === "ok" ? "success-msg show" : "error-msg show"}>
      <span className="material-symbols-outlined text-base">
        {type === "ok" ? "check_circle" : "error"}
      </span>
      <span>{text}</span>
    </div>
  );
}
