// Workshops management: card UI and localStorage-backed mock data until API integration.
const WORKSHOP_STORAGE_KEY = "aiche.workshops.v1";
const DEFAULT_WORKSHOP_IMAGE = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80";
const seedWorkshops = [
  { id: 1, name: "Leadership", description: "Build the skills to guide a team through ambiguity and change.", instructor: "Eng. Sara Adel", sessions: 2, certificateEnabled: true, image: DEFAULT_WORKSHOP_IMAGE },
  { id: 2, name: "Communication", description: "Turn a technical answer into a story a mixed room can follow.", instructor: "Eng. Omar Nabil", sessions: 1, certificateEnabled: true, image: DEFAULT_WORKSHOP_IMAGE },
  { id: 3, name: "Technical Presentation Studio", description: "Peer studio for refining technical talks.", instructor: "Eng. Nour El-Sayed", sessions: 2, certificateEnabled: true, image: DEFAULT_WORKSHOP_IMAGE }
];
let workshops = loadWorkshops();
const workshopGrid = document.getElementById("workshopsGrid");
const emptyState = document.getElementById("emptyState");
const workshopCount = document.getElementById("workshopCount");
const addWorkshopButton = document.getElementById("addWorkshopBtn");
const workshopModal = document.getElementById("workshopModal");
const workshopForm = document.getElementById("workshopForm");
const workshopModalTitle = document.getElementById("workshopModalTitle");
function loadWorkshops() {
  try { const saved = localStorage.getItem(WORKSHOP_STORAGE_KEY); if (saved !== null) return JSON.parse(saved); }
  catch (error) { console.warn("Could not load saved workshops", error); }
  return seedWorkshops.map(workshop => ({ ...workshop }));
}
function saveWorkshops() {
  try { localStorage.setItem(WORKSHOP_STORAGE_KEY, JSON.stringify(workshops)); }
  catch (error) { console.warn("Could not save workshops", error); }
}
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function renderWorkshops(list = workshops) {
  if (!workshopGrid) return;
  if (workshopCount) workshopCount.textContent = `${list.length} Workshop${list.length === 1 ? "" : "s"}`;
  if (emptyState) emptyState.hidden = list.length > 0;
  workshopGrid.innerHTML = list.map(workshop => `
    <article class="course-card workshop-card">
      <img class="course-card__image" src="${escapeHtml(workshop.image || DEFAULT_WORKSHOP_IMAGE)}" alt="${escapeHtml(workshop.name)}" loading="lazy" onerror="this.src='${DEFAULT_WORKSHOP_IMAGE}'">
      <div class="course-card__body">
        <div class="course-card__meta"><span class="level-pill">Workshop</span><span>${Number(workshop.sessions) || 0} session${Number(workshop.sessions) === 1 ? "" : "s"}</span></div>
        <h3 class="course-card__name">${escapeHtml(workshop.name)}</h3>
        <p class="course-card__description">${escapeHtml(workshop.description || "No description provided.")}</p>
        <p class="course-card__students">${escapeHtml(workshop.instructor || "Speaker to be announced")}</p>
        <div class="course-card__footer">
          <a class="course-card__view" href="workshop-management-details.html?id=${encodeURIComponent(workshop.id)}">View Details</a>
          <div class="course-card__menu">
            <button type="button" class="course-card__menu-btn" data-workshop-menu="${escapeHtml(workshop.id)}" aria-label="Actions for ${escapeHtml(workshop.name)}" aria-expanded="false">⋮</button>
            <div class="course-card__menu-dropdown" id="workshop-menu-${escapeHtml(workshop.id)}">

              ${can(currentUser, "edit_workshop") ? `<button type="button" data-workshop-edit="${escapeHtml(workshop.id)}">Edit</button>` : ""}
              ${can(currentUser, "delete_workshop") ? `<button type="button" class="danger" data-workshop-delete="${escapeHtml(workshop.id)}">Delete</button>` : ""}
            </div>
          </div>
        </div>
      </div>
    </article>`).join("");
}
function filterWorkshops() {
  const query = (document.getElementById("workshopSearch")?.value || "").trim().toLowerCase();
  renderWorkshops(workshops.filter(workshop => [workshop.name, workshop.description, workshop.instructor].some(value => String(value || "").toLowerCase().includes(query))));
}
function renderAddWorkshopButton() { if (addWorkshopButton) addWorkshopButton.hidden = !can(currentUser, "add_workshop"); }
function openWorkshopModal(workshop = null) {
  if (!can(currentUser, workshop ? "edit_workshop" : "add_workshop")) { alert(`You don't have permission to ${workshop ? "edit" : "add"} workshops.`); return; }
  if (!workshopModal || !workshopForm) return;
  workshopModalTitle.textContent = workshop ? "Edit Workshop" : "Add Workshop";
  workshopForm.dataset.workshopId = workshop ? String(workshop.id) : "";
  workshopForm.elements.workshopName.value = workshop?.name || "";
  workshopForm.elements.workshopDescription.value = workshop?.description || "";
  workshopForm.elements.workshopInstructor.value = workshop?.instructor || "";
  workshopForm.elements.workshopImage.value = workshop?.image || "";
  workshopModal.hidden = false; workshopModal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open");
  workshopForm.elements.workshopName.focus();
}
function closeWorkshopModal() {
  if (workshopModal) { workshopModal.hidden = true; workshopModal.setAttribute("aria-hidden", "true"); }
  if (workshopForm) { workshopForm.reset(); workshopForm.dataset.workshopId = ""; }
  document.body.classList.remove("modal-open");
}
function handleWorkshopSubmit(event) {
  event.preventDefault();
  const id = workshopForm.dataset.workshopId;
  const name = workshopForm.elements.workshopName.value.trim();
  const description = workshopForm.elements.workshopDescription.value.trim();
  const instructor = workshopForm.elements.workshopInstructor.value.trim();
  const image = workshopForm.elements.workshopImage.value.trim() || DEFAULT_WORKSHOP_IMAGE;
  if (!name || !description || !instructor) { alert("Please complete the workshop title, description, and instructor."); return; }
  if (id) {
    if (!can(currentUser, "edit_workshop")) { alert("You don't have permission to edit workshops."); return; }
    const workshop = workshops.find(item => String(item.id) === String(id));
    if (!workshop) { alert("Workshop not found."); return; }
    Object.assign(workshop, { name, description, instructor, image });
  } else {
    if (!can(currentUser, "add_workshop")) { alert("You don't have permission to add workshops."); return; }
    workshops.push({ id: Date.now(), name, description, instructor, image, sessions: 0, certificateEnabled: true });
  }
  saveWorkshops(); filterWorkshops(); closeWorkshopModal();
}
function editWorkshop(id) { const workshop = workshops.find(item => String(item.id) === String(id)); if (workshop) openWorkshopModal(workshop); }
function deleteWorkshop(id) {
  if (!can(currentUser, "delete_workshop")) { alert("You don't have permission to delete workshops."); return; }
  const workshop = workshops.find(item => String(item.id) === String(id));
  if (!workshop) { alert("Workshop not found."); return; }
  if (!confirm(`Delete "${workshop.name}"? This cannot be undone.`)) return;
  workshops = workshops.filter(item => String(item.id) !== String(id)); saveWorkshops(); filterWorkshops();
}
function setupWorkshopEvents() {
  document.getElementById("workshopSearch")?.addEventListener("input", filterWorkshops);
  addWorkshopButton?.addEventListener("click", () => openWorkshopModal());
  workshopForm?.addEventListener("submit", handleWorkshopSubmit);
  document.getElementById("closeWorkshopModalBtn")?.addEventListener("click", closeWorkshopModal);
  document.getElementById("cancelWorkshopBtn")?.addEventListener("click", closeWorkshopModal);
  document.addEventListener("click", event => {
    if (event.target.matches("[data-close-workshop-modal]")) { closeWorkshopModal(); return; }
    const toggle = event.target.closest("[data-workshop-menu]");
    if (toggle) {
      event.stopPropagation(); const menu = document.getElementById(`workshop-menu-${toggle.dataset.workshopMenu}`);
      document.querySelectorAll(".course-card__menu-dropdown.is-open").forEach(item => { if (item !== menu) item.classList.remove("is-open"); });
      menu?.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(menu?.classList.contains("is-open"))); return;
    }
    const edit = event.target.closest("[data-workshop-edit]"); if (edit) { editWorkshop(edit.dataset.workshopEdit); return; }
    const remove = event.target.closest("[data-workshop-delete]"); if (remove) { deleteWorkshop(remove.dataset.workshopDelete); return; }
    if (!event.target.closest(".course-card__menu")) document.querySelectorAll(".course-card__menu-dropdown.is-open").forEach(item => item.classList.remove("is-open"));
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeWorkshopModal(); });
}
function initWorkshopsPage() {
  if (!workshopGrid || !requirePermission(currentUser, "view_workshops")) return;
  renderAddWorkshopButton(); renderWorkshops(); setupWorkshopEvents();
}
document.addEventListener("DOMContentLoaded", initWorkshopsPage);
