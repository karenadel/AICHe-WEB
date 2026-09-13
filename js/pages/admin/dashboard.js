// ============================================================
// MOCK USER DATA — replace with the real login/session response
// once Backend has an endpoint. This is the ONLY object you
// should need to swap out later.
//
// Toggle `role` below to test different views:
// "committee_admin" → needs `committee` + full `permissions` map
// "president" / "vp" / "secretary" → full access, `permissions` ignored
// ============================================================

// --- Example: President / VP / Secretary (full access) ---
const currentUser = {
  role: "president",
  committee: null,
  permissions: {}   // ignored entirely — hasFullAccess() overrides
};

// --- Example: Committee Admin (uncomment to test instead) ---
// NOTE: view_database intentionally omitted below.
// Question for Backend/PM: does "Database" mean the chapter-wide
// database (all committees' data), or just the committee's own
// data section? Until this is decided, Committee Admins do NOT
// get view_database — only President/VP/Secretary see Database
// via hasFullAccess().
// const currentUser = {
//   role: "committee_admin",
//   committee: "Web Development",
//   permissions: {
//     view_courses: true,
//     add_course: false,

//     view_workshops: true,
//     add_workshop: false,

//     view_events: false,
//     view_site_visits: true,
//     add_event: false,
//     add_site_visit: false,

//     view_sessions: true,
//     add_session: true,
//     add_task: true,

//     view_users: false,

//     view_student_progress: true,
//     view_member_progress: true,

//     view_attendance: true,
//     view_points: true,

//     view_feedback: false,
//     view_access_control: false
//   }
// };

// ============================================================
// MOCK STATS DATA — replace with GET /dashboard/stats later
// TODO(Backend): stats should eventually be scoped per role —
// a Committee Admin may need committee-specific stats instead
// of chapter-wide totals. Using chapter-wide totals for now.
// ============================================================
const mockStats = [
  { label: "Total Students", value: 248, iconClass: "stat-icon--students" },
  { label: "Total Members", value: 96, iconClass: "stat-icon--members" },
  { label: "Total Courses", value: 18, iconClass: "stat-icon--courses" },
  { label: "Total Workshops", value: 12, iconClass: "stat-icon--workshops" },
  { label: "Total Events", value: 15, iconClass: "stat-icon--events" },
  { label: "Total Site Visits", value: 6, iconClass: "stat-icon--sitevisits" }
];

// ============================================================
// MOCK RECENT ACTIVITY — replace with GET /dashboard/recent-activity
// TODO(Backend): activity feed should eventually be scoped per
// role — a Committee Admin shouldn't see other committees'
// activity unless that's an intended chapter-wide view.
// ============================================================
const mockActivity = [
  { type: "student", message: "New student enrolled — Ahmed Mohamed", created_at: "10 minutes ago" },
  { type: "session", message: "Web Development Committee added a new session", created_at: "35 minutes ago" },
  { type: "event", message: "Marketing Committee registered a new event", created_at: "1 hour ago" },
  { type: "task", message: "Technical Committee added a task", created_at: "2 hours ago" }
];

// ============================================================
// Quick Actions — "Add" actions only, deliberately separate
// from managementConfig below (which is "View" access to a
// whole management page).
// ============================================================
const quickActionsConfig = [
  { key: "add_course",     label: "Add Course",      href: "courses-management.html" },
  { key: "add_workshop",   label: "Add Workshop",    href: "workshops-management.html" },
  { key: "add_event",      label: "Add Event",       href: "events-management.html" },
  { key: "add_site_visit", label: "Add Site Visit",  href: "events-management.html" },
  { key: "add_session",    label: "Add Session",     href: "sessions-management.html" },
  { key: "add_task",       label: "Add Task",        href: "sessions-management.html" }
];

// ============================================================
// Management sidebar — "View" permissions, separate from Quick
// Actions above. Some items depend on more than one permission
// (e.g. Events & Site Visits) — use `keys: []` for those instead
// of a single `key`.
//
// Database: only reachable via hasFullAccess() (President/VP/
// Secretary). Committee Admins never get this until Backend/PM
// decide what "Database" scope actually means for them.
// ============================================================
const managementConfig = [
  { key: "view_courses",          label: "Courses",              href: "courses-management.html" },
  { key: "view_workshops",        label: "Workshops",            href: "workshops-management.html" },
  {
    keys: ["view_events", "view_site_visits"],
    label: "Events & Site Visits",
    href: "events-management.html"
  },
  { key: "view_sessions",         label: "Sessions",             href: "sessions-management.html" },
  { key: "view_database",         label: "Database",             href: "database.html" },
  { key: "view_users",            label: "Users",                href: "users.html" },
  { key: "view_student_progress", label: "Student Progress",     href: "student-progress.html" },
  { key: "view_member_progress",  label: "Member Progress",      href: "member-progress.html" },
  { key: "view_attendance",       label: "Attendance",           href: "attendance.html" },
  { key: "view_points",           label: "Points",               href: "points.html" },
  { key: "view_feedback",         label: "Feedback Reports",     href: "feedback-reports.html" },
  { key: "view_access_control",   label: "Access Control",       href: "access-control.html" }
];

// ============================================================
// Permission logic
// NOTE: this is UI-only. Hiding a button here does NOT protect
// the actual action — Backend MUST independently verify every
// write request (create course, add session, etc.) against the
// authenticated user's real role/committee/permissions. Anyone
// can open DevTools and flip currentUser.permissions.x to true;
// that only changes what renders, never what Backend will allow.
// ============================================================
function hasFullAccess(user) {
  return ["president", "vp", "secretary"].includes(user.role);
}
function can(user, key) {
  return hasFullAccess(user) || !!user.permissions[key];
}
function canAny(user, ...keys) {
  return keys.some(key => can(user, key));
}

// ---- Render: Dashboard title ----
function renderTitle(user) {
  const title = document.getElementById('dashboardTitle');
  const eyebrow = document.getElementById('dashboardEyebrow');
  const profileLabel = document.getElementById('profileLabel');

  if (user.role === 'committee_admin') {
    title.textContent = `${user.committee} Committee Dashboard`;
    eyebrow.textContent = `${user.committee} Committee`;
    profileLabel.textContent = user.committee;
  } else {
    title.textContent = 'Admin Dashboard';
    eyebrow.textContent = 'Upper Management';
    profileLabel.textContent = user.role.toUpperCase();
  }
}

// ---- Render: Stat cards ----
function renderStats(stats) {
  const grid = document.getElementById('statsGrid');
  grid.innerHTML = stats.map(stat => `
    <div class="stat-card">
      <div class="stat-icon ${stat.iconClass}"></div>
      <div class="stat-text">
        <h3>${stat.label}</h3>
        <p>${stat.value}</p>
      </div>
    </div>
  `).join('');
}

// ---- Render: Quick actions (permission-gated) ----
function renderQuickActions(user) {
  const container = document.getElementById('quickActions');
  const visible = quickActionsConfig.filter(action => can(user, action.key));

  container.innerHTML = visible.length
    ? visible.map(action => `<a href="${action.href}" class="action-btn">${action.label}</a>`).join('')
    : `<p>No quick actions available for your account.</p>`;
}

// ---- Render: Management nav (permission-gated) ----
function renderManagementNav(user) {
  const list = document.getElementById('managementList');
  const visible = managementConfig.filter(item => {
    if (item.keys) return canAny(user, ...item.keys);
    return can(user, item.key);
  });

  list.innerHTML = visible.length
    ? visible.map(item => `<li><a href="${item.href}">${item.label}</a></li>`).join('')
    : `<li>No management sections available.</li>`;
}

// ---- Render: Recent activity ----
function renderActivity(items) {
  const list = document.getElementById('activityList');
  list.innerHTML = items.map(item => `
    <div class="activity-item activity-item--${item.type}">
      <p>${item.message}</p>
      <span class="activity-time">${item.created_at}</span>
    </div>
  `).join('');
}

// ---- Init ----
function initDashboard() {
  renderTitle(currentUser);
  renderStats(mockStats);
  renderQuickActions(currentUser);
  renderManagementNav(currentUser);
  renderActivity(mockActivity);
}

document.addEventListener('DOMContentLoaded', initDashboard);