"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  HardDrive,
  Code2,
  Download,
  X,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface GoogleSheetsConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleSheetsConsoleModal({
  isOpen,
  onClose,
}: GoogleSheetsConsoleModalProps) {
  const [tabInfo, setTabInfo] = useState<{
    spreadsheet_title: string;
    total_sheets: number;
    sheets: Array<{ name: string; records: number }>;
    drive_folders: Array<{ path: string; files: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSheetsInfo();
    }
  }, [isOpen]);

  async function loadSheetsInfo() {
    setLoading(true);
    try {
      const res = await fetch("/api/gas?action=getSheetTabs");
      const json = await res.json();
      if (json.success) {
        setTabInfo(json.data);
      }
    } finally {
      setLoading(false);
    }
  }

  function downloadSheetCSV(sheetName: string) {
    window.open(`/api/gas?action=get${sheetName}`, "_blank");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">
                Google Sheets Database & Apps Script API Console
              </h3>
              <p className="text-xs text-slate-300">
                Architecture: Frontend → Auth → GAS REST API → 20 Sheets Tables → Google Drive Folders
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top connection box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Google Apps Script API
              </div>
              <p className="mt-1 font-mono text-xs text-emerald-950 truncate">
                doGet(e) & doPost(e) Active
              </p>
              <p className="mt-1 text-[11px] text-emerald-700">
                REST-Style JSON layer returning consistent success/data envelope
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                20-Sheet Spreadsheet
              </div>
              <p className="mt-1 font-mono text-xs text-blue-950">
                {tabInfo?.spreadsheet_title || "Membership_Business_Network_DB_2026.xlsx"}
              </p>
              <p className="mt-1 text-[11px] text-blue-700">
                Zero plain-text passwords stored
              </p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800">
                <HardDrive className="h-4 w-4 text-purple-600" />
                Google Drive Storage
              </div>
              <p className="mt-1 font-mono text-xs text-purple-950">
                Membership Network/Root
              </p>
              <p className="mt-1 text-[11px] text-purple-700">
                Profile photos, TYFCB docs & certificates
              </p>
            </div>
          </div>

          {/* 20 Exact Database Tables Sheet Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm">
                20 Required Version 1 Spreadsheet Tabs ({tabInfo?.sheets.length || 20} sheets)
              </h4>
              <button
                type="button"
                onClick={loadSheetsInfo}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh Row Counts
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {(tabInfo?.sheets || []).map((sh) => (
                <div
                  key={sh.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 transition hover:border-blue-300 hover:bg-white"
                >
                  <div className="truncate">
                    <p className="font-mono text-xs font-semibold text-slate-800 truncate">
                      {sh.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {sh.records} rows
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadSheetCSV(sh.name)}
                    title="Export JSON/CSV API"
                    className="rounded-md p-1.5 text-slate-500 hover:bg-blue-100 hover:text-blue-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Google Drive Sub-folders */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">
              Google Drive Organized Sub-Folder Structure (#26)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(tabInfo?.drive_folders || []).map((f) => (
                <div
                  key={f.path}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <HardDrive className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="truncate">
                    <p className="font-mono text-xs font-semibold text-slate-900 truncate">
                      {f.path}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {f.files} uploaded files & URLs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code snippet preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="flex items-center gap-2 font-mono text-xs text-blue-400">
                <Code2 className="h-4 w-4" /> Google Apps Script / Code.gs Deployment Response Contract
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://script.google.com/macros/s/AKfycbz_MBN_EXEC_DEPLOYMENT_ID/exec?action=getDashboard`
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
              >
                {copied ? "Copied Endpoint URL!" : "Copy Endpoint URL"}
              </button>
            </div>
            <pre className="overflow-x-auto font-mono text-xs text-emerald-400 leading-relaxed">
{`{
  "success": true,
  "message": "Operation completed successfully",
  "data": { "kpis": { "active_members": 14, "business_generated": 14850000 }, ... }
}`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
}
