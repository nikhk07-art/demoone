"use client";

import React from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface CategorySeatBarProps {
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  maxAllowed: number;
  activeCount: number;
  occupancyPct: number;
  isFull: boolean;
  onSelectOverride?: () => void;
  canOverride?: boolean;
}

export function CategorySeatBar({
  categoryId,
  categoryName,
  categoryCode,
  maxAllowed,
  activeCount,
  occupancyPct,
  isFull,
  onSelectOverride,
  canOverride,
}: CategorySeatBarProps) {
  const barColor =
    occupancyPct >= 100
      ? "bg-red-500"
      : occupancyPct >= 75
      ? "bg-amber-500"
      : "bg-emerald-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
            {categoryId}
          </span>
          <h4 className="font-semibold text-slate-900 text-sm">{categoryName}</h4>
        </div>
        <div className="flex items-center gap-2">
          {isFull ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
              <AlertTriangle className="h-3 w-3" /> Full Capacity
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3 w-3" />{" "}
              {maxAllowed - activeCount} Seat{maxAllowed - activeCount > 1 ? "s" : ""} Open
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <span>
          Active: <strong className="font-mono text-slate-900">{activeCount}</strong> /{" "}
          <strong className="font-mono text-slate-900">{maxAllowed}</strong> Max Seats
        </span>
        <span className="font-mono font-semibold text-slate-800">
          {occupancyPct}%
        </span>
      </div>

      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, occupancyPct)}%` }}
        />
      </div>

      {isFull && canOverride && onSelectOverride && (
        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="text-[11px] text-slate-500">
            Protection locked for general applicants
          </span>
          <button
            type="button"
            onClick={onSelectOverride}
            className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100"
          >
            Admin Capacity Override
          </button>
        </div>
      )}
    </div>
  );
}
