import {
  pgTable,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

// 1. Chapters
export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  chapter_id: text("chapter_id").notNull().unique(), // CHAP-001
  chapter_name: text("chapter_name").notNull(), // Lakshya, Unnati
  chapter_code: text("chapter_code").notNull(), // LAK, UNN
  chapter_leader_member_id: text("chapter_leader_member_id"),
  meeting_day: text("meeting_day"), // Wednesday, Friday
  meeting_time: text("meeting_time"), // 07:30 AM
  meeting_mode: text("meeting_mode"), // In-Person / Hybrid
  meeting_location: text("meeting_location"),
  city: text("city"),
  member_target: integer("member_target").default(50),
  current_member_count: integer("current_member_count").default(0),
  status: text("status").default("Active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 2. Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  category_id: text("category_id").notNull().unique(), // CAT-001
  category_name: text("category_name").notNull(),
  category_code: text("category_code").notNull(),
  description: text("description"),
  max_members_allowed: integer("max_members_allowed").default(1),
  active_member_count: integer("active_member_count").default(0),
  status: text("status").default("Active"),
  sort_order: integer("sort_order").default(1),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 3. Members
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  member_id: text("member_id").notNull().unique(), // MEM-2026-001
  membership_no: text("membership_no").notNull(),
  first_name: text("first_name").notNull(),
  middle_name: text("middle_name").default(""),
  last_name: text("last_name").notNull(),
  full_name: text("full_name").notNull(),
  profile_photo_url: text("profile_photo_url"),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  whatsapp_no: text("whatsapp_no"),
  gender: text("gender"),
  date_of_birth: text("date_of_birth"),
  business_name: text("business_name").notNull(),
  designation: text("designation"),
  business_description: text("business_description"),
  business_address: text("business_address"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("India"),
  postal_code: text("postal_code"),
  website: text("website"),
  chapter_id: text("chapter_id").notNull(), // CHAP-001
  category_id: text("category_id").notNull(), // CAT-001
  referral_member_id: text("referral_member_id"),
  joining_date: text("joining_date"),
  membership_start_date: text("membership_start_date"),
  membership_end_date: text("membership_end_date"),
  membership_type: text("membership_type").default("Standard Membership"),
  membership_status: text("membership_status").default("Active"), // Active, Inactive, Expired
  approval_status: text("approval_status").default("Approved"), // Pending, Approved, Rejected
  approved_by: text("approved_by"),
  approved_at: text("approved_at"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 4. Users (Role-based access)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(), // USR-001
  member_id: text("member_id"), // MEM-2026-001 or null for system admins
  full_name: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  mobile: text("mobile"),
  auth_uid: text("auth_uid"), // Firebase / Google Login UID
  role: text("role").notNull().default("Member"), // Super Admin, Organization Admin, Chapter Admin, Member, Staff, Viewer
  status: text("status").default("Active"),
  last_login: timestamp("last_login").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 5. Posts (Social Community Feed)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  post_id: text("post_id").notNull().unique(), // PST-001
  member_id: text("member_id").notNull(),
  post_type: text("post_type").notNull().default("Text"), // Text, Image, Video, Document, Business Update, Event Update, Training Update, Referral Success
  title: text("title").notNull(),
  content: text("content").notNull(),
  media_type: text("media_type"),
  media_url: text("media_url"), // Google Drive File URL
  thumbnail_url: text("thumbnail_url"),
  visibility: text("visibility").default("All Members"),
  status: text("status").default("Published"),
  is_pinned: boolean("is_pinned").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 6. Post_Comments
export const post_comments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  comment_id: text("comment_id").notNull().unique(),
  post_id: text("post_id").notNull(),
  member_id: text("member_id").notNull(),
  comment_text: text("comment_text").notNull(),
  parent_comment_id: text("parent_comment_id"),
  status: text("status").default("Active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 7. Post_Likes
export const post_likes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  like_id: text("like_id").notNull().unique(),
  post_id: text("post_id").notNull(),
  member_id: text("member_id").notNull(),
  reaction_type: text("reaction_type").default("Like"), // Like, Celebrate, Support, Interested
  created_at: timestamp("created_at").defaultNow(),
});

// 8. Announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  announcement_id: text("announcement_id").notNull().unique(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  image_url: text("image_url"),
  attachment_url: text("attachment_url"), // Google Drive attachment
  target_type: text("target_type").default("All Members"), // All Members, Specific Chapter, Specific Category, Admins Only
  target_chapter_id: text("target_chapter_id"),
  priority: text("priority").default("Normal"), // High, Urgent, Normal
  publish_date: text("publish_date"),
  expiry_date: text("expiry_date"),
  status: text("status").default("Published"),
  created_by: text("created_by"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 9. Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  event_id: text("event_id").notNull().unique(), // EVT-001
  chapter_id: text("chapter_id").notNull(), // CHAP-001 or ALL
  event_name: text("event_name").notNull(),
  event_type: text("event_type").notNull().default("Weekly Meeting"), // Weekly Meeting, Networking Event, Training, Workshop, Webinar, Orientation, Committee Meeting, Annual Event
  description: text("description"),
  event_date: text("event_date").notNull(),
  start_time: text("start_time"),
  end_time: text("end_time"),
  event_mode: text("event_mode").default("In-Person"), // In-Person, Online, Hybrid
  venue_name: text("venue_name"),
  venue_address: text("venue_address"),
  meeting_link: text("meeting_link"),
  capacity: integer("capacity").default(100),
  registration_required: boolean("registration_required").default(true),
  registration_deadline: text("registration_deadline"),
  event_status: text("event_status").default("Scheduled"), // Scheduled, Completed, Cancelled
  created_by: text("created_by"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 10. Event_Attendance
export const event_attendance = pgTable("event_attendance", {
  id: serial("id").primaryKey(),
  attendance_id: text("attendance_id").notNull().unique(),
  event_id: text("event_id").notNull(),
  member_id: text("member_id").notNull(),
  attendance_status: text("attendance_status").default("Present"), // Present, Absent, Late, Excused, Registered, Cancelled
  check_in_time: text("check_in_time"),
  check_out_time: text("check_out_time"),
  guest_count: integer("guest_count").default(0),
  remarks: text("remarks"),
  marked_by: text("marked_by"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 11. Visitors
export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  visitor_id: text("visitor_id").notNull().unique(), // VIS-001
  chapter_id: text("chapter_id").notNull(),
  event_id: text("event_id"),
  referred_by_member_id: text("referred_by_member_id"),
  visitor_name: text("visitor_name").notNull(),
  business_name: text("business_name").notNull(),
  category_interest: text("category_interest"),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  city: text("city"),
  visit_date: text("visit_date"),
  visit_status: text("visit_status").default("Invited"), // Invited, Registered, Attended, Follow-up Required, Converted, Not Interested
  converted_member_id: text("converted_member_id"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 12. Referrals
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referral_id: text("referral_id").notNull().unique(), // REF-001
  chapter_id: text("chapter_id").notNull(),
  given_by_member_id: text("given_by_member_id").notNull(),
  received_by_member_id: text("received_by_member_id").notNull(),
  client_name: text("client_name").notNull(),
  client_company: text("client_company").notNull(),
  client_mobile: text("client_mobile").notNull(),
  client_email: text("client_email"),
  referral_category_id: text("referral_category_id"),
  referral_description: text("referral_description").notNull(),
  referral_date: text("referral_date"),
  referral_status: text("referral_status").default("New"), // New, Contacted, In Progress, Converted, Closed, Rejected
  estimated_business_value: numeric("estimated_business_value").default("0"),
  closed_business_value: numeric("closed_business_value").default("0"),
  currency: text("currency").default("INR"),
  closure_date: text("closure_date"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 13. Business_Transactions
export const business_transactions = pgTable("business_transactions", {
  id: serial("id").primaryKey(),
  transaction_id: text("transaction_id").notNull().unique(), // TXN-001
  referral_id: text("referral_id"),
  giver_member_id: text("giver_member_id").notNull(),
  receiver_member_id: text("receiver_member_id").notNull(),
  transaction_date: text("transaction_date").notNull(),
  business_description: text("business_description").notNull(),
  amount: numeric("amount").notNull().default("0"),
  currency: text("currency").default("INR"),
  payment_status: text("payment_status").default("Paid"), // Paid, Pending
  transaction_status: text("transaction_status").default("Verified"),
  remarks: text("remarks"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 14. Organization_Settings
export const organization_settings = pgTable("organization_settings", {
  id: serial("id").primaryKey(),
  organization_id: text("organization_id").notNull().unique(), // ORG-001
  organization_name: text("organization_name").notNull().default("Membership Business Network"),
  organization_code: text("organization_code").default("MBN"),
  logo_url: text("logo_url"),
  email: text("email").default("admin@membershipbusinessnetwork.org"),
  phone: text("phone").default("+91 98200 45678"),
  website: text("website").default("https://membershipbusinessnetwork.org"),
  address: text("address").default("Tower 4B, Business Hub, BKC"),
  city: text("city").default("Mumbai"),
  state: text("state").default("Maharashtra"),
  country: text("country").default("India"),
  postal_code: text("postal_code").default("400051"),
  timezone: text("timezone").default("Asia/Kolkata"),
  currency: text("currency").default("INR"),
  gas_web_app_url: text("gas_web_app_url"), // Google Apps Script Deployment URL
  google_drive_folder_id: text("google_drive_folder_id"),
  status: text("status").default("Active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 15. Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  notification_id: text("notification_id").notNull().unique(),
  user_id: text("user_id").notNull(), // Target user or 'ALL'
  title: text("title").notNull(),
  message: text("message").notNull(),
  notification_type: text("notification_type").default("System"), // Referral, Event, Approval, Announcement, Business
  related_module: text("related_module"),
  related_record_id: text("related_record_id"),
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at").defaultNow(),
  read_at: timestamp("read_at"),
});

// 16. Activity_Log
export const activity_log = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  log_id: text("log_id").notNull().unique(),
  user_id: text("user_id").notNull(),
  action_type: text("action_type").notNull(), // Member Approved, Category Override, Referral Updated, etc.
  module_name: text("module_name").notNull(),
  record_id: text("record_id"),
  old_data: text("old_data"),
  new_data: text("new_data"),
  created_at: timestamp("created_at").defaultNow(),
});

// 17. Membership_Plans
export const membership_plans = pgTable("membership_plans", {
  id: serial("id").primaryKey(),
  plan_id: text("plan_id").notNull().unique(), // PLN-001
  plan_name: text("plan_name").notNull(), // Standard Membership, Premium Membership, Corporate Membership
  description: text("description"),
  duration_months: integer("duration_months").default(12),
  joining_fee: numeric("joining_fee").default("5000"),
  membership_fee: numeric("membership_fee").default("35000"),
  renewal_fee: numeric("renewal_fee").default("32000"),
  currency: text("currency").default("INR"),
  benefits: text("benefits"),
  status: text("status").default("Active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 18. Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  payment_id: text("payment_id").notNull().unique(), // PAY-001
  member_id: text("member_id").notNull(),
  plan_id: text("plan_id"),
  payment_date: text("payment_date").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("INR"),
  payment_method: text("payment_method").default("Bank Transfer / UPI"),
  transaction_reference: text("transaction_reference"),
  payment_status: text("payment_status").default("Paid"), // Paid, Pending, Overdue
  payment_for: text("payment_for").default("New Membership"), // New Membership, Renewal, Event Fee, Training Fee, Other
  remarks: text("remarks"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 19. Trainings
export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  training_id: text("training_id").notNull().unique(), // TRN-001
  chapter_id: text("chapter_id").default("ALL"),
  training_title: text("training_title").notNull(),
  trainer_name: text("trainer_name").notNull(),
  description: text("description"),
  training_date: text("training_date").notNull(),
  start_time: text("start_time"),
  end_time: text("end_time"),
  venue_or_link: text("venue_or_link"),
  training_type: text("training_type").default("Leadership Leadership Skills"), // Member Success Program, Referral Excellence, Presentation Mastery
  capacity: integer("capacity").default(50),
  status: text("status").default("Upcoming"), // Upcoming, Completed
  created_by: text("created_by"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 20. Training_Attendance
export const training_attendance = pgTable("training_attendance", {
  id: serial("id").primaryKey(),
  training_attendance_id: text("training_attendance_id").notNull().unique(),
  training_id: text("training_id").notNull(),
  member_id: text("member_id").notNull(),
  attendance_status: text("attendance_status").default("Present"),
  certificate_url: text("certificate_url"), // Google Drive Certificate URL
  score: integer("score").default(95),
  feedback: text("feedback"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
