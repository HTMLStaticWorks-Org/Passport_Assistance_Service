/**
 * PASSPORTEASE - AUTHENTICATION SCRIPT (auth.js)
 * Login, Registration, OTP Verification Modal, Session Management & Validations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved Theme and RTL Direction
  const savedTheme = localStorage.getItem('passportease_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const savedDir = localStorage.getItem('passportease_dir') || 'ltr';
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  } else {
    document.documentElement.removeAttribute('dir');
    document.documentElement.setAttribute('lang', 'en');
  }

  // Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  
    // Setup Theme & RTL toggles on auth page
  function setupAuthToggles() {
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');

    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        if (nextTheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('passportease_theme', 'dark');
          btn.innerHTML = '<i data-lucide="sun" style="width:16px;height:16px;"></i><span>Light</span>';
        } else {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('passportease_theme', 'light');
          btn.innerHTML = '<i data-lucide="moon" style="width:16px;height:16px;"></i><span>Dark</span>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    });

    rtlBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
        const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        if (nextDir === 'rtl') {
          document.documentElement.setAttribute('dir', 'rtl');
          document.documentElement.setAttribute('lang', 'ar');
          localStorage.setItem('passportease_dir', 'rtl');
          btn.innerHTML = '<span>LTR</span>';
        } else {
          document.documentElement.removeAttribute('dir');
          document.documentElement.setAttribute('lang', 'en');
          localStorage.setItem('passportease_dir', 'ltr');
          btn.innerHTML = '<span>RTL</span>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    });

    // Update initial button text & icons
    const currentTheme = localStorage.getItem('passportease_theme') || 'light';
    themeBtns.forEach(btn => {
      btn.innerHTML = currentTheme === 'dark' ? '<i data-lucide="sun" style="width:16px;height:16px;"></i><span>Light</span>' : '<i data-lucide="moon" style="width:16px;height:16px;"></i><span>Dark</span>';
    });
    const currentDir = localStorage.getItem('passportease_dir') || 'ltr';
    rtlBtns.forEach(btn => {
      btn.innerHTML = currentDir === 'rtl' ? '<span>LTR</span>' : '<span>RTL</span>';
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
  setupAuthToggles();

  const tabLogin = document.getElementById('tabLoginBtn');
  const tabRegister = document.getElementById('tabRegisterBtn');
  const loginFormContainer = document.getElementById('loginFormContainer');
  const registerFormContainer = document.getElementById('registerFormContainer');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const quickDemoBtn = document.getElementById('quickDemoLoginBtn');

  // Password visibility toggles
  document.querySelectorAll('.toggle-password-visibility').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = `<i data-lucide="eye-off" style="width:18px;height:18px;"></i>`;
        } else {
          input.type = 'password';
          btn.innerHTML = `<i data-lucide="eye" style="width:18px;height:18px;"></i>`;
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  });

  // Tab switching
  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginFormContainer.classList.remove('d-none');
      registerFormContainer.classList.add('d-none');
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerFormContainer.classList.remove('d-none');
      loginFormContainer.classList.add('d-none');
    });
  }

  // Quick Demo Login Button for instant reviewer experience
  if (quickDemoBtn) {
    quickDemoBtn.addEventListener('click', () => {
      document.getElementById('loginIdentifier').value = 'client.demo@passportease.in';
      document.getElementById('loginPassword').value = 'Passport@2026';
      handleLoginSuccess({
        fullName: 'Aarav Sharma',
        email: 'client.demo@passportease.in',
        phone: '+91 98765 43210'
      });
    });
  }

  // Social Media Authentication Buttons (Demo OAuth Simulation)
  document.querySelectorAll('.auth-social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.dataset.provider || 'Social';
      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span><span>Connecting...</span>`;

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        handleLoginSuccess({
          fullName: `Aarav Sharma (${provider})`,
          email: `client.${provider.toLowerCase()}@passportease.in`,
          phone: '+91 98765 43210'
        });
      }, 500);
    });
  });

  // Handle Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = document.getElementById('loginIdentifier').value.trim();
      const password = document.getElementById('loginPassword').value;
      const feedback = document.getElementById('authFeedback');

      if (!identifier || !password) {
        showFeedback(feedback, 'Please enter your email/phone and password.', 'danger');
        return;
      }

      if (password.length < 6) {
        showFeedback(feedback, 'Password must be at least 6 characters.', 'danger');
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Authenticating...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        handleLoginSuccess({
          fullName: identifier.includes('@') ? identifier.split('@')[0].replace('.', ' ').toUpperCase() : 'Client Account',
          email: identifier.includes('@') ? identifier : `${identifier}@demo.in`,
          phone: identifier.includes('@') ? '+91 98765 43210' : identifier
        });
      }, 700);
    });
  }

  // Handle Registration Form Submission -> Triggers OTP Modal
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regFullName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;
      const feedback = document.getElementById('regFeedback');

      // Validations
      if (!name || !email || !phone || !password) {
        showFeedback(feedback, 'Please fill in all required fields.', 'danger');
        return;
      }

      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showFeedback(feedback, 'Please enter a valid email address.', 'danger');
        return;
      }

      if (phone.replace(/\D/g, '').length < 10) {
        showFeedback(feedback, 'Please enter a valid 10-digit mobile number.', 'danger');
        return;
      }

      if (password !== confirmPassword) {
        showFeedback(feedback, 'Passwords do not match. Please re-enter.', 'danger');
        return;
      }

      if (password.length < 6) {
        showFeedback(feedback, 'Password must be at least 6 characters.', 'danger');
        return;
      }

      // Store temporary pending registration
      window.pendingRegistration = {
        fullName: name,
        email: email,
        phone: phone
      };

      // Open OTP Verification Modal
      const otpModal = new bootstrap.Modal(document.getElementById('otpVerifyModal'));
      document.getElementById('otpRecipientNotice').textContent = phone;
      startOtpTimer();
      otpModal.show();
    });
  }

  // Handle OTP Verification Submission
  const otpVerifyBtn = document.getElementById('btnSubmitOtp');
  if (otpVerifyBtn) {
    otpVerifyBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.otp-digit-input');
      let enteredOtp = '';
      inputs.forEach(input => enteredOtp += input.value.trim());

      const otpFeedback = document.getElementById('otpFeedback');

      if (enteredOtp.length < 4) {
        showFeedback(otpFeedback, 'Please enter the 4-digit verification code.', 'danger');
        return;
      }

      otpVerifyBtn.disabled = true;
      otpVerifyBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Verifying...`;

      setTimeout(() => {
        // Any 4 digit code is accepted in demonstration mode
        const userData = window.pendingRegistration || {
          fullName: 'New Registered Client',
          email: 'applicant@passportease.in',
          phone: '+91 98765 43210'
        };

        const modalEl = document.getElementById('otpVerifyModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        handleLoginSuccess(userData);
      }, 800);
    });
  }

  // OTP Inputs Auto-advance
  const otpInputs = document.querySelectorAll('.otp-digit-input');
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
});

let otpTimerInterval = null;
function startOtpTimer() {
  let seconds = 59;
  const timerEl = document.getElementById('otpTimer');
  const resendBtn = document.getElementById('btnResendOtp');
  if (!timerEl) return;

  if (resendBtn) resendBtn.disabled = true;
  clearInterval(otpTimerInterval);

  otpTimerInterval = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
      timerEl.textContent = '00:00';
      if (resendBtn) resendBtn.disabled = false;
    } else {
      const secStr = seconds < 10 ? `0${seconds}` : seconds;
      timerEl.textContent = `00:${secStr}`;
      seconds--;
    }
  }, 1000);
}

function handleLoginSuccess(userProfile) {
  // Store user in localStorage (purely for demonstration authentication session)
  const sessionUser = {
    fullName: userProfile.fullName || 'Demo Client',
    email: userProfile.email || 'client@passportease.in',
    phone: userProfile.phone || '+91 98765 43210',
    loggedInAt: new Date().toISOString()
  };
  localStorage.setItem('passportease_user', JSON.stringify(sessionUser));

  // If applications don't exist yet in localStorage, populate starter mock data
  initStarterApplications(sessionUser.fullName);

  // Redirect to Client Dashboard
  window.location.href = 'dashboard.html';
}

function initStarterApplications(userName) {
  const existing = localStorage.getItem('passportease_apps');
  if (!existing) {
    const starterApps = [
      {
        id: 'app-1',
        ref: 'PE-2026-98421',
        applicantName: userName || 'Aarav Sharma',
        type: 'Passport Renewal (36 Pages)',
        serviceCategory: 'renewal',
        submissionDate: '02 Nov 2026',
        statusStep: 3, // Step 3: Appointment Assistance
        statusBadge: 'Appointment Assistance',
        badgeColor: 'primary',
        location: 'Regional Passport Seva Kendra (PSK Central)',
        appointmentDate: '16 Nov 2026 at 10:30 AM',
        caseworker: 'Senior Facilitator Rajiv Nair',
        documentsCount: 4,
        notes: 'Pre-verification completed with zero discrepancies. Appointment slot confirmed at PSK Central.'
      },
      {
        id: 'app-2',
        ref: 'PE-2026-44102',
        applicantName: `${userName ? userName.split(' ')[0] : 'Priya'} (Family Minor)`,
        type: 'Minor Fresh Passport Application',
        serviceCategory: 'minor',
        submissionDate: '05 Nov 2026',
        statusStep: 2, // Step 2: Documents Under Review
        statusBadge: 'Documents Under Review',
        badgeColor: 'warning',
        location: 'Passport Seva Camp Office',
        appointmentDate: 'Pending Document Approval',
        caseworker: 'Legal Documentation Specialist Anita Rao',
        documentsCount: 3,
        notes: 'Annexure D consent affidavit uploaded. Awaiting clear birth certificate scan review.'
      }
    ];
    localStorage.setItem('passportease_apps', JSON.stringify(starterApps));
  }
}

function showFeedback(el, message, type) {
  if (!el) return;
  el.className = `alert alert-${type} mt-3 py-2 small`;
  el.textContent = message;
  el.classList.remove('d-none');
  setTimeout(() => {
    el.classList.add('d-none');
  }, 5000);
}

