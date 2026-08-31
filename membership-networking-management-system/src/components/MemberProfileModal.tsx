"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Handshake,
  CalendarCheck2,
  Award,
} from "lucide-react";
import { formatINR } from "@/lib/format";

export interface MemberRecord {
  member_id: string;
  membership_no: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_photo_url?: string | null;
  email: string;
  mobile: string;
  business_name: string;
  designation?: string | null;
  business_description?: string | null;
  business_address?: string | null;
  city?: string | null;
  website?: string | null;
  chapter_id: string;
  category_id: string;
  joining_date?: string | null;
  membership_type?: string | null;
  membership_status?: string | null;
  approval_status?: string | null;
  notes?: string | null;
}

interface MemberProfileModalProps {
  member: MemberRecord | null;
  canApprove: boolean;
  onClose: () => void;
  onStatusChange: (memberId: string, status: "Approved" | "Rejected") => void;
}

export function MemberProfileModal({
  member,
  canApprove,
  onClose,
  onStatusChange,
}: MemberProfileModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "referrals" | "business" | "meetings"
  >("overview");
  const [loadingAction, setLoadingAction] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!member) return null;

  const isPending = member.approval_status === "Pending";

  async function handleApprove() {
    if (!member) return;
    setLoadingAction(true);
    try {
      const res = await fetch("/api/gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approveMember",
          member_id: member.member_id,
          approved_by: "Super Admin",
          notes: "Approved by Membership Committee",
        }),
      });
      const json = await res.json();
      if (json.success) {
        onStatusChange(member.member_id, "Approved");
        onClose();
      }
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleReject() {
    if (!member) return;
    setLoadingAction(true);
    try {
      const res = await fetch("/api/gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rejectMember",
          member_id: member.member_id,
          rejected_by: "Super Admin",
          reason: rejectReason || "Seat currently locked",
        }),
      });
      const json = await res.json();
      if (json.success) {
        onStatusChange(member.member_id, "Rejected");
        onClose();
      }
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header with Oxford Navy banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={
                member.profile_photo_url ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              }
              alt={member.full_name}
              className="h-20 w-20 rounded-2xl border-2 border-white/30 object-cover shadow-md"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-500/20 px-2 py-0.5 font-mono text-xs font-semibold text-blue-200">
                  {member.member_id}
                </span>
                <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-xs text-white">
                  {member.membership_no}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    member.approval_status === "Approved"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : member.approval_status === "Pending"
                      ? "bg-amber-400/25 text-amber-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {member.approval_status}
                </span>
              </div>
              <h2 className="mt-1.5 text-2xl font-bold text-white">
                {member.full_name}
              </h2>
              <p className="text-sm text-blue-200">
                {member.designation || "Director"} • {member.business_name}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> Chapter:{" "}
                  <strong>{member.chapter_id === "CHAP-002" ? "Unnati" : "Lakshya"}</strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  Category: <strong>{member.category_id}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Banner if Pending */}
        {isPending && canApprove && (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-900">
                  ⚡ Membership Application Awaiting Approval
                </p>
                <p className="text-xs text-amber-800">
                  {member.notes || "Check category seat vacancy before approving."}
                </p>
              </div>

              {!showRejectInput ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" /> Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={loadingAction}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {loadingAction ? "Approving..." : "Approve Member"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={loadingAction}
                    className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Confirm Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(false)}
                    className="text-xs text-slate-600 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50/70 px-6 py-3">
          <div className="flex items-center gap-2.5">
            <Handshake className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-[11px] text-slate-500">Referrals Given</p>
              <p className="font-mono text-sm font-bold text-slate-900">12</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-[11px] text-slate-500">TYFCB Generated</p>
              <p className="font-mono text-sm font-bold text-emerald-700">
                {formatINR(6350000)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CalendarCheck2 className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-[11px] text-slate-500">Meeting Attendance</p>
              <p className="font-mono text-sm font-bold text-slate-900">96%</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-[11px] text-slate-500">Visitors Hosted</p>
              <p className="font-mono text-sm font-bold text-slate-900">4</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
          {(
            [
              { key: "overview", label: "Executive Overview" },
              { key: "referrals", label: "Referral Pipeline" },
              { key: "business", label: "TYFCB Transactions" },
              { key: "meetings", label: "Attendance & Trainings" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-2 px-4 py-3 text-xs font-semibold transition ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Company & Specialty Pitch
                </h4>
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
                  {member.business_description ||
                    "Specialized corporate B2B services provider dedicated to inter-chapter collaboration and executive referrals."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 p-4 space-y-2.5 text-xs">
                  <h5 className="font-bold text-slate-900">Direct Contact</h5>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="font-mono">{member.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{member.business_address || "Mumbai, India"}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2.5 text-xs">
                  <h5 className="font-bold text-slate-900">Membership Details</h5>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Induction Date</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {member.joining_date || "2024-01-10"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan Tier</span>
                    <span className="font-semibold text-slate-800">
                      {member.membership_type || "Standard Membership"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category Code</span>
                    <span className="font-mono font-semibold text-blue-700">
                      {member.category_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "referrals" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recent Closed & Pipeline Referrals
              </h4>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Referral ID</th>
                      <th className="px-4 py-2.5 font-semibold">Client Company</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                      <th className="px-4 py-2.5 font-semibold text-right">
                        Closed Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 font-mono text-slate-700">REF-001</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        Piramal Horizon Estates Pvt Ltd
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800 font-semibold">
                          Closed
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700 text-right">
                        ₹45,00,000
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-slate-700">REF-002</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        Agarwal Precision Forgings Ltd
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800 font-semibold">
                          Closed
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700 text-right">
                        ₹18,50,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "business" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
              <p className="text-xs font-semibold text-emerald-900">
                Verified Thank You For Closed Business (TYFCB) Total
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-700">
                ₹63,50,000
              </p>
              <p className="mt-1 text-xs text-emerald-800">
                Verified against bank receipts and Chapter Audit Logs.
              </p>
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold text-slate-900">
                  Weekly Chapter Breakfast Attendance Streak: 24 Meetings Present
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Completed Member Success Program (MSP) with 98% evaluation score.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
