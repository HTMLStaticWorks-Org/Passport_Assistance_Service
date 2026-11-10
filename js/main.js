/**
 * PASSPORTEASE - PUBLIC SCRIPT (main.js)
 * Interactions, Mobile Navigation, Application Tracker, Fee Calculator, Swiper & GSAP
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme (Dark / Light)
  initThemeManager();

  // Initialize RTL Direction Manager
  initRtlManager();

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40
    });
  }

  // Check Auth State to update public navbar
  updateNavbarAuthState();

  // Public Navbar Scroll effect
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Initialize Swiper for Testimonials
  if (document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.testimonials-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }

  // Initialize Live Fee & Timeline Calculator
  initFeeCalculator();

  // Initialize Quick Track Application Modal Logic
  initTrackModal();

  // Initialize Consultation & Enquiry Form
  initEnquiryForm();

  // Initialize Floating Back to Top Button
  initBackToTop();

  // Initialize Navbar Dropdown Handler
  initDropdownHandler();
});

/**
 * Navbar Dropdown Helper (Desktop & Mobile)
 */
function initDropdownHandler() {
  document.querySelectorAll('.navbar-nav .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const menu = toggle.nextElementSibling;
      if (menu && menu.classList.contains('dropdown-menu')) {
        menu.classList.toggle('show');
        toggle.setAttribute('aria-expanded', menu.classList.contains('show'));
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.dropdown')) {
      document.querySelectorAll('.navbar-nav .dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        const toggle = menu.previousElementSibling;
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/**
 * Update Navbar based on logged in state
 */
function updateNavbarAuthState() {
  const activeUser = localStorage.getItem('passportease_user');
  const authNavContainer = document.getElementById('navAuthActions');
  if (!authNavContainer) return;

  const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const currentDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';

  if (activeUser) {
    try {
      const user = JSON.parse(activeUser);
      authNavContainer.innerHTML = `
        <button class="btn btn-outline-secondary nav-icon-btn rtl-toggle-btn" title="${currentDir === 'rtl' ? 'Switch to LTR Direction' : 'Switch to RTL Direction'}" aria-label="Toggle RTL Direction">
          <i data-lucide="languages"></i>
        </button>
        <button class="btn btn-outline-secondary nav-icon-btn theme-toggle-btn" title="${currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}" aria-label="Toggle Theme">
          <i data-lucide="${currentTheme === 'dark' ? 'sun' : 'moon'}"></i>
        </button>
        <button class="btn btn-outline-secondary nav-icon-btn track-app-btn" data-bs-toggle="modal" data-bs-target="#trackApplicationModal" title="Track Application" aria-label="Track Application">
          <i data-lucide="crosshair"></i>
        </button>
        <a href="dashboard.html" class="btn btn-navy nav-icon-btn nav-login-btn" title="Dashboard (${user.fullName || 'Client'})" aria-label="Dashboard">
          <i data-lucide="layout-dashboard"></i>
        </a>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      attachThemeAndRtlListeners();
    } catch(e) {}
  }
}

/**
 * Theme Manager: Dark / Light Mode
 */
function initThemeManager() {
  const savedTheme = localStorage.getItem('passportease_theme') || 'light';
  applyTheme(savedTheme);
  attachThemeAndRtlListeners();
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
      btn.setAttribute('aria-label', 'Switch to Light Theme');
    } else {
      btn.innerHTML = '<i data-lucide="moon" style="width:16px;height:16px;"></i><span>Dark</span>';
      btn.setAttribute('title', 'Switch to Dark Theme');
      btn.setAttribute('aria-label', 'Switch to Dark Theme');
    }
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * RTL Direction Manager
 */
function initRtlManager() {
  const savedDir = localStorage.getItem('passportease_dir') || 'ltr';
  applyDirection(savedDir);
  attachThemeAndRtlListeners();
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
      btn.setAttribute('aria-label', 'Switch to LTR Direction');
      btn.classList.add('active');
    } else {
      btn.innerHTML = '<span>RTL</span>';
      btn.setAttribute('title', 'Switch to RTL Direction');
      btn.setAttribute('aria-label', 'Switch to RTL Direction');
      btn.classList.remove('active');
    }
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function attachThemeAndRtlListeners() {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('passportease_theme', newTheme);
    };
  });

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const currentDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('passportease_dir', newDir);
    };
  });
}

/**
 * Live Fee & Timeline Calculator Widget
 */
function initFeeCalculator() {
  const serviceSelect = document.getElementById('calcServiceType');
  const bookletSelect = document.getElementById('calcBookletType');
  const speedSelect = document.getElementById('calcSpeed');

  const govtFeeEl = document.getElementById('calcGovtFee');
  const assistFeeEl = document.getElementById('calcAssistFee');
  const totalFeeEl = document.getElementById('calcTotalFee');
  const timelineEl = document.getElementById('calcTimeline');

  if (!serviceSelect || !govtFeeEl) return;

  function calculate() {
    const service = serviceSelect.value;
    const booklet = bookletSelect ? bookletSelect.value : '36';
    const speed = speedSelect ? speedSelect.value : 'normal';

    let govt = 1500;
    let assist = 999;
    let days = '15 - 20 Business Days';

    if (service === 'renewal') {
      govt = 1500;
      assist = 999;
      days = '12 - 18 Business Days';
    } else if (service === 'tatkal') {
      govt = 3500;
      assist = 1799;
      days = '3 - 5 Business Days (Expedited)';
    } else if (service === 'minor') {
      govt = 1000;
      assist = 899;
      days = '14 - 20 Business Days';
    } else if (service === 'lost') {
      govt = 3000;
      assist = 1499;
      days = '20 - 30 Business Days';
    } else if (service === 'correction') {
      govt = 1500;
      assist = 1199;
      days = '15 - 22 Business Days';
    }

    if (booklet === '60') {
      govt += 500;
    }

    if (speed === 'tatkal' && service !== 'tatkal') {
      govt += 2000;
      assist += 800;
      days = '3 - 5 Business Days';
    }

    const total = govt + assist;

    govtFeeEl.textContent = `₹${govt.toLocaleString()}`;
    assistFeeEl.textContent = `₹${assist.toLocaleString()}`;
    totalFeeEl.textContent = `₹${total.toLocaleString()}`;
    timelineEl.textContent = days;
  }

  serviceSelect.addEventListener('change', calculate);
  if (bookletSelect) bookletSelect.addEventListener('change', calculate);
  if (speedSelect) speedSelect.addEventListener('change', calculate);

  // Initial calculation
  calculate();
}

/**
 * Public Track Application Modal Logic
 */
function initTrackModal() {
  const trackForm = document.getElementById('publicTrackForm');
  const trackResultContainer = document.getElementById('trackResultArea');
  if (!trackForm || !trackResultContainer) return;

  trackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const refInput = document.getElementById('trackRefNumber').value.trim();
    if (!refInput) return;

    // Show simulated search animation
    trackResultContainer.innerHTML = `
      <div class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Searching...</span>
        </div>
        <p class="mt-3 text-muted">Retrieving verified application records...</p>
      </div>
    `;

    setTimeout(() => {
      // Check if reference exists in localStorage or use realistic demo state
      let applications = [];
      const stored = localStorage.getItem('passportease_apps');
      if (stored) {
        try { applications = JSON.parse(stored); } catch(e) {}
      }

      let app = applications.find(a => a.ref.toLowerCase() === refInput.toLowerCase());

      // If not found in stored apps, provide a realistic simulated record
      if (!app) {
        app = {
          ref: refInput.toUpperCase(),
          name: 'Verified Applicant',
          type: 'Tatkal Priority Assistance',
          date: '04 Nov 2026',
          statusStep: 3,
          statusText: 'Appointment Assistance & Slot Confirmed',
          location: 'Regional Passport Center, Tower 3',
          caseworker: 'Senior Facilitator Rajiv Nair',
          appointmentDate: '14 Nov 2026 at 10:30 AM'
        };
      }

      const steps = [
        'Application Submitted',
        'Documents Under Review',
        'Appointment Assistance',
        'Application Processing',
        'Completed'
      ];

      const currentStep = app.statusStep || 3;
      const progressPercent = (currentStep / 5) * 100;

      trackResultContainer.innerHTML = `
        <div class="card border-0 bg-light p-3 rounded-3 mt-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span class="badge bg-primary text-white mb-1">${app.type || 'Standard Assistance'}</span>
              <h5 class="mb-0 fw-bold text-dark">${app.ref}</h5>
            </div>
            <div class="text-end">
              <span class="badge bg-success-subtle text-success border border-success">${app.statusText || 'Active Case'}</span>
              <div class="small text-muted mt-1">Submitted: ${app.date || 'Recent'}</div>
            </div>
          </div>

          <!-- Progress -->
          <div class="mb-3">
            <div class="d-flex justify-content-between small text-muted mb-1">
              <span>Overall Progress</span>
              <span class="fw-bold text-primary">${progressPercent}%</span>
            </div>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar bg-warning" role="progressbar" style="width: ${progressPercent}%;" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>

          <!-- Step Indicators -->
          <div class="d-flex justify-content-between small text-muted text-center mb-3">
            <span class="${currentStep >= 1 ? 'fw-bold text-success' : ''}">✓ Submitted</span>
            <span class="${currentStep >= 2 ? 'fw-bold text-success' : ''}">✓ Review</span>
            <span class="${currentStep >= 3 ? 'fw-bold text-primary' : ''}">● Appointment</span>
            <span class="${currentStep >= 4 ? 'fw-bold text-success' : ''}">○ Processing</span>
            <span class="${currentStep >= 5 ? 'fw-bold text-success' : ''}">○ Done</span>
          </div>

          <div class="bg-white p-3 rounded-2 border small">
            <div class="row g-2">
              <div class="col-6">
                <span class="text-muted d-block">Assigned Specialist</span>
                <strong>${app.caseworker || 'Senior Case Officer R. Nair'}</strong>
              </div>
              <div class="col-6">
                <span class="text-muted d-block">Next Milestone</span>
                <strong>${app.appointmentDate || 'Slot Confirmed: 14 Nov 2026'}</strong>
              </div>
            </div>
          </div>

          <div class="mt-3 text-center">
            <a href="dashboard.html" class="btn btn-outline-primary btn-sm w-100">Log in to Client Dashboard for Full Details</a>
          </div>
        </div>
      `;
    }, 600);
  });
}

/**
 * Consultation & Enquiry Form Handler
 */
function initEnquiryForm() {
  const enquiryForm = document.getElementById('consultationEnquiryForm');
  const alertBox = document.getElementById('enquiryFeedbackAlert');

  if (!enquiryForm) return;

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = enquiryForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Submitting...`;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      enquiryForm.reset();

      if (alertBox) {
        alertBox.className = 'alert alert-success mt-3';
        alertBox.innerHTML = `<strong>Thank you!</strong> Your assistance inquiry has been assigned to a Senior Passport Specialist. We will call you within 15 minutes.`;
        alertBox.classList.remove('d-none');
        setTimeout(() => alertBox.classList.add('d-none'), 8000);
      } else {
        alert('Thank you! Your assistance inquiry has been received. Our team will contact you within 15 minutes.');
      }
    }, 800);
  });
}



/**
 * Floating Back To Top Button
 */
function initBackToTop() {
  const bttBtn = document.getElementById('backToTopBtn');
  if (!bttBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      bttBtn.classList.add('visible');
    } else {
      bttBtn.classList.remove('visible');
    }
  });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
