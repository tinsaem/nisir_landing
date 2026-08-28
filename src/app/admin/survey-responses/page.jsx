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

export default function AdminSurveyResponsesPage() {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [responses, setResponses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCurrentUser().then((parsed) => {
      if (!parsed) {
        router.replace("/");
        return;
      }
      if (parsed.role !== "ADMIN") {
        router.replace("/");
        return;
      }
      setAccount(parsed);
    });
  }, [router]);

  useEffect(() => {
    if (!account) return;
    fetch("/api/admin/survey-responses")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success) setResponses(data.responses);
        else {
          setError(data.message || "Failed to load responses.");
          setResponses([]);
        }
      })
      .catch(() => {
        setError("Network error — could not reach the server.");
        setResponses([]);
      });
  }, [account, router]);

  if (!account || !responses) {
    return <main className="min-h-screen bg-[#f0f4fb]" />;
  }

  return (
    <main className="min-h-screen bg-[#f0f4fb] py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-1">
              EBCA staff awareness survey — research capture
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Survey Responses</h1>
            <p className="text-sm text-gray-500 mt-1">
              {responses.length} response{responses.length === 1 ? "" : "s"} recorded
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
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Bank name</th>
                  <th className="px-4 py-3">Q1: Phishing awareness</th>
                  <th className="px-4 py-3">Q2: Compliance familiarity</th>
                  <th className="px-4 py-3">Q3: Training effectiveness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {responses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No responses yet.
                    </td>
                  </tr>
                ) : (
                  responses.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{fmt(r.submittedAt)}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">{r.employeeId}</td>
                      <td className="px-4 py-3 text-gray-700">{r.bankName}</td>
                      <td className="px-4 py-3 text-gray-700">{r.q1}</td>
                      <td className="px-4 py-3 text-gray-700">{r.q2}</td>
                      <td className="px-4 py-3 text-gray-700">{r.q3}</td>
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
