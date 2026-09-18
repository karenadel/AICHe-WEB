// ============================================================
// WORKSHOPS MANAGEMENT
//
// Frontend-only implementation.
//
// IMPORTANT:
// Workshop data is currently MOCK DATA.
// Backend integration will replace the mock operations.
//
// Required shared file:
// ../../js/global/admin-auth.js
// ============================================================

// ============================================================
// MOCK WORKSHOPS
// ============================================================

let workshops = [
  {
    id: 1,

    name: "Leadership",

    description:
      "Build the skills to guide a team through ambiguity and change.",

    instructor: "Eng. Sara Adel",

    sessions: 2,

    certificateEnabled: true,
  },

  {
    id: 2,

    name: "Communication",

    description:
      "Turn a technical answer into a story a mixed room can follow.",

    instructor: "Eng. Omar Nabil",

    sessions: 1,

    certificateEnabled: true,
  },

  {
    id: 3,

    name: "Technical Presentation Studio",

    description: "Peer studio for refining technical talks.",

    instructor: "Eng. Nour El-Sayed",

    sessions: 2,

    certificateEnabled: true,
  },
];

// ============================================================
// DOM ELEMENTS
// ============================================================

const tableBody = document.getElementById("workshopsTableBody");

const emptyState = document.getElementById("emptyState");

const workshopCount = document.getElementById("workshopCount");

const addWorkshopButton = document.getElementById("addWorkshopBtn");

const workshopModal = document.getElementById("workshopModal");

const workshopForm = document.getElementById("workshopForm");

const workshopModalTitle = document.getElementById("workshopModalTitle");

// ============================================================
// RENDER WORKSHOPS
// ============================================================

function renderWorkshops() {
  if (!tableBody) {
    return;
  }

  // ----------------------------------------------------------
  // Empty state
  // ----------------------------------------------------------

  if (workshops.length === 0) {
    tableBody.innerHTML = "";

    if (emptyState) {
      emptyState.hidden = false;
    }

    updateWorkshopCount();

    return;
  }

  if (emptyState) {
    emptyState.hidden = true;
  }

  // ----------------------------------------------------------
  // Render rows
  // ----------------------------------------------------------

  tableBody.innerHTML = workshops
    .map((workshop) => {
      return `
            <tr
              data-workshop-id="${workshop.id}"
            >

              <td>

                <div class="workshop-name">
                  ${escapeHtml(workshop.name)}
                </div>

                <div class="workshop-name__description">
                  ${escapeHtml(workshop.description)}
                </div>

              </td>


              <td>

                <span class="session-count">
                  ${workshop.sessions}
                </span>

              </td>


              <td>

                <div class="workshop-actions">

                  <button
                    type="button"
                    class="table-action"
                    data-action="view"
                    data-workshop-id="${workshop.id}"
                  >
                    View Details
                  </button>


                  ${
                    can(currentUser, "edit_workshop")
                      ? `
                        <button
                          type="button"
                          class="table-action"
                          data-action="edit"
                          data-workshop-id="${workshop.id}"
                        >
                          Edit
                        </button>
                      `
                      : ""
                  }


                  ${
                    can(currentUser, "delete_workshop")
                      ? `
                        <button
                          type="button"
                          class="table-action table-action--delete"
                          data-action="delete"
                          data-workshop-id="${workshop.id}"
                        >
                          Delete
                        </button>
                      `
                      : ""
                  }

                </div>

              </td>

            </tr>
          `;
    })
    .join("");

  updateWorkshopCount();
}

// ============================================================
// WORKSHOP COUNT
// ============================================================

function updateWorkshopCount() {
  if (!workshopCount) {
    return;
  }

  const count = workshops.length;

  workshopCount.textContent = `${count} Workshop${count === 1 ? "" : "s"}`;
}

// ============================================================
// ADD WORKSHOP BUTTON
// ============================================================

function renderAddWorkshopButton() {
  if (!addWorkshopButton) {
    return;
  }

  addWorkshopButton.hidden = !can(currentUser, "add_workshop");
}

// ============================================================
// OPEN WORKSHOP MODAL
// ============================================================

function openWorkshopModal(workshop = null) {
  if (!workshopModal) {
    return;
  }

  if (workshop) {
    // --------------------------------------------------------
    // Edit mode
    // --------------------------------------------------------

    workshopModalTitle.textContent = "Edit Workshop";

    workshopForm.dataset.workshopId = String(workshop.id);

    setFormValue("workshopName", workshop.name);

    setFormValue("workshopDescription", workshop.description);

    setFormValue("workshopInstructor", workshop.instructor);
  } else {
    // --------------------------------------------------------
    // Add mode
    // --------------------------------------------------------

    workshopModalTitle.textContent = "Add Workshop";

    workshopForm.dataset.workshopId = "";

    workshopForm.reset();
  }

  workshopModal.hidden = false;

  workshopModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  const firstInput = document.getElementById("workshopName");

  if (firstInput) {
    firstInput.focus();
  }
}

// ============================================================
// CLOSE WORKSHOP MODAL
// ============================================================

function closeWorkshopModal() {
  if (!workshopModal) {
    return;
  }

  workshopModal.hidden = true;

  workshopModal.setAttribute("aria-hidden", "true");

  if (workshopForm) {
    workshopForm.reset();

    workshopForm.dataset.workshopId = "";
  }

  document.body.classList.remove("modal-open");
}

// ============================================================
// FORM HELPERS
// ============================================================

function setFormValue(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value;
  }
}

function getFormValue(id) {
  const element = document.getElementById(id);

  return element ? element.value.trim() : "";
}

// ============================================================
// WORKSHOP FORM SUBMIT
// ============================================================

function handleWorkshopSubmit(event) {
  event.preventDefault();

  if (!workshopForm) {
    return;
  }

  const workshopId = workshopForm.dataset.workshopId;

  const name = getFormValue("workshopName");

  const description = getFormValue("workshopDescription");

  const instructor = getFormValue("workshopInstructor");

  // ----------------------------------------------------------
  // Validation
  // ----------------------------------------------------------

  if (!name) {
    alert("Please enter the workshop title.");

    return;
  }

  if (!description) {
    alert("Please enter the workshop description.");

    return;
  }

  if (!instructor) {
    alert("Please enter the instructor or speaker.");

    return;
  }

  // ----------------------------------------------------------
  // EDIT
  // ----------------------------------------------------------

  if (workshopId) {
    if (!can(currentUser, "edit_workshop")) {
      alert("You don't have permission to edit workshops.");

      return;
    }

    const workshop = workshops.find(
      (item) => String(item.id) === String(workshopId),
    );

    if (!workshop) {
      alert("Workshop not found.");

      return;
    }

    workshop.name = name;

    workshop.description = description;

    workshop.instructor = instructor;

    alert("Workshop updated successfully.");
  }

  // ----------------------------------------------------------
  // ADD
  // ----------------------------------------------------------
  else {
    if (!can(currentUser, "add_workshop")) {
      alert("You don't have permission to add workshops.");

      return;
    }

    const newWorkshop = {
      id: Date.now(),

      name: name,

      description: description,

      instructor: instructor,

      sessions: 0,

      certificateEnabled: true,
    };

    workshops.push(newWorkshop);

    alert("Workshop added successfully.");
  }

  renderWorkshops();

  closeWorkshopModal();
}

// ============================================================
// EDIT WORKSHOP
// ============================================================

function editWorkshop(workshopId) {
  if (!can(currentUser, "edit_workshop")) {
    alert("You don't have permission to edit workshops.");

    return;
  }

  const workshop = workshops.find(
    (item) => String(item.id) === String(workshopId),
  );

  if (!workshop) {
    alert("Workshop not found.");

    return;
  }

  openWorkshopModal(workshop);
}

// ============================================================
// DELETE WORKSHOP
// ============================================================

function deleteWorkshop(workshopId) {
  if (!can(currentUser, "delete_workshop")) {
    alert("You don't have permission to delete workshops.");

    return;
  }

  const workshop = workshops.find(
    (item) => String(item.id) === String(workshopId),
  );

  if (!workshop) {
    alert("Workshop not found.");

    return;
  }

  const confirmed = confirm(
    `Are you sure you want to delete "${workshop.name}"?`,
  );

  if (!confirmed) {
    return;
  }

  /*
    BACKEND TODO:

    DELETE /api/workshops/{workshopId}

    After successful backend response:
    remove the workshop from the UI.
  */

  workshops = workshops.filter(
    (item) => String(item.id) !== String(workshopId),
  );

  renderWorkshops();

  alert("Workshop deleted successfully (mock).");
}

// ============================================================
// VIEW WORKSHOP DETAILS
// ============================================================

function viewWorkshop(workshopId) {
  const workshop = workshops.find(
    (item) => String(item.id) === String(workshopId),
  );

  if (!workshop) {
    alert("Workshop not found.");

    return;
  }

  window.location.href = `workshop-management-details.html?id=${workshop.id}`;
}

// ============================================================
// TABLE ACTIONS
// ============================================================

function handleTableActions(event) {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.action;

  const workshopId = button.dataset.workshopId;

  if (!workshopId) {
    return;
  }

  switch (action) {
    case "view":
      viewWorkshop(workshopId);

      break;

    case "edit":
      editWorkshop(workshopId);

      break;

    case "delete":
      deleteWorkshop(workshopId);

      break;
  }
}

// ============================================================
// MODAL EVENTS
// ============================================================

function setupModalEvents() {
  // ----------------------------------------------------------
  // Form
  // ----------------------------------------------------------

  if (workshopForm) {
    workshopForm.addEventListener("submit", handleWorkshopSubmit);
  }

  // ----------------------------------------------------------
  // Close button
  // ----------------------------------------------------------

  const closeButton = document.getElementById("closeWorkshopModalBtn");

  if (closeButton) {
    closeButton.addEventListener("click", closeWorkshopModal);
  }

  // ----------------------------------------------------------
  // Cancel button
  // ----------------------------------------------------------

  const cancelButton = document.getElementById("cancelWorkshopBtn");

  if (cancelButton) {
    cancelButton.addEventListener("click", closeWorkshopModal);
  }

  // ----------------------------------------------------------
  // Overlay
  // ----------------------------------------------------------

  document.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-workshop-modal]")) {
      closeWorkshopModal();
    }
  });

  // ----------------------------------------------------------
  // Escape key
  // ----------------------------------------------------------

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeWorkshopModal();
    }
  });
}

// ============================================================
// BUTTON EVENTS
// ============================================================

function setupButtonEvents() {
  // ----------------------------------------------------------
  // Add Workshop
  // ----------------------------------------------------------

  if (addWorkshopButton) {
    addWorkshopButton.addEventListener("click", () => {
      if (!can(currentUser, "add_workshop")) {
        alert("You don't have permission to add workshops.");

        return;
      }

      openWorkshopModal();
    });
  }

  // ----------------------------------------------------------
  // Table actions
  // ----------------------------------------------------------

  if (tableBody) {
    tableBody.addEventListener("click", handleTableActions);
  }
}

// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ============================================================
// INIT
// ============================================================

function initPage() {
  // ----------------------------------------------------------
  // Page access
  // ----------------------------------------------------------

  if (!requirePermission(currentUser, "view_workshops")) {
    return;
  }

  // ----------------------------------------------------------
  // Permission-controlled UI
  // ----------------------------------------------------------

  renderAddWorkshopButton();

  // ----------------------------------------------------------
  // Render data
  // ----------------------------------------------------------

  renderWorkshops();

  // ----------------------------------------------------------
  // Events
  // ----------------------------------------------------------

  setupModalEvents();

  setupButtonEvents();
}

// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", initPage);
