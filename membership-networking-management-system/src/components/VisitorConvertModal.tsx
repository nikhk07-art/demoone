"use client";

import React, { useState } from "react";
import { UserCheck, X, ShieldAlert, CheckCircle2 } from "lucide-react";

interface VisitorConvertModalProps {
  visitor: {
    visitor_id: string;
    visitor_name: string;
    business_name: string;
    mobile: string;
    email: string;
    category_interest?: string | null;
    chapter_id?: string;
    referred_by_member_id?: string | null;
  } | null;
  chapters: Array<{ chapter_id: string; chapter_name: string }>;
  categories: Array<{
    category_id: string;
    category_name: string;
    max_members_allowed: number;
    active_member_count: number;
    is_full: boolean;
  }>;
  members: Array<{ member_id: string; full_name: string; chapter_id: string }>;
  onClose: () => void;
  onSuccess: (data: unknown) => void;
}

export function VisitorConvertModal({
  visitor,
  chapters,
  categories,
  members,
  onClose,
  onSuccess,
}: VisitorConvertModalProps) {
  if (!visitor) return null;

  const nameParts = visitor.visitor_name.split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "Member");
  const [chapterId, setChapterId] = useState(visitor.chapter_id || "CHAP-001");
  const [categoryId, setCategoryId] = useState(visitor.category_interest || "CAT-001");
  const [membershipType, setMembershipType] = useState("Standard Membership");
  const [referralMemberId, setReferralMemberId] = useState(
    visitor.referred_by_member_id || "MEM-2026-001"
  );
  const [allowOverride, setAllowOverride] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedCategory = categories.find((c) => c.category_id === categoryId);
  const isSelectedCategoryFull = selectedCategory?.is_full || false;

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    if (!visitor) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "convertVisitor",
          visitor_id: visitor.visitor_id,
          converted_by: "Super Admin",
          allowOverride,
          memberData: {
            first_name: firstName,
            last_name: lastName,
            business_name: visitor.business_name,
            mobile: visitor.mobile,
            email: visitor.email,
            chapter_id: chapterId,
            category_id: categoryId,
            membership_type: membershipType,
            referral_member_id: referralMemberId,
          },
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.message || "Failed to convert visitor");
        setLoading(false);
        return;
      }
      onSuccess(json.data);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">
                Induct Visitor to Member
              </h3>
              <p className="text-xs text-slate-500">
                Visitor: {visitor.visitor_name} ({visitor.business_name})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleConvert} className="p-6 space-y-4">
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
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                Membership Plan *
              </label>
              <select
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              >
                <option value="Standard Membership">Standard Membership (₹38,500/yr)</option>
                <option value="Premium Membership">Premium Membership (₹55,000/yr)</option>
                <option value="Corporate Membership">Corporate Membership (₹85,000/yr)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Category Seat *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_id} | {c.category_name} ({c.active_member_count}/{c.max_members_allowed} filled)
                  {c.is_full ? " — FULL" : ""}
                </option>
              ))}
            </select>

            {isSelectedCategoryFull && (
              <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <ShieldAlert className="h-4 w-4 text-amber-700" />
                  Category Seat {selectedCategory?.category_name} is Full!
                </div>
                <label className="mt-1.5 flex items-center gap-2 text-xs text-amber-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowOverride}
                    onChange={(e) => setAllowOverride(e.target.checked)}
                    className="rounded-sm border-amber-400 text-blue-600"
                  />
                  Override seat restriction (Super Admin logged audit)
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Referral Sponsor Member *
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
              disabled={loading || (isSelectedCategoryFull && !allowOverride)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "Inducting..." : "Approve & Convert to Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
