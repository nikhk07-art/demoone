"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Menu, X, Plus, Users, TrendingUp, UserCheck,
  CalendarDays, Handshake, Building2, CheckCircle2, XCircle,
  RefreshCw, ThumbsUp, MessageSquare, Share2, Pin, Mail, Phone,
  MapPin, Edit, Eye, Clock, ArrowUp, Sparkles,
} from "lucide-react";
import { Sidebar, NavId } from "@/components/Sidebar";
import { formatINR, formatCompactINR } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Animated Counter Hook                                              */
/* ------------------------------------------------------------------ */
function useAnimatedCounter(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const inc = end / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

/* ------------------------------------------------------------------ */
/* Container animation variants                                        */
/* ------------------------------------------------------------------ */
const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.2 } },
};

const CHART_COLORS = ["#2196F3", "#4CAF50", "#FF9800", "#E91E63", "#9C27B0", "#00BCD4"];

/* ================================================================== */
/* MAIN COMPONENT                                                     */
/* ================================================================== */
export default function MPBNApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginStep, setLoginStep] = useState<"email" | "password">("email");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // App state
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  // Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [postsList, setPostsList] = useState<any[]>([]);
  const [referralsList, setReferralsList] = useState<any[]>([]);
  const [visitorsList, setVisitorsList] = useState<any[]>([]);
  const [txnsList, setTxnsList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [trainingsList, setTrainingsList] = useState<any[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Modals
  const [addVisitorOpen, setAddVisitorOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addReferralOpen, setAddReferralOpen] = useState(false);
  const [viewMember, setViewMember] = useState<any>(null);
  const [addThankYouOpen, setAddThankYouOpen] = useState(false);

  // Form states
  const [vName, setVName] = useState("");
  const [vEmail, setVEmail] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vCompany, setVCompany] = useState("");
  const [vChapter, setVChapter] = useState("");
  const [vRegType, setVRegType] = useState("");

  // no carousel needed

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const endpoints = [
        "getDashboard","getMembers","getCategories","getChapters","getPosts",
        "getReferrals","getVisitors","getBusinessTransactions","getEvents",
        "getTrainings","getAnnouncements","getNotifications","getActivityLog",
      ];
      const results = await Promise.all(endpoints.map((a) => fetch(`/api/gas?action=${a}`).then((r) => r.json())));
      if (results[0]?.success) setDashboardData(results[0].data);
      if (results[1]?.success) setMembersList(results[1].data);
      if (results[2]?.success) setCategoriesList(results[2].data);
      if (results[3]?.success) setChaptersList(results[3].data);
      if (results[4]?.success) setPostsList(results[4].data);
      if (results[5]?.success) setReferralsList(results[5].data);
      if (results[6]?.success) setVisitorsList(results[6].data);
      if (results[7]?.success) setTxnsList(results[7].data);
      if (results[8]?.success) setEventsList(results[8].data);
      if (results[9]?.success) setTrainingsList(results[9].data);
      if (results[10]?.success) setAnnouncementsList(results[10].data);
      if (results[11]?.success) setNotificationsList(results[11].data);
      if (results[12]?.success) setActivityLogs(results[12].data);
    } finally { setLoading(false); }
  }

  useEffect(() => { if (isLoggedIn) loadAllData(); }, [isLoggedIn]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loginStep === "email") {
      if (!loginEmail) { setLoginError("Please enter your email"); return; }
      setLoginStep("password");
      setLoginError("");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    setTimeout(() => {
      setLoginLoading(false);
      setIsLoggedIn(true);
    }, 1200);
  }

  async function handleAddVisitor(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/gas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createVisitor",
        data: { visitor_name: vName, email: vEmail, mobile: vPhone, business_name: vCompany, chapter_id: vChapter || "CHAP-001", visit_status: "Registered" },
      }),
    });
    const json = await res.json();
    if (json.success) {
      setAddVisitorOpen(false); setVName(""); setVEmail(""); setVPhone(""); setVCompany(""); setVChapter(""); setVRegType("");
      showToast("Visitor added successfully!"); loadAllData();
    }
  }

  async function handleApprove(memberId: string) {
    await fetch("/api/gas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approveMember", member_id: memberId, approved_by: "Admin" }),
    });
    showToast("Member approved!"); loadAllData();
  }

  async function handleReject(memberId: string) {
    await fetch("/api/gas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rejectMember", member_id: memberId, rejected_by: "Admin", reason: "Application declined" }),
    });
    showToast("Member rejected"); loadAllData();
  }

  async function handleToggleLike(postId: string) {
    await fetch("/api/gas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleLike", post_id: postId, member_id: "MEM-2026-001", reaction_type: "Like" }),
    });
    loadAllData();
  }

  const filteredMembers = useMemo(() => membersList.filter((m) =>
    !globalSearch || m.full_name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
    m.business_name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
    m.member_id?.toLowerCase().includes(globalSearch.toLowerCase())
  ), [membersList, globalSearch]);

  const pendingMembers = useMemo(() => membersList.filter((m) => m.approval_status === "Pending"), [membersList]);
  const kpis = dashboardData?.kpis || {};

  // ========================== LOGIN PAGE ============================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #B3E5FC 0%, #81D4FA 25%, #4FC3F7 50%, #29B6F6 75%, #03A9F4 100%)" }}>
        {/* Animated wave circles */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1440 900">
          <motion.circle cx="200" cy="200" r="300" fill="none" stroke="white" strokeWidth="1.5" animate={{ r: [280, 340, 280] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.circle cx="1200" cy="600" r="250" fill="none" stroke="white" strokeWidth="1.5" animate={{ r: [230, 300, 230] }} transition={{ duration: 10, repeat: Infinity }} />
          <motion.circle cx="700" cy="100" r="200" fill="none" stroke="white" strokeWidth="1" animate={{ r: [180, 240, 180] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.circle cx="100" cy="700" r="180" fill="none" stroke="white" strokeWidth="1" animate={{ r: [160, 220, 160] }} transition={{ duration: 7, repeat: Infinity }} />
          <motion.circle cx="1300" cy="150" r="150" fill="none" stroke="white" strokeWidth="1" animate={{ r: [130, 190, 130] }} transition={{ duration: 9, repeat: Infinity }} />
        </svg>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="absolute top-6 left-8 flex items-center gap-3 z-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">
            <span className="text-lg font-bold text-[#2196F3]">M</span>
          </div>
          <span className="text-2xl font-bold text-white drop-shadow-md">MPBN</span>
        </motion.div>

        {/* Main Card */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="flex w-full max-w-[900px] overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Left — MPBN Branding Panel */}
            <div className="relative hidden md:flex w-[420px] min-h-[480px] flex-col items-center justify-center overflow-hidden" style={{ background: "linear-gradient(145deg, #1565C0 0%, #1976D2 30%, #2196F3 60%, #42A5F5 100%)" }}>
              {/* Animated background circles */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 420 480">
                <motion.circle cx="100" cy="120" r="120" fill="none" stroke="white" strokeWidth="1" animate={{ r: [100, 140, 100] }} transition={{ duration: 7, repeat: Infinity }} />
                <motion.circle cx="320" cy="350" r="100" fill="none" stroke="white" strokeWidth="1" animate={{ r: [80, 120, 80] }} transition={{ duration: 9, repeat: Infinity }} />
                <motion.circle cx="210" cy="240" r="160" fill="none" stroke="white" strokeWidth="0.5" animate={{ r: [140, 180, 140] }} transition={{ duration: 11, repeat: Infinity }} />
              </svg>

              <div className="relative z-10 flex flex-col items-center text-center px-10">
                {/* Large Logo */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-2xl mb-6"
                >
                  <span className="text-4xl font-extrabold text-[#1976D2] tracking-tight">M</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl font-extrabold text-white tracking-tight mb-3"
                >
                  MPBN
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="text-blue-100 text-sm font-medium leading-relaxed max-w-[260px]"
                >
                  Membership Professional Business Network
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85 }}
                  className="mt-8 flex items-center gap-2"
                >
                  {["Connect", "Collaborate", "Grow"].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.15 }}
                      className="rounded-full bg-white/15 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold text-white border border-white/20"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Right — Sign In Form */}
            <div className="flex flex-1 flex-col justify-center px-10 py-12">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign In to MPBN</h2>
                <p className="text-sm text-gray-500 mb-8">Membership Professional Business Network</p>

                {loginError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{loginError}</motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {loginStep === "email" ? (
                      <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Email address</label>
                        <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Enter email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white transition-all hover:border-gray-400" />
                      </motion.div>
                    ) : (
                      <motion.div key="password" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                          <span className="font-medium text-gray-800">{loginEmail}</span>
                          <button type="button" onClick={() => setLoginStep("email")} className="text-[#2196F3] hover:underline text-xs">(change)</button>
                        </div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter password" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white transition-all hover:border-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loginLoading}
                    className="w-full rounded-xl bg-[#2196F3] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-[#1976D2] transition-colors disabled:opacity-70"
                  >
                    {loginLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                        Signing in...
                      </span>
                    ) : loginStep === "email" ? "Continue" : "Sign In"}
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Don&apos;t have an account? <button className="text-[#2196F3] font-semibold hover:underline">Sign up</button>
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">or continue with</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setLoginLoading(true); setTimeout(() => { setLoginLoading(false); setIsLoggedIn(true); }, 800); }}
                  className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ========================== MAIN APP ==============================
  return (
    <div className="flex min-h-screen bg-[#EAF4FC]">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-2.5 rounded-xl bg-gray-800 px-5 py-3.5 text-sm font-medium text-white shadow-2xl"
          >
            <CheckCircle2 className="h-5 w-5 text-green-400" />{toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNav={setActiveNav}
        membershipRequestCount={pendingMembers.length}
        onLogout={() => setIsLoggedIn(false)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/60 bg-white/80 backdrop-blur-lg px-5 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="lg:hidden rounded-lg p-2 hover:bg-gray-100 text-gray-600">
              <Menu size={20} />
            </button>
            <div className="relative w-56 sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search members, referrals..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 hover:border-gray-300 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative rounded-xl bg-gray-100 p-2.5 text-gray-600 hover:bg-gray-200 transition-colors">
              <Bell size={18} />
              {notificationsList.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notificationsList.length}
                </span>
              )}
            </motion.button>
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2196F3] text-white font-semibold text-sm">A</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-none">Admin</p>
                <p className="text-xs text-gray-500 mt-0.5">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 md:p-7">
          <AnimatePresence mode="wait">
            {/* ===================== DASHBOARD ===================== */}
            {activeNav === "dashboard" && (
              <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-7">
                {/* Greeting */}
                <motion.div variants={fadeUp} className="rounded-2xl bg-gradient-to-r from-[#1976D2] to-[#42A5F5] p-7 text-white shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-blue-100 text-sm font-medium">
                        Welcome back 👋
                      </motion.p>
                      <h1 className="text-2xl md:text-3xl font-bold mt-1">Good Morning, Admin</h1>
                      <p className="mt-2 text-blue-100 text-sm">Here&apos;s what&apos;s happening in your network today</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={loadAllData}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-xs px-5 py-2.5 text-sm font-semibold hover:bg-white/25 transition-colors">
                      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh Data
                    </motion.button>
                  </div>
                </motion.div>

                {/* KPI Cards */}
                <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: "Total Members", value: kpis.total_members || 16, icon: Users, color: "#2196F3", bg: "#E3F2FD" },
                    { label: "Active Members", value: kpis.active_members || 14, icon: UserCheck, color: "#4CAF50", bg: "#E8F5E9" },
                    { label: "Chapters", value: kpis.chapters_count || 2, icon: Building2, color: "#9C27B0", bg: "#F3E5F5" },
                    { label: "Referrals", value: kpis.referrals_given || 8, icon: Handshake, color: "#FF9800", bg: "#FFF3E0" },
                    { label: "Visitors", value: kpis.visitors_count || 5, icon: UserCheck, color: "#00BCD4", bg: "#E0F7FA" },
                    { label: "Business (₹)", value: kpis.business_generated ? (kpis.business_generated / 100000).toFixed(1) + "L" : "148.5L", icon: TrendingUp, color: "#E91E63", bg: "#FCE4EC" },
                  ].map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                      <motion.div key={idx} variants={fadeUp} whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                        className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm cursor-pointer transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-xl" style={{ backgroundColor: kpi.bg }}>
                            <Icon size={20} style={{ color: kpi.color }} />
                          </div>
                          <ArrowUp size={14} className="text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">{kpi.label}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Chapter Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(dashboardData?.chapter_performance || [
                    { chapter_name: "Lakshya", chapter_code: "LAK", active_members: 9, referrals_count: 5, visitors_count: 3, business_generated: 8650000, meeting_day: "Wednesday" },
                    { chapter_name: "Unnati", chapter_code: "UNN", active_members: 7, referrals_count: 3, visitors_count: 2, business_generated: 6200000, meeting_day: "Friday" },
                  ]).map((ch: any, idx: number) => (
                    <motion.div key={idx} variants={fadeUp} whileHover={{ y: -3 }}
                      className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3F2FD] text-[#2196F3] font-extrabold text-sm">{ch.chapter_code}</div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{ch.chapter_name} Chapter</h3>
                          <p className="text-xs text-gray-500">Meeting every {ch.meeting_day}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Active Members", value: ch.active_members, color: "text-[#2196F3]" },
                          { label: "Referrals", value: ch.referrals_count, color: "text-[#FF9800]" },
                          { label: "Visitors", value: ch.visitors_count, color: "text-[#00BCD4]" },
                          { label: "Business", value: formatCompactINR(ch.business_generated || 0), color: "text-[#4CAF50]" },
                        ].map((s) => (
                          <div key={s.label} className="rounded-xl bg-gray-50 p-3 text-center">
                            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Category Occupancy */}
                <motion.div variants={fadeUp} className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Category Occupancy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(dashboardData?.category_occupancy || categoriesList).slice(0, 8).map((cat: any) => (
                      <div key={cat.category_id} className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-gray-700 truncate">{cat.category_name}</span>
                            <span className="text-xs font-mono font-semibold text-gray-500">{cat.active_member_count || 0}/{cat.max_members_allowed || 2}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, cat.occupancy_pct || 0)}%` }} transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${(cat.occupancy_pct || 0) >= 100 ? "bg-red-500" : (cat.occupancy_pct || 0) >= 75 ? "bg-amber-500" : "bg-[#2196F3]"}`} />
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.is_full ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {cat.is_full ? "Full" : `${(cat.max_members_allowed || 2) - (cat.active_member_count || 0)} open`}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ===================== HOME FEED ===================== */}
            {activeNav === "home" && (
              <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Community Feed</h2>
                {postsList.map((post, idx) => (
                  <motion.div key={post.post_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                    className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
                    {post.is_pinned && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2196F3] bg-blue-50 px-2.5 py-1 rounded-full"><Pin size={12} />Pinned</span>}
                    <div className="flex items-center gap-3">
                      <img src={post.profile_photo_url || "https://images.pexels.com/photos/8761679/pexels-photo-8761679.jpeg?auto=compress&cs=tinysrgb&w=100"} alt="" className="h-11 w-11 rounded-full object-cover border-2 border-gray-100" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{post.member_name}</p>
                        <p className="text-xs text-gray-500">{post.business_name} • {post.post_type}</p>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800">{post.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{post.content}</p>
                    {post.media_url && post.media_type === "image" && <img src={post.media_url} alt="" className="w-full rounded-xl object-cover max-h-72 border border-gray-100" />}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm text-gray-500">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleToggleLike(post.post_id)}
                        className="flex items-center gap-1.5 hover:text-[#2196F3] transition-colors"><ThumbsUp size={16} /> {post.like_count || 0}</motion.button>
                      <span className="flex items-center gap-1.5"><MessageSquare size={16} /> {post.comment_count || 0}</span>
                      <button className="flex items-center gap-1.5 hover:text-[#2196F3] transition-colors"><Share2 size={16} /> Share</button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ===================== MEMBERS ===================== */}
            {(activeNav === "members" || activeNav === "members_summary") && (
              <motion.div key="members" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Members</h2>
                    <p className="text-sm text-gray-500">{filteredMembers.length} members found</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setAddMemberOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-[#1976D2] transition-colors">
                    <Plus size={16} />Add Member
                  </motion.button>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Member</th>
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Chapter</th>
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Contact</th>
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredMembers.map((m, idx) => (
                          <motion.tr key={m.member_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                            className="hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={() => setViewMember(m)}>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img src={m.profile_photo_url || "https://images.pexels.com/photos/8761679/pexels-photo-8761679.jpeg?auto=compress&cs=tinysrgb&w=100"} alt="" className="h-9 w-9 rounded-full object-cover" />
                                <div><p className="font-semibold text-gray-800 text-sm">{m.full_name}</p><p className="text-xs text-gray-500">{m.business_name}</p></div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5"><span className="text-xs font-medium bg-blue-50 text-[#2196F3] px-2 py-1 rounded-lg">{m.chapter_id === "CHAP-002" ? "Unnati" : "Lakshya"}</span></td>
                            <td className="px-5 py-3.5 text-xs text-gray-600 font-mono">{m.category_id}</td>
                            <td className="px-5 py-3.5 text-xs text-gray-600"><p>{m.email}</p><p className="font-mono">{m.mobile}</p></td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${m.approval_status === "Approved" ? "bg-green-100 text-green-700" : m.approval_status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                                {m.approval_status === "Approved" && <CheckCircle2 size={12} />}
                                {m.approval_status === "Pending" && <Clock size={12} />}
                                {m.approval_status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => setViewMember(m)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Eye size={15} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Edit size={15} /></button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===================== VISITOR ===================== */}
            {activeNav === "visitor" && (
              <motion.div key="visitor" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-gray-800">Visitors</h2><p className="text-sm text-gray-500">{visitorsList.length} visitors</p></div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setAddVisitorOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-[#1976D2]">
                    <Plus size={16} />Add New Visitor
                  </motion.button>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/80 border-b border-gray-100"><tr>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Visitor</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Company</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Referred By</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {visitorsList.map((v, idx) => (
                        <motion.tr key={v.visitor_id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                          className="hover:bg-blue-50/40 transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-gray-800">{v.visitor_name}</td>
                          <td className="px-5 py-3.5 text-gray-600">{v.business_name}</td>
                          <td className="px-5 py-3.5 text-gray-600">{v.referred_by_name}</td>
                          <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v.visit_status === "Converted" ? "bg-green-100 text-green-700" : v.visit_status === "Attended" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{v.visit_status}</span></td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ===================== REFERRALS ===================== */}
            {(activeNav === "referrals" || activeNav === "referral_summary") && (
              <motion.div key="referrals" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Referrals</h2>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setAddReferralOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200">
                    <Plus size={16} />Pass Referral
                  </motion.button>
                </div>
                {/* Pipeline columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {["New", "Contacted", "In Progress", "Closed"].map((status) => {
                    const items = referralsList.filter((r) => r.referral_status === status || (status === "Closed" && r.referral_status === "Converted"));
                    return (
                      <div key={status} className="rounded-2xl bg-gray-50 p-4 border border-gray-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{status}</span>
                          <span className="text-xs font-mono bg-white text-gray-500 px-2 py-0.5 rounded-lg">{items.length}</span>
                        </div>
                        {items.map((ref) => (
                          <motion.div key={ref.referral_id} whileHover={{ y: -2 }} className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm space-y-2">
                            <p className="font-semibold text-gray-800 text-sm">{ref.client_company}</p>
                            <p className="text-xs text-gray-500">{ref.giver_name} → {ref.receiver_name}</p>
                            <p className="text-sm font-bold text-[#2196F3]">{formatINR(Number(ref.closed_business_value || ref.estimated_business_value || 0))}</p>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ===================== THANK YOU NOTE (Business Transactions) ===================== */}
            {activeNav === "thank_you_note" && (
              <motion.div key="tyfcb" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Thank You Notes (Closed Business)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Total Business Generated</p>
                    <p className="text-2xl font-bold text-[#2196F3]">{formatCompactINR(txnsList.reduce((s, t) => s + Number(t.amount || 0), 0))}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-800">{txnsList.length}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Avg Transaction</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCompactINR(txnsList.length > 0 ? txnsList.reduce((s, t) => s + Number(t.amount || 0), 0) / txnsList.length : 0)}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm"><thead className="bg-gray-50/80 border-b border-gray-100"><tr>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Description</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">From → To</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase text-right">Amount</th>
                  </tr></thead><tbody className="divide-y divide-gray-50">
                    {txnsList.map((t) => (
                      <tr key={t.transaction_id} className="hover:bg-blue-50/40"><td className="px-5 py-3 font-mono text-xs text-gray-500">{t.transaction_id}</td>
                        <td className="px-5 py-3 font-semibold text-gray-800 text-sm">{t.business_description}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{t.giver_name} → {t.receiver_name}</td>
                        <td className="px-5 py-3 text-right font-bold text-green-600">{formatINR(Number(t.amount))}</td></tr>
                    ))}
                  </tbody></table>
                </div>
              </motion.div>
            )}

            {/* ===================== MEMBERSHIP REQUESTS ===================== */}
            {activeNav === "membership_requests" && (
              <motion.div key="requests" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Membership Requests</h2>
                {pendingMembers.length === 0 ? (
                  <div className="rounded-2xl bg-white p-12 border border-gray-100 shadow-sm text-center">
                    <CheckCircle2 size={48} className="mx-auto text-green-400 mb-3" />
                    <p className="font-semibold text-gray-700">All caught up!</p>
                    <p className="text-sm text-gray-500 mt-1">No pending membership requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingMembers.map((m) => (
                      <motion.div key={m.member_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl bg-white p-5 border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img src={m.profile_photo_url || "https://images.pexels.com/photos/8761679/pexels-photo-8761679.jpeg?auto=compress&cs=tinysrgb&w=100"} alt="" className="h-12 w-12 rounded-full object-cover" />
                          <div><p className="font-bold text-gray-800">{m.full_name}</p><p className="text-sm text-gray-500">{m.business_name} • {m.category_id}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleReject(m.member_id)}
                            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><XCircle size={15} className="inline mr-1" />Reject</motion.button>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleApprove(m.member_id)}
                            className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 shadow-md shadow-green-200"><CheckCircle2 size={15} className="inline mr-1" />Approve</motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ===================== EVENTS ===================== */}
            {(activeNav === "event" || activeNav === "meetings" || activeNav === "meeting_attendance") && (
              <motion.div key="events" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">{activeNav === "meeting_attendance" ? "Meeting Attendance" : "Events & Meetings"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {eventsList.map((evt, idx) => (
                    <motion.div key={evt.event_id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                      whileHover={{ y: -3 }} className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-[#2196F3]">{evt.event_type}</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${evt.event_status === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{evt.event_status}</span>
                      </div>
                      <h3 className="font-bold text-gray-800">{evt.event_name}</h3>
                      <p className="text-sm text-gray-500">{evt.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1"><CalendarDays size={13} />{evt.event_date}</span>
                        <span className="flex items-center gap-1"><Clock size={13} />{evt.start_time}</span>
                        <span className="flex items-center gap-1"><MapPin size={13} />{evt.venue_name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ===================== TRAINING ===================== */}
            {activeNav === "training" && (
              <motion.div key="training" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Training Programs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {trainingsList.map((t, idx) => (
                    <motion.div key={t.training_id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                      className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${t.status === "Completed" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>{t.status}</span>
                      <h3 className="font-bold text-gray-800 mt-3">{t.training_title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{t.description}</p>
                      <p className="text-xs text-gray-500 mt-3">Trainer: <span className="font-semibold text-gray-700">{t.trainer_name}</span></p>
                      <p className="text-xs text-gray-500">Date: {t.training_date}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ===================== ORG SETTINGS ===================== */}
            {activeNav === "org_settings" && (
              <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Organization Setting</h2>
                <div className="rounded-2xl bg-white p-7 border border-gray-100 shadow-sm space-y-5">
                  {[
                    { label: "Organization Name", value: "MPBN" },
                    { label: "Email", value: "admin@mpbn.org" },
                    { label: "Phone", value: "+91 98204 88200" },
                    { label: "City", value: "Mumbai" },
                    { label: "Currency", value: "INR" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">{f.label}</label>
                      <input type="text" defaultValue={f.value} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white hover:border-gray-300 transition-colors" />
                    </div>
                  ))}
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => showToast("Settings saved!")}
                    className="rounded-xl bg-[#2196F3] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-[#1976D2]">Save Changes</motion.button>
                </div>
              </motion.div>
            )}

            {/* ===================== CATEGORIES ===================== */}
            {activeNav === "master_categories" && (
              <motion.div key="categories" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Business Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriesList.map((cat, idx) => (
                    <motion.div key={cat.category_id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -3 }} className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{cat.category_id}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.is_full ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{cat.is_full ? "Full" : "Open"}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm">{cat.category_name}</h3>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${cat.occupancy_pct || 0}%` }} transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${(cat.occupancy_pct || 0) >= 100 ? "bg-red-500" : "bg-[#2196F3]"}`} />
                      </div>
                      <p className="text-xs text-gray-500">{cat.active_member_count || 0} / {cat.max_members_allowed || 2} seats filled</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ===================== CHAPTERS ===================== */}
            {activeNav === "master_chapters" && (
              <motion.div key="chapters" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Chapters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {chaptersList.map((ch) => (
                    <motion.div key={ch.chapter_id} whileHover={{ y: -4 }} className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3F2FD] text-[#2196F3] font-extrabold text-lg">{ch.chapter_code}</div>
                        <div><h3 className="text-lg font-bold text-gray-800">{ch.chapter_name}</h3><p className="text-sm text-gray-500">{ch.city} • {ch.meeting_day}</p></div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4 text-center">
                        <div><p className="text-xs text-gray-500">Members</p><p className="text-xl font-bold text-gray-800">{ch.current_member_count || 8}</p></div>
                        <div><p className="text-xs text-gray-500">Target</p><p className="text-xl font-bold text-gray-800">{ch.member_target}</p></div>
                        <div><p className="text-xs text-gray-500">Status</p><p className="text-sm font-semibold text-green-600 mt-1">{ch.status}</p></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ===================== NAMING CONVENTION ===================== */}
            {activeNav === "naming_convention" && (
              <motion.div key="naming" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Naming Convention</h2>
                <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm space-y-4">
                  {[
                    { prefix: "MEM-2026-XXX", desc: "Member IDs" }, { prefix: "CHAP-XXX", desc: "Chapter IDs" },
                    { prefix: "CAT-XXX", desc: "Category IDs" }, { prefix: "REF-XXX", desc: "Referral IDs" },
                    { prefix: "VIS-XXX", desc: "Visitor IDs" }, { prefix: "EVT-XXX", desc: "Event IDs" },
                    { prefix: "TXN-XXX", desc: "Transaction IDs" }, { prefix: "TRN-XXX", desc: "Training IDs" },
                  ].map((n) => (
                    <div key={n.prefix} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <span className="font-mono text-sm font-semibold text-[#2196F3] bg-blue-50 px-3 py-1 rounded-lg">{n.prefix}</span>
                      <span className="text-sm text-gray-600">{n.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ===================== FALLBACK / OTHER PAGES ===================== */}
            {["org_gallery", "create_org_admin", "create_chapter_admin", "renew_member_list", "payments"].includes(activeNav) && (
              <motion.div key={activeNav} variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="flex flex-col items-center justify-center py-20">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-[#2196F3] mb-5">
                  <Sparkles size={36} />
                </motion.div>
                <h2 className="text-xl font-bold text-gray-800 capitalize">{activeNav.replace(/_/g, " ")}</h2>
                <p className="text-sm text-gray-500 mt-2">This module is ready for configuration</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ===================== ADD VISITOR MODAL ===================== */}
      <AnimatePresence>
        {addVisitorOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div variants={scaleIn} initial="initial" animate="animate" exit="exit" className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Add New Visitor</h3>
                <button onClick={() => setAddVisitorOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddVisitor} className="p-6 space-y-4">
                {[
                  { label: "Visitor Name", value: vName, set: setVName, required: true, placeholder: "Full name" },
                  { label: "Email", value: vEmail, set: setVEmail, required: true, placeholder: "visitor@company.com", type: "email" },
                  { label: "Contact Number", value: vPhone, set: setVPhone, required: true, placeholder: "+91 98XXX XXXXX" },
                  { label: "Company Name", value: vCompany, set: setVCompany, placeholder: "Company name" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      {f.label} {f.required && <span className="text-red-500">*</span>}
                    </label>
                    <input type={f.type || "text"} required={f.required} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white hover:border-gray-300 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Chapter <span className="text-red-500">*</span></label>
                  <select required value={vChapter} onChange={(e) => setVChapter(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white hover:border-gray-300 transition-colors appearance-none">
                    <option value="">Select Chapter</option>
                    {chaptersList.map((c) => <option key={c.chapter_id} value={c.chapter_id}>{c.chapter_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Registration Type <span className="text-red-500">*</span></label>
                  <select required value={vRegType} onChange={(e) => setVRegType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white hover:border-gray-300 transition-colors appearance-none">
                    <option value="">Select Registration Type</option>
                    <option value="Chapter Meeting">Chapter Meeting</option>
                    <option value="Event">Event</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit"
                  className="w-full rounded-xl bg-[#2196F3] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-[#1976D2] mt-2">Add Visitor</motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== ADD MEMBER MODAL ===================== */}
      <AnimatePresence>
        {addMemberOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div variants={scaleIn} initial="initial" animate="animate" exit="exit" className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-800">Add New Member</h3>
                <button onClick={() => setAddMemberOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={20} /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await fetch("/api/gas", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "createMember", data: {
                    first_name: fd.get("first_name"), last_name: fd.get("last_name"), email: fd.get("email"),
                    mobile: fd.get("mobile"), business_name: fd.get("business_name"), designation: fd.get("designation"),
                    chapter_id: fd.get("chapter_id"), category_id: fd.get("category_id"),
                  } }),
                });
                setAddMemberOpen(false); showToast("Member added!"); loadAllData();
              }} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">First Name *</label>
                    <input name="first_name" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Last Name *</label>
                    <input name="last_name" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                </div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email *</label>
                  <input name="email" type="email" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Mobile *</label>
                  <input name="mobile" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Business Name *</label>
                  <input name="business_name" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Designation</label>
                  <input name="designation" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Chapter *</label>
                    <select name="chapter_id" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm appearance-none">
                      <option value="">Select</option>{chaptersList.map((c) => <option key={c.chapter_id} value={c.chapter_id}>{c.chapter_name}</option>)}
                    </select></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Category *</label>
                    <select name="category_id" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm appearance-none">
                      <option value="">Select</option>{categoriesList.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                    </select></div>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit"
                  className="w-full rounded-xl bg-[#2196F3] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-[#1976D2]">Add Member</motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== ADD REFERRAL MODAL ===================== */}
      <AnimatePresence>
        {addReferralOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div variants={scaleIn} initial="initial" animate="animate" exit="exit" className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-800">Pass Referral</h3>
                <button onClick={() => setAddReferralOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={20} /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await fetch("/api/gas", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "createReferral", data: {
                    given_by_member_id: fd.get("given_by"), received_by_member_id: fd.get("received_by"),
                    client_name: fd.get("client_name"), client_company: fd.get("client_company"),
                    client_mobile: fd.get("client_mobile"), referral_description: fd.get("description"),
                    estimated_business_value: fd.get("estimated_value"),
                  } }),
                });
                setAddReferralOpen(false); showToast("Referral passed!"); loadAllData();
              }} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Given By *</label>
                    <select name="given_by" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm appearance-none">
                      {membersList.filter((m) => m.approval_status === "Approved").map((m) => <option key={m.member_id} value={m.member_id}>{m.full_name}</option>)}
                    </select></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Received By *</label>
                    <select name="received_by" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm appearance-none">
                      {membersList.filter((m) => m.approval_status === "Approved").map((m) => <option key={m.member_id} value={m.member_id}>{m.full_name}</option>)}
                    </select></div>
                </div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Client Name *</label>
                  <input name="client_name" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Client Company *</label>
                  <input name="client_company" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Client Mobile *</label>
                  <input name="client_mobile" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Estimated Value (₹)</label>
                  <input name="estimated_value" type="number" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Description *</label>
                  <textarea name="description" required rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" /></div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit"
                  className="w-full rounded-xl bg-[#2196F3] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-[#1976D2]">Pass Referral</motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== VIEW MEMBER MODAL ===================== */}
      <AnimatePresence>
        {viewMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div variants={scaleIn} initial="initial" animate="animate" exit="exit" className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="relative bg-gradient-to-r from-[#1976D2] to-[#42A5F5] px-6 py-8 text-white rounded-t-2xl">
                <button onClick={() => setViewMember(null)} className="absolute right-4 top-4 rounded-lg bg-white/15 p-1.5 text-white hover:bg-white/25"><X size={18} /></button>
                <div className="flex items-center gap-4">
                  <img src={viewMember.profile_photo_url || "https://images.pexels.com/photos/8761679/pexels-photo-8761679.jpeg?auto=compress&cs=tinysrgb&w=100"} alt="" className="h-16 w-16 rounded-2xl object-cover border-2 border-white/30" />
                  <div>
                    <h3 className="text-xl font-bold">{viewMember.full_name}</h3>
                    <p className="text-blue-100 text-sm">{viewMember.designation || "Director"} • {viewMember.business_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-white/15 px-2 py-0.5 rounded-lg">{viewMember.chapter_id === "CHAP-002" ? "Unnati" : "Lakshya"}</span>
                      <span className="text-xs bg-white/15 px-2 py-0.5 rounded-lg font-mono">{viewMember.category_id}</span>
                    </div>
                  </div>
                </div>
              </div>
              {viewMember.approval_status === "Pending" && (
                <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-amber-800">⏳ Pending Approval</p>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { handleReject(viewMember.member_id); setViewMember(null); }}
                      className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Reject</motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { handleApprove(viewMember.member_id); setViewMember(null); }}
                      className="rounded-xl bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 shadow-sm">Approve</motion.button>
                  </div>
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Mail size={15} />, label: "Email", value: viewMember.email },
                    { icon: <Phone size={15} />, label: "Mobile", value: viewMember.mobile },
                    { icon: <MapPin size={15} />, label: "City", value: viewMember.city || "Mumbai" },
                    { icon: <CalendarDays size={15} />, label: "Joined", value: viewMember.joining_date || "2024" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-start gap-2.5 text-sm">
                      <span className="text-gray-400 mt-0.5">{f.icon}</span>
                      <div><p className="text-xs text-gray-500">{f.label}</p><p className="font-medium text-gray-800">{f.value}</p></div>
                    </div>
                  ))}
                </div>
                {viewMember.business_description && (
                  <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Business Description</p>
                    <p className="text-sm text-gray-700">{viewMember.business_description}</p></div>
                )}
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setViewMember(null)}
                  className="w-full rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">Close</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
