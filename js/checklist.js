/**
 * PASSPORTEASE - INTERACTIVE DOCUMENTS CHECKLIST (checklist.js)
 * Real-time readiness calculation, category filters, local persistence & PDF export
 */

// Master Checklist Database
const CHECKLIST_ITEMS = [
  // 1. Identity Proof
  {
    id: 'id-aadhaar',
    category: 'identity',
    title: 'Aadhaar Card (e-Aadhaar with validated digital signature)',
    desc: 'Accepted if full 12 digits visible and address / DOB matches without discrepancies.',
    meta: 'Accepted: Color PDF or original card scan (under 2MB)',
    mandatory: true
  },
  {
    id: 'id-voter',
    category: 'identity',
    title: 'Election Commission Voter ID Card (EPIC)',
    desc: 'Must show current photograph and exact legal name. Both front and back required.',
    meta: 'Accepted: Clear scan of both sides',
    mandatory: false
  },
  {
    id: 'id-pan',
    category: 'identity',
    title: 'Permanent Account Number (PAN Card)',
    desc: 'Useful secondary identity proof for adult applicants. Signature must be clearly visible.',
    meta: 'Accepted: Laminated card scan or e-PAN',
    mandatory: false
  },
  {
    id: 'id-driving',
    category: 'identity',
    title: 'Valid Driving License',
    desc: 'Must be current (non-expired) and issued by state Transport Department.',
    meta: 'Accepted: Smart card or digitised DL',
    mandatory: false
  },

  // 2. Address Proof
  {
    id: 'addr-utility',
    category: 'address',
    title: 'Electricity / Water / Piped Gas Bill',
    desc: 'Must be dated within the last 3 months in the applicant’s or parent’s/spouse’s name.',
    meta: 'Validity: Under 90 days from application date',
    mandatory: true
  },
  {
    id: 'addr-bank',
    category: 'address',
    title: 'Scheduled Bank Passbook / Running Statement',
    desc: '1-year active bank statement with bank stamp & signature, or passbook with photo stamped.',
    meta: 'Accepted: Public / Scheduled Commercial banks',
    mandatory: true
  },
  {
    id: 'addr-rent',
    category: 'address',
    title: 'Registered Rent Agreement (if living in rented home)',
    desc: 'Must be a registered lease agreement under the Registration Act, not just notary.',
    meta: 'Condition: Mandatory if current address differs from permanent',
    mandatory: false
  },
  {
    id: 'addr-spouse',
    category: 'address',
    title: 'Spouse Passport (Copy of first & last page)',
    desc: 'Applicable if address matches spouse’s existing passport and applicant endorsement is present.',
    meta: 'Requirement: Accompanied by Marriage Certificate',
    mandatory: false
  },

  // 3. Date of Birth Proof
  {
    id: 'dob-birth-cert',
    category: 'dob',
    title: 'Official Birth Certificate from Municipal Authority / Registrar',
    desc: 'Issued by Registrar of Births & Deaths or Municipal Corporation. Mandatory for applicants born on or after 26/01/1989.',
    meta: 'Accepted: Original certified municipal copy',
    mandatory: true
  },
  {
    id: 'dob-school',
    category: 'dob',
    title: 'Matriculation / Secondary School Leaving Certificate (10th CBSE/ICSE/State)',
    desc: 'Must clearly state applicant’s full name, father’s name, and date of birth.',
    meta: 'Accepted: Original board marksheet or passing certificate',
    mandatory: false
  },
  {
    id: 'dob-policy',
    category: 'dob',
    title: 'Life Insurance Policy Bond (LIC / Recognized Insurer)',
    desc: 'Policy bond recording the date of birth of the insured applicant.',
    meta: 'Accepted: Official policy document',
    mandatory: false
  },

  // 4. New Passport Documents
  {
    id: 'new-annexure-e',
    category: 'new',
    title: 'Standard Affidavit (Annexure E Declarations)',
    desc: 'Declaration of citizenship, no pending criminal proceedings, and personal bona fides.',
    meta: 'Format: Plain paper self-declaration / notary if required',
    mandatory: true
  },
  {
    id: 'new-photo',
    category: 'new',
    title: 'Passport Size Color Photographs (4.5 cm x 3.5 cm)',
    desc: 'White background, 80% face coverage, matte or semi-matte finish, no colored glasses.',
    meta: 'Standard: ICAO compliant specification',
    mandatory: true
  },
  {
    id: 'new-non-ecr',
    category: 'new',
    title: 'Non-ECR Proof (Higher Education Degree / 10th Standard Pass)',
    desc: 'Exempts passport holder from Emigration Check Required for overseas employment.',
    meta: 'Advantage: Hassle-free international travel clearance',
    mandatory: false
  },

  // 5. Passport Renewal Documents
  {
    id: 'renew-old-passport',
    category: 'renewal',
    title: 'Old Original Passport Booklet',
    desc: 'Physical booklet must be presented at the PSK appointment for physical cancellation and return.',
    meta: 'Requirement: Self-attested copy of first 2 and last 2 pages',
    mandatory: true
  },
  {
    id: 'renew-ecr-page',
    category: 'renewal',
    title: 'Copy of Observation / ECR Page (if applicable)',
    desc: 'Photocopy of any official endorsements or observation stamps in existing passport.',
    meta: 'Verification: Mandatory if any observations were issued',
    mandatory: false
  },
  {
    id: 'renew-validity',
    category: 'renewal',
    title: 'Explanation Letter (if passport expired over 3 years ago)',
    desc: 'Notarized self-affidavit explaining the reason for delay in renewal beyond 36 months.',
    meta: 'Condition: Only required if expired > 3 years',
    mandatory: false
  },

  // 6. Minor Passport Documents
  {
    id: 'minor-parents-passports',
    category: 'minor',
    title: 'Original and Self-Attested Copies of Both Parents’ Passports',
    desc: 'If either parent holds a valid passport, spouse name must be endorsed.',
    meta: 'Requirement: Both parents’ physical presence or NOC',
    mandatory: true
  },
  {
    id: 'minor-annexure-d',
    category: 'minor',
    title: 'Annexure D (Parental Consent Declaration)',
    desc: 'Joint declaration by both parents affirming consent for minor child’s passport issuance.',
    meta: 'Form: Standard Annexure D template',
    mandatory: true
  },
  {
    id: 'minor-school-id',
    category: 'minor',
    title: 'Minor School Identity Card / Bonafide Certificate',
    desc: 'School bonafide certificate with student photograph issued on school letterhead.',
    meta: 'Accepted: Current academic year certificate',
    mandatory: false
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initChecklist();
});

function initChecklist() {
  const container = document.getElementById('checklistItemsContainer');
  const progressPercentEl = document.getElementById('checklistPercent');
  const progressBarEl = document.getElementById('checklistProgressBar');
  const countCheckedEl = document.getElementById('checkedCount');
  const countTotalEl = document.getElementById('totalCount');
  const readinessBadgeEl = document.getElementById('readinessBadge');
  const filterButtons = document.querySelectorAll('.checklist-filter-btn');
  const clearBtn = document.getElementById('clearChecklistBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');

  if (!container) return;

  // Retrieve saved states from localStorage
  let savedState = {};
  const stored = localStorage.getItem('passportease_checklist_state');
  if (stored) {
    try { savedState = JSON.parse(stored); } catch(e) {}
  }

  let activeFilter = 'all';

  function renderList() {
    container.innerHTML = '';

    const filtered = CHECKLIST_ITEMS.filter(item => {
      if (activeFilter === 'all') return true;
      return item.category === activeFilter;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-muted">No documents found for this category.</div>`;
      return;
    }

    filtered.forEach(item => {
      const isChecked = !!savedState[item.id];
      const card = document.createElement('div');
      card.className = `checklist-item-card ${isChecked ? 'checked' : ''}`;
      card.dataset.id = item.id;
      card.dataset.category = item.category;

      card.innerHTML = `
        <div class="custom-checkbox" role="checkbox" aria-checked="${isChecked}" tabindex="0">
          <i data-lucide="${isChecked ? 'check' : ''}" style="width:16px;height:16px;"></i>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
            <span class="check-item-title mb-0">${item.title}</span>
            ${item.mandatory ? '<span class="badge bg-danger-subtle text-danger border border-danger-subtle small" style="font-size:0.65rem;">Mandatory</span>' : '<span class="badge bg-secondary-subtle text-secondary small" style="font-size:0.65rem;">Optional / Supporting</span>'}
          </div>
          <p class="check-item-sub">${item.desc}</p>
          <div class="check-item-meta">
            <i data-lucide="info" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>
            ${item.meta}
          </div>
        </div>
      `;

      // Event listener for toggle
      card.addEventListener('click', (e) => {
        toggleItem(item.id);
      });

      container.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    updateProgress();
  }

  function toggleItem(id) {
    savedState[id] = !savedState[id];
    localStorage.setItem('passportease_checklist_state', JSON.stringify(savedState));
    renderList();
  }

  function updateProgress() {
    const total = CHECKLIST_ITEMS.length;
    let checkedCount = 0;

    CHECKLIST_ITEMS.forEach(it => {
      if (savedState[it.id]) checkedCount++;
    });

    const percent = Math.round((checkedCount / total) * 100);

    if (progressPercentEl) progressPercentEl.textContent = `${percent}%`;
    if (progressBarEl) {
      progressBarEl.style.width = `${percent}%`;
      progressBarEl.setAttribute('aria-valuenow', percent);
    }
    if (countCheckedEl) countCheckedEl.textContent = checkedCount;
    if (countTotalEl) countTotalEl.textContent = total;

    if (readinessBadgeEl) {
      if (percent < 30) {
        readinessBadgeEl.textContent = 'Getting Started';
        readinessBadgeEl.className = 'badge bg-secondary text-white';
      } else if (percent < 70) {
        readinessBadgeEl.textContent = 'Partially Ready';
        readinessBadgeEl.className = 'badge bg-warning text-dark';
      } else if (percent < 100) {
        readinessBadgeEl.textContent = 'Almost Ready!';
        readinessBadgeEl.className = 'badge bg-info text-white';
      } else {
        readinessBadgeEl.textContent = '100% Ready for Verification!';
        readinessBadgeEl.className = 'badge bg-success text-white';
      }
    }
  }

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter || 'all';
      renderList();
    });
  });

  // Clear All
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all checklist marks?')) {
        savedState = {};
        localStorage.removeItem('passportease_checklist_state');
        renderList();
      }
    });
  }

  // Select All
  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      CHECKLIST_ITEMS.forEach(it => {
        savedState[it.id] = true;
      });
      localStorage.setItem('passportease_checklist_state', JSON.stringify(savedState));
      renderList();
    });
  }

  // Download PDF / Print
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Initial render
  renderList();
}

