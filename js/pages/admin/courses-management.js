// Courses management: mock data persisted in localStorage until API integration.
const COURSE_STORAGE_KEY = "aiche.courses.v1";
const DEFAULT_COURSE_IMAGE = "https://loop-media.co/wp-content/uploads/2025/01/Complete-Guide-to-Web-Development-and-Design.jpg";
const seedCourses = [
  { id: 1, name: "Process Safety Foundations", description: "Build a strong foundation in process safety and risk awareness.", instructor: "AICHE Technical Team", level: "Beginner", duration: "6 weeks", students: 32, image: DEFAULT_COURSE_IMAGE },
  { id: 2, name: "Excel for Process Engineers", description: "Use spreadsheets to analyze engineering data and solve practical problems.", instructor: "AICHE Technical Team", level: "Beginner", duration: "4 weeks", students: 45, image: DEFAULT_COURSE_IMAGE }
];
let courses = loadCourses();
let activeCourseId = null;

function loadCourses() {
  try {
    const saved = localStorage.getItem(COURSE_STORAGE_KEY);
    if (saved !== null) return JSON.parse(saved);
  } catch (error) { console.warn("Could not load saved courses", error); }
  return seedCourses.map(course => ({ ...course }));
}
function saveCourses() {
  try { localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses)); }
  catch (error) { console.warn("Could not save courses", error); }
}
function escapeCourseHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function renderCourses(list = courses) {
  const grid = document.getElementById("coursesGrid");
  if (!grid) return;
  grid.innerHTML = list.length ? list.map(course => `
    <article class="course-card">
      <img class="course-card__image" src="${escapeCourseHtml(course.image || DEFAULT_COURSE_IMAGE)}" alt="${escapeCourseHtml(course.name)}" loading="lazy" onerror="this.src='${DEFAULT_COURSE_IMAGE}'">
      <div class="course-card__body">
        <div class="course-card__meta"><span class="level-pill">${escapeCourseHtml(course.level || "All levels")}</span><span>${escapeCourseHtml(course.duration || "Self-paced")}</span></div>
        <h3 class="course-card__name">${escapeCourseHtml(course.name)}</h3>
        <p class="course-card__description">${escapeCourseHtml(course.description || "No description provided.")}</p>
        <p class="course-card__students">${Number(course.students) || 0} students${course.instructor ? ` · ${escapeCourseHtml(course.instructor)}` : ""}</p>
        <div class="course-card__footer">
          <a class="course-card__view" href="course-details.html?id=${encodeURIComponent(course.id)}">View Details</a>
          <div class="course-card__menu">
            <button type="button" class="course-card__menu-btn" data-course-menu="${escapeCourseHtml(course.id)}" aria-label="Actions for ${escapeCourseHtml(course.name)}" aria-expanded="false">⋮</button>
            <div class="course-card__menu-dropdown" id="course-menu-${escapeCourseHtml(course.id)}">
              ${can(currentUser, "edit_course") ? `<button type="button" data-course-edit="${escapeCourseHtml(course.id)}">Edit</button>` : ""}
              ${can(currentUser, "delete_course") ? `<button type="button" class="danger" data-course-delete="${escapeCourseHtml(course.id)}">Delete</button>` : ""}
            </div>
          </div>
        </div>
      </div>
    </article>`).join("") : `<p class="grid-empty">${courses.length ? "No courses match your search." : "No courses yet. Add your first course."}</p>`;
}
function filterCourses() {
  const query = (document.getElementById("courseSearch")?.value || "").trim().toLowerCase();
  renderCourses(courses.filter(course => [course.name, course.description, course.instructor, course.level].some(value => String(value || "").toLowerCase().includes(query))));
}
function openCourseModal(course = null) {
  if (!can(currentUser, course ? "edit_course" : "add_course")) { alert(`You don't have permission to ${course ? "edit" : "add"} courses.`); return; }
  const modal = document.getElementById("courseModal"), form = document.getElementById("courseForm");
  if (!modal || !form) return;
  activeCourseId = course ? course.id : null;
  document.getElementById("courseModalTitle").textContent = course ? "Edit Course" : "Add Course";
  form.elements.courseName.value = course?.name || "";
  form.elements.courseDescription.value = course?.description || "";
  form.elements.courseInstructor.value = course?.instructor || "";
  form.elements.courseLevel.value = course?.level || "Beginner";
  form.elements.courseDuration.value = course?.duration || "";
  form.elements.courseImage.value = course?.image || "";
  modal.hidden = false; modal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open");
  form.elements.courseName.focus();
}
function closeCourseModal() {
  const modal = document.getElementById("courseModal"), form = document.getElementById("courseForm");
  if (modal) { modal.hidden = true; modal.setAttribute("aria-hidden", "true"); }
  if (form) form.reset(); activeCourseId = null; document.body.classList.remove("modal-open");
}
function handleCourseSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.courseName.value.trim(), description = form.elements.courseDescription.value.trim(), instructor = form.elements.courseInstructor.value.trim();
  if (!name || !description || !instructor) { alert("Please complete the course title, description, and instructor."); return; }
  if (activeCourseId !== null) {
    if (!can(currentUser, "edit_course")) { alert("You don't have permission to edit courses."); return; }
    const course = courses.find(item => String(item.id) === String(activeCourseId));
    if (!course) { alert("Course not found."); return; }
    Object.assign(course, { name, description, instructor, level: form.elements.courseLevel.value, duration: form.elements.courseDuration.value.trim(), image: form.elements.courseImage.value.trim() || DEFAULT_COURSE_IMAGE });
  } else {
    if (!can(currentUser, "add_course")) { alert("You don't have permission to add courses."); return; }
    courses.push({ id: Date.now(), name, description, instructor, level: form.elements.courseLevel.value, duration: form.elements.courseDuration.value.trim(), image: form.elements.courseImage.value.trim() || DEFAULT_COURSE_IMAGE, students: 0 });
  }
  saveCourses(); filterCourses(); closeCourseModal();
}
function deleteCourse(id) {
  if (!can(currentUser, "delete_course")) { alert("You don't have permission to delete courses."); return; }
  const course = courses.find(item => String(item.id) === String(id));
  if (!course) { alert("Course not found."); return; }
  if (!confirm(`Delete "${course.name}"? This cannot be undone.`)) return;
  courses = courses.filter(item => String(item.id) !== String(id)); saveCourses(); filterCourses();
}
function renderAddCourseButton() {
  const button = document.getElementById("addCourseBtn");
  if (button) button.hidden = !can(currentUser, "add_course");
}
function setupCourseEvents() {
  document.getElementById("courseSearch")?.addEventListener("input", filterCourses);
  document.getElementById("addCourseBtn")?.addEventListener("click", () => openCourseModal());
  document.getElementById("courseForm")?.addEventListener("submit", handleCourseSubmit);
  document.getElementById("closeCourseModalBtn")?.addEventListener("click", closeCourseModal);
  document.getElementById("cancelCourseBtn")?.addEventListener("click", closeCourseModal);
  document.addEventListener("click", event => {
    if (event.target.matches("[data-close-course-modal]")) closeCourseModal();
    const toggle = event.target.closest("[data-course-menu]");
    if (toggle) {
      event.stopPropagation();
      const menu = document.getElementById(`course-menu-${toggle.dataset.courseMenu}`);
      document.querySelectorAll(".course-card__menu-dropdown.is-open").forEach(item => { if (item !== menu) item.classList.remove("is-open"); });
      menu?.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(menu?.classList.contains("is-open")));
      return;
    }
    const edit = event.target.closest("[data-course-edit]");
    if (edit) { openCourseModal(courses.find(item => String(item.id) === String(edit.dataset.courseEdit))); return; }
    const remove = event.target.closest("[data-course-delete]");
    if (remove) { deleteCourse(remove.dataset.courseDelete); return; }
    if (!event.target.closest(".course-card__menu")) document.querySelectorAll(".course-card__menu-dropdown.is-open").forEach(item => item.classList.remove("is-open"));
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeCourseModal(); });
}
function initCoursesPage() {
  if (!document.getElementById("coursesGrid")) return;
  if (!requirePermission(currentUser, "view_courses")) return;
  renderAddCourseButton(); renderCourses(); setupCourseEvents();
}
document.addEventListener("DOMContentLoaded", initCoursesPage);
