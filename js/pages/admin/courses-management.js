// ============================================================
// COURSES MANAGEMENT — page-specific logic.
// Relies on js/global/admin-auth.js being loaded first.
// ============================================================

const mockCourses = [
  { id: 1, name: "Process Safety Foundations", students: 32, image: "https://loop-media.co/wp-content/uploads/2025/01/Complete-Guide-to-Web-Development-and-Design.jpg" },
  { id: 2, name: "Excel for Process Engineers", students: 45, image: "https://loop-media.co/wp-content/uploads/2025/01/Complete-Guide-to-Web-Development-and-Design.jpg" }
];

function renderCourses(courses) {
  const grid = document.getElementById("coursesGrid");
  grid.innerHTML = courses.length
    ? courses.map(course => `
        <div class="course-card">
          <img class="course-card__image" src="${course.image}" alt="${course.name}">
          <div class="course-card__body">
            <h3 class="course-card__name">${course.name}</h3>
            <p class="course-card__students">${course.students} students</p>
            <div class="course-card__footer">
              <a class="course-card__view" href="course-details.html?id=${course.id}">View Details</a>
              <div class="course-card__menu">
                <button class="course-card__menu-btn" data-menu-toggle="${course.id}">⋮</button>
                <div class="course-card__menu-dropdown" id="menu-${course.id}">
                  <a href="course-details.html?id=${course.id}">Information</a>
                  <button type="button" data-edit="${course.id}">Edit</button>
                  <button type="button" class="danger" data-delete="${course.id}">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join("")
    : "<p>No courses found.</p>";

  attachMenuHandlers();
}

function attachMenuHandlers() {
  document.querySelectorAll("[data-menu-toggle]").forEach(btn => {
    btn.addEventListener("click", event => {
      event.stopPropagation();
      const dropdown = document.getElementById(`menu-${btn.getAttribute("data-menu-toggle")}`);
      document.querySelectorAll(".course-card__menu-dropdown.is-open").forEach(open => {
        if (open !== dropdown) open.classList.remove("is-open");
      });
      dropdown.classList.toggle("is-open");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".course-card__menu-dropdown.is-open").forEach(open => open.classList.remove("is-open"));
  });

  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => console.log(`Edit course ${btn.getAttribute("data-edit")} — form not built yet`));
  });

  document.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => console.log(`Delete course ${btn.getAttribute("data-delete")} — confirmation + API not built yet`));
  });
}

function renderAddCourseButton(user) {
  document.getElementById("addCourseBtn").hidden = !can(user, "add_course");
}

function setupCourseSearch() {
  const input = document.getElementById("courseSearch");
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    renderCourses(mockCourses.filter(course => course.name.toLowerCase().includes(query)));
  });
}

function initPage() {
  if (!requirePermission(currentUser, "view_courses")) return;

  renderCourses(mockCourses);
  renderAddCourseButton(currentUser);
  setupCourseSearch();
}

document.addEventListener("DOMContentLoaded", initPage);
