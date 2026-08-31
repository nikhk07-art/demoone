"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  Settings,
  Image,
  Users,
  BarChart3,
  UserCheck,
  UserPlus,
  ShieldPlus,
  MessageSquareText,
  Database,
  ClipboardCheck,
  RefreshCw,
  Contact,
  CalendarDays,
  GraduationCap,
  Link2,
  Heart,
  Calendar,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export type NavId =
  | "home"
  | "dashboard"
  | "org_settings"
  | "org_gallery"
  | "members_summary"
  | "referral_summary"
  | "visitor"
  | "create_org_admin"
  | "create_chapter_admin"
  | "naming_convention"
  | "master_categories"
  | "master_chapters"
  | "membership_requests"
  | "renew_member_list"
  | "members"
  | "event"
  | "training"
  | "referrals"
  | "thank_you_note"
  | "meetings"
  | "meeting_attendance";

interface SidebarProps {
  activeNav: NavId;
  onNav: (id: NavId) => void;
  membershipRequestCount?: number;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  activeNav,
  onNav,
  membershipRequestCount = 1,
  onLogout,
  collapsed,
  onToggle,
}: SidebarProps) {
  const [masterDataOpen, setMasterDataOpen] = useState(false);
  const [meetingsOpen, setMeetingsOpen] = useState(false);

  const navItems: Array<{
    id?: NavId;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    isGroup?: boolean;
    groupId?: string;
    children?: Array<{ id: NavId; label: string }>;
  }> = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "org_settings", label: "Organization Setting", icon: <Settings size={20} /> },
    { id: "org_gallery", label: "Organization Gallery", icon: <Image size={20} /> },
    { id: "members_summary", label: "Members Summary", icon: <Users size={20} /> },
    { id: "referral_summary", label: "Referral Summary", icon: <BarChart3 size={20} /> },
    { id: "visitor", label: "Visitor", icon: <UserCheck size={20} /> },
    { id: "create_org_admin", label: "Create Org Admin", icon: <UserPlus size={20} /> },
    { id: "create_chapter_admin", label: "Create Chapter Admin", icon: <ShieldPlus size={20} /> },
    { id: "naming_convention", label: "Naming Convention", icon: <MessageSquareText size={20} /> },
    {
      label: "Master Data",
      icon: <Database size={20} />,
      isGroup: true,
      groupId: "master",
      children: [
        { id: "master_categories", label: "Categories" },
        { id: "master_chapters", label: "Chapters" },
      ],
    },
    { id: "membership_requests", label: "Membership Requests", icon: <ClipboardCheck size={20} />, badge: membershipRequestCount },
    { id: "renew_member_list", label: "Renew Member List", icon: <RefreshCw size={20} /> },
    { id: "members", label: "Members", icon: <Contact size={20} /> },
    { id: "event", label: "Event", icon: <CalendarDays size={20} /> },
    { id: "training", label: "Training", icon: <GraduationCap size={20} /> },
    { id: "referrals", label: "Referrals", icon: <Link2 size={20} /> },
    { id: "thank_you_note", label: "Thank You Note", icon: <Heart size={20} /> },
    {
      label: "Meetings",
      icon: <Calendar size={20} />,
      isGroup: true,
      groupId: "meetings",
      children: [
        { id: "meetings", label: "All Meetings" },
        { id: "meeting_attendance", label: "Attendance" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: collapsed ? -280 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 flex flex-col shadow-xl lg:shadow-md lg:translate-x-0 lg:static"
        style={{ willChange: "transform" }}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={onToggle} className="lg:hidden p-1 text-gray-500 hover:text-gray-700">
              <Menu size={22} />
            </button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2196F3] text-white font-bold text-lg shadow-md"
            >
              M
            </motion.div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">MPBN</span>
          </div>
          <button onClick={onToggle} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item, idx) => {
            if (item.isGroup) {
              const isOpen = item.groupId === "master" ? masterDataOpen : meetingsOpen;
              const toggle = item.groupId === "master" ? () => setMasterDataOpen(!masterDataOpen) : () => setMeetingsOpen(!meetingsOpen);

              return (
                <div key={idx}>
                  <button
                    onClick={toggle}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-3.5">
                      <span className="text-gray-400">{item.icon}</span>
                      {item.label}
                    </span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} className="text-gray-400" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && item.children && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-12 space-y-0.5 py-1">
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => { onNav(child.id); if (window.innerWidth < 1024) onToggle(); }}
                              className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                activeNav === child.id
                                  ? "bg-[#2196F3] text-white shadow-md"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                              }`}
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const isActive = activeNav === item.id;
            return (
              <motion.button
                key={item.id || idx}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { if (item.id) onNav(item.id); if (window.innerWidth < 1024) onToggle(); }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#2196F3] text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 hover:bg-blue-50/60 hover:text-[#1976D2]"
                }`}
              >
                <span className="flex items-center gap-3.5">
                  <span className={isActive ? "text-white" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                {item.badge && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isActive ? "bg-white text-[#2196F3]" : "bg-amber-100 text-amber-700 border border-amber-300"
                    }`}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 px-3 py-3">
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
