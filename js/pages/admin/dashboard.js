// ============================================================
// ADMIN DASHBOARD
//
// Relies on:
// js/global/admin-auth.js
//
// admin-auth.js MUST be loaded before this file.
// ============================================================


// ============================================================
// MOCK STATS DATA
// ============================================================
//
// TODO(Backend):
// Replace this with:
//
// GET /dashboard/stats
//
// Stats should eventually be scoped according to
// the authenticated user's role and committee.
// ============================================================

const mockStats = [

  {
    label: "Total Students",
    value: 248,
    iconClass: "stat-icon--students"
  },

  {
    label: "Total Members",
    value: 96,
    iconClass: "stat-icon--members"
  },

  {
    label: "Total Courses",
    value: 18,
    iconClass: "stat-icon--courses"
  },

  {
    label: "Total Workshops",
    value: 12,
    iconClass: "stat-icon--workshops"
  },

  {
    label: "Total Events",
    value: 15,
    iconClass: "stat-icon--events"
  },

  {
    label: "Total Site Visits",
    value: 6,
    iconClass: "stat-icon--sitevisits"
  }

];


// ============================================================
// MOCK RECENT ACTIVITY
// ============================================================
//
// TODO(Backend):
// Replace with:
//
// GET /dashboard/recent-activity
// ============================================================

const mockActivity = [

  {
    type: "student",
    message: "New student enrolled — Ahmed Mohamed",
    created_at: "10 minutes ago"
  },

  {
    type: "session",
    message: "Web Development Committee added a new session",
    created_at: "35 minutes ago"
  },

  {
    type: "event",
    message: "Marketing Committee registered a new event",
    created_at: "1 hour ago"
  },

  {
    type: "task",
    message: "Technical Committee added a task",
    created_at: "2 hours ago"
  }

];


// ============================================================
// QUICK ACTIONS CONFIGURATION
// ============================================================

const quickActionsConfig = [

  {
    key: "add_course",
    label: "Add Course",
    href: "courses-management.html"
  },

  {
    key: "add_workshop",
    label: "Add Workshop",
    href: "workshops-management.html"
  },

  {
    key: "add_event",
    label: "Add Event",
    href: "events-management.html"
  },

  {
    key: "add_site_visit",
    label: "Add Site Visit",
    href: "events-management.html"
  },

  {
    key: "add_session",
    label: "Add Session",
    href: "sessions-management.html"
  },

  {
    key: "add_task",
    label: "Add Task",
    href: "sessions-management.html"
  }

];


// ============================================================
// DASHBOARD TITLE
// ============================================================

function renderTitle(user) {

  const title =
    document.getElementById("dashboardTitle");

  const eyebrow =
    document.getElementById("dashboardEyebrow");

  const description =
    document.getElementById("dashboardDescription");

  const role =
    document.getElementById("dashboardRole");


  if (!title || !eyebrow || !description || !role) {
    return;
  }


  // Committee Admin
  if (isCommitteeAdmin(user)) {

    title.textContent =
      `${user.committee} Committee Dashboard`;

    eyebrow.textContent =
      `${user.committee} Committee`;

    description.textContent =
      `Manage ${user.committee} activities, sessions, tasks, and progress.`;

    role.textContent =
      "Committee Admin";

    return;
  }


  // President
  if (isPresident(user)) {

    title.textContent =
      "Admin Dashboard";

    eyebrow.textContent =
      "Upper Management";

    description.textContent =
      "Overview of AIChE activities, users, and content.";

    role.textContent =
      "President";

    return;
  }


  // VP
  if (isVP(user)) {

    title.textContent =
      "Admin Dashboard";

    eyebrow.textContent =
      "Upper Management";

    description.textContent =
      "Overview of AIChE activities, users, and content.";

    role.textContent =
      "Vice President";

    return;
  }


  // Secretary
  if (isSecretary(user)) {

    title.textContent =
      "Admin Dashboard";

    eyebrow.textContent =
      "Upper Management";

    description.textContent =
      "Overview of AIChE activities, users, and content.";

    role.textContent =
      "Secretary";

    return;
  }


  // Fallback
  title.textContent =
    "Admin Dashboard";

  eyebrow.textContent =
    "Administration";

  description.textContent =
    "Overview of AIChE activities, users, and content.";

  role.textContent =
    "Administrator";
}


// ============================================================
// RENDER STATS
// ============================================================

function renderStats(stats) {

  const grid =
    document.getElementById("statsGrid");

  if (!grid) {
    return;
  }


  if (!stats || !stats.length) {

    grid.innerHTML = `
      <p class="activity-empty">
        No statistics available.
      </p>
    `;

    return;
  }


  grid.innerHTML = stats
    .map(stat => {

      return `
        <div class="stat-card">

          <div
            class="stat-icon ${stat.iconClass}"
            aria-hidden="true"
          ></div>

          <div class="stat-text">

            <h3>
              ${stat.label}
            </h3>

            <p>
              ${stat.value}
            </p>

          </div>

        </div>
      `;

    })
    .join("");
}


// ============================================================
// RENDER QUICK ACTIONS
// ============================================================

function renderQuickActions(user) {

  const container =
    document.getElementById("quickActions");

  if (!container) {
    return;
  }


  const visibleActions =
    quickActionsConfig.filter(action => {

      return can(
        user,
        action.key
      );

    });


  // No actions available
  if (!visibleActions.length) {

    container.innerHTML = `
      <p class="actions-empty">
        No quick actions are available for your account.
      </p>
    `;

    return;
  }


  // Render actions
  container.innerHTML =
    visibleActions
      .map(action => {

        return `
          <a
            href="${action.href}"
            class="action-btn"
          >
            ${action.label}
          </a>
        `;

      })
      .join("");
}


// ============================================================
// RENDER RECENT ACTIVITY
// ============================================================

function renderActivity(items) {

  const list =
    document.getElementById("activityList");

  if (!list) {
    return;
  }


  if (!items || !items.length) {

    list.innerHTML = `
      <p class="activity-empty">
        No recent activity.
      </p>
    `;

    return;
  }


  list.innerHTML =
    items
      .map(item => {

        return `
          <div
            class="activity-item
                   activity-item--${item.type}"
          >

            <p class="activity-message">
              ${item.message}
            </p>

            <span class="activity-time">
              ${item.created_at}
            </span>

          </div>
        `;

      })
      .join("");
}


// ============================================================
// INITIALIZE DASHBOARD
// ============================================================

function initDashboard() {

  // Make sure admin-auth.js loaded correctly.
  if (typeof currentUser === "undefined") {

    console.error(
      "Dashboard error: currentUser is not available. " +
      "Make sure admin-auth.js is loaded before dashboard.js."
    );

    return;
  }


  // Header
  renderTitle(currentUser);


  // Statistics
  renderStats(mockStats);


  // Quick actions
  renderQuickActions(currentUser);


  // Recent activity
  renderActivity(mockActivity);
}


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);