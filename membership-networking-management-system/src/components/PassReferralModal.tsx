"use client";

import React, { useState } from "react";
import { Handshake, X, DollarSign, CheckCircle2 } from "lucide-react";

interface PassReferralModalProps {
  isOpen: boolean;
  chapters: Array<{ chapter_id: string; chapter_name: string }>;
  categories: Array<{ category_id: string; category_name: string }>;
  members: Array<{
    member_id: string;
    full_name: string;
    business_name: string;
    chapter_id: string;
  }>;
  onClose: () => void;
  onSuccess: () => void;
}

export function PassReferralModal({
  isOpen,
  chapters,
  categories,
  members,
  onClose,
  onSuccess,
}: PassReferralModalProps) {
  const [givenBy, setGivenBy] = useState("MEM-2026-002");
  const [receivedBy, setReceivedBy] = useState("MEM-2026-001");
  const [chapterId, setChapterId] = useState("CHAP-001");
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientMobile, setClientMobile] = useState("+91 98");
  const [referralCategoryId, setReferralCategoryId] = useState("CAT-009");
  const [referralDescription, setReferralDescription] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("1500000");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createReferral",
          data: {
            chapter_id: chapterId,
            given_by_member_id: givenBy,
            received_by_member_id: receivedBy,
            client_name: clientName,
            client_company: clientCompany,
            client_mobile: clientMobile,
            referral_category_id: referralCategoryId,
            referral_description: referralDescription,
            estimated_business_value: estimatedValue,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Handshake className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">
                Pass Warm Referral Slip
              </h3>
              <p className="text-xs text-slate-500">
                Logged in Google Sheets Referrals tab & notifies receiver
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Given By Member *
              </label>
              <select
                value={givenBy}
                onChange={(e) => setGivenBy(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              >
                {members.map((m) => (
                  <option key={m.member_id} value={m.member_id}>
                    {m.full_name} ({m.business_name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Received By Member *
              </label>
              <select
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              >
                {members.map((m) => (
                  <option key={m.member_id} value={m.member_id}>
                    {m.full_name} ({m.business_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Contact Person *
              </label>
              <input
                required
                type="text"
                placeholder="Ramesh Singhal"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Company Name *
              </label>
              <input
                required
                type="text"
                placeholder="Singhal Infrastructure Ltd"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Direct Mobile *
              </label>
              <input
                required
                type="text"
                value={clientMobile}
                onChange={(e) => setClientMobile(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-blue-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Contract Value (₹) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="number"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm font-mono focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Referral Scope & Warm Intro Note *
            </label>
            <textarea
              required
              rows={3}
              value={referralDescription}
              onChange={(e) => setReferralDescription(e.target.value)}
              placeholder="Spoke with Ramesh personally about your debt syndication and fractional CFO services. Expecting call this afternoon."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "Passing Slip..." : "Submit Referral Slip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
