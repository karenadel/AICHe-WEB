// ============================================================
// COURSE DETAILS — page-specific logic.
// Relies on js/global/admin-auth.js being loaded first.
// ============================================================

const mockCoursesById = {
  1: { id: 1, name: "Process Safety Foundations", description: "Make safer decisions earlier. A practical course in hazard recognition, safeguards, and the language of process safety.", instructor: "Eng. Youssef Khalil", level: "Intermediate", duration: "6 hours", students: 32, certificateEnabled: true, parts: [
    { type: "Lecture", title: "Process safety mindset", status: "Published" }, { type: "Lecture", title: "Reading the process", status: "Published" }, { type: "Task", title: "Safeguards that work", status: "Published" }, { type: "Quiz", title: "Bow-tie thinking", status: "Published" }, { type: "Final Exam", title: "Final case review", status: "Draft" }
  ] },
  2: { id: 2, name: "Excel for Process Engineers", description: "Build a clean model for mass balances, scenarios, and decisions your team can trust.", instructor: "Eng. Mariam Hassan", level: "Open to all", duration: "9 hours", students: 45, certificateEnabled: false, parts: [
    { type: "Lecture", title: "Getting started with models", status: "Published" }, { type: "Task", title: "Build a mass balance sheet", status: "Draft" }
  ] }
};

function renderCourseInfo(course) {
  document.getElementById("courseTitle").textContent = course.name;
  document.getElementById("courseDescription").textContent = course.description;
  document.getElementById("courseInstructor").textContent = course.instructor;
  document.getElementById("courseLevel").textContent = course.level;
  document.getElementById("courseDuration").textContent = course.duration;
  document.getElementById("courseStudents").textContent = course.students;
}

function getCourseIdFromUrl() { return Number(new URLSearchParams(window.location.search).get("id")); }

function renderParts(parts) {
  const list = document.getElementById("partsList");
  list.innerHTML = parts.length ? parts.map(part => `
    <li class="part-item"><div class="part-item__label"><span class="part-item__type">${part.type}</span><span class="part-item__title">${part.title}</span></div><span class="part-item__status">${part.status}</span></li>
  `).join("") : "<li>No parts added yet.</li>";
}

function renderCertificateStatus(course) {
  document.getElementById("certificateStatus").textContent = course.certificateEnabled
    ? "Certificate is enabled for this course — issued automatically on completion of the Final Exam."
    : "Certificate is not yet configured for this course.";
}

function renderAddPartButton(user) { document.getElementById("addPartBtn").hidden = !can(user, "add_course"); }

function initPage() {
  if (!requirePermission(currentUser, "view_courses")) return;
  const course = mockCoursesById[getCourseIdFromUrl()];
  if (!course) {
    document.getElementById("courseTitle").textContent = "Course not found";
    document.getElementById("courseDescription").textContent = "";
    return;
  }
  renderCourseInfo(course);
  renderParts(course.parts);
  renderCertificateStatus(course);
  renderAddPartButton(currentUser);
}

document.addEventListener("DOMContentLoaded", initPage);
