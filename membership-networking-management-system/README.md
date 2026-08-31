# Membership Business Network — Executive Membership & Business Networking Management System

An institutional, fullstack B2B membership and business networking platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Recharts**, **Drizzle ORM (PostgreSQL)**, and **Google Apps Script REST API (`doGet` / `doPost`)** backed by **Google Sheets** (20 database tables) and **Google Drive** organized sub-folders.

---

## 1. Complete Architecture

```
Frontend (Next.js / React / TypeScript / Recharts)
   ↓
Authentication (Firebase OAuth / Role Switcher Simulator)
   ↓
Google Apps Script REST API Layer (doGet / doPost contract)
   ↓
Google Spreadsheet (20 Exact Tables: Members, Categories, Chapters, Referrals, TYFCB...)
   ↓
Google Drive (Membership Network/Members/, Posts/, Announcements/, Events/, Documents/)
```

---

## 2. Google Sheets Database (Exact 20 Version 1 Sheets)

The system enforces exact headers across all 20 required Google Sheet tabs:
1. `Members` (`member_id`, `membership_no`, `first_name`, `last_name`, `category_id`, `chapter_id`, `approval_status`, ...)
2. `Categories` (`category_id` CAT-001 through CAT-010, `max_members_allowed`, `active_member_count`, ...)
3. `Chapters` (`Lakshya` CHAP-001, `Unnati` CHAP-002 + unlimited future chapters)
4. `Users` (Role-based access matrix: `Super Admin`, `Organization Admin`, `Chapter Admin`, `Member`, `Staff`, `Viewer`)
5. `Posts` (Social community feed posts with image/document Google Drive URLs & pinned status)
6. `Post_Comments`
7. `Post_Likes`
8. `Announcements`
9. `Events`
10. `Event_Attendance`
11. `Visitors` (Invited → Registered → Attended → Follow-up Required → Converted)
12. `Referrals` (New → Contacted → In Progress → Converted → Closed)
13. `Business_Transactions` (Verified Thank You For Closed Business TYFCB ledger)
14. `Organization_Settings`
15. `Notifications`
16. `Activity_Log`
17. `Membership_Plans`
18. `Payments`
19. `Trainings`
20. `Training_Attendance`

---

## 3. Deploying the Google Apps Script Backend (`Google Apps Script/Code.gs`)

1. Open your Google Spreadsheet.
2. Click **Extensions → Apps Script**.
3. Copy the contents of `Google Apps Script/Code.gs`, `Config.gs`, `Utils.gs`, and `Drive.gs` into your script project.
4. Set script property `SPREADSHEET_ID` to your Google Sheet ID.
5. Click **Deploy → New Deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the Deployment Web App URL into Organization Settings (`gas_web_app_url`).

---

## 4. Key Workflows Implemented

- **Category Occupancy & Protection (#8, #39)**: Prevents assigning more active members to a category when its `max_members_allowed` is reached, with a Super Admin capacity override badge and activity audit log.
- **Member Approval Workflow (#40)**: `Pending → Admin Review → Approved / Rejected` with automated notifications and activity log entry.
- **Visitor to Member Induction (#42)**: Single-modal conversion that pre-populates visitor contact details, checks category seat vacancy, assigns chapter & referral sponsor, and links `converted_member_id`.
- **Referral TYFCB Pipeline (#41)**: Warm referral slips move from `New → Contacted → In Progress → Closed`, automatically creating a verified Thank You For Closed Business transaction upon closing.
