// ============================================================
// COURSE DETAILS — page-specific logic.
// Relies on js/global/admin-auth.js being loaded first
// (currentUser, can, requirePermission, renderManagementNav).
// ============================================================

// ---- MOCK COURSE DATA — replace with GET /courses/:id later ----
// TODO(Backend): fetch by the `id` query param instead of this lookup.
// Only fields already confirmed elsewhere (name, description,
// students) are included — no invented fields like Instructor,
// Level, or Duration until the real course model is confirmed.
const mockCoursesById = {
  1: {
    id: 1,
    name: "Process Safety Foundations",
    description: "Make safer decisions earlier. A practical course in hazard recognition, safeguards, and the language of process safety.",
    students: 32,
    certificateEnabled: true,
    parts: [
      { type: "Lecture", title: "Process safety mindset", status: "Published" },
      { type: "Lecture", title: "Reading the process", status: "Published" },
      { type: "Task", title: "Safeguards that work", status: "Published" },
      { type: "Quiz", title: "Bow-tie thinking", status: "Published" },
      { type: "Final Exam", title: "Final case review", status: "Draft" }
    ]
  },
  2: {
    id: 2,
    name: "Excel for Process Engineers",
    description: "Build a clean model for mass balances, scenarios, and decisions your team can trust.",
    students: 45,
    certificateEnabled: false,
    parts: [
      { type: "Lecture", title: "Getting started with models", status: "Published" },
      { type: "Task", title: "Build a mass balance sheet", status: "Draft" }
    ]
  }
};

function getCourseIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id'));
}

function renderCourseInfo(course) {
  document.getElementById('courseTitle').textContent = course.name;
  document.getElementById('courseDescription').textContent = course.description;
  document.getElementById('courseStudents').textContent = course.students;
}

function renderParts(parts) {
  const list = document.getElementById('partsList');
  list.innerHTML = parts.length
    ? parts.map(part => `
        <li class="part-item">
          <div class="part-item__label">
            <span class="part-item__type">${part.type}</span>
            <span class="part-item__title">${part.title}</span>
          </div>
          <span class="part-item__status">${part.status}</span>
        </li>
      `).join('')
    : `<li>No parts added yet.</li>`;
}

function renderCertificateStatus(course) {
  const el = document.getElementById('certificateStatus');
  el.textContent = course.certificateEnabled
    ? "Certificate is enabled for this course — issued automatically on completion of the Final Exam."
    : "Certificate is not yet configured for this course.";
}

// ⚠️ TEMPORARY: reusing `add_course` to gate "Add Part" until
// Backend/PM define a real permission for editing course
// content (e.g. `edit_course` or `add_course_part`). Creating a
// new course and editing an existing course's parts are likely
// different operations and probably shouldn't share one
// permission long-term. Replace this key once confirmed.
function renderAddPartButton(user) {
  const btn = document.getElementById('addPartBtn');
  btn.hidden = !can(user, 'add_course');
}

// ---- Init ----
function initPage() {
  if (!requirePermission(currentUser, 'view_courses')) return;

  const courseId = getCourseIdFromUrl();
  const course = mockCoursesById[courseId];

  if (!course) {
    document.getElementById('courseTitle').textContent = "Course not found";
    document.getElementById('courseDescription').textContent = "";
    return;
  }

  renderManagementNav(currentUser);
  renderCourseInfo(course);
  renderParts(course.parts);
  renderCertificateStatus(course);
  renderAddPartButton(currentUser);
}

document.addEventListener('DOMContentLoaded', initPage);