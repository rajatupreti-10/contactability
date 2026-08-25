/**
 * IndiGo Redesign Script - Passenger Details Flow
 * Handles multiple scenarios (single, double, triple pax for both guest and logged-in).
 */

// Global State
let currentFlow = 'guest'; // 'guest' or 'logged-in'
let currentPaxCount = 3;  // 1, 2, or 3

// Mock Data for Logged-In
const SAVED_PASSENGERS = {
    'john-doe': {
        id: 'john-doe',
        name: 'John Doe',
        relationship: 'You',
        gender: 'Male',
        dob: '1990-04-12',
        mobile: '9876543210',
        email: 'john.doe@gmail.com',
        countryCode: '+91'
    },
    'kim-doe': {
        id: 'kim-doe',
        name: 'Kim Doe',
        relationship: 'Nominee',
        gender: 'Female',
        dob: '1995-11-20',
        mobile: '', // Blank to trigger missing contact details error state
        email: '',
        countryCode: '+91'
    },
    'nancy-doe': {
        id: 'nancy-doe',
        name: 'Nancy Doe',
        relationship: 'Nominee',
        gender: 'Female',
        dob: '1998-07-05',
        mobile: '',
        email: '',
        countryCode: '+91'
    }
};

const COUNTRY_CODES = [
    { code: '+91', flag: '🇮🇳' },
    { code: '+1', flag: '🇺🇸' },
    { code: '+44', flag: '🇬🇧' },
    { code: '+65', flag: '🇸🇬' },
    { code: '+971', flag: '🇦🇪' }
];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Flow Selection Tabs (Guest vs Logged In)
    const btnGuestFlow = document.getElementById('flow-guest');
    const btnLoggedFlow = document.getElementById('flow-logged');
    
    // Passenger Count Pills
    const countPills = document.querySelectorAll('.count-pill');

    if (btnGuestFlow && btnLoggedFlow) {
        btnGuestFlow.addEventListener('click', () => {
            currentFlow = 'guest';
            btnGuestFlow.classList.add('active');
            btnLoggedFlow.classList.remove('active');
            renderWorkspace();
        });

        btnLoggedFlow.addEventListener('click', () => {
            currentFlow = 'logged-in';
            btnLoggedFlow.classList.add('active');
            btnGuestFlow.classList.remove('active');
            renderWorkspace();
        });
    }

    countPills.forEach(pill => {
        pill.addEventListener('click', () => {
            countPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentPaxCount = parseInt(pill.getAttribute('data-count'), 10);
            renderWorkspace();
        });
    });

    // Initial render
    renderWorkspace();
}

/**
 * Renders the main work area based on flow and passenger count
 */
function renderWorkspace() {
    const dynamicContainer = document.getElementById('dynamic-passenger-container');
    if (!dynamicContainer) return;

    dynamicContainer.innerHTML = '';

    if (currentFlow === 'guest') {
        renderGuestFlow(dynamicContainer);
    } else {
        renderLoggedInFlow(dynamicContainer);
    }

    bindInteractions();
    updateSidebarSummary();
}

/**
 * Render Anonymous Guest Flow (1, 2, or 3 Pax)
 */
function renderGuestFlow(container) {
    const mainHeader = document.getElementById('main-flow-header');
    if (mainHeader) {
        mainHeader.innerHTML = `
            <h1>Enter passenger details</h1>
            <p class="subtext">Login to book with your saved details</p>
            <div class="important-notice">
                <i class="fa-solid fa-circle-info"></i> 
                <strong>Important:</strong> For International Travel and Foreign Nationals travelling within India, enter your name exactly as shown on your Passport or Travel Document.
            </div>
        `;
    }

    for (let i = 1; i <= currentPaxCount; i++) {
        const isCollapsed = i > 1;
        const showContactDetails = i <= 2; // Capture contact details for max 2 passengers

        const card = document.createElement('div');
        card.className = `pax-card ${isCollapsed ? 'collapsed' : ''}`;
        card.id = `guest-pax-card-${i}`;

        card.innerHTML = `
            <div class="pax-card-header" data-pax-index="${i}">
                <div class="pax-title-container">
                    <span class="pax-main-title">
                        <i class="fa-solid fa-user-pen"></i>
                        Adult ${i}
                        <span class="pax-subtitle" style="margin-left: 8px; font-weight: normal;">Passenger ${i}</span>
                    </span>
                </div>
                <div class="pax-toggle-icon">
                    <i class="fa-solid fa-angle-up"></i>
                </div>
            </div>
            <div class="pax-card-body">
                <!-- Gender Selection -->
                <div class="gender-selection">
                    <span>Gender:</span>
                    <label class="radio-container">
                        <input type="radio" name="guest-gender-${i}" value="Male" checked>
                        <span class="custom-radio"></span>
                        Male
                    </label>
                    <label class="radio-container">
                        <input type="radio" name="guest-gender-${i}" value="Female">
                        <span class="custom-radio"></span>
                        Female
                    </label>
                </div>

                <!-- Form Fields -->
                <div class="form-grid">
                    <div class="form-group">
                        <input type="text" class="form-input" id="guest-first-name-${i}" placeholder=" " required>
                        <label class="form-label" for="guest-first-name-${i}">First And Middle Name</label>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" id="guest-last-name-${i}" placeholder=" " required>
                        <label class="form-label" for="guest-last-name-${i}">Last Name</label>
                    </div>
                    <div class="form-group full-width">
                        <input type="text" class="form-input" id="guest-dob-${i}" placeholder=" " data-type="dob">
                        <label class="form-label" for="guest-dob-${i}">Date Of Birth (Optional)</label>
                        <div class="dob-hint">* Please enter date of birth in (DD-MM-YYYY) format i.e. 25-04-1998</div>
                    </div>
                </div>

                <!-- Contact Details Section (Up to 2 passengers) - Placed directly below DOB -->
                ${showContactDetails ? `
                <div class="contact-section">
                    <div class="contact-section-header" style="flex-direction: row; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <span class="contact-section-title">Contact details</span>
                            <span class="contact-section-subtext">The flyer must have access to the mobile number for updates.</span>
                        </div>
                        ${i === 1 && currentPaxCount > 1 ? `
                            <div class="copy-details-checkbox-container">
                                <label class="checkbox-container">
                                    <input type="checkbox" id="chk-copy-contact">
                                    <span class="custom-checkbox-label">Copy Mobile Number and Email for all passengers</span>
                                </label>
                            </div>
                        ` : ''}
                    </div>
                    <div class="contact-form-grid">
                        <div class="country-dropdown-container country-group">
                            <div class="country-select-wrapper">
                                <select class="country-select" id="guest-country-${i}">
                                    ${COUNTRY_CODES.map(cc => `<option value="${cc.code}">${cc.flag} ${cc.code}</option>`).join('')}
                                </select>
                                <span class="dropdown-arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="tel" class="form-input mobile-input" id="guest-mobile-${i}" placeholder=" " required>
                            <label class="form-label" for="guest-mobile-${i}">Flyer's primary mobile number</label>
                        </div>
                        <div class="form-group email-group">
                            <input type="email" class="form-input email-input" id="guest-email-${i}" placeholder=" " required>
                            <label class="form-label" for="guest-email-${i}">Email Id</label>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Custom Extras (Placed below Contact Details) -->
                <div class="sec-accordion-btn" style="margin-top: 10px;">
                    <span>Special Assistance</span>
                    <i class="fa-solid fa-circle-plus"></i>
                </div>
                <div class="sec-accordion-btn">
                    <span>Add X Airline Loyalty ID</span>
                    <i class="fa-solid fa-circle-plus"></i>
                </div>
            </div>
        `;
        container.appendChild(card);
    }

    // Citizenship Checkbox Section
    const citizenshipCard = document.createElement('div');
    citizenshipCard.className = 'citizenship-container';
    citizenshipCard.innerHTML = `
        <span class="citizenship-text">Are there any passengers EU citizens aged 12-15 years, or Indian/Non-EU citizens aged 12-17 years?</span>
        <div class="citizenship-options">
            <label class="radio-container">
                <input type="radio" name="eu-citizenship" value="Yes">
                <span class="custom-radio"></span>
                Yes
            </label>
            <label class="radio-container">
                <input type="radio" name="eu-citizenship" value="No" checked>
                <span class="custom-radio"></span>
                No
            </label>
        </div>
    `;
    container.appendChild(citizenshipCard);
}

/**
 * Render Logged-In Flow (1, 2, or 3 Pax with Doe family)
 */
function renderLoggedInFlow(container) {
    const mainHeader = document.getElementById('main-flow-header');
    if (mainHeader) {
        mainHeader.innerHTML = `
            <h1>Enter passenger details</h1>
            <p class="subtext">Configure details for saved flyers on this booking</p>
            <div class="important-notice">
                <i class="fa-solid fa-circle-info"></i> 
                <strong>Important:</strong> Ensure names match Government-issued ID card exactly.
            </div>
        `;
    }

    // Saved Passengers list to display in choice grid
    const listHtml = [];
    
    // John Doe (You) - always present
    listHtml.push(`
        <div class="saved-pax-item selected" data-pax-id="john-doe">
            <div class="saved-pax-info">
                <div class="saved-pax-avatar">JD</div>
                <div>
                    <div class="saved-pax-name">John Doe</div>
                    <div class="saved-pax-role">You</div>
                </div>
            </div>
            <div class="saved-pax-checkbox"><i class="fa-solid fa-check"></i></div>
        </div>
    `);

    // Kim Doe (Nominee) - present if pax >= 2
    if (currentPaxCount >= 2) {
        listHtml.push(`
            <div class="saved-pax-item selected" data-pax-id="kim-doe">
                <div class="saved-pax-info">
                    <div class="saved-pax-avatar">KD</div>
                    <div>
                        <div class="saved-pax-name">Kim Doe</div>
                        <div class="saved-pax-role">Nominee</div>
                    </div>
                </div>
                <div class="saved-pax-checkbox"><i class="fa-solid fa-check"></i></div>
            </div>
        `);
    }

    // Nancy Doe (Nominee) - present if pax >= 3
    if (currentPaxCount >= 3) {
        listHtml.push(`
            <div class="saved-pax-item selected" data-pax-id="nancy-doe">
                <div class="saved-pax-info">
                    <div class="saved-pax-avatar">ND</div>
                    <div>
                        <div class="saved-pax-name">Nancy Doe</div>
                        <div class="saved-pax-role">Nominee</div>
                    </div>
                </div>
                <div class="saved-pax-checkbox"><i class="fa-solid fa-check"></i></div>
            </div>
        `);
    }

    const savedListCard = document.createElement('div');
    savedListCard.className = 'saved-list-card';
    savedListCard.innerHTML = `
        <div class="saved-list-title">Choose from saved list</div>
        <div class="saved-list-grid" style="grid-template-columns: repeat(${currentPaxCount === 1 ? 1 : (currentPaxCount === 2 ? 2 : 3)}, 1fr);">
            ${listHtml.join('')}
        </div>
    `;
    container.appendChild(savedListCard);

    // Card 1: John Doe (Pre-filled and Valid)
    const card1 = document.createElement('div');
    card1.className = 'pax-card collapsed';
    card1.id = 'logged-pax-card-1';
    card1.innerHTML = `
        <div class="pax-card-header" data-pax-index="1">
            <div class="pax-title-container">
                <span class="pax-main-title">
                    John Doe
                    <span class="pax-saved-badge">Saved Profile</span>
                </span>
                <span class="pax-subtitle">Adult | Male | 36 Years</span>
            </div>
            <div class="pax-toggle-icon"><i class="fa-solid fa-angle-up"></i></div>
        </div>
        <div class="pax-card-body">
            <div class="gender-selection">
                <span>Gender:</span>
                <label class="radio-container">
                    <input type="radio" name="logged-gender-1" value="Male" checked disabled>
                    <span class="custom-radio"></span> Male
                </label>
                <label class="radio-container">
                    <input type="radio" name="logged-gender-1" value="Female" disabled>
                    <span class="custom-radio"></span> Female
                </label>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <input type="text" class="form-input" id="logged-first-name-1" value="John" readonly>
                    <label class="form-label" for="logged-first-name-1">First And Middle Name</label>
                </div>
                <div class="form-group">
                    <input type="text" class="form-input" id="logged-last-name-1" value="Doe" readonly>
                    <label class="form-label" for="logged-last-name-1">Last Name</label>
                </div>
                <div class="form-group full-width">
                    <input type="text" class="form-input" id="logged-dob-1" value="12-04-1990" readonly>
                    <label class="form-label" for="logged-dob-1">Date Of Birth</label>
                </div>
            </div>

            <!-- Contact Details placed below DOB -->
            <div class="contact-section">
                <div class="contact-section-header" style="flex-direction: row; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <span class="contact-section-title">Contact details</span>
                        <span class="contact-section-subtext">Verified primary mobile and email for travel updates.</span>
                    </div>
                    ${currentPaxCount > 1 ? `
                        <div class="copy-details-checkbox-container">
                            <label class="checkbox-container">
                                <input type="checkbox" id="chk-logged-copy-contact">
                                <span class="custom-checkbox-label">Copy Mobile Number and Email for all passengers</span>
                            </label>
                        </div>
                    ` : ''}
                </div>
                <div class="contact-form-grid">
                    <div class="country-dropdown-container country-group">
                        <div class="country-select-wrapper">
                            <select class="country-select" id="logged-country-1" disabled>
                                <option value="+91">🇮🇳 +91</option>
                            </select>
                            <span class="dropdown-arrow"><i class="fa-solid fa-chevron-down"></i></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="tel" class="form-input" id="logged-mobile-1" value="9876543210" readonly>
                        <label class="form-label" for="logged-mobile-1">Flyer's primary mobile number</label>
                    </div>
                    <div class="form-group email-group">
                        <input type="email" class="form-input" id="logged-email-1" value="john.doe@gmail.com" readonly>
                        <label class="form-label" for="logged-email-1">Email Id</label>
                    </div>
                </div>
            </div>

            <!-- Custom Extras -->
            <div class="sec-accordion-btn" style="margin-top: 10px;">
                <span>Special Assistance</span>
                <i class="fa-solid fa-circle-plus"></i>
            </div>
            <div class="sec-accordion-btn">
                <span>Add X Airline Loyalty ID</span>
                <i class="fa-solid fa-circle-plus"></i>
            </div>
        </div>
    `;
    container.appendChild(card1);

    // Card 2: Kim Doe (ERROR STATE: Missing contact details)
    if (currentPaxCount >= 2) {
        const card2 = document.createElement('div');
        card2.className = 'pax-card error-card'; // Expanded and highlighted by default
        card2.id = 'logged-pax-card-2';
        card2.innerHTML = `
            <div class="pax-card-header" data-pax-index="2">
                <div class="pax-title-container">
                    <span class="pax-main-title">
                        Kim Doe
                        <span class="pax-saved-badge">Saved Profile</span>
                    </span>
                    <span class="pax-subtitle">Nominee | Adult | Female | 30 Years</span>
                </div>
                <div class="pax-toggle-icon"><i class="fa-solid fa-angle-up"></i></div>
            </div>
            <div class="pax-card-body">
                <div class="gender-selection">
                    <span>Gender:</span>
                    <label class="radio-container">
                        <input type="radio" name="logged-gender-2" value="Male" disabled>
                        <span class="custom-radio"></span> Male
                    </label>
                    <label class="radio-container">
                        <input type="radio" name="logged-gender-2" value="Female" checked disabled>
                        <span class="custom-radio"></span> Female
                    </label>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <input type="text" class="form-input" id="logged-first-name-2" value="Kim" readonly>
                        <label class="form-label" for="logged-first-name-2">First And Middle Name</label>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" id="logged-last-name-2" value="Doe" readonly>
                        <label class="form-label" for="logged-last-name-2">Last Name</label>
                    </div>
                    <div class="form-group full-width">
                        <input type="text" class="form-input" id="logged-dob-2" value="20-11-1995" readonly>
                        <label class="form-label" for="logged-dob-2">Date Of Birth</label>
                    </div>
                </div>

                <!-- Contact Details in Error State placed below DOB -->
                <div class="contact-section">
                    <div class="contact-section-header">
                        <span class="contact-section-title">Contact details</span>
                        <span class="contact-section-subtext">The flyer must have access to the mobile number submitted below for mandatory travel updates.</span>
                    </div>
                    <div class="contact-form-grid">
                        <div class="country-dropdown-container country-group">
                            <div class="country-select-wrapper">
                                <select class="country-select" id="logged-country-2">
                                    ${COUNTRY_CODES.map(cc => `<option value="${cc.code}">${cc.flag} ${cc.code}</option>`).join('')}
                                </select>
                                <span class="dropdown-arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="tel" class="form-input mobile-input error" id="logged-mobile-2" placeholder=" " required>
                            <label class="form-label" for="logged-mobile-2">Flyer's primary mobile number</label>
                            <div class="error-message" id="err-mobile-2">
                                <i class="fa-solid fa-circle-exclamation"></i> Mobile number is required for travel updates
                            </div>
                        </div>
                        <div class="form-group email-group">
                            <input type="email" class="form-input email-input error" id="logged-email-2" placeholder=" " required>
                            <label class="form-label" for="logged-email-2">Email Id</label>
                            <div class="error-message" id="err-email-2">
                                <i class="fa-solid fa-circle-exclamation"></i> Email ID is required
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Custom Extras -->
                <div class="sec-accordion-btn" style="margin-top: 10px;">
                    <span>Special Assistance</span>
                    <i class="fa-solid fa-circle-plus"></i>
                </div>
                <div class="sec-accordion-btn">
                    <span>Add X Airline Loyalty ID</span>
                    <i class="fa-solid fa-circle-plus"></i>
                </div>
            </div>
        `;
        container.appendChild(card2);
    }

    // Card 3: Nancy Doe (Standard Fields Only - No contact details captured because max 2)
    if (currentPaxCount >= 3) {
        const card3 = document.createElement('div');
        card3.className = 'pax-card collapsed';
        card3.id = 'logged-pax-card-3';
        card3.innerHTML = `
            <div class="pax-card-header" data-pax-index="3">
                <div class="pax-title-container">
                    <span class="pax-main-title">
                        Nancy Doe
                        <span class="pax-saved-badge">Saved Profile</span>
                    </span>
                    <span class="pax-subtitle">Nominee | Adult | Female | 28 Years</span>
                </div>
                <div class="pax-toggle-icon"><i class="fa-solid fa-angle-up"></i></div>
            </div>
            <div class="pax-card-body">
                <div class="gender-selection">
                    <span>Gender:</span>
                    <label class="radio-container">
                        <input type="radio" name="logged-gender-3" value="Male" disabled>
                        <span class="custom-radio"></span> Male
                    </label>
                    <label class="radio-container">
                        <input type="radio" name="logged-gender-3" value="Female" checked disabled>
                        <span class="custom-radio"></span> Female
                    </label>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <input type="text" class="form-input" id="logged-first-name-3" value="Nancy" readonly>
                        <label class="form-label" for="logged-first-name-3">First And Middle Name</label>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" id="logged-last-name-3" value="Doe" readonly>
                        <label class="form-label" for="logged-last-name-3">Last Name</label>
                    </div>
                    <div class="form-group full-width">
                        <input type="text" class="form-input" id="logged-dob-3" value="05-07-1998" readonly>
                        <label class="form-label" for="logged-dob-3">Date Of Birth</label>
                    </div>
                </div>

                <!-- Custom Extras -->
                <div class="sec-accordion-btn" style="margin-top: 10px;">
                    <span>Special Assistance</span>
                    <i class="fa-solid fa-circle-plus"></i>
                </div>
                <div class="sec-accordion-btn">
                    <span>Add X Airline Loyalty ID</span>
                    <i class="fa-solid fa-circle-plus"></i>
                </div>
            </div>
        `;
        container.appendChild(card3);
    }
}

/**
 * Bind DOM Interactions
 */
function bindInteractions() {
    // Accordion headers
    const headers = document.querySelectorAll('.pax-card-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.pax-card');
            if (card) {
                card.classList.toggle('collapsed');
            }
        });
    });

    // Reactive error clearing on typing
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.remove('error');
                const errMessage = input.parentElement.querySelector('.error-message');
                if (errMessage) {
                    errMessage.style.display = 'none';
                }

                // If card has no active errors, clear card red border
                const card = input.closest('.pax-card');
                if (card && card.classList.contains('error-card')) {
                    const remainingErrors = card.querySelectorAll('.form-input.error');
                    let activeErrors = 0;
                    remainingErrors.forEach(errInp => {
                        const errText = errInp.parentElement.querySelector('.error-message');
                        if (errText && errText.style.display !== 'none') {
                            activeErrors++;
                        }
                    });
                    if (activeErrors === 0) {
                        card.classList.remove('error-card');
                    }
                }
            }
        });
    });

    // --- Guest Flow Copy Details Checkbox Logic ---
    const chkCopyContact = document.getElementById('chk-copy-contact');
    if (chkCopyContact) {
        chkCopyContact.addEventListener('change', () => {
            syncGuestContactDetails();
        });

        // Add listeners to Passenger 1 fields to copy in real-time when checked
        const mob1 = document.getElementById('guest-mobile-1');
        const email1 = document.getElementById('guest-email-1');
        const country1 = document.getElementById('guest-country-1');

        if (mob1) mob1.addEventListener('input', syncGuestContactDetails);
        if (email1) email1.addEventListener('input', syncGuestContactDetails);
        if (country1) country1.addEventListener('change', syncGuestContactDetails);

        // If Passenger 2 fields are manually edited, uncheck the box
        const mob2 = document.getElementById('guest-mobile-2');
        const email2 = document.getElementById('guest-email-2');
        
        if (mob2) {
            mob2.addEventListener('input', () => {
                if (chkCopyContact.checked) {
                    chkCopyContact.checked = false;
                }
            });
        }
        if (email2) {
            email2.addEventListener('input', () => {
                if (chkCopyContact.checked) {
                    chkCopyContact.checked = false;
                }
            });
        }
    }

    // --- Logged-In Flow Copy Details Checkbox Logic ---
    const chkLoggedCopyContact = document.getElementById('chk-logged-copy-contact');
    if (chkLoggedCopyContact) {
        chkLoggedCopyContact.addEventListener('change', () => {
            syncLoggedContactDetails();
        });

        // If Passenger 2 fields are manually edited, uncheck the box
        const mob2 = document.getElementById('logged-mobile-2');
        const email2 = document.getElementById('logged-email-2');
        
        if (mob2) {
            mob2.addEventListener('input', () => {
                if (chkLoggedCopyContact.checked) {
                    chkLoggedCopyContact.checked = false;
                }
            });
        }
        if (email2) {
            email2.addEventListener('input', () => {
                if (chkLoggedCopyContact.checked) {
                    chkLoggedCopyContact.checked = false;
                }
            });
        }
    }

    // Side summary toggle
    const sbHeader = document.querySelector('.flight-summary-header');
    if (sbHeader) {
        sbHeader.addEventListener('click', () => {
            const sbBody = document.querySelector('.flight-summary-body');
            const icon = sbHeader.querySelector('i');
            if (sbBody) {
                if (sbBody.style.display === 'none') {
                    sbBody.style.display = 'flex';
                    icon.className = 'fa-solid fa-chevron-up';
                } else {
                    sbBody.style.display = 'none';
                    icon.className = 'fa-solid fa-chevron-down';
                }
            }
        });
    }

    // Validation handler on Next
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            validateAndProceed();
        });
    }
}

/**
 * Synchronize Guest Flow Passenger 1 Details to Passenger 2
 */
function syncGuestContactDetails() {
    const checkbox = document.getElementById('chk-copy-contact');
    if (!checkbox || !checkbox.checked) return;

    const mob1 = document.getElementById('guest-mobile-1');
    const email1 = document.getElementById('guest-email-1');
    const country1 = document.getElementById('guest-country-1');

    const mob2 = document.getElementById('guest-mobile-2');
    const email2 = document.getElementById('guest-email-2');
    const country2 = document.getElementById('guest-country-2');

    if (mob1 && mob2) {
        mob2.value = mob1.value;
        mob2.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (email1 && email2) {
        email2.value = email1.value;
        email2.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (country1 && country2) {
        country2.value = country1.value;
    }

    // Expand Pax 2 card for visual feedback of success
    const card2 = document.getElementById('guest-pax-card-2');
    if (card2 && card2.classList.contains('collapsed')) {
        card2.classList.remove('collapsed');
    }
}

/**
 * Synchronize Logged-In Flow Passenger 1 Details to Passenger 2
 */
function syncLoggedContactDetails() {
    const checkbox = document.getElementById('chk-logged-copy-contact');
    if (!checkbox) return;

    const mob2 = document.getElementById('logged-mobile-2');
    const email2 = document.getElementById('logged-email-2');
    const country2 = document.getElementById('logged-country-2');
    const card2 = document.getElementById('logged-pax-card-2');

    if (checkbox.checked) {
        // Copy John Doe values
        if (mob2) {
            mob2.value = '9876543210';
            mob2.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (email2) {
            email2.value = 'john.doe@gmail.com';
            email2.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (country2) {
            country2.value = '+91';
        }

        // Clear error states immediately
        if (mob2) mob2.classList.remove('error');
        if (email2) email2.classList.remove('error');
        const errMob = document.getElementById('err-mobile-2');
        const errEmail = document.getElementById('err-email-2');
        if (errMob) errMob.style.display = 'none';
        if (errEmail) errEmail.style.display = 'none';
        if (card2) card2.classList.remove('error-card');
    } else {
        // Reset back to blank/error state
        if (mob2) mob2.value = '';
        if (email2) email2.value = '';
        
        if (mob2) mob2.classList.add('error');
        if (email2) email2.classList.add('error');
        const errMob = document.getElementById('err-mobile-2');
        const errEmail = document.getElementById('err-email-2');
        if (errMob) errMob.style.display = 'flex';
        if (errEmail) errEmail.style.display = 'flex';
        if (card2) card2.classList.add('error-card');
    }
}

/**
 * Validates the form based on visible contact fields
 */
function validateAndProceed() {
    let hasErrors = false;

    if (currentFlow === 'guest') {
        const checkPaxCount = Math.min(2, currentPaxCount);
        for (let i = 1; i <= checkPaxCount; i++) {
            const mobileInput = document.getElementById(`guest-mobile-${i}`);
            const emailInput = document.getElementById(`guest-email-${i}`);
            const card = document.getElementById(`guest-pax-card-${i}`);

            // Reset errors
            if (mobileInput) mobileInput.classList.remove('error');
            if (emailInput) emailInput.classList.remove('error');
            const mobileErr = document.getElementById(`err-guest-mobile-${i}`);
            const emailErr = document.getElementById(`err-guest-email-${i}`);
            if (mobileErr) mobileErr.remove();
            if (emailErr) emailErr.remove();

            let paxError = false;

            if (mobileInput && mobileInput.value.trim() === '') {
                mobileInput.classList.add('error');
                const errMsg = document.createElement('div');
                errMsg.className = 'error-message';
                errMsg.id = `err-guest-mobile-${i}`;
                errMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Mobile number is required for travel updates`;
                mobileInput.parentElement.appendChild(errMsg);
                paxError = true;
                hasErrors = true;
            }

            if (emailInput && emailInput.value.trim() === '') {
                emailInput.classList.add('error');
                const errMsg = document.createElement('div');
                errMsg.className = 'error-message';
                errMsg.id = `err-guest-email-${i}`;
                errMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Email ID is required`;
                emailInput.parentElement.appendChild(errMsg);
                paxError = true;
                hasErrors = true;
            }

            if (paxError && card) {
                card.classList.add('error-card');
                card.classList.remove('collapsed');
            }
        }
    } else {
        // Logged-in State: validate Passenger 2 if present
        if (currentPaxCount >= 2) {
            const mobileInput = document.getElementById('logged-mobile-2');
            const emailInput = document.getElementById('logged-email-2');
            const card = document.getElementById('logged-pax-card-2');
            const mobileErr = document.getElementById('err-mobile-2');
            const emailErr = document.getElementById('err-email-2');

            let paxError = false;

            if (mobileInput && mobileInput.value.trim() === '') {
                mobileInput.classList.add('error');
                if (mobileErr) mobileErr.style.display = 'flex';
                paxError = true;
                hasErrors = true;
            }

            if (emailInput && emailInput.value.trim() === '') {
                emailInput.classList.add('error');
                if (emailErr) emailErr.style.display = 'flex';
                paxError = true;
                hasErrors = true;
            }

            if (paxError && card) {
                card.classList.add('error-card');
                card.classList.remove('collapsed');
            }
        }
    }

    if (!hasErrors) {
        alert('Validation Successful! Proceeding to next step (Add-ons).');
    } else {
        const firstErrorCard = document.querySelector('.pax-card.error-card');
        if (firstErrorCard) {
            firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

/**
 * Dynamically adjust sidebar fare / trip information based on current state
 */
function updateSidebarSummary() {
    const tripSummaryText = document.getElementById('trip-summary-text');
    const fareAmountText = document.getElementById('fare-amount-text');

    const baseFarePerPax = 6529; 
    const totalFare = baseFarePerPax * currentPaxCount;

    if (tripSummaryText) {
        tripSummaryText.innerText = `${currentPaxCount} Adult${currentPaxCount > 1 ? 's' : ''}`;
    }
    if (fareAmountText) {
        fareAmountText.innerText = `₹${totalFare.toLocaleString('en-IN')}`;
    }
}
