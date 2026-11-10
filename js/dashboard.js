/**
 * PASSPORTEASE - CLIENT DASHBOARD SCRIPT (dashboard.js)
 * Full interactive management: Applications, 5-Step Tracker, Document Uploads,
 * Appointment Booking, Notifications, Profile Editor & Session handling.
 */

// Global State
let currentUser = null;
let userApplications = [];
let uploadedDocuments = [];
let notificationsList = [];

document.addEventListener('DOMContentLoaded', () => {
  // Theme & RTL Init
  initThemeManager();
  initRtlManager();

  // 1. Check Authentication Session
  checkAuthSession();

  // 2. Initialize Data from LocalStorage
  loadDashboardData();

  // 3. Initialize Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 4. Setup Tab Navigation
  setupSidebarNavigation();

  // 5. Setup Mobile Sidebar Toggle
  setupMobileSidebar();

  // 6. Render Overview & Applications
  renderOverviewMetrics();
  renderApplicationsList();

  // 7. Setup New Application Modal
  setupNewApplicationModal();

  // 8. Setup Document Upload Dropzone & Manager
  setupDocumentUploader();

  // 9. Setup Appointment Booking Assistance
  setupAppointmentBooking();

  // 10. Setup Notifications Center
  setupNotifications();

  // 11. Setup Profile Management
  setupProfileEditor();

  // 12. Setup Logout
  setupLogout();
});

/**
 * 1. Check Auth Session
 */
function checkAuthSession() {
  const sessionStr = localStorage.getItem('passportease_user');
  if (!sessionStr) {
    // If not logged in, auto-populate demo user for direct testability or redirect
    currentUser = {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@passportease.in',
      phone: '+91 98765 43210',
      address: 'Suite 402, Highline Residency, Bandra West, Mumbai 400050',
      dob: '1992-08-14',
      gender: 'Male',
      nationality: 'Indian'
    };
    localStorage.setItem('passportease_user', JSON.stringify(currentUser));
  } else {
    try {
      currentUser = JSON.parse(sessionStr);
    } catch(e) {
      currentUser = { fullName: 'Aarav Sharma', email: 'aarav.sharma@passportease.in' };
    }
  }

  // Update Topbar and Sidebar user identity
  const userNameEls = document.querySelectorAll('.user-display-name');
  const userEmailEls = document.querySelectorAll('.user-display-email');
  userNameEls.forEach(el => el.textContent = currentUser.fullName || 'Valued Client');
  userEmailEls.forEach(el => el.textContent = currentUser.email || 'client@passportease.in');
}

/**
 * 2. Load LocalStorage Data
 */
function loadDashboardData() {
  // Applications
  const storedApps = localStorage.getItem('passportease_apps');
  if (storedApps) {
    try {
      userApplications = JSON.parse(storedApps);
    } catch(e) {
      userApplications = getDefaultApplications();
    }
  } else {
    userApplications = getDefaultApplications();
    localStorage.setItem('passportease_apps', JSON.stringify(userApplications));
  }

  // Uploaded Documents
  const storedDocs = localStorage.getItem('passportease_docs');
  if (storedDocs) {
    try {
      uploadedDocuments = JSON.parse(storedDocs);
    } catch(e) {
      uploadedDocuments = getDefaultDocuments();
    }
  } else {
    uploadedDocuments = getDefaultDocuments();
    localStorage.setItem('passportease_docs', JSON.stringify(uploadedDocuments));
  }

  // Notifications
  const storedNotifs = localStorage.getItem('passportease_notifs');
  if (storedNotifs) {
    try {
      notificationsList = JSON.parse(storedNotifs);
    } catch(e) {
      notificationsList = getDefaultNotifications();
    }
  } else {
    notificationsList = getDefaultNotifications();
    localStorage.setItem('passportease_notifs', JSON.stringify(notificationsList));
  }
}

function getDefaultApplications() {
  return [
    {
      id: 'app-1',
      ref: 'PE-2026-98421',
      applicantName: currentUser ? currentUser.fullName : 'Aarav Sharma',
      type: 'Passport Renewal (36 Pages)',
      serviceCategory: 'renewal',
      submissionDate: '02 Nov 2026',
      statusStep: 3, // 1 to 5
      statusBadge: 'Appointment Assistance',
      badgeColor: 'primary',
      location: 'Regional PSK Central, Counter B',
      appointmentDate: '16 Nov 2026 at 10:30 AM',
      caseworker: 'Senior Facilitator Rajiv Nair',
      documentsCount: 4,
      notes: 'Pre-check complete. Original passport & self-attested annexure validated.'
    },
    {
      id: 'app-2',
      ref: 'PE-2026-44102',
      applicantName: `${currentUser ? currentUser.fullName.split(' ')[0] : 'Priya'} (Family Minor)`,
      type: 'Minor Fresh Passport Application',
      serviceCategory: 'minor',
      submissionDate: '05 Nov 2026',
      statusStep: 2,
      statusBadge: 'Documents Under Review',
      badgeColor: 'warning',
      location: 'Passport Seva Camp Office',
      appointmentDate: 'Pending Verification',
      caseworker: 'Legal Documentation Specialist Anita Rao',
      documentsCount: 3,
      notes: 'Annexure D consent affidavit uploaded. Clear municipal birth certificate under review.'
    }
  ];
}

function getDefaultDocuments() {
  return [
    {
      id: 'doc-1',
      name: 'Aadhaar_Card_SelfAttested.pdf',
      category: 'Identity Proof',
      size: '1.4 MB',
      date: '02 Nov 2026',
      status: 'Verified',
      statusBadge: 'success'
    },
    {
      id: 'doc-2',
      name: 'Old_Passport_Front_Back.pdf',
      category: 'Passport Renewal Documents',
      size: '2.1 MB',
      date: '02 Nov 2026',
      status: 'Verified',
      statusBadge: 'success'
    },
    {
      id: 'doc-3',
      name: 'Electricity_Bill_Sept2026.jpg',
      category: 'Address Proof',
      size: '850 KB',
      date: '03 Nov 2026',
      status: 'Verified',
      statusBadge: 'success'
    },
    {
      id: 'doc-4',
      name: 'Birth_Certificate_Municipal.pdf',
      category: 'Date of Birth Proof',
      size: '1.8 MB',
      date: '05 Nov 2026',
      status: 'Under Review',
      statusBadge: 'warning'
    }
  ];
}

function getDefaultNotifications() {
  return [
    {
      id: 'notif-1',
      category: 'verification',
      title: 'Identity Proof Approved',
      message: 'Your Aadhaar card digital attestation has been successfully verified by our compliance team.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif-2',
      category: 'appointment',
      title: 'Appointment Assistance Scheduled',
      message: 'Your preferred slot for 16 Nov 2026 at 10:30 AM has been requested. Physical escort details will follow.',
      time: '1 day ago',
      read: false
    },
    {
      id: 'notif-3',
      category: 'alert',
      title: 'Minor Birth Certificate Under Review',
      message: 'Case Officer Anita Rao is reviewing the municipal seal clarity on the birth certificate.',
      time: '2 days ago',
      read: true
    },
    {
      id: 'notif-4',
      category: 'progress',
      title: 'Application PE-2026-98421 Advanced to Stage 3',
      message: 'Your file has progressed from Document Review to Appointment Assistance.',
      time: '3 days ago',
      read: true
    }
  ];
}

/**
 * 4. Setup Sidebar Navigation Tabs
 */
function setupSidebarNavigation() {
  const navLinks = document.querySelectorAll('.sidebar-menu-link[data-tab]');
  const tabPanes = document.querySelectorAll('.dashboard-tab-pane');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.dataset.tab;

      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update active tab pane
      tabPanes.forEach(pane => {
        pane.classList.add('d-none');
        if (pane.id === `tab-${targetTab}`) {
          pane.classList.remove('d-none');
        }
      });

      // Close mobile sidebar on navigation
      const sidebar = document.getElementById('dashboardSidebar');
      if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('show-sidebar');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Action links from overview cards
  document.querySelectorAll('[data-switch-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.dataset.switchTab;
      const matchingLink = document.querySelector(`.sidebar-menu-link[data-tab="${targetTab}"]`);
      if (matchingLink) {
        matchingLink.click();
      }
    });
  });
}

/**
 * 5. Mobile Sidebar Toggle
 */
function setupMobileSidebar() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('dashboardSidebar');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show-sidebar');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('show-sidebar');
    });
  }
}

/**
 * 6. Overview Metrics & Applications
 */
function renderOverviewMetrics() {
  const totalAppsEl = document.getElementById('metricTotalApps');
  const underReviewEl = document.getElementById('metricUnderReview');
  const pendingDocsEl = document.getElementById('metricPendingDocs');
  const appointmentStatusEl = document.getElementById('metricAppointmentStatus');

  const total = userApplications.length;
  const underReview = userApplications.filter(a => a.statusStep === 2).length;
  const pendingDocs = uploadedDocuments.filter(d => d.status === 'Under Review' || d.status === 'Action Required').length;
  const hasConfirmedAppointment = userApplications.some(a => a.statusStep >= 3 && a.appointmentDate && !a.appointmentDate.includes('Pending'));

  if (totalAppsEl) totalAppsEl.textContent = total;
  if (underReviewEl) underReviewEl.textContent = underReview;
  if (pendingDocsEl) pendingDocsEl.textContent = pendingDocs;
  if (appointmentStatusEl) {
    appointmentStatusEl.textContent = hasConfirmedAppointment ? 'Slot Confirmed' : 'Action Required';
    appointmentStatusEl.className = hasConfirmedAppointment ? 'metric-value text-success' : 'metric-value text-warning';
  }
}

function renderApplicationsList() {
  const container = document.getElementById('applicationsListContainer');
  const overviewSnippet = document.getElementById('overviewRecentApplication');
  if (!container) return;

  container.innerHTML = '';

  if (userApplications.length === 0) {
    container.innerHTML = `
      <div class="card p-5 text-center border-0 shadow-sm">
        <i data-lucide="folder-plus" class="mx-auto text-muted mb-3" style="width:48px;height:48px;"></i>
        <h5 class="fw-bold">No Active Applications Found</h5>
        <p class="text-muted">You haven't submitted any passport assistance requests yet.</p>
        <button class="btn btn-gold mx-auto" data-bs-toggle="modal" data-bs-target="#newApplicationModal">
          <i data-lucide="plus" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i>
          Apply for Assistance Now
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  // Render recent application snippet on Overview
  if (overviewSnippet && userApplications[0]) {
    const recent = userApplications[0];
    const steps = [
      'Application Submitted',
      'Documents Under Review',
      'Appointment Assistance',
      'Application Processing',
      'Completed'
    ];
    const progressPercent = (recent.statusStep / 5) * 100;

    overviewSnippet.innerHTML = `
      <div class="card border-0 shadow-sm p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle mb-1">${recent.type}</span>
            <h4 class="mb-0 fw-bold">${recent.ref} - ${recent.applicantName}</h4>
            <div class="small text-muted mt-1">Submitted on ${recent.submissionDate} | Assigned: <strong>${recent.caseworker}</strong></div>
          </div>
          <div class="text-end">
            <span class="badge bg-warning text-dark px-3 py-2 fw-bold" style="font-size:0.85rem;">Stage ${recent.statusStep}/5: ${recent.statusBadge}</span>
          </div>
        </div>

        <!-- 5-Step Progress Tracker -->
        <div class="pipeline-steps-container">
          <div class="pipeline-progress-bar" style="width: ${((recent.statusStep - 1) / 4) * 100}%;"></div>
          ${steps.map((st, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < recent.statusStep;
            const isActive = stepNum === recent.statusStep;
            return `
              <div class="pipeline-step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                <div class="pipeline-step-circle">
                  ${isCompleted ? '<i data-lucide="check" style="width:16px;height:16px;"></i>' : stepNum}
                </div>
                <div class="pipeline-step-label">${st}</div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="bg-light p-3 rounded-3 mt-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <i data-lucide="calendar" class="text-primary me-2" style="width:18px;height:18px;display:inline-block;vertical-align:middle;"></i>
            <span class="small fw-semibold">Next Action / Slot:</span>
            <span class="small text-dark fw-bold ms-1">${recent.appointmentDate} (${recent.location})</span>
          </div>
          <button class="btn btn-outline-navy btn-sm" onclick="viewApplicationDetails('${recent.id}')">
            View Case File
          </button>
        </div>
      </div>
    `;
  }

  // Render Full Applications in "My Applications" Tab
  userApplications.forEach(app => {
    const card = document.createElement('div');
    card.className = 'card border-0 shadow-sm p-4 mb-4';

    const steps = [
      'Application Submitted',
      'Documents Under Review',
      'Appointment Assistance',
      'Application Processing',
      'Completed'
    ];
    const progressWidth = ((app.statusStep - 1) / 4) * 100;

    card.innerHTML = `
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
            <h5 class="fw-bold mb-0 text-dark">${app.ref}</h5>
            <span class="badge badge-doc-type">${app.type}</span>
          </div>
          <div class="text-muted small">Applicant: <strong>${app.applicantName}</strong> | Submitted: ${app.submissionDate}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">${app.statusBadge}</span>
          <button class="btn btn-outline-primary btn-sm" onclick="viewApplicationDetails('${app.id}')">
            <i data-lucide="eye" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>
            View Details
          </button>
        </div>
      </div>

      <!-- 5-Step Visual Track -->
      <div class="pipeline-steps-container my-3">
        <div class="pipeline-progress-bar" style="width: ${progressWidth}%;"></div>
        ${steps.map((st, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < app.statusStep;
          const isActive = stepNum === app.statusStep;
          return `
            <div class="pipeline-step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
              <div class="pipeline-step-circle">
                ${isCompleted ? '<i data-lucide="check" style="width:16px;height:16px;"></i>' : stepNum}
              </div>
              <div class="pipeline-step-label">${st}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="row g-2 pt-2 border-top small text-muted">
        <div class="col-md-4">
          <i data-lucide="user-check" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>
          Facilitator: <strong>${app.caseworker}</strong>
        </div>
        <div class="col-md-5">
          <i data-lucide="map-pin" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>
          Location: <strong>${app.location}</strong>
        </div>
        <div class="col-md-3 text-md-end">
          <i data-lucide="file-check" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>
          Docs: <strong>${app.documentsCount} Attached</strong>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * View Application Details Modal
 */
window.viewApplicationDetails = function(appId) {
  const app = userApplications.find(a => a.id === appId);
  if (!app) return;

  const modalEl = document.getElementById('applicationDetailsModal');
  if (!modalEl) return;

  document.getElementById('modalDetailRef').textContent = app.ref;
  document.getElementById('modalDetailApplicant').textContent = app.applicantName;
  document.getElementById('modalDetailType').textContent = app.type;
  document.getElementById('modalDetailDate').textContent = app.submissionDate;
  document.getElementById('modalDetailStatus').textContent = app.statusBadge;
  document.getElementById('modalDetailOfficer').textContent = app.caseworker;
  document.getElementById('modalDetailLocation').textContent = app.location;
  document.getElementById('modalDetailSlot').textContent = app.appointmentDate;
  document.getElementById('modalDetailNotes').textContent = app.notes || 'No special notes recorded. Pre-check in progress.';

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

/**
 * 7. Setup New Application Submission Modal
 */
function setupNewApplicationModal() {
  const form = document.getElementById('newApplicationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const applicantName = document.getElementById('newAppApplicantName').value.trim();
    const serviceType = document.getElementById('newAppServiceType').value;
    const passportType = document.getElementById('newAppPassportType').value;
    const preferredCity = document.getElementById('newAppCity').value;

    if (!applicantName || !serviceType) {
      alert('Please fill in applicant name and service category.');
      return;
    }

    const newRef = `PE-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newApp = {
      id: `app-${Date.now()}`,
      ref: newRef,
      applicantName: applicantName,
      type: `${serviceType} (${passportType})`,
      serviceCategory: serviceType.toLowerCase(),
      submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      statusStep: 1, // Step 1: Application Submitted
      statusBadge: 'Application Submitted',
      badgeColor: 'info',
      location: `Passport Seva Kendra (${preferredCity})`,
      appointmentDate: 'Pending Verification',
      caseworker: 'Senior Facilitator Rajiv Nair',
      documentsCount: 0,
      notes: 'New assistance dossier initiated. Please upload requested identity and address records.'
    };

    userApplications.unshift(newApp);
    localStorage.setItem('passportease_apps', JSON.stringify(userApplications));

    // Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      category: 'progress',
      title: `Application Initiated (${newRef})`,
      message: `Your new file for ${applicantName} has been created and assigned to Case Facilitation Team.`,
      time: 'Just now',
      read: false
    };
    notificationsList.unshift(newNotif);
    localStorage.setItem('passportease_notifs', JSON.stringify(notificationsList));

    // Reset and hide modal
    form.reset();
    const modalEl = document.getElementById('newApplicationModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    // Re-render
    renderOverviewMetrics();
    renderApplicationsList();
    renderNotifications();

    alert(`Application ${newRef} successfully submitted! A dedicated facilitator has been assigned.`);
  });
}

/**
 * 8. Document Upload Dropzone & Manager
 */
function setupDocumentUploader() {
  const dropzone = document.getElementById('uploadDropzone');
  const fileInput = document.getElementById('docFileInput');
  const categorySelect = document.getElementById('docCategorySelect');
  const uploadProgressArea = document.getElementById('uploadProgressArea');
  const uploadProgressBar = document.getElementById('uploadProgressBar');
  const uploadedContainer = document.getElementById('uploadedDocsContainer');

  if (!dropzone || !fileInput) return;

  renderUploadedDocuments();

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      handleFiles(fileInput.files);
    }
  });

  function handleFiles(files) {
    const file = files[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File exceeds the 5MB size limit. Please upload a compressed document scan.');
      return;
    }

    // Validate extension
    const allowed = ['pdf', 'jpg', 'jpeg', 'png'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      alert('Invalid file format. Only PDF, JPG, and PNG files are supported.');
      return;
    }

    const category = categorySelect ? categorySelect.value : 'Identity Proof';

    // Show simulated progress
    if (uploadProgressArea && uploadProgressBar) {
      uploadProgressArea.classList.remove('d-none');
      uploadProgressBar.style.width = '0%';
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        uploadProgressBar.style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            uploadProgressArea.classList.add('d-none');
            // Add to list
            const sizeFormatted = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
            const newDoc = {
              id: `doc-${Date.now()}`,
              name: file.name,
              category: category,
              size: sizeFormatted,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: 'Under Review',
              statusBadge: 'warning'
            };

            uploadedDocuments.unshift(newDoc);
            localStorage.setItem('passportease_docs', JSON.stringify(uploadedDocuments));
            renderUploadedDocuments();
            renderOverviewMetrics();

            alert(`"${file.name}" uploaded successfully for verification!`);
          }, 400);
        }
      }, 150);
    }
  }
}

function renderUploadedDocuments() {
  const container = document.getElementById('uploadedDocsContainer');
  if (!container) return;

  container.innerHTML = '';

  if (uploadedDocuments.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-muted">No documents uploaded yet.</div>`;
    return;
  }

  uploadedDocuments.forEach(doc => {
    const item = document.createElement('div');
    item.className = 'uploaded-file-item';

    const isPdf = doc.name.toLowerCase().endsWith('.pdf');

    item.innerHTML = `
      <div class="uploaded-file-info">
        <div class="file-type-icon">
          <i data-lucide="${isPdf ? 'file-text' : 'image'}" style="width:20px;height:20px;"></i>
        </div>
        <div>
          <div class="fw-bold text-dark text-break mb-1" style="font-size:0.92rem;">${doc.name}</div>
          <div class="small text-muted">
            <span class="badge bg-light text-dark border me-2">${doc.category}</span>
            <span>${doc.size}</span> • <span>${doc.date}</span>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-${doc.statusBadge}-subtle text-${doc.statusBadge} border border-${doc.statusBadge}-subtle">${doc.status}</span>
        <button class="btn btn-outline-secondary btn-sm" onclick="previewDocument('${doc.name}')" title="Preview File">
          <i data-lucide="eye" style="width:14px;height:14px;"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm" onclick="removeDocument('${doc.id}')" title="Remove File">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
        </button>
      </div>
    `;

    container.appendChild(item);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.previewDocument = function(fileName) {
  alert(`File Preview: ${fileName}\n\n[Demonstration preview: Document scan verified. Standard resolution 300 DPI, full legal borders intact.]`);
};

window.removeDocument = function(docId) {
  if (confirm('Are you sure you want to delete this document from your assistance file?')) {
    uploadedDocuments = uploadedDocuments.filter(d => d.id !== docId);
    localStorage.setItem('passportease_docs', JSON.stringify(uploadedDocuments));
    renderUploadedDocuments();
    renderOverviewMetrics();
  }
};

/**
 * 9. Appointment Assistance Booking
 */
function setupAppointmentBooking() {
  const form = document.getElementById('appointmentHelpForm');
  const slotButtons = document.querySelectorAll('.slot-pill-btn');

  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const appRef = document.getElementById('bookingAppRef').value;
      const date = document.getElementById('bookingPreferredDate').value;
      const pskLocation = document.getElementById('bookingPskLocation').value;
      const assistType = document.getElementById('bookingAssistanceType').value;
      const activeSlot = document.querySelector('.slot-pill-btn.active');
      const timeSlot = activeSlot ? activeSlot.dataset.slot : '10:00 AM - 01:00 PM';

      if (!date) {
        alert('Please select your preferred appointment date.');
        return;
      }

      // Update matching application
      const app = userApplications.find(a => a.ref === appRef) || userApplications[0];
      if (app) {
        app.appointmentDate = `${date} (${timeSlot})`;
        app.location = pskLocation;
        app.statusStep = 3;
        app.statusBadge = 'Slot Requested & Under Concierge Booking';
        localStorage.setItem('passportease_apps', JSON.stringify(userApplications));
      }

      // Add Notification
      notificationsList.unshift({
        id: `notif-${Date.now()}`,
        category: 'appointment',
        title: 'Appointment Assistance Scheduled',
        message: `Appointment booking requested for ${date} at ${pskLocation}. Facilitator will confirm ARN appointment receipt shortly.`,
        time: 'Just now',
        read: false
      });
      localStorage.setItem('passportease_notifs', JSON.stringify(notificationsList));

      renderOverviewMetrics();
      renderApplicationsList();
      renderNotifications();

      const bookingStatusAlert = document.getElementById('bookingStatusAlert');
      if (bookingStatusAlert) {
        bookingStatusAlert.className = 'alert alert-success mt-3';
        bookingStatusAlert.innerHTML = `
          <h6 class="fw-bold mb-1"><i data-lucide="check-circle" class="me-1"></i> Appointment Assistance Request Lodged!</h6>
          <p class="mb-0 small">Preferred Date: <strong>${date}</strong> (${timeSlot}) at <strong>${pskLocation}</strong>. Package: <strong>${assistType}</strong>. Our booking desk will dispatch your appointment appointment slip within 4 business hours.</p>
        `;
        bookingStatusAlert.classList.remove('d-none');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      } else {
        alert(`Appointment booking assistance submitted for ${date} at ${pskLocation}!`);
      }
    });
  }
}

/**
 * 10. Notifications Center
 */
function setupNotifications() {
  renderNotifications();

  const markAllReadBtn = document.getElementById('btnMarkAllRead');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      notificationsList.forEach(n => n.read = true);
      localStorage.setItem('passportease_notifs', JSON.stringify(notificationsList));
      renderNotifications();
    });
  }
}

function renderNotifications() {
  const container = document.getElementById('notificationsListContainer');
  const unreadBadge = document.getElementById('unreadNotifBadge');
  const topbarDot = document.getElementById('topbarNotifDot');

  const unreadCount = notificationsList.filter(n => !n.read).length;
  if (unreadBadge) {
    unreadBadge.textContent = unreadCount;
    unreadBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }
  if (topbarDot) {
    topbarDot.style.display = unreadCount > 0 ? 'block' : 'none';
  }

  if (!container) return;

  container.innerHTML = '';

  if (notificationsList.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-muted">No notifications right now.</div>`;
    return;
  }

  notificationsList.forEach(n => {
    const item = document.createElement('div');
    item.className = `p-3 rounded-3 mb-2 border ${n.read ? 'bg-white' : 'bg-primary-subtle border-primary-subtle'}`;

    let iconName = 'bell';
    if (n.category === 'verification') iconName = 'shield-check';
    else if (n.category === 'appointment') iconName = 'calendar';
    else if (n.category === 'alert') iconName = 'alert-triangle';
    else if (n.category === 'progress') iconName = 'arrow-right-circle';

    item.innerHTML = `
      <div class="d-flex align-items-start gap-3">
        <div class="p-2 rounded-2 ${n.read ? 'bg-light text-muted' : 'bg-primary text-white'}">
          <i data-lucide="${iconName}" style="width:18px;height:18px;"></i>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h6 class="fw-bold mb-0 text-dark" style="font-size:0.95rem;">${n.title}</h6>
            <small class="text-muted">${n.time}</small>
          </div>
          <p class="mb-0 small text-muted">${n.message}</p>
        </div>
      </div>
    `;

    container.appendChild(item);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * 11. Profile Management
 */
function setupProfileEditor() {
  const form = document.getElementById('profileEditorForm');
  const passwordForm = document.getElementById('changePasswordForm');

  if (currentUser) {
    if (document.getElementById('profileFullName')) document.getElementById('profileFullName').value = currentUser.fullName || '';
    if (document.getElementById('profileEmail')) document.getElementById('profileEmail').value = currentUser.email || '';
    if (document.getElementById('profilePhone')) document.getElementById('profilePhone').value = currentUser.phone || '';
    if (document.getElementById('profileAddress')) document.getElementById('profileAddress').value = currentUser.address || '';
    if (document.getElementById('profileDob')) document.getElementById('profileDob').value = currentUser.dob || '1992-08-14';
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      currentUser.fullName = document.getElementById('profileFullName').value.trim();
      currentUser.email = document.getElementById('profileEmail').value.trim();
      currentUser.phone = document.getElementById('profilePhone').value.trim();
      currentUser.address = document.getElementById('profileAddress').value.trim();
      currentUser.dob = document.getElementById('profileDob').value;

      localStorage.setItem('passportease_user', JSON.stringify(currentUser));
      checkAuthSession();

      const alertEl = document.getElementById('profileUpdateAlert');
      if (alertEl) {
        alertEl.classList.remove('d-none');
        setTimeout(() => alertEl.classList.add('d-none'), 4000);
      } else {
        alert('Profile information saved successfully!');
      }
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = document.getElementById('currentPassword').value;
      const newPass = document.getElementById('newPassword').value;
      const confirmPass = document.getElementById('confirmNewPassword').value;

      if (!current || !newPass) {
        alert('Please fill out all password fields.');
        return;
      }

      if (newPass !== confirmPass) {
        alert('New passwords do not match. Please re-enter.');
        return;
      }

      if (newPass.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
      }

      passwordForm.reset();
      const pwdAlert = document.getElementById('passwordUpdateAlert');
      if (pwdAlert) {
        pwdAlert.classList.remove('d-none');
        setTimeout(() => pwdAlert.classList.add('d-none'), 4000);
      } else {
        alert('Password updated successfully!');
      }
    });
  }
}

/**
 * 12. Setup Logout
 */
function setupLogout() {
  const logoutButtons = document.querySelectorAll('.btn-logout-action');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to log out of your PassportEase Client Portal?')) {
        localStorage.removeItem('passportease_user');
        window.location.href = 'auth.html';
      }
    });
  });
}

/**
 * Theme & RTL Managers
 */
function initThemeManager() {
  const savedTheme = localStorage.getItem('passportease_theme') || 'light';
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('passportease_theme', newTheme);
    };
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = '<i data-lucide="sun" style="width:16px;height:16px;"></i><span>Light</span>';
      btn.setAttribute('title', 'Switch to Light Theme');
    } else {
      btn.innerHTML = '<i data-lucide="moon" style="width:16px;height:16px;"></i><span>Dark</span>';
      btn.setAttribute('title', 'Switch to Dark Theme');
    }
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function initRtlManager() {
  const savedDir = localStorage.getItem('passportease_dir') || 'ltr';
  applyDirection(savedDir);

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const currentDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('passportease_dir', newDir);
    };
  });
}

function applyDirection(dir) {
  if (dir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    if (dir === 'rtl') {
      btn.innerHTML = '<span>LTR</span>';
      btn.setAttribute('title', 'Switch to LTR Direction');
    } else {
      btn.innerHTML = '<span>RTL</span>';
      btn.setAttribute('title', 'Switch to RTL Direction');
    }
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}



// Back to top button
const bttBtn = document.getElementById('backToTopBtn');
if (bttBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) bttBtn.classList.add('visible');
    else bttBtn.classList.remove('visible');
  });
  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
