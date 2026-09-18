// ============================================================

// WORKSHOP MANAGEMENT DETAILS

//

// Frontend-only implementation.

//

// IMPORTANT:

// The data below is MOCK DATA.

// Backend/API integration will replace the mock operations.

//

// Required shared file:

// ../../js/global/admin-auth.js

// ============================================================

// ============================================================

// MOCK DATA

// ============================================================

const mockWorkshopsById = {
  1: {
    id: 1,

    name: "Leadership",

    description:
      "Build the skills to guide a team through ambiguity and change.",

    instructor: "Eng. Sara Adel",

    sessions: [
      {
        id: 101,

        title: "Foundations of Leadership",

        description: "Core leadership styles and when to use them.",

        date: "2026-09-22",

        time: "18:00",

        mode: "In-person",

        location: "AICHE Cairo HQ",

        materials: "",
      },

      {
        id: 102,

        title: "Leading Under Pressure",

        description: "Decision-making in high-stakes moments.",

        date: "2026-09-29",

        time: "18:00",

        mode: "Online",

        location: "Zoom",

        materials: "",
      },
    ],

    certificateEnabled: true,
  },

  2: {
    id: 2,

    name: "Communication",

    description:
      "Turn a technical answer into a story a mixed room can follow.",

    instructor: "Eng. Omar Nabil",

    sessions: [
      {
        id: 201,

        title: "Technical Presentation Studio",

        description: "Structuring a talk for a non-technical audience.",

        date: "2026-10-05",

        time: "17:00",

        mode: "In-person",

        location: "AICHE Cairo HQ",

        materials: "",
      },
    ],

    certificateEnabled: true,
  },

  3: {
    id: 3,

    name: "Technical Presentation Studio",

    description: "Peer studio for refining technical talks.",

    instructor: "Eng. Nour El-Sayed",

    sessions: [
      {
        id: 301,

        title: "Session 1: Draft & Feedback",

        description: "Bring a draft, get peer feedback.",

        date: "2026-10-12",

        time: "17:00",

        mode: "In-person",

        location: "AICHE Cairo HQ",

        materials: "",
      },

      {
        id: 302,

        title: "Session 2: Final Run-through",

        description: "Full run-through before showcase.",

        date: "2026-10-19",

        time: "17:00",

        mode: "Online",

        location: "Zoom",

        materials: "",
      },
    ],

    certificateEnabled: true,
  },
};

// ============================================================

// URL / WORKSHOP HELPERS

// ============================================================

function getWorkshopIdFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return Number(params.get("id"));
}

function getCurrentWorkshop() {
  const workshopId = getWorkshopIdFromUrl();

  return mockWorkshopsById[workshopId];
}

// ============================================================

// FORMATTERS

// ============================================================

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    "en-GB",

    {
      day: "2-digit",

      month: "short",

      year: "numeric",
    },
  ).format(date);
}

function formatTime(timeString) {
  if (!timeString) {
    return "—";
  }

  const parts = timeString.split(":");

  if (parts.length < 2) {
    return timeString;
  }

  const hours = Number(parts[0]);

  const minutes = parts[1];

  if (Number.isNaN(hours)) {
    return timeString;
  }

  const suffix = hours >= 12 ? "PM" : "AM";

  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes} ${suffix}`;
}

// ============================================================

// WORKSHOP INFO

// ============================================================

function renderWorkshopInfo(workshop) {
  const title = document.getElementById("workshopTitle");

  const description = document.getElementById("workshopDescription");

  const instructor = document.getElementById("workshopInstructor");

  const sessionCount = document.getElementById("workshopSessionCount");

  if (title) {
    title.textContent = workshop.name;
  }

  if (description) {
    description.textContent = workshop.description;
  }

  if (instructor) {
    instructor.textContent = workshop.instructor;
  }

  if (sessionCount) {
    sessionCount.textContent = workshop.sessions.length;
  }
}

// ============================================================

// SESSIONS

// ============================================================

function renderSessions(sessions) {
  const list = document.getElementById("sessionsList");

  if (!list) {
    return;
  }

  if (!sessions || sessions.length === 0) {
    list.innerHTML = `

      <li class="session-item session-item--empty">

        <p>No sessions added yet.</p>

      </li>

    `;

    updateSessionCount(0);

    return;
  }

  list.innerHTML = sessions

    .map((session, index) => {
      return `

            <li

              class="session-item"

              data-session-id="${session.id}"

            >



              <div class="session-item__content">



                <p class="session-item__title">

                  ${escapeHtml(session.title)}

                </p>



                <p class="session-item__description">

                  ${escapeHtml(session.description)}

                </p>



                <p class="session-item__meta">



                  <span>

                    ${formatDate(session.date)}

                  </span>



                  <span>

                    ${formatTime(session.time)}

                  </span>



                  <span class="session-item__mode">

                    ${escapeHtml(session.mode)}

                  </span>



                  <span>

                    ${escapeHtml(session.location)}

                  </span>



                </p>



                ${
                  session.materials
                    ? `

                      <p class="session-item__materials">



                        Materials:



                        <a

                          href="${escapeHtml(session.materials)}"

                          target="_blank"

                          rel="noopener noreferrer"

                        >

                          View Materials

                        </a>



                      </p>

                    `
                    : ""
                }



              </div>





              <div class="session-item__actions">



                ${
                  can(
                    currentUser,

                    "edit_workshop_session",
                  )
                    ? `

                      <button

                        type="button"

                        class="session-action-btn"

                        data-action="edit-session"

                        data-session-id="${session.id}"

                      >

                        Edit

                      </button>

                    `
                    : ""
                }





                ${
                  can(
                    currentUser,

                    "delete_workshop_session",
                  )
                    ? `

                      <button

                        type="button"

                        class="session-action-btn session-action-btn--delete"

                        data-action="delete-session"

                        data-session-id="${session.id}"

                      >

                        Delete

                      </button>

                    `
                    : ""
                }



              </div>



            </li>

          `;
    })

    .join("");

  updateSessionCount(sessions.length);
}

function updateSessionCount(count) {
  const element = document.getElementById("workshopSessionCount");

  if (element) {
    element.textContent = count;
  }
}

// ============================================================

// PERMISSIONS / BUTTONS

// ============================================================

function renderWorkshopActions(user) {
  const editButton = document.getElementById("editWorkshopBtn");

  const deleteButton = document.getElementById("deleteWorkshopBtn");

  if (editButton) {
    editButton.hidden = !can(
      user,

      "edit_workshop",
    );
  }

  if (deleteButton) {
    deleteButton.hidden = !can(
      user,

      "delete_workshop",
    );
  }
}

function renderAddSessionButton(user) {
  const button = document.getElementById("addSessionBtn");

  if (!button) {
    return;
  }

  button.hidden = !can(
    user,

    "add_workshop_session",
  );
}

// ============================================================

// CERTIFICATE

// ============================================================

function renderCertificateSection(workshop) {
  const section = document.getElementById("certificateSection");

  const status = document.getElementById("certificateStatus");

  if (!section) {
    return;
  }

  if (workshop.certificateEnabled) {
    section.hidden = false;

    if (status) {
      status.textContent = "Enabled";
    }
  } else {
    section.hidden = false;

    if (status) {
      status.textContent = "Disabled";
    }
  }
}

// ============================================================

// SESSION MODAL

// ============================================================

function openSessionModal(session = null) {
  const modal = document.getElementById("sessionModal");

  const modalTitle = document.getElementById("sessionModalTitle");

  const form = document.getElementById("sessionForm");

  if (!modal || !form) {
    return;
  }

  if (session) {
    modalTitle.textContent = "Edit Session";

    form.dataset.sessionId = String(session.id);
  } else {
    modalTitle.textContent = "Add Session";

    form.dataset.sessionId = "";
  }

  setFormValue(
    "sessionTitle",

    session?.title || "",
  );

  setFormValue(
    "sessionDescription",

    session?.description || "",
  );

  setFormValue(
    "sessionDate",

    session?.date || "",
  );

  setFormValue(
    "sessionTime",

    session?.time || "",
  );

  setFormValue(
    "sessionMode",

    session?.mode || "In-person",
  );

  setFormValue(
    "sessionLocation",

    session?.location || "",
  );

  setFormValue(
    "sessionMaterials",

    session?.materials || "",
  );

  modal.hidden = false;

  modal.setAttribute(
    "aria-hidden",

    "false",
  );

  document.body.classList.add("modal-open");

  const firstInput = document.getElementById("sessionTitle");

  if (firstInput) {
    firstInput.focus();
  }
}

function closeSessionModal() {
  const modal = document.getElementById("sessionModal");

  const form = document.getElementById("sessionForm");

  if (!modal) {
    return;
  }

  modal.hidden = true;

  modal.setAttribute(
    "aria-hidden",

    "true",
  );

  if (form) {
    form.reset();

    form.dataset.sessionId = "";
  }

  document.body.classList.remove("modal-open");
}

// ============================================================

// WORKSHOP MODAL

// ============================================================

function openWorkshopModal(workshop) {
  const modal = document.getElementById("workshopModal");

  if (!modal) {
    return;
  }

  setFormValue(
    "workshopName",

    workshop.name,
  );

  setFormValue(
    "workshopFormDescription",

    workshop.description,
  );

  setFormValue(
    "workshopFormInstructor",

    workshop.instructor,
  );

  modal.hidden = false;

  modal.setAttribute(
    "aria-hidden",

    "false",
  );

  document.body.classList.add("modal-open");

  const firstInput = document.getElementById("workshopName");

  if (firstInput) {
    firstInput.focus();
  }
}

function closeWorkshopModal() {
  const modal = document.getElementById("workshopModal");

  const form = document.getElementById("workshopForm");

  if (!modal) {
    return;
  }

  modal.hidden = true;

  modal.setAttribute(
    "aria-hidden",

    "true",
  );

  if (form) {
    form.reset();
  }

  document.body.classList.remove("modal-open");
}

// ============================================================

// FORM HELPERS

// ============================================================

function setFormValue(
  id,

  value,
) {
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

// SESSION FORM

// ============================================================

function handleSessionSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const workshop = getCurrentWorkshop();

  if (!workshop) {
    return;
  }

  const sessionId = form.dataset.sessionId;

  const sessionData = {
    title: getFormValue("sessionTitle"),

    description: getFormValue("sessionDescription"),

    date: getFormValue("sessionDate"),

    time: getFormValue("sessionTime"),

    mode: getFormValue("sessionMode"),

    location: getFormValue("sessionLocation"),

    materials: getFormValue("sessionMaterials"),
  };

  // ----------------------------------------------------------

  // Validation

  // ----------------------------------------------------------

  if (!sessionData.title) {
    alert("Please enter the session title.");

    return;
  }

  if (!sessionData.description) {
    alert("Please enter the session description.");

    return;
  }

  if (!sessionData.date) {
    alert("Please select the session date.");

    return;
  }

  if (!sessionData.time) {
    alert("Please select the session time.");

    return;
  }

  if (!sessionData.mode) {
    alert("Please select the session mode.");

    return;
  }

  if (!sessionData.location) {
    alert("Please enter the location or online link.");

    return;
  }

  // ----------------------------------------------------------

  // EDIT

  // ----------------------------------------------------------

  if (sessionId) {
    if (
      !can(
        currentUser,

        "edit_workshop_session",
      )
    ) {
      alert("You don't have permission to edit sessions.");

      return;
    }

    const session = workshop.sessions.find(
      (item) => String(item.id) === String(sessionId),
    );

    if (!session) {
      alert("Session not found.");

      return;
    }

    Object.assign(
      session,

      sessionData,
    );

    alert("Session updated successfully.");
  }

  // ----------------------------------------------------------

  // ADD

  // ----------------------------------------------------------
  else {
    if (
      !can(
        currentUser,

        "add_workshop_session",
      )
    ) {
      alert("You don't have permission to add sessions.");

      return;
    }

    const newSession = {
      id: Date.now(),

      ...sessionData,
    };

    workshop.sessions.push(newSession);

    alert("Session added successfully.");
  }

  renderSessions(workshop.sessions);

  closeSessionModal();
}

// ============================================================

// EDIT SESSION

// ============================================================

function editSession(sessionId) {
  const workshop = getCurrentWorkshop();

  if (!workshop) {
    return;
  }

  if (
    !can(
      currentUser,

      "edit_workshop_session",
    )
  ) {
    alert("You don't have permission to edit sessions.");

    return;
  }

  const session = workshop.sessions.find(
    (item) => String(item.id) === String(sessionId),
  );

  if (!session) {
    alert("Session not found.");

    return;
  }

  openSessionModal(session);
}

// ============================================================

// DELETE SESSION

// ============================================================

function deleteSession(sessionId) {
  const workshop = getCurrentWorkshop();

  if (!workshop) {
    return;
  }

  if (
    !can(
      currentUser,

      "delete_workshop_session",
    )
  ) {
    alert("You don't have permission to delete sessions.");

    return;
  }

  const session = workshop.sessions.find(
    (item) => String(item.id) === String(sessionId),
  );

  if (!session) {
    alert("Session not found.");

    return;
  }

  const confirmed = confirm(
    `Are you sure you want to delete "${session.title}"?`,
  );

  if (!confirmed) {
    return;
  }

  workshop.sessions = workshop.sessions.filter(
    (item) => String(item.id) !== String(sessionId),
  );

  renderSessions(workshop.sessions);

  alert("Session deleted successfully.");
}

// ============================================================

// EDIT WORKSHOP

// ============================================================

function editWorkshop() {
  const workshop = getCurrentWorkshop();

  if (!workshop) {
    return;
  }

  if (
    !can(
      currentUser,

      "edit_workshop",
    )
  ) {
    alert("You don't have permission to edit this workshop.");

    return;
  }

  openWorkshopModal(workshop);
}

// ============================================================

// WORKSHOP FORM

// ============================================================

function handleWorkshopSubmit(event) {
  event.preventDefault();

  const workshop = getCurrentWorkshop();

  if (!workshop) {
    return;
  }

  if (
    !can(
      currentUser,

      "edit_workshop",
    )
  ) {
    alert("You don't have permission to edit this workshop.");

    return;
  }

  const name = getFormValue("workshopName");

  const description = getFormValue("workshopFormDescription");

  const instructor = getFormValue("workshopFormInstructor");

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

  workshop.name = name;

  workshop.description = description;

  workshop.instructor = instructor;

  renderWorkshopInfo(workshop);

  closeWorkshopModal();

  alert("Workshop updated successfully.");
}

// ============================================================

// DELETE WORKSHOP

// ============================================================

function deleteWorkshop() {
  const workshop = getCurrentWorkshop();

  if (!workshop) {
    return;
  }

  if (
    !can(
      currentUser,

      "delete_workshop",
    )
  ) {
    alert("You don't have permission to delete this workshop.");

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



    DELETE /api/workshops/{id}



    After successful backend response:

    window.location.href =

      "workshops-management.html";

  */

  alert("Workshop deleted successfully (mock).");

  window.location.href = "workshops-management.html";
}

// ============================================================

// SESSION ACTIONS

// ============================================================

function handleSessionActions(event) {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.action;

  const sessionId = button.dataset.sessionId;

  if (!sessionId) {
    return;
  }

  if (action === "edit-session") {
    editSession(sessionId);
  }

  if (action === "delete-session") {
    deleteSession(sessionId);
  }
}

// ============================================================

// MODAL EVENTS

// ============================================================

function setupModalEvents() {
  // ----------------------------------------------------------

  // Session Form

  // ----------------------------------------------------------

  const sessionForm = document.getElementById("sessionForm");

  if (sessionForm) {
    sessionForm.addEventListener(
      "submit",

      handleSessionSubmit,
    );
  }

  // ----------------------------------------------------------

  // Workshop Form

  // ----------------------------------------------------------

  const workshopForm = document.getElementById("workshopForm");

  if (workshopForm) {
    workshopForm.addEventListener(
      "submit",

      handleWorkshopSubmit,
    );
  }

  // ----------------------------------------------------------

  // Close Session Modal

  // ----------------------------------------------------------

  const closeSessionButton = document.getElementById("closeSessionModalBtn");

  if (closeSessionButton) {
    closeSessionButton.addEventListener(
      "click",

      closeSessionModal,
    );
  }

  const cancelSessionButton = document.getElementById("cancelSessionBtn");

  if (cancelSessionButton) {
    cancelSessionButton.addEventListener(
      "click",

      closeSessionModal,
    );
  }

  // ----------------------------------------------------------

  // Close Workshop Modal

  // ----------------------------------------------------------

  const closeWorkshopButton = document.getElementById("closeWorkshopModalBtn");

  if (closeWorkshopButton) {
    closeWorkshopButton.addEventListener(
      "click",

      closeWorkshopModal,
    );
  }

  const cancelWorkshopButton = document.getElementById("cancelWorkshopBtn");

  if (cancelWorkshopButton) {
    cancelWorkshopButton.addEventListener(
      "click",

      closeWorkshopModal,
    );
  }

  // ----------------------------------------------------------

  // Overlay close

  // ----------------------------------------------------------

  document.addEventListener(
    "click",

    (event) => {
      if (event.target.matches("[data-close-session-modal]")) {
        closeSessionModal();
      }

      if (event.target.matches("[data-close-workshop-modal]")) {
        closeWorkshopModal();
      }
    },
  );

  // ----------------------------------------------------------

  // Escape key

  // ----------------------------------------------------------

  document.addEventListener(
    "keydown",

    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      closeSessionModal();

      closeWorkshopModal();
    },
  );
}

// ============================================================

// BUTTON EVENTS

// ============================================================

function setupButtonEvents() {
  // ----------------------------------------------------------

  // Add Session

  // ----------------------------------------------------------

  const addSessionButton = document.getElementById("addSessionBtn");

  if (addSessionButton) {
    addSessionButton.addEventListener(
      "click",

      () => {
        if (
          !can(
            currentUser,

            "add_workshop_session",
          )
        ) {
          alert("You don't have permission to add sessions.");

          return;
        }

        openSessionModal();
      },
    );
  }

  // ----------------------------------------------------------

  // Edit Workshop

  // ----------------------------------------------------------

  const editWorkshopButton = document.getElementById("editWorkshopBtn");

  if (editWorkshopButton) {
    editWorkshopButton.addEventListener(
      "click",

      editWorkshop,
    );
  }

  // ----------------------------------------------------------

  // Delete Workshop

  // ----------------------------------------------------------

  const deleteWorkshopButton = document.getElementById("deleteWorkshopBtn");

  if (deleteWorkshopButton) {
    deleteWorkshopButton.addEventListener(
      "click",

      deleteWorkshop,
    );
  }

  // ----------------------------------------------------------

  // Session actions

  // ----------------------------------------------------------

  const sessionsList = document.getElementById("sessionsList");

  if (sessionsList) {
    sessionsList.addEventListener(
      "click",

      handleSessionActions,
    );
  }
}

// ============================================================

// HTML ESCAPE

// Prevents mock/user content from being inserted as HTML.

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

  // Page Access

  // ----------------------------------------------------------

  if (
    !requirePermission(
      currentUser,

      "view_workshops",
    )
  ) {
    return;
  }

  // ----------------------------------------------------------

  // Get Workshop

  // ----------------------------------------------------------

  const workshop = getCurrentWorkshop();

  if (!workshop) {
    const title = document.getElementById("workshopTitle");

    const description = document.getElementById("workshopDescription");

    if (title) {
      title.textContent = "Workshop not found";
    }

    if (description) {
      description.textContent = "The requested workshop could not be found.";
    }

    return;
  }

  // ----------------------------------------------------------

  // Sidebar

  // ----------------------------------------------------------

  // ----------------------------------------------------------

  // Content

  // ----------------------------------------------------------

  renderWorkshopInfo(workshop);

  renderSessions(workshop.sessions);

  renderWorkshopActions(currentUser);

  renderAddSessionButton(currentUser);

  renderCertificateSection(workshop);

  // ----------------------------------------------------------

  // Events

  // ----------------------------------------------------------

  setupModalEvents();

  setupButtonEvents();
}

// ============================================================

// DOM READY

// ============================================================

document.addEventListener(
  "DOMContentLoaded",

  initPage,
);
