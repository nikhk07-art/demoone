"use client";

import React, { useState } from "react";
import { UserPlus, X, ShieldAlert, CheckCircle2 } from "lucide-react";

interface AddMemberModalProps {
  isOpen: boolean;
  chapters: Array<{ chapter_id: string; chapter_name: string }>;
  categories: Array<{
    category_id: string;
    category_name: string;
    max_members_allowed: number;
    active_member_count: number;
    is_full: boolean;
  }>;
  members: Array<{ member_id: string; full_name: string }>;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMemberModal({
  isOpen,
  chapters,
  categories,
  members,
  onClose,
  onSuccess,
}: AddMemberModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("+91 98");
  const [businessName, setBusinessName] = useState("");
  const [designation, setDesignation] = useState("Managing Director");
  const [businessDescription, setBusinessDescription] = useState("");
  const [chapterId, setChapterId] = useState("CHAP-001");
  const [categoryId, setCategoryId] = useState("CAT-001");
  const [referralMemberId, setReferralMemberId] = useState("MEM-2026-001");
  const [allowOverride, setAllowOverride] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const selectedCategory = categories.find((c) => c.category_id === categoryId);
  const isFull = selectedCategory?.is_full || false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createMember",
          allowOverride,
          user_name: "Super Admin",
          data: {
            first_name: firstName,
            last_name: lastName,
            email,
            mobile,
            business_name: businessName,
            designation,
            business_description: businessDescription,
            chapter_id: chapterId,
            category_id: categoryId,
            referral_member_id: referralMemberId,
            membership_status: "Pending",
            approval_status: "Pending",
          },
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.message || "Failed to create member");
        setLoading(false);
        return;
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error creating member");
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
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">
                Induct New Member Application
              </h3>
              <p className="text-xs text-slate-500">
                Auto-generates Member ID & logs application to Membership Committee
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
          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name *
              </label>
              <input
                required
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Rohan"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                required
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Verma"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Email *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@company.in"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile / WhatsApp *
              </label>
              <input
                required
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Name *
              </label>
              <input
                required
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Verma Logistics LLP"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chapter *
              </label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              >
                {chapters.map((ch) => (
                  <option key={ch.chapter_id} value={ch.chapter_id}>
                    {ch.chapter_name} ({ch.chapter_id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Seat *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_id} | {c.category_name} ({c.active_member_count}/{c.max_members_allowed})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isFull && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                Category Seat {selectedCategory?.category_name} is Full!
              </div>
              <label className="mt-1 flex items-center gap-2 text-xs text-amber-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowOverride}
                  onChange={(e) => setAllowOverride(e.target.checked)}
                  className="rounded-sm border-amber-400 text-blue-600"
                />
                Override seat restriction as Super Admin (logs audit record)
              </label>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Referral Sponsor Member
            </label>
            <select
              value={referralMemberId}
              onChange={(e) => setReferralMemberId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
            >
              {members.map((m) => (
                <option key={m.member_id} value={m.member_id}>
                  {m.full_name} ({m.member_id})
                </option>
              ))}
            </select>
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
              disabled={loading || (isFull && !allowOverride)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "Submitting..." : "Submit Member Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
