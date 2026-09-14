// ============================================================
// COURSES MANAGEMENT — page-specific logic.
// Relies on js/global/admin-auth.js being loaded first
// (currentUser, can, canAny, requirePermission, renderManagementNav).
// ============================================================

// ---- MOCK COURSES DATA — replace with GET /courses later ----
const mockCourses = [
  { id: 1, name: "Process Safety Foundations", students: 32 },
  { id: 2, name: "Excel for Process Engineers", students: 45 }
];

function renderCourses(courses) {
  const tbody = document.getElementById('coursesTableBody');
  tbody.innerHTML = courses.length
    ? courses.map(course => `
        <tr>
          <td>${course.name}</td>
          <td>${course.students}</td>
          <td><a href="course-details.html?id=${course.id}">View</a></td>
        </tr>
      `).join('')
    : `<tr><td colspan="3">No courses found.</td></tr>`;
}

function renderAddCourseButton(user) {
  const btn = document.getElementById('addCourseBtn');
  btn.hidden = !can(user, 'add_course');
}

function setupCourseSearch() {
  const input = document.getElementById('courseSearch');
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const filtered = mockCourses.filter(course =>
      course.name.toLowerCase().includes(query)
    );
    renderCourses(filtered);
  });
}

// ---- Init ----
function initPage() {
  if (!requirePermission(currentUser, 'view_courses')) return;

  renderManagementNav(currentUser);
  renderCourses(mockCourses);
  renderAddCourseButton(currentUser);
  setupCourseSearch();
}

document.addEventListener('DOMContentLoaded', initPage);