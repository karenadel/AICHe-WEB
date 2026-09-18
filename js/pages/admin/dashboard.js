// ============================================================
// DASHBOARD — page-specific logic.
// Relies on js/global/admin-auth.js being loaded first
// (currentUser, can, canAny, renderManagementNav).
// ============================================================

// ---- MOCK STATS DATA — replace with GET /dashboard/stats later ----
// TODO(Backend): stats should eventually be scoped per role.
const mockStats = [
  { label: "Total Students", value: 248, iconClass: "stat-icon--students" },
  { label: "Total Members", value: 96, iconClass: "stat-icon--members" },
  { label: "Total Courses", value: 18, iconClass: "stat-icon--courses" },
  { label: "Total Workshops", value: 12, iconClass: "stat-icon--workshops" },
  { label: "Total Events", value: 15, iconClass: "stat-icon--events" },
  { label: "Total Site Visits", value: 6, iconClass: "stat-icon--sitevisits" }
];

// ---- MOCK RECENT ACTIVITY — replace with GET /dashboard/recent-activity ----
// TODO(Backend): activity feed should eventually be scoped per role.
const mockActivity = [
  { type: "student", message: "New student enrolled — Ahmed Mohamed", created_at: "10 minutes ago" },
  { type: "session", message: "Web Development Committee added a new session", created_at: "35 minutes ago" },
  { type: "event", message: "Marketing Committee registered a new event", created_at: "1 hour ago" },
  { type: "task", message: "Technical Committee added a task", created_at: "2 hours ago" }
];

const quickActionsConfig = [
  { key: "add_course",     label: "Add Course",      href: "courses-management.html" },
  { key: "add_workshop",   label: "Add Workshop",    href: "workshops-management.html" },
  { key: "add_event",      label: "Add Event",       href: "events-management.html" },
  { key: "add_site_visit", label: "Add Site Visit",  href: "events-management.html" },
  { key: "add_session",    label: "Add Session",     href: "sessions-management.html" },
  { key: "add_task",       label: "Add Task",        href: "sessions-management.html" }
];

function renderTitle(user) {

  const title = document.getElementById('dashboardTitle');
  const eyebrow = document.getElementById('dashboardEyebrow');

  if (user.role === 'committee_admin') {

    title.textContent = `${user.committee} Committee Dashboard`;
    eyebrow.textContent = `${user.committee} Committee`;

  } else {

    title.textContent = 'Admin Dashboard';
    eyebrow.textContent = 'Upper Management';

  }

}

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

function renderQuickActions(user) {
  const container = document.getElementById('quickActions');
  const visible = quickActionsConfig.filter(action => can(user, action.key));

  container.innerHTML = visible.length
    ? visible.map(action => `<a href="${action.href}" class="action-btn">${action.label}</a>`).join('')
    : `<p>No quick actions available for your account.</p>`;
}

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