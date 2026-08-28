"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadCurrentUser } from "@/lib/currentUser";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [account, setAccount] = useState(null);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </main>
  );
}
