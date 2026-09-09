/* =========================================================
   GREENCARE HOSPITAL MANAGEMENT SYSTEM
   Frontend-only hospital management system

   Technology:
   HTML
   CSS
   JavaScript
   localStorage
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "greencare_hospital_system";


/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultData = {

    patients: [

        {
            id: "P-001",
            name: "Amina Yusuf",
            gender: "Female",
            dob: "1998-04-15",
            phone: "08031112233",
            blood: "O+",
            diagnosis: "Malaria",
            address: "Zaria, Kaduna",
            date: "2026-09-08"
        },

        {
            id: "P-002",
            name: "Musa Ibrahim",
            gender: "Male",
            dob: "1989-11-02",
            phone: "08062223344",
            blood: "A+",
            diagnosis: "Hypertension",
            address: "Sabon Gari, Kaduna",
            date: "2026-09-07"
        },

        {
            id: "P-003",
            name: "Fatima Abdullahi",
            gender: "Female",
            dob: "2002-07-19",
            phone: "08103334455",
            blood: "B+",
            diagnosis: "Typhoid",
            address: "Kano Road, Kaduna",
            date: "2026-09-06"
        }

    ],


    doctors: [

        {
            id: "D-001",
            name: "Dr. Sarah Bello",
            specialization: "General Physician",
            phone: "08015551001",
            department: "General Medicine"
        },

        {
            id: "D-002",
            name: "Dr. Ibrahim Lawal",
            specialization: "Cardiologist",
            phone: "08025551002",
            department: "Cardiology"
        },

        {
            id: "D-003",
            name: "Dr. Mary James",
            specialization: "Pediatrician",
            phone: "08035551003",
            department: "Pediatrics"
        }

    ],


    nurses: [

        {
            id: "N-001",
            name: "Grace Daniel",
            department: "General Ward",
            phone: "08046662001",
            shift: "Morning"
        },

        {
            id: "N-002",
            name: "Hauwa Aliyu",
            department: "Pediatrics",
            phone: "08056662002",
            shift: "Evening"
        },

        {
            id: "N-003",
            name: "Peter John",
            department: "Emergency",
            phone: "08066662003",
            shift: "Night"
        }

    ],


    appointments: [

        {
            id: "A-001",
            patientId: "P-001",
            doctorId: "D-001",
            date: "2026-09-10",
            time: "09:00",
            reason: "Follow-up",
            status: "Scheduled"
        },

        {
            id: "A-002",
            patientId: "P-002",
            doctorId: "D-002",
            date: "2026-09-10",
            time: "11:30",
            reason: "Blood pressure review",
            status: "Scheduled"
        },

        {
            id: "A-003",
            patientId: "P-003",
            doctorId: "D-003",
            date: "2026-09-11",
            time: "10:00",
            reason: "Routine check-up",
            status: "Scheduled"
        }

    ],


    announcements: [

        {
            id: "AN-001",
            title: "Monthly Staff Meeting",
            message:
                "All department heads should attend the monthly staff meeting on Friday at 10:00 AM.",
            priority: "High",
            date: "2026-09-08"
        },

        {
            id: "AN-002",
            title: "Health and Safety Reminder",
            message:
                "Please ensure all clinical areas follow the hospital infection prevention guidelines.",
            priority: "Medium",
            date: "2026-09-07"
        },

        {
            id: "AN-003",
            title: "System Maintenance",
            message:
                "The management system will receive routine maintenance this weekend.",
            priority: "Low",
            date: "2026-09-06"
        }

    ],


    settings: {

        hospitalName:
            "GreenCare General Hospital",

        hospitalPhone:
            "0800 000 0000",

        hospitalEmail:
            "info@greencarehospital.com",

        hospitalAddress:
            "Ahmadu Bello Way, Kaduna, Nigeria"

    }

};


/* =========================================================
   APPLICATION DATA
========================================================= */

let data = loadData();

let currentType = null;

let editingId = null;


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function cloneData(object) {

    return JSON.parse(
        JSON.stringify(object)
    );

}


function loadData() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (saved) {

            return JSON.parse(saved);

        }

    } catch (error) {

        console.error(
            "Could not load saved data:",
            error
        );

    }

    return cloneData(defaultData);

}


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

    renderAll();

}


function getToday() {

    const date = new Date();

    return date
        .toISOString()
        .split("T")[0];

}


function formatDate(date) {

    if (!date) {
        return "—";
    }

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "en-NG",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function generateID(prefix, array) {

    let highest = 0;

    array.forEach(item => {

        const parts =
            String(item.id).split("-");

        const number =
            parseInt(parts[1]);

        if (!isNaN(number)) {

            highest =
                Math.max(
                    highest,
                    number
                );

        }

    });

    return (
        prefix +
        "-" +
        String(highest + 1)
            .padStart(3, "0")
    );

}


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timeout
    );

    showToast.timeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =========================================================
   NAVIGATION
========================================================= */

function navigate(sectionName) {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            section.classList.toggle(
                "active",
                section.id === sectionName
            );

        });


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.section === sectionName
            );

        });


    const titles = {

        dashboard: [
            "Dashboard",
            "Hospital overview and daily activities"
        ],

        patients: [
            "Patients",
            "Manage hospital patient records."
        ],

        doctors: [
            "Doctors",
            "Manage doctors and specialists."
        ],

        nurses: [
            "Nurses",
            "Manage hospital nursing staff."
        ],

        appointments: [
            "Appointments",
            "Schedule and manage appointments."
        ],

        announcements: [
            "Announcements",
            "Create and manage hospital notices."
        ],

        settings: [
            "Settings",
            "Configure hospital information."
        ]

    };


    $("pageTitle").textContent =
        titles[sectionName][0];

    $("pageDescription").textContent =
        titles[sectionName][1];


    $("sidebar").classList.remove(
        "open"
    );


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =========================================================
   NAVIGATION EVENTS
========================================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                navigate(
                    button.dataset.section
                );

            }
        );

    });


document
    .querySelectorAll("[data-go]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                navigate(
                    button.dataset.go
                );

            }
        );

    });


$("menuButton").addEventListener(
    "click",
    () => {

        $("sidebar")
            .classList.toggle("open");

    }
);


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    $("totalPatients").textContent =
        data.patients.length;

    $("totalDoctors").textContent =
        data.doctors.length;

    $("totalNurses").textContent =
        data.nurses.length;

    $("totalAppointments").textContent =
        data.appointments.length;


    /* Recent patients */

    const patients =
        data.patients
            .slice()
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            )
            .slice(0, 5);


    if (!patients.length) {

        $("recentPatients").innerHTML = `
            <tr>
                <td colspan="4" class="empty">
                    No patients found.
                </td>
            </tr>
        `;

    } else {

        $("recentPatients").innerHTML =
            patients
                .map(patient => `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(patient.name)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(patient.id)}
                        </td>

                        <td>
                            ${escapeHTML(patient.gender)}
                        </td>

                        <td>
                            ${escapeHTML(patient.diagnosis)}
                        </td>

                    </tr>

                `)
                .join("");

    }


    /* Dashboard announcements */

    const announcements =
        data.announcements
            .slice()
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            )
            .slice(0, 4);


    if (!announcements.length) {

        $("dashboardAnnouncements").innerHTML = `
            <div class="empty">
                No announcements.
            </div>
        `;

    } else {

        $("dashboardAnnouncements").innerHTML =
            announcements
                .map(item => `

                    <div class="announcement-item">

                        <h4>
                            ${escapeHTML(item.title)}
                        </h4>

                        <p>
                            ${escapeHTML(item.message)}
                        </p>

                        <small>
                            ${formatDate(item.date)}
                            ·
                            ${escapeHTML(item.priority)}
                            priority
                        </small>

                    </div>

                `)
                .join("");

    }


    /* Upcoming appointments */

    const appointments =
        data.appointments
            .slice()
            .sort(
                (a, b) =>
                    (
                        a.date + a.time
                    ).localeCompare(
                        b.date + b.time
                    )
            )
            .slice(0, 5);


    if (!appointments.length) {

        $("upcomingAppointments").innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No appointments.
                </td>
            </tr>
        `;

        return;

    }


    $("upcomingAppointments").innerHTML =
        appointments
            .map(appointment => {

                const patient =
                    data.patients.find(
                        item =>
                            item.id ===
                            appointment.patientId
                    );

                const doctor =
                    data.doctors.find(
                        item =>
                            item.id ===
                            appointment.doctorId
                    );


                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                patient?.name ||
                                "Deleted patient"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                doctor?.name ||
                                "Deleted doctor"
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                appointment.date
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                appointment.time
                            )}
                        </td>

                        <td>

                            <span
                                class="badge ${appointment.status.toLowerCase()}"
                            >
                                ${escapeHTML(
                                    appointment.status
                                )}
                            </span>

                        </td>

                    </tr>

                `;

            })
            .join("");

}


/* =========================================================
   PATIENTS
========================================================= */

function renderPatients() {

    const search =
        $("patientSearch")
            .value
            .toLowerCase()
            .trim();


    const patients =
        data.patients.filter(patient => {

            return [

                patient.name,
                patient.id,
                patient.phone,
                patient.diagnosis,
                patient.blood

            ]
                .some(value =>
                    String(value)
                        .toLowerCase()
                        .includes(search)
                );

        });


    if (!patients.length) {

        $("patientsTable").innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No patients found.
                </td>
            </tr>
        `;

        return;

    }


    $("patientsTable").innerHTML =
        patients
            .map(patient => `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(patient.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(patient.id)}
                    </td>

                    <td>
                        ${escapeHTML(patient.gender)}
                    </td>

                    <td>
                        ${escapeHTML(patient.phone)}
                    </td>

                    <td>
                        ${escapeHTML(patient.blood)}
                    </td>

                    <td>
                        ${escapeHTML(patient.diagnosis)}
                    </td>

                    <td>

                        <button
                            class="action-button"
                            onclick="editRecord(
                                'patient',
                                '${patient.id}'
                            )"
                        >
                            Edit
                        </button>

                        <button
                            class="action-button delete"
                            onclick="deleteRecord(
                                'patient',
                                '${patient.id}'
                            )"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `)
            .join("");

}


/* =========================================================
   DOCTORS
========================================================= */

function renderDoctors() {

    const search =
        $("doctorSearch")
            .value
            .toLowerCase()
            .trim();


    const doctors =
        data.doctors.filter(doctor => {

            return [

                doctor.name,
                doctor.id,
                doctor.specialization,
                doctor.department,
                doctor.phone

            ]
                .some(value =>
                    String(value)
                        .toLowerCase()
                        .includes(search)
                );

        });


    if (!doctors.length) {

        $("doctorsTable").innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No doctors found.
                </td>
            </tr>
        `;

        return;

    }


    $("doctorsTable").innerHTML =
        doctors
            .map(doctor => `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(doctor.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(doctor.id)}
                    </td>

                    <td>
                        ${escapeHTML(
                            doctor.specialization
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            doctor.phone
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            doctor.department
                        )}
                    </td>

                    <td>

                        <button
                            class="action-button"
                            onclick="editRecord(
                                'doctor',
                                '${doctor.id}'
                            )"
                        >
                            Edit
                        </button>

                        <button
                            class="action-button delete"
                            onclick="deleteRecord(
                                'doctor',
                                '${doctor.id}'
                            )"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `)
            .join("");

}


/* =========================================================
   NURSES
========================================================= */

function renderNurses() {

    const search =
        $("nurseSearch")
            .value
            .toLowerCase()
            .trim();


    const nurses =
        data.nurses.filter(nurse => {

            return [

                nurse.name,
                nurse.id,
                nurse.department,
                nurse.phone,
                nurse.shift

            ]
                .some(value =>
                    String(value)
                        .toLowerCase()
                        .includes(search)
                );

        });


    if (!nurses.length) {

        $("nursesTable").innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No nurses found.
                </td>
            </tr>
        `;

        return;

    }


    $("nursesTable").innerHTML =
        nurses
            .map(nurse => `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(nurse.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(nurse.id)}
                    </td>

                    <td>
                        ${escapeHTML(
                            nurse.department
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            nurse.phone
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            nurse.shift
                        )}
                    </td>

                    <td>

                        <button
                            class="action-button"
                            onclick="editRecord(
                                'nurse',
                                '${nurse.id}'
                            )"
                        >
                            Edit
                        </button>

                        <button
                            class="action-button delete"
                            onclick="deleteRecord(
                                'nurse',
                                '${nurse.id}'
                            )"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `)
            .join("");

}


/* =========================================================
   APPOINTMENTS
========================================================= */

function renderAppointments() {

    const search =
        $("appointmentSearch")
            .value
            .toLowerCase()
            .trim();


    const status =
        $("appointmentStatusFilter").value;


    const appointments =
        data.appointments.filter(appointment => {

            const patient =
                data.patients.find(
                    p =>
                        p.id ===
                        appointment.patientId
                );

            const doctor =
                data.doctors.find(
                    d =>
                        d.id ===
                        appointment.doctorId
                );


            const matchesSearch = [

                patient?.name,
                doctor?.name,
                appointment.reason,
                appointment.id

            ]
                .some(value =>
                    String(value || "")
                        .toLowerCase()
                        .includes(search)
                );


            const matchesStatus =
                !status ||
                appointment.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    if (!appointments.length) {

        $("appointmentsTable").innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No appointments found.
                </td>
            </tr>
        `;

        return;

    }


    $("appointmentsTable").innerHTML =
        appointments
            .map(appointment => {

                const patient =
                    data.patients.find(
                        p =>
                            p.id ===
                            appointment.patientId
                    );

                const doctor =
                    data.doctors.find(
                        d =>
                            d.id ===
                            appointment.doctorId
                    );


                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                patient?.name ||
                                "Deleted patient"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                doctor?.name ||
                                "Deleted doctor"
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                appointment.date
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                appointment.time
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                appointment.reason
                            )}
                        </td>

                        <td>

                            <span
                                class="badge ${appointment.status.toLowerCase()}"
                            >
                                ${escapeHTML(
                                    appointment.status
                                )}
                            </span>

                        </td>

                        <td>

                            <button
                                class="action-button"
                                onclick="editRecord(
                                    'appointment',
                                    '${appointment.id}'
                                )"
                            >
                                Edit
                            </button>

                            <button
                                class="action-button delete"
                                onclick="deleteRecord(
                                    'appointment',
                                    '${appointment.id}'
                                )"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            })
            .join("");

}


/* =========================================================
   ANNOUNCEMENTS
========================================================= */

function renderAnnouncements() {

    const announcements =
        data.announcements
            .slice()
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            );


    if (!announcements.length) {

        $("announcementsGrid").innerHTML = `
            <div class="card">
                <div class="empty">
                    No announcements available.
                </div>
            </div>
        `;

        return;

    }


    $("announcementsGrid").innerHTML =
        announcements
            .map(item => `

                <article
                    class="announcement-card"
                >

                    <span
                        class="
                            badge
                            ${item.priority.toLowerCase()}
                            priority
                        "
                    >
                        ${escapeHTML(
                            item.priority
                        )}
                    </span>


                    <h3>
                        ${escapeHTML(
                            item.title
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            item.message
                        )}
                    </p>


                    <small>
                        Published
                        ${formatDate(item.date)}
                    </small>


                    <div
                        class="announcement-actions"
                    >

                        <button
                            class="action-button"
                            onclick="editRecord(
                                'announcement',
                                '${item.id}'
                            )"
                        >
                            Edit
                        </button>


                        <button
                            class="action-button delete"
                            onclick="deleteRecord(
                                'announcement',
                                '${item.id}'
                            )"
                        >
                            Delete
                        </button>

                    </div>

                </article>

            `)
            .join("");

}


/* =========================================================
   SETTINGS
========================================================= */

function renderSettings() {

    $("hospitalName").value =
        data.settings.hospitalName;

    $("hospitalPhone").value =
        data.settings.hospitalPhone;

    $("hospitalEmail").value =
        data.settings.hospitalEmail;

    $("hospitalAddress").value =
        data.settings.hospitalAddress;

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

    renderDashboard();

    renderPatients();

    renderDoctors();

    renderNurses();

    renderAppointments();

    renderAnnouncements();

    renderSettings();

}


/* =========================================================
   FORM FIELD GENERATOR
========================================================= */

function createField(
    name,
    label,
    type = "text",
    value = "",
    options = {}
) {

    if (type === "select") {

        return `

            <label>

                ${label}

                <select
                    name="${name}"
                    ${options.required ? "required" : ""}
                >

                    ${options.items
                        .map(item => `

                            <option
                                value="${escapeHTML(item.value)}"
                                ${
                                    item.value === value
                                    ? "selected"
                                    : ""
                                }
                            >
                                ${escapeHTML(item.text)}
                            </option>

                        `)
                        .join("")
                    }

                </select>

            </label>

        `;

    }


    if (type === "textarea") {

        return `

            <label
                class="${options.full ? "full-field" : ""}"
            >

                ${label}

                <textarea
                    name="${name}"
                    rows="${options.rows || 4}"
                    ${options.required ? "required" : ""}
                >${escapeHTML(value)}</textarea>

            </label>

        `;

    }


    return `

        <label
            class="${options.full ? "full-field" : ""}"
        >

            ${label}

            <input
                type="${type}"
                name="${name}"
                value="${escapeHTML(value)}"
                ${options.required ? "required" : ""}
            >

        </label>

    `;

}


/* =========================================================
   OPEN ADD FORM
========================================================= */

function openAdd(type) {

    currentType = type;

    editingId = null;

    buildForm(
        type,
        {}
    );

    $("modalOverlay")
        .classList.add("show");

}


/* =========================================================
   EDIT FORM
========================================================= */

function editRecord(type, id) {

    const key =
        type + "s";


    const record =
        data[key].find(
            item =>
                item.id === id
        );


    if (!record) {

        return;

    }


    currentType = type;

    editingId = id;


    buildForm(
        type,
        record
    );


    $("modalOverlay")
        .classList.add("show");

}


window.editRecord = editRecord;


/* =========================================================
   BUILD MODAL FORM
========================================================= */

function buildForm(type, record) {

    $("modalTitle").textContent =
        editingId
        ? "Edit " + capitalize(type)
        : "Add " + capitalize(type);


    $("modalDescription").textContent =
        editingId
        ? "Update the information below."
        : "Enter the information below.";


    let html = "";


    /* PATIENT */

    if (type === "patient") {

        html = [

            createField(
                "name",
                "Full Name",
                "text",
                record.name,
                {
                    required: true
                }
            ),

            createField(
                "gender",
                "Gender",
                "select",
                record.gender,
                {
                    required: true,

                    items: [

                        {
                            value: "Male",
                            text: "Male"
                        },

                        {
                            value: "Female",
                            text: "Female"
                        },

                        {
                            value: "Other",
                            text: "Other"
                        }

                    ]
                }
            ),

            createField(
                "dob",
                "Date of Birth",
                "date",
                record.dob,
                {
                    required: true
                }
            ),

            createField(
                "phone",
                "Phone Number",
                "tel",
                record.phone,
                {
                    required: true
                }
            ),

            createField(
                "blood",
                "Blood Group",
                "select",
                record.blood,
                {
                    items: [

                        {
                            value: "A+",
                            text: "A+"
                        },

                        {
                            value: "A-",
                            text: "A-"
                        },

                        {
                            value: "B+",
                            text: "B+"
                        },

                        {
                            value: "B-",
                            text: "B-"
                        },

                        {
                            value: "AB+",
                            text: "AB+"
                        },

                        {
                            value: "AB-",
                            text: "AB-"
                        },

                        {
                            value: "O+",
                            text: "O+"
                        },

                        {
                            value: "O-",
                            text: "O-"
                        }

                    ]
                }
            ),

            createField(
                "diagnosis",
                "Diagnosis",
                "text",
                record.diagnosis,
                {
                    required: true
                }
            ),

            createField(
                "address",
                "Address",
                "textarea",
                record.address,
                {
                    full: true,
                    rows: 3
                }
            )

        ].join("");

    }


    /* DOCTOR */

    if (type === "doctor") {

        html = [

            createField(
                "name",
                "Full Name",
                "text",
                record.name,
                {
                    required: true
                }
            ),

            createField(
                "specialization",
                "Specialization",
                "text",
                record.specialization,
                {
                    required: true
                }
            ),

            createField(
                "phone",
                "Phone Number",
                "tel",
                record.phone,
                {
                    required: true
                }
            ),

            createField(
                "department",
                "Department",
                "text",
                record.department,
                {
                    required: true
                }
            )

        ].join("");

    }


    /* NURSE */

    if (type === "nurse") {

        html = [

            createField(
                "name",
                "Full Name",
                "text",
                record.name,
                {
                    required: true
                }
            ),

            createField(
                "department",
                "Department",
                "text",
                record.department,
                {
                    required: true
                }
            ),

            createField(
                "phone",
                "Phone Number",
                "tel",
                record.phone,
                {
                    required: true
                }
            ),

            createField(
                "shift",
                "Shift",
                "select",
                record.shift,
                {
                    required: true,

                    items: [

                        {
                            value: "Morning",
                            text: "Morning"
                        },

                        {
                            value: "Afternoon",
                            text: "Afternoon"
                        },

                        {
                            value: "Evening",
                            text: "Evening"
                        },

                        {
                            value: "Night",
                            text: "Night"
                        }

                    ]
                }
            )

        ].join("");

    }


    /* APPOINTMENT */

    if (type === "appointment") {

        const patientOptions =
            data.patients.map(patient => ({

                value: patient.id,

                text:
                    patient.id +
                    " — " +
                    patient.name

            }));


        const doctorOptions =
            data.doctors.map(doctor => ({

                value: doctor.id,

                text:
                    doctor.id +
                    " — " +
                    doctor.name

            }));


        html = [

            createField(
                "patientId",
                "Patient",
                "select",
                record.patientId,
                {
                    required: true,
                    items: patientOptions
                }
            ),

            createField(
                "doctorId",
                "Doctor",
                "select",
                record.doctorId,
                {
                    required: true,
                    items: doctorOptions
                }
            ),

            createField(
                "date",
                "Date",
                "date",
                record.date ||
                getToday(),
                {
                    required: true
                }
            ),

            createField(
                "time",
                "Time",
                "time",
                record.time ||
                "09:00",
                {
                    required: true
                }
            ),

            createField(
                "reason",
                "Reason",
                "text",
                record.reason,
                {
                    required: true
                }
            ),

            createField(
                "status",
                "Status",
                "select",
                record.status ||
                "Scheduled",
                {
                    required: true,

                    items: [

                        {
                            value: "Scheduled",
                            text: "Scheduled"
                        },

                        {
                            value: "Completed",
                            text: "Completed"
                        },

                        {
                            value: "Cancelled",
                            text: "Cancelled"
                        }

                    ]
                }
            )

        ].join("");

    }


    /* ANNOUNCEMENT */

    if (type === "announcement") {

        html = [

            createField(
                "title",
                "Announcement Title",
                "text",
                record.title,
                {
                    required: true
                }
            ),

            createField(
                "priority",
                "Priority",
                "select",
                record.priority ||
                "Medium",
                {
                    required: true,

                    items: [

                        {
                            value: "High",
                            text: "High"
                        },

                        {
                            value: "Medium",
                            text: "Medium"
                        },

                        {
                            value: "Low",
                            text: "Low"
                        }

                    ]
                }
            ),

            createField(
                "message",
                "Announcement Message",
                "textarea",
                record.message,
                {
                    required: true,
                    full: true,
                    rows: 5
                }
            ),

            createField(
                "date",
                "Date",
                "date",
                record.date ||
                getToday(),
                {
                    required: true
                }
            )

        ].join("");

    }


    $("formFields").innerHTML = html;

}


/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(word) {

    return word
        .charAt(0)
        .toUpperCase() +
        word.slice(1);

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    $("modalOverlay")
        .classList.remove("show");

    currentType = null;

    editingId = null;

}


$("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


$("cancelModal")
    .addEventListener(
        "click",
        closeModal
    );


$("modalOverlay")
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("modalOverlay")
            ) {

                closeModal();

            }

        }
    );


/* =========================================================
   SAVE FORM
========================================================= */

$("recordForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(
                    event.target
                );


            const record =
                Object.fromEntries(
                    formData.entries()
                );


            const key =
                currentType + "s";


            /* PATIENT */

            if (
                currentType ===
                "patient"
            ) {

                if (editingId) {

                    const existing =
                        data.patients.find(
                            item =>
                                item.id ===
                                editingId
                        );

                    Object.assign(
                        existing,
                        record
                    );

                } else {

                    data.patients.unshift({

                        ...record,

                        id:
                            generateID(
                                "P",
                                data.patients
                            ),

                        date:
                            getToday()

                    });

                }

            }


            /* DOCTOR */

            if (
                currentType ===
                "doctor"
            ) {

                if (editingId) {

                    const existing =
                        data.doctors.find(
                            item =>
                                item.id ===
                                editingId
                        );

                    Object.assign(
                        existing,
                        record
                    );

                } else {

                    data.doctors.unshift({

                        ...record,

                        id:
                            generateID(
                                "D",
                                data.doctors
                            )

                    });

                }

            }


            /* NURSE */

            if (
                currentType ===
                "nurse"
            ) {

                if (editingId) {

                    const existing =
                        data.nurses.find(
                            item =>
                                item.id ===
                                editingId
                        );

                    Object.assign(
                        existing,
                        record
                    );

                } else {

                    data.nurses.unshift({

                        ...record,

                        id:
                            generateID(
                                "N",
                                data.nurses
                            )

                    });

                }

            }


            /* APPOINTMENT */

            if (
                currentType ===
                "appointment"
            ) {

                if (editingId) {

                    const existing =
                        data.appointments.find(
                            item =>
                                item.id ===
                                editingId
                        );

                    Object.assign(
                        existing,
                        record
                    );

                } else {

                    data.appointments.unshift({

                        ...record,

                        id:
                            generateID(
                                "A",
                                data.appointments
                            )

                    });

                }

            }


            /* ANNOUNCEMENT */

            if (
                currentType ===
                "announcement"
            ) {

                if (editingId) {

                    const existing =
                        data.announcements.find(
                            item =>
                                item.id ===
                                editingId
                        );

                    Object.assign(
                        existing,
                        record
                    );

                } else {

                    data.announcements.unshift({

                        ...record,

                        id:
                            generateID(
                                "AN",
                                data.announcements
                            )

                    });

                }

            }


            saveData();


            const wasEditing =
                Boolean(editingId);


            closeModal();


            showToast(
                wasEditing
                    ? "Record updated successfully."
                    : "Record added successfully."
            );

        }
    );


/* =========================================================
   DELETE RECORD
========================================================= */

function deleteRecord(type, id) {

    const key =
        type + "s";


    const record =
        data[key].find(
            item =>
                item.id === id
        );


    if (!record) {

        return;

    }


    const name =
        record.name ||
        record.title ||
        record.id;


    const confirmed =
        confirm(
            `Are you sure you want to delete "${name}"?`
        );


    if (!confirmed) {

        return;

    }


    data[key] =
        data[key].filter(
            item =>
                item.id !== id
        );


    saveData();


    showToast(
        "Record deleted successfully."
    );

}


window.deleteRecord = deleteRecord;


/* =========================================================
   ADD BUTTONS
========================================================= */

$("addPatientButton")
    .addEventListener(
        "click",
        () => openAdd("patient")
    );


$("addDoctorButton")
    .addEventListener(
        "click",
        () => openAdd("doctor")
    );


$("addNurseButton")
    .addEventListener(
        "click",
        () => openAdd("nurse")
    );


$("addAppointmentButton")
    .addEventListener(
        "click",
        () => openAdd("appointment")
    );


$("addAnnouncementButton")
    .addEventListener(
        "click",
        () => openAdd("announcement")
    );


/* =========================================================
   SEARCH
========================================================= */

$("patientSearch")
    .addEventListener(
        "input",
        renderPatients
    );


$("doctorSearch")
    .addEventListener(
        "input",
        renderDoctors
    );


$("nurseSearch")
    .addEventListener(
        "input",
        renderNurses
    );


$("appointmentSearch")
    .addEventListener(
        "input",
        renderAppointments
    );


$("appointmentStatusFilter")
    .addEventListener(
        "change",
        renderAppointments
    );


/* =========================================================
   SETTINGS
========================================================= */

$("settingsForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            data.settings = {

                hospitalName:
                    $("hospitalName").value,

                hospitalPhone:
                    $("hospitalPhone").value,

                hospitalEmail:
                    $("hospitalEmail").value,

                hospitalAddress:
                    $("hospitalAddress").value

            };


            saveData();


            showToast(
                "Hospital settings saved."
            );

        }
    );


/* =========================================================
   EXPORT DATA
========================================================= */

$("exportButton")
    .addEventListener(
        "click",
        () => {

            const json =
                JSON.stringify(
                    data,
                    null,
                    4
                );


            const blob =
                new Blob(
                    [json],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                "hospital-management-data.json";


            link.click();


            URL.revokeObjectURL(url);


            showToast(
                "Hospital data exported."
            );

        }
    );


/* =========================================================
   RESET DATA
========================================================= */

$("resetButton")
    .addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Reset all data to the original demo data?"
                );


            if (!confirmed) {

                return;

            }


            data =
                cloneData(
                    defaultData
                );


            saveData();


            showToast(
                "Demo data restored."
            );

        }
    );


/* =========================================================
   CURRENT DATE
========================================================= */

$("currentDate").textContent =
    new Date().toLocaleDateString(
        "en-NG",
        {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );


/* =========================================================
   START APPLICATION
========================================================= */

renderAll();