"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadCurrentUser } from "@/lib/currentUser";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    loadCurrentUser().then((parsed) => {
      if (!parsed) {
        router.replace("/admin-login");
        return;
      }
      if (parsed.role !== "ADMIN") {
        router.replace("/admin-login");
        return;
      }
      setAccount(parsed);
    });
  }, [router]);

  async function handleReset() {
    const confirmed = window.confirm(
      "This permanently deletes all Employee Login, Gallery Signup, and Survey Response data. This cannot be undone. Continue?"
    );
    if (!confirmed) return;

    setResetting(true);
    setResetMessage("");
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const { logins, surveys, gallery } = data.deleted;
        setResetMessage(
          `Cleared ${logins} employee login${logins === 1 ? "" : "s"}, ${surveys} survey response${surveys === 1 ? "" : "s"}, ${gallery} gallery signup${gallery === 1 ? "" : "s"}.`
        );
      } else {
        setResetMessage(data.message || "Reset failed.");
      }
    } catch {
      setResetMessage("Network error — could not reach the server.");
    }
    setResetting(false);
  }

  if (!account) {
    return <main className="min-h-screen bg-[#f0f4fb]" />;
  }

  return (
    <main className="min-h-screen bg-[#f0f4fb] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-1">
          Nisir Bank S.C — SETA Research
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">
          Signed in as {account.employeeId}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/employee-logins"
            className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <span className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">badge</span>
            </span>
            <div>
              <p className="font-bold text-gray-900 mb-1">Employee Logins</p>
              <p className="text-sm text-gray-500">
                Submissions from the employee login page.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/gallery-signups"
            className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <span className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">photo_library</span>
            </span>
            <div>
              <p className="font-bold text-gray-900 mb-1">Gallery Signups</p>
              <p className="text-sm text-gray-500">
                Submissions from the Nisir Bank S.C Gallery signup page.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/survey-responses"
            className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <span className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">fact_check</span>
            </span>
            <div>
              <p className="font-bold text-gray-900 mb-1">Survey Responses</p>
              <p className="text-sm text-gray-500">
                Submissions from the EBCA staff awareness survey.
              </p>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-bold text-red-800 mb-1">Danger Zone</p>
          <p className="text-sm text-red-700 mb-4">
            This is an experiment — use this to wipe collected data between test runs.
            Permanently deletes all Employee Login, Gallery Signup, and Survey Response
            records. Your own admin account is not affected.
          </p>
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-lg"
          >
            {resetting ? "Clearing…" : "Reset Experiment Data"}
          </button>
          {resetMessage && <p className="text-sm text-red-800 mt-3">{resetMessage}</p>}
        </div>
      </div>
    </main>
  );
}
