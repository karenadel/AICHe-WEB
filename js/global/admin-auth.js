// ============================================================
// ADMIN AUTH & PERMISSIONS
// Shared across all admin pages.
// Include this file BEFORE the page's own JS file.
//
// IMPORTANT:
// This file currently uses a MOCK currentUser for frontend testing.
//
// Backend TODO:
// Once authentication is connected, currentUser should come from
// the authenticated session / API response and contain:
//
// {
//   role: "president" | "vp" | "secretary" | "committee_admin",
//   committee: "Web Development" | "Marketing" | ... | null,
//   permissions: { ... }
// }
//
// Backend MUST independently enforce all permissions.
// Frontend permission checks are only for UI/UX.
// ============================================================


// ============================================================
// CURRENT USER — MOCK DATA FOR FRONTEND TESTING
// ============================================================

// ------------------------------------------------------------
// Option 1: President / VP / Secretary
// Full access automatically.
// ------------------------------------------------------------

const currentUser = {
  role: "president",
  committee: null,
  permissions: {}
};


// ------------------------------------------------------------
// Option 2: Committee Admin
//
// To test a Committee Admin instead:
//
// 1. Comment out the currentUser object above.
// 2. Uncomment the object below.
// 3. Change committee if needed.
// ------------------------------------------------------------

/*
const currentUser = {
  role: "committee_admin",

  committee: "Web Development",

  permissions: {

    // -------------------------
    // Courses
    // -------------------------
    view_courses: true,
    add_course: false,
    edit_course: false,
    delete_course: false,

    // -------------------------
    // Workshops
    // -------------------------
    view_workshops: true,
    add_workshop: false,
    edit_workshop: false,
    delete_workshop: false,

    // Workshop Sessions
    add_workshop_session: false,
    edit_workshop_session: false,
    delete_workshop_session: false,

    // -------------------------
    // Events
    // -------------------------
    view_events: false,
    add_event: false,
    edit_event: false,
    delete_event: false,

    // -------------------------
    // Site Visits
    // -------------------------
    view_site_visits: true,
    add_site_visit: false,
    edit_site_visit: false,
    delete_site_visit: false,

    // -------------------------
    // Sessions
    // -------------------------
    view_sessions: true,
    add_session: true,
    edit_session: true,
    delete_session: true,

    // Tasks
    add_task: true,
    edit_task: true,
    delete_task: true,

    // -------------------------
    // Database
    // -------------------------
    view_database: true,
    edit_database: false,

    // -------------------------
    // Users
    // -------------------------
    view_users: false,

    // -------------------------
    // Student Progress
    // -------------------------
    view_student_progress: true,

    // -------------------------
    // Member Progress
    // -------------------------
    view_member_progress: true,

    // -------------------------
    // Attendance
    // -------------------------
    view_attendance: true,
    edit_attendance: true,

    // -------------------------
    // Points
    // -------------------------
    view_points: true,
    edit_points: true,

    // -------------------------
    // Feedback Reports
    // -------------------------
    view_feedback: false,

    // -------------------------
    // Access Control
    // -------------------------
    view_access_control: false

  }
};
*/


// ============================================================
// MANAGEMENT SIDEBAR CONFIGURATION
// ============================================================
//
// The sidebar is the same structure for every admin.
//
// Visibility is controlled by permissions.
//
// NOTE:
// "Events & Site Visits" contains two permissions because they
// share one page in the sitemap.
//

const managementConfig = [

  {
    key: "view_courses",
    label: "Courses",
    href: "courses-management.html"
  },

  {
    key: "view_workshops",
    label: "Workshops",
    href: "workshops-management.html"
  },

  {
    keys: ["view_events", "view_site_visits"],
    label: "Events & Site Visits",
    href: "events-management.html"
  },

  {
    key: "view_sessions",
    label: "Sessions",
    href: "sessions-management.html"
  },

  {
    key: "view_database",
    label: "Database",
    href: "database.html"
  },

  {
    key: "view_users",
    label: "Users",
    href: "users.html"
  },

  {
    key: "view_student_progress",
    label: "Student Progress",
    href: "student-progress.html"
  },

  {
    key: "view_member_progress",
    label: "Member Progress",
    href: "member-progress.html"
  },

  {
    key: "view_attendance",
    label: "Attendance",
    href: "attendance.html"
  },

  {
    key: "view_points",
    label: "Points",
    href: "points.html"
  },

  {
    key: "view_feedback",
    label: "Feedback Reports",
    href: "feedback-reports.html"
  },

  {
    key: "view_access_control",
    label: "Access Control",
    href: "access-control.html"
  }

];


// ============================================================
// ROLE HELPERS
// ============================================================

/**
 * Check whether the user has full admin access.
 *
 * According to the website structure:
 * President / VP / Secretary
 * have full access.
 */
function hasFullAccess(user) {

  if (!user || !user.role) {
    return false;
  }

  return [
    "president",
    "vp",
    "secretary"
  ].includes(user.role);

}


// ============================================================
// PERMISSION CHECK
// ============================================================

/**
 * Check whether a user has a specific permission.
 *
 * Full-access roles automatically pass every permission check.
 *
 * Example:
 *
 * can(currentUser, "add_course")
 * can(currentUser, "view_workshops")
 */
function can(user, permissionKey) {

  if (!user) {
    return false;
  }

  // President / VP / Secretary
  // automatically have full access.
  if (hasFullAccess(user)) {
    return true;
  }

  // Committee Admin
  return !!(
    user.permissions &&
    user.permissions[permissionKey]
  );

}


// ============================================================
// MULTIPLE PERMISSIONS
// ============================================================

/**
 * Check if the user has AT LEAST ONE of the given permissions.
 *
 * Example:
 *
 * canAny(
 *   currentUser,
 *   "view_events",
 *   "view_site_visits"
 * );
 */
function canAny(user, ...permissionKeys) {

  return permissionKeys.some(
    permissionKey => can(user, permissionKey)
  );

}


/**
 * Check if the user has ALL of the given permissions.
 *
 * Example:
 *
 * canAll(
 *   currentUser,
 *   "view_workshops",
 *   "edit_workshop"
 * );
 */
function canAll(user, ...permissionKeys) {

  return permissionKeys.every(
    permissionKey => can(user, permissionKey)
  );

}


// ============================================================
// PAGE ACCESS GUARDS
// ============================================================

/**
 * Require one permission to access a page.
 *
 * If the user doesn't have the permission,
 * redirect them to the dashboard.
 *
 * Example:
 *
 * if (!requirePermission(currentUser, "view_workshops")) {
 *   return;
 * }
 */
function requirePermission(
  user,
  permissionKey,
  redirectTo = "dashboard.html"
) {

  if (!can(user, permissionKey)) {

    window.location.href = redirectTo;

    return false;
  }

  return true;

}


/**
 * Require at least one permission.
 *
 * Example:
 *
 * if (
 *   !requireAnyPermission(
 *     currentUser,
 *     ["view_events", "view_site_visits"]
 *   )
 * ) {
 *   return;
 * }
 */
function requireAnyPermission(
  user,
  permissionKeys,
  redirectTo = "dashboard.html"
) {

  if (!canAny(user, ...permissionKeys)) {

    window.location.href = redirectTo;

    return false;
  }

  return true;

}


/**
 * Require ALL permissions.
 *
 * Useful when a page/action needs multiple permissions.
 */
function requireAllPermissions(
  user,
  permissionKeys,
  redirectTo = "dashboard.html"
) {

  if (!canAll(user, ...permissionKeys)) {

    window.location.href = redirectTo;

    return false;
  }

  return true;

}


// ============================================================
// MANAGEMENT SIDEBAR
// ============================================================

/**
 * Render the Management sidebar according to permissions.
 *
 * Every admin page should contain:
 *
 * <ul id="managementList"></ul>
 *
 * The function will automatically fill it.
 */
function renderManagementNav(user) {

  const list = document.getElementById("managementList");

  if (!list) {
    return;
  }


  // Get current HTML page name.
  const currentPage =
    window.location.pathname
      .split("/")
      .pop();


  // Determine which sections the user can see.
  const visibleSections =
    managementConfig.filter(item => {

      // Some sidebar items depend on multiple permissions.
      if (item.keys) {

        return canAny(
          user,
          ...item.keys
        );

      }

      // Normal single-permission item.
      return can(
        user,
        item.key
      );

    });


  // No available sections.
  if (!visibleSections.length) {

    list.innerHTML = `
      <li class="sidebar__empty">
        No management sections available.
      </li>
    `;

    return;
  }


  // Render sidebar links.
  list.innerHTML =
    visibleSections
      .map(item => {

        const activeClass =
          item.href === currentPage
            ? " class=\"is-active\""
            : "";

        return `
          <li>
            <a href="${item.href}"${activeClass}>
              ${item.label}
            </a>
          </li>
        `;

      })
      .join("");

}


// ============================================================
// CONDITIONAL ELEMENT VISIBILITY
// ============================================================

/**
 * Show/hide an element based on a permission.
 *
 * Example:
 *
 * showIfCan(
 *   currentUser,
 *   "add_course",
 *   document.getElementById("addCourseBtn")
 * );
 */
function showIfCan(
  user,
  permissionKey,
  element
) {

  if (!element) {
    return;
  }

  element.hidden = !can(
    user,
    permissionKey
  );

}


/**
 * Show/hide an element if the user has ANY
 * of the provided permissions.
 */
function showIfCanAny(
  user,
  permissionKeys,
  element
) {

  if (!element) {
    return;
  }

  element.hidden = !canAny(
    user,
    ...permissionKeys
  );

}


/**
 * Show/hide an element if the user has ALL
 * of the provided permissions.
 */
function showIfCanAll(
  user,
  permissionKeys,
  element
) {

  if (!element) {
    return;
  }

  element.hidden = !canAll(
    user,
    ...permissionKeys
  );

}


// ============================================================
// BUTTON / ACTION GUARD
// ============================================================

/**
 * Useful for actions such as Edit / Delete.
 *
 * Example:
 *
 * if (!ensurePermission(currentUser, "delete_course")) {
 *   return;
 * }
 *
 * This protects the frontend action.
 * Backend must STILL verify the request.
 */
function ensurePermission(
  user,
  permissionKey
) {

  if (!can(user, permissionKey)) {

    console.warn(
      `Permission denied: ${permissionKey}`
    );

    return false;
  }

  return true;

}


// ============================================================
// USER INFORMATION HELPERS
// ============================================================

/**
 * Get the current user's role.
 */
function getUserRole(user = currentUser) {

  return user?.role || null;

}


/**
 * Get the current user's committee.
 */
function getUserCommittee(user = currentUser) {

  return user?.committee || null;

}


/**
 * Check whether the current user is a Committee Admin.
 */
function isCommitteeAdmin(
  user = currentUser
) {

  return user?.role === "committee_admin";

}


/**
 * Check whether the current user is President.
 */
function isPresident(
  user = currentUser
) {

  return user?.role === "president";

}


/**
 * Check whether the current user is VP.
 */
function isVP(
  user = currentUser
) {

  return user?.role === "vp";

}


/**
 * Check whether the current user is Secretary.
 */
function isSecretary(
  user = currentUser
) {

  return user?.role === "secretary";

}


// ============================================================
// DEBUG / TEST HELPERS
// ============================================================
//
// These are useful during frontend development.
//
// Open browser console and run:
//
// getCurrentUser()
// getCurrentUserPermissions()
// can(currentUser, "add_course")
// hasFullAccess(currentUser)
//

function getCurrentUser() {

  return currentUser;

}


function getCurrentUserPermissions() {

  return currentUser?.permissions || {};

}


// ============================================================
// BACKEND INTEGRATION NOTE
// ============================================================
//
// This file is currently FRONTEND authorization logic.
//
// When backend authentication is ready:
//
// ❌ Do NOT trust this mock object.
// ❌ Do NOT use frontend permissions as real security.
//
// Instead:
//
// 1. User logs in.
// 2. Backend authenticates the account.
// 3. Backend determines:
//
//      role
//      committee
//      permissions
//
// 4. Backend returns/stores the authenticated session.
// 5. Frontend loads the real authenticated user.
// 6. Frontend uses the functions in this file to control UI.
//
// Backend MUST also check authorization for:
//
//      GET
//      POST
//      PUT/PATCH
//      DELETE
//
// requests.
//
// A hidden button is NOT security.
//
// ============================================================