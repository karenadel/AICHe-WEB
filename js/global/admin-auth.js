// // ============================================================
// // ADMIN AUTH & PERMISSIONS — shared across every admin page.
// // Include this via <script> BEFORE the page's own JS file.
// //
// // TODO(Backend): currentUser is currently a mock. Once login
// // returns a real session, replace this object with the actual
// // authenticated user's { role, committee, permissions }.
// // ============================================================

// // --- Example: President / VP / Secretary (full access) ---
// const currentUser = {
//   role: "president",
//   committee: null,
//   permissions: {}   // ignored entirely — hasFullAccess() overrides
// };

// // --- Example: Committee Admin (uncomment to test instead) ---
// // NOTE: view_database intentionally omitted.
// // Question for Backend/PM: does "Database" mean chapter-wide
// // data or just the committee's own section? Until decided,
// // Committee Admins do NOT get view_database — only
// // President/VP/Secretary see it via hasFullAccess().
// // const currentUser = {
// //   role: "committee_admin",
// //   committee: "Web Development",
// //   permissions: {
// //     view_courses: true,
// //     add_course: false,
// //     view_workshops: true,
// //     add_workshop: false,
// //     view_events: false,
// //     view_site_visits: true,
// //     add_event: false,
// //     add_site_visit: false,
// //     view_sessions: true,
// //     add_session: true,
// //     add_task: true,
// //     view_users: false,
// //     view_student_progress: true,
// //     view_member_progress: true,
// //     view_attendance: true,
// //     view_points: true,
// //     view_feedback: false,
// //     view_access_control: false
// //   }
// // };

// // ============================================================
// // Management sidebar config — identical across all admin pages
// // ============================================================
// const managementConfig = [
//   { key: "view_courses",          label: "Courses",              href: "courses-management.html" },
//   { key: "view_workshops",        label: "Workshops",            href: "workshops-management.html" },
//   {
//     keys: ["view_events", "view_site_visits"],
//     label: "Events & Site Visits",
//     href: "events-management.html"
//   },
//   { key: "view_sessions",         label: "Sessions",             href: "sessions-management.html" },
//   { key: "view_database",         label: "Database",             href: "database.html" },
//   { key: "view_users",            label: "Users",                href: "users.html" },
//   { key: "view_student_progress", label: "Student Progress",     href: "student-progress.html" },
//   { key: "view_member_progress",  label: "Member Progress",      href: "member-progress.html" },
//   { key: "view_attendance",       label: "Attendance",           href: "attendance.html" },
//   { key: "view_points",           label: "Points",               href: "points.html" },
//   { key: "view_feedback",         label: "Feedback Reports",     href: "feedback-reports.html" },
//   { key: "view_access_control",   label: "Access Control",       href: "access-control.html" }
// ];

// // ============================================================
// // Permission logic
// // NOTE: this is UI-only. Hiding a button or redirecting away
// // from a page here does NOT protect the actual action or data —
// // Backend MUST independently verify every request against the
// // authenticated user's real role/committee/permissions.
// // ============================================================
// function hasFullAccess(user) {
//   return ["president", "vp", "secretary"].includes(user.role);
// }
// function can(user, key) {
//   return hasFullAccess(user) || !!user.permissions[key];
// }
// function canAny(user, ...keys) {
//   return keys.some(key => can(user, key));
// }

// // ---- Page access guard ----
// // Call at the top of each page's init function. Redirects to
// // the dashboard if the user lacks the required permission(s).
// function requirePermission(user, key, redirectTo = 'dashboard.html') {
//   if (!can(user, key)) {
//     window.location.href = redirectTo;
//     return false;
//   }
//   return true;
// }
// function requireAnyPermission(user, keys, redirectTo = 'dashboard.html') {
//   if (!canAny(user, ...keys)) {
//     window.location.href = redirectTo;
//     return false;
//   }
//   return true;
// }

// function renderManagementNav(user) {
//   const list = document.getElementById('managementList');
//   if (!list) return;

//   const currentPage = window.location.pathname.split('/').pop();

//   const visible = managementConfig.filter(item => {
//     if (item.keys) return canAny(user, ...item.keys);
//     return can(user, item.key);
//   });

//   list.innerHTML = visible.length
//     ? visible.map(item => {
//         const activeClass = item.href === currentPage ? ' class="is-active"' : '';
//         return `<li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
//       }).join('')
//     : `<li>No management sections available.</li>`;
// }
// ============================================================
// ADMIN AUTH & PERMISSIONS — shared across every admin page.
// Include this via <script> BEFORE the page's own JS file.
//
// TODO(Backend): currentUser is currently a mock. Once login
// returns a real session, replace this object with the actual
// authenticated user's { role, committee, permissions }.
// ============================================================

// --- Example: President / VP / Secretary (full access) ---
const currentUser = {
  role: "president",
  committee: null,
  permissions: {}   // ignored entirely — hasFullAccess() overrides
};

// --- Example: Committee Admin (uncomment to test instead) ---
// NOTE: view_database intentionally omitted.
// Question for Backend/PM: does "Database" mean chapter-wide
// data or just the committee's own section? Until decided,
// Committee Admins do NOT get view_database — only
// President/VP/Secretary see it via hasFullAccess().
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
// Management sidebar config — identical across all admin pages
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
// NOTE: this is UI-only. Hiding a button or redirecting away
// from a page here does NOT protect the actual action or data —
// Backend MUST independently verify every request against the
// authenticated user's real role/committee/permissions.
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

// ---- Page access guard ----
// Call at the top of each page's init function. Redirects to
// the dashboard if the user lacks the required permission(s).
function requirePermission(user, key, redirectTo = 'dashboard.html') {
  if (!can(user, key)) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
function requireAnyPermission(user, keys, redirectTo = 'dashboard.html') {
  if (!canAny(user, ...keys)) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

function renderManagementNav(user) {
  const list = document.getElementById('managementList');
  if (!list) return;

  const currentPage = window.location.pathname.split('/').pop();

  const visible = managementConfig.filter(item => {
    if (item.keys) return canAny(user, ...item.keys);
    return can(user, item.key);
  });

  list.innerHTML = visible.length
    ? visible.map(item => {
        const activeClass = item.href === currentPage ? ' class="is-active"' : '';
        return `<li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
      }).join('')
    : `<li>No management sections available.</li>`;
}
