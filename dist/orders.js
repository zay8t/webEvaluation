/**
 * Secure Multi-Step Checkout Controller
 * Coordinates inline authentication, address validations, credit card validations (Luhn Check),
 * promo discount verification, and Stripe payment / simulated webhook confirmation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '/api';
    
    // Core checkout state variables
    let currentStep = 1;
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let appliedDiscount = 0;
    let appliedPromoCode = null;
    let selectedAuthMode = 'guest'; // guest, login, signup
    
    // Stripe session details
    let paymentIntentId = null;
    let clientSecret = null;
    let lastOrderReference = null;

    // Cache elements
    const elements = {
        // Steps
        step1: document.getElementById('checkout-step-1'),
        step2: document.getElementById('checkout-step-2'),
        step3: document.getElementById('checkout-step-3'),
        step4: document.getElementById('checkout-step-4'),
        
        // Stepper Track
        progress: document.getElementById('stepper-progress'),
        dots: [
            document.getElementById('step-dot-1'),
            document.getElementById('step-dot-2'),
            document.getElementById('step-dot-3'),
            document.getElementById('step-dot-4')
        ],
        
        // Cart Summary & Items
        cartItems: document.getElementById('cart-items'),
        emptyCart: document.getElementById('empty-cart'),
        cartCountBadge: document.getElementById('cart-count-badge'),
        step1NextBtn: document.getElementById('step1-next-btn'),

        // Inline Auth
        authContainer: document.getElementById('inline-auth-container'),
        welcomeBanner: document.getElementById('user-welcome-banner'),
        loggedInUser: document.getElementById('logged-in-username'),
        loginBox: document.getElementById('inline-login-box'),
        signupBox: document.getElementById('inline-signup-box'),
        loginError: document.getElementById('login-error-msg'),
        signupError: document.getElementById('signup-error-msg'),
        
        // Forms & Validations
        shippingForm: document.getElementById('shipping-form'),
        paymentForm: document.getElementById('payment-card-form'),
        billingAddressBox: document.getElementById('billing-address-box'),
        sameBillingToggle: document.getElementById('same-billing-toggle'),
        
        // Input fields (Shipping)
        shipName: document.getElementById('ship-name'),
        shipEmail: document.getElementById('ship-email'),
        shipAddress: document.getElementById('ship-address'),
        shipCity: document.getElementById('ship-city'),
        shipZip: document.getElementById('ship-zip'),
        shipPhone: document.getElementById('ship-phone'),
        shipNotes: document.getElementById('ship-notes'),
        
        // Input fields (Billing)
        billName: document.getElementById('bill-name'),
        billPhone: document.getElementById('bill-phone'),
        billAddress: document.getElementById('bill-address'),
        billCity: document.getElementById('bill-city'),
        billZip: document.getElementById('bill-zip'),
        
        // Input fields (Card Details)
        cardNum: document.getElementById('card-number'),
        cardExpiry: document.getElementById('card-expiry'),
        cardCVC: document.getElementById('card-cvc'),
        
        // Sidebar Pricing
        subtotal: document.getElementById('summary-subtotal'),
        tax: document.getElementById('summary-tax'),
        shipping: document.getElementById('summary-shipping'),
        discountRow: document.getElementById('summary-discount-row'),
        discountLabel: document.getElementById('applied-code-label'),
        discountVal: document.getElementById('summary-discount'),
        total: document.getElementById('summary-total'),
        
        // Promo forms
        promoInput: document.getElementById('promo-code-input'),
        promoBtn: document.getElementById('promo-apply-btn'),
        promoMsg: document.getElementById('promo-status-msg'),

        // Review Details
        reviewShipName: document.getElementById('review-shipping-name'),
        reviewShipEmail: document.getElementById('review-shipping-email'),
        reviewShipAddress: document.getElementById('review-shipping-address'),
        reviewBillingDetails: document.getElementById('review-billing-details'),
        reviewCardNumber: document.getElementById('review-card-number'),
        reviewItemsList: document.getElementById('review-items-list'),

        // Buttons & Modals
        paymentModal: document.getElementById('payment-modal'),
        successScreen: document.getElementById('success-screen'),
        confirmedOrderId: document.getElementById('confirmed-order-id'),
        placeOrderBtn: document.getElementById('place-order-btn')
    };

    // ============================================================================
    // STEPPER NAVIGATION
    // ============================================================================

    function showStep(stepNum) {
        elements.step1.classList.add('hidden');
        elements.step2.classList.add('hidden');
        elements.step3.classList.add('hidden');
        elements.step4.classList.add('hidden');

        document.getElementById(`checkout-step-${stepNum}`).classList.remove('hidden');

        // Update stepper tracker
        const percentages = { 1: '0%', 2: '33%', 3: '66%', 4: '100%' };
        elements.progress.style.width = percentages[stepNum];

        // Update step dots
        elements.dots.forEach((dot, index) => {
            const stepIdx = index + 1;
            dot.classList.remove('active', 'completed');
            
            if (stepIdx < stepNum) {
                dot.classList.add('completed');
                dot.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>`;
            } else if (stepIdx === stepNum) {
                dot.classList.add('active');
                dot.innerHTML = stepIdx;
            } else {
                dot.innerHTML = stepIdx;
            }
        });

        currentStep = stepNum;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.nextStep = () => {
        if (currentStep < 4) showStep(currentStep + 1);
    };

    window.prevStep = () => {
        if (currentStep > 1) showStep(currentStep - 1);
    };

    // ============================================================================
    // DYNAMIC ORDER SUMMARY & PRICING CALCULATIONS
    // ============================================================================

    function calculatePricing() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxVal = Math.round(subtotal * 0.05); // 5% flat GST
        const shippingVal = subtotal > 5000 || subtotal === 0 ? 0 : 250; // Free above 5k PKR
        const totalVal = subtotal + taxVal + shippingVal - appliedDiscount;

        const formatPKR = (amount) => {
            return new Intl.NumberFormat('en-PK', {
                style: 'currency',
                currency: 'PKR',
                minimumFractionDigits: 0
            }).format(amount);
        };

        // Render to DOM
        elements.subtotal.innerText = formatPKR(subtotal);
        elements.tax.innerText = formatPKR(taxVal);
        elements.shipping.innerText = shippingVal === 0 ? 'FREE' : formatPKR(shippingVal);
        elements.total.innerText = formatPKR(totalVal);

        if (appliedDiscount > 0) {
            elements.discountRow.classList.remove('hidden');
            elements.discountLabel.innerText = appliedPromoCode;
            elements.discountVal.innerText = `-${formatPKR(appliedDiscount)}`;
        } else {
            elements.discountRow.classList.add('hidden');
        }

        return { subtotal, taxVal, shippingVal, totalVal };
    }

    // Render step 1 cart item list
    function renderCartItems() {
        if (cart.length === 0) {
            elements.cartItems.innerHTML = '';
            elements.emptyCart.classList.remove('hidden');
            elements.step1NextBtn.disabled = true;
            elements.step1NextBtn.classList.add('opacity-50', 'cursor-not-allowed');
            elements.cartCountBadge.innerText = '0 Items';
            calculatePricing();
            return;
        }

        elements.emptyCart.classList.add('hidden');
        elements.step1NextBtn.disabled = false;
        elements.step1NextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCountBadge.innerText = `${totalItemsCount} Item${totalItemsCount > 1 ? 's' : ''}`;

        elements.cartItems.innerHTML = cart.map(item => `
            <div class="flex items-center gap-4 py-5 border-b border-gray-100 dark:border-spectra-dark-border last:border-0" data-id="${item.product_id}">
                <div class="w-16 h-16 bg-gray-100 dark:bg-spectra-dark-card rounded-xl overflow-hidden flex-shrink-0">
                    <img src="${item.image_url}" alt="${item.product_name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow min-w-0">
                    <h4 class="font-bold text-sm truncate">${item.product_name}</h4>
                    <p class="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">${item.brand}</p>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center border border-spectra-border dark:border-spectra-dark-border rounded-lg overflow-hidden h-7">
                            <button onclick="updateQty(${item.product_id}, -1)" class="px-2 hover:bg-gray-100 dark:hover:bg-spectra-dark-card transition-colors font-bold text-xs">-</button>
                            <span class="px-3 text-xs font-bold leading-7 bg-gray-50 dark:bg-spectra-dark-card border-x border-spectra-border dark:border-spectra-dark-border">${item.quantity}</span>
                            <button onclick="updateQty(${item.product_id}, 1)" class="px-2 hover:bg-gray-100 dark:hover:bg-spectra-dark-card transition-colors font-bold text-xs">+</button>
                        </div>
                        <span class="font-bold text-xs text-spectra-orange">${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}</span>
                    </div>
                </div>
                <button onclick="removeItem(${item.product_id})" class="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `).join('');

        calculatePricing();
    }

    // Quantity actions
    window.updateQty = (id, delta) => {
        const idx = cart.findIndex(i => i.product_id === id);
        if (idx !== -1) {
            cart[idx].quantity += delta;
            if (cart[idx].quantity < 1) {
                cart.splice(idx, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    };

    window.removeItem = (id) => {
        cart = cart.filter(i => i.product_id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    };

    // ============================================================================
    // PROMO / DISCOUNT ACTION
    // ============================================================================

    window.applyPromoCode = async () => {
        const code = elements.promoInput.value.trim();
        if (!code) {
            showPromoStatus('Please type a promo code first.', 'text-red-500');
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (subtotal === 0) {
            showPromoStatus('Your cart is empty.', 'text-red-500');
            return;
        }

        elements.promoBtn.disabled = true;
        elements.promoBtn.innerText = 'Applying...';
        showPromoStatus('Validating discount...', 'text-gray-400');

        try {
            const res = await fetch(`${API_BASE_URL}/orders/validate-promo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, subtotal })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Promo validation failed');
            }

            // Apply discount
            appliedDiscount = data.discount_amount;
            appliedPromoCode = data.code;
            calculatePricing();
            showPromoStatus(`Discount code "${data.code}" applied successfully!`, 'text-green-500');
        } catch (error) {
            appliedDiscount = 0;
            appliedPromoCode = null;
            calculatePricing();
            showPromoStatus(error.message, 'text-red-500');
        } finally {
            elements.promoBtn.disabled = false;
            elements.promoBtn.innerText = 'Apply';
        }
    };

    function showPromoStatus(msg, className) {
        elements.promoMsg.innerText = msg;
        elements.promoMsg.className = `text-xs font-medium mt-1 ${className}`;
    }

    // ============================================================================
    // INLINE AUTHENTICATION
    // ============================================================================

    // Check login state on load
    function checkUserSession() {
        const token = localStorage.getItem('auth_token');
        const profile = JSON.parse(localStorage.getItem('user_profile') || 'null');

        if (token && profile) {
            // Logged in
            elements.authContainer.classList.add('hidden');
            elements.welcomeBanner.classList.remove('hidden');
            elements.loggedInUser.innerText = profile.full_name || 'Customer';
            
            // Auto populate form
            elements.shipName.value = profile.full_name || '';
            elements.shipEmail.value = profile.email || '';
            elements.shipAddress.value = profile.address || '';
        } else {
            // Not logged in
            elements.authContainer.classList.remove('hidden');
            elements.welcomeBanner.classList.add('hidden');
            toggleInlineAuthMode('guest'); // default guest mode
        }
    }

    window.toggleInlineAuthMode = (mode) => {
        selectedAuthMode = mode;
        
        // Reset states
        elements.loginBox.classList.add('hidden');
        elements.signupBox.classList.add('hidden');
        elements.loginError.innerText = '';
        elements.signupError.innerText = '';
        
        // Remove active class styling from togglers
        const btnLogin = document.getElementById('btn-switch-login');
        const btnSignup = document.getElementById('btn-switch-signup');
        const btnGuest = document.getElementById('btn-switch-guest');

        btnLogin.className = btnLogin.className.replace('bg-spectra-orange text-white', 'bg-white dark:bg-spectra-dark-surface');
        btnSignup.className = btnSignup.className.replace('bg-spectra-orange text-white', 'bg-white dark:bg-spectra-dark-surface');
        btnGuest.className = btnGuest.className.replace('bg-spectra-orange text-white', 'bg-white dark:bg-spectra-dark-surface');

        if (mode === 'login') {
            elements.loginBox.classList.remove('hidden');
            btnLogin.classList.add('bg-spectra-orange', 'text-white');
        } else if (mode === 'signup') {
            elements.signupBox.classList.remove('hidden');
            btnSignup.classList.add('bg-spectra-orange', 'text-white');
        } else if (mode === 'guest') {
            btnGuest.classList.add('bg-spectra-orange', 'text-white');
        }
    };

    window.handleInlineLogin = async () => {
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value;

        if (!email || !pass) {
            elements.loginError.innerText = 'Please fill out both email and password';
            return;
        }

        const btn = document.getElementById('inline-login-btn');
        btn.disabled = true;
        btn.innerText = 'Signing In...';
        elements.loginError.innerText = '';

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            // Save credentials
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_profile', JSON.stringify(data.user));

            // Refresh view
            checkUserSession();
        } catch (error) {
            elements.loginError.innerText = error.message;
        } finally {
            btn.disabled = false;
            btn.innerText = 'Sign In';
        }
    };

    window.handleInlineSignup = async () => {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const pass = document.getElementById('signup-password').value;

        if (!name || !email || !pass) {
            elements.signupError.innerText = 'All fields are required';
            return;
        }

        const btn = document.getElementById('inline-signup-btn');
        btn.disabled = true;
        btn.innerText = 'Registering...';
        elements.signupError.innerText = '';

        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: name, email, password: pass })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            // Save credentials
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_profile', JSON.stringify(data.user));

            // Refresh view
            checkUserSession();
        } catch (error) {
            elements.signupError.innerText = error.message;
        } finally {
            btn.disabled = false;
            btn.innerText = 'Register & Continue';
        }
    };

    window.handleInlineSignOut = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_profile');
        
        // Clear populated values
        elements.shipName.value = '';
        elements.shipEmail.value = '';
        elements.shipAddress.value = '';
        
        checkUserSession();
    };

    // ============================================================================
    // STEP VALIDATIONS
    // ============================================================================

    // Clear error tags on input change
    elements.shippingForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const errSpan = input.nextElementSibling;
            if (errSpan && errSpan.classList.contains('error-msg')) {
                errSpan.classList.add('hidden');
                input.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
            }
        });
    });

    function showFieldErr(input, msg) {
        const errSpan = input.nextElementSibling;
        if (errSpan && errSpan.classList.contains('error-msg')) {
            errSpan.innerText = msg;
            errSpan.classList.remove('hidden');
        }
        input.classList.add('border-red-500', 'ring-2', 'ring-red-200');
    }

    window.validateAndGoToPayment = () => {
        let isValid = true;

        // 1. Receiver Name
        if (!elements.shipName.value.trim()) {
            showFieldErr(elements.shipName, 'Receiver name is required');
            isValid = false;
        }

        // 2. Email Address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(elements.shipEmail.value.trim())) {
            showFieldErr(elements.shipEmail, 'Please enter a valid email address');
            isValid = false;
        }

        // 3. Address
        if (!elements.shipAddress.value.trim()) {
            showFieldErr(elements.shipAddress, 'Delivery address is required');
            isValid = false;
        }

        // 4. City
        if (!elements.shipCity.value.trim()) {
            showFieldErr(elements.shipCity, 'City is required');
            isValid = false;
        }

        // 5. Postal Code
        const zipVal = elements.shipZip.value.trim();
        if (!zipVal) {
            showFieldErr(elements.shipZip, 'Postal code is required');
            isValid = false;
        } else if (!/^\d{5}$/.test(zipVal)) {
            showFieldErr(elements.shipZip, 'Postal code must be exactly 5 digits');
            isValid = false;
        }

        // 6. Phone Number
        const phoneVal = elements.shipPhone.value.trim();
        if (!phoneVal) {
            showFieldErr(elements.shipPhone, 'Phone number is required');
            isValid = false;
        } else if (!/^((\+92)|(0092)|(0))?3\d{9}$/.test(phoneVal.replace(/[-\s]/g, ''))) {
            showFieldErr(elements.shipPhone, 'Enter a valid Pakistani mobile number (e.g. 03001234567)');
            isValid = false;
        }

        if (isValid) nextStep();
    };

    // Card Input Formats
    // Format card number: xxxx xxxx xxxx xxxx
    elements.cardNum.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        for (let i = 0; i < val.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += val[i];
        }
        e.target.value = formatted;
        
        // Reset card validation errors
        clearCardErrors();
    });

    // Format Expiry: MM/YY
    elements.cardExpiry.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
        if (val.length >= 2) {
            e.target.value = val.substr(0, 2) + '/' + val.substr(2, 2);
        } else {
            e.target.value = val;
        }
        clearCardErrors();
    });

    elements.cardCVC.addEventListener('input', () => {
        clearCardErrors();
    });

    function clearCardErrors() {
        elements.paymentForm.querySelectorAll('.card-error').forEach(span => span.classList.add('hidden'));
        elements.paymentForm.querySelectorAll('input').forEach(i => i.classList.remove('border-red-500'));
    }

    function showCardErr(input, msg) {
        const errSpan = input.parentNode.nextElementSibling || input.nextElementSibling;
        if (errSpan && errSpan.classList.contains('card-error')) {
            errSpan.innerText = msg;
            errSpan.classList.remove('hidden');
        }
        input.classList.add('border-red-500');
    }

    // Luhn card check
    function validateLuhn(numStr) {
        let sum = 0;
        let shouldDouble = false;
        const cleanStr = numStr.replace(/\D/g, '');
        
        if (cleanStr.length < 13 || cleanStr.length > 19) return false;
        
        for (let i = cleanStr.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanStr.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    }

    window.toggleBillingAddressForm = () => {
        if (elements.sameBillingToggle.checked) {
            elements.billingAddressBox.classList.add('hidden');
        } else {
            elements.billingAddressBox.classList.remove('hidden');
        }
    };

    window.validateAndGoToReview = () => {
        let isValid = true;
        clearCardErrors();

        // 1. Validate Card Number (Luhn check)
        const cleanCard = elements.cardNum.value.replace(/\s+/g, '');
        if (!cleanCard) {
            showCardErr(elements.cardNum, 'Card number is required');
            isValid = false;
        } else if (!validateLuhn(cleanCard)) {
            showCardErr(elements.cardNum, 'Invalid credit card number (failed checksum)');
            isValid = false;
        }

        // 2. Validate Expiry Date MM/YY
        const expiryVal = elements.cardExpiry.value;
        if (!expiryVal || !/^\d{2}\/\d{2}$/.test(expiryVal)) {
            showCardErr(elements.cardExpiry, 'Use MM/YY format');
            isValid = false;
        } else {
            const parts = expiryVal.split('/');
            const month = parseInt(parts[0], 10);
            const year = parseInt('20' + parts[1], 10);
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            if (month < 1 || month > 12) {
                showCardErr(elements.cardExpiry, 'Invalid month (01-12)');
                isValid = false;
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                showCardErr(elements.cardExpiry, 'Card has expired');
                isValid = false;
            }
        }

        // 3. Validate CVC
        const cvcVal = elements.cardCVC.value;
        if (!cvcVal || cvcVal.length < 3 || cvcVal.length > 4) {
            showCardErr(elements.cardCVC, 'Invalid CVC (3-4 digits)');
            isValid = false;
        }

        // 4. Validate Billing Address if separate
        if (!elements.sameBillingToggle.checked) {
            if (!elements.billName.value.trim()) {
                elements.billName.classList.add('border-red-500');
                isValid = false;
            }
            if (!elements.billAddress.value.trim()) {
                elements.billAddress.classList.add('border-red-500');
                isValid = false;
            }
            if (!elements.billCity.value.trim()) {
                elements.billCity.classList.add('border-red-500');
                isValid = false;
            }
            if (!elements.billZip.value.trim()) {
                elements.billZip.classList.add('border-red-500');
                isValid = false;
            }
        }

        if (isValid) {
            renderOrderReviewStep();
            nextStep();
        }
    };

    // Populate review details in Step 4
    function renderOrderReviewStep() {
        elements.reviewShipName.innerText = elements.shipName.value;
        elements.reviewShipEmail.innerText = elements.shipEmail.value;
        elements.reviewShipAddress.innerText = `${elements.shipAddress.value}, ${elements.shipCity.value}, ${elements.shipZip.value} | Phone: ${elements.shipPhone.value}`;

        if (elements.sameBillingToggle.checked) {
            elements.reviewBillingDetails.innerText = 'Same as shipping address';
        } else {
            elements.reviewBillingDetails.innerText = `${elements.billName.value}\n${elements.billAddress.value}, ${elements.billCity.value}, ${elements.billZip.value}\nPhone: ${elements.billPhone.value || elements.shipPhone.value}`;
        }

        // Mask card number for security preview
        const rawCard = elements.cardNum.value.replace(/\s+/g, '');
        const lastFour = rawCard.substr(rawCard.length - 4);
        elements.reviewCardNumber.innerText = `Card ending in: **** **** **** ${lastFour}`;

        // Render review items summary
        elements.reviewItemsList.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between py-3 text-xs">
                <div>
                    <span class="font-bold">${item.product_name}</span>
                    <span class="text-gray-400 font-semibold ml-2">x ${item.quantity}</span>
                </div>
                <span class="font-mono text-spectra-orange font-bold">${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }

    // ============================================================================
    // SECURE PAYMENT SUBMISSION & WEBHOOK SIMULATION
    // ============================================================================

    window.submitFinalPayment = async () => {
        elements.placeOrderBtn.disabled = true;
        elements.placeOrderBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;

        // Open transaction lock loader modal
        elements.paymentModal.classList.remove('hidden');

        const token = localStorage.getItem('auth_token');
        const summary = calculatePricing();

        const shippingStr = `${elements.shipAddress.value}, ${elements.shipCity.value}, ${elements.shipZip.value}`;
        let billingStr = shippingStr;
        if (!elements.sameBillingToggle.checked) {
            billingStr = `${elements.billAddress.value}, ${elements.billCity.value}, ${elements.billZip.value}`;
        }

        const payload = {
            items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
            discount_code: appliedPromoCode,
            shipping_address: shippingStr,
            billing_address: billingStr,
            guest_email: elements.shipEmail.value.trim(),
            guest_name: elements.shipName.value.trim(),
            phone: elements.shipPhone.value.trim(),
            notes: elements.shipNotes.value.trim(),
            payment_method: 'Stripe Credit Card'
        };

        const reqHeaders = { 'Content-Type': 'application/json' };
        if (token) {
            reqHeaders['Authorization'] = `Bearer ${token}`;
        }

        try {
            // Step A: Initialize Checkout Session and lock inventory
            const sessionRes = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: reqHeaders,
                body: JSON.stringify(payload)
            });

            const sessionData = await sessionRes.json();

            if (!sessionRes.ok) {
                throw new Error(sessionData.message || 'Checkout session initialization failed');
            }

            paymentIntentId = sessionData.payment_intent_id;
            clientSecret = sessionData.client_secret;
            lastOrderReference = sessionData.order_id;

            // Wait 2 seconds to simulate bank transfer and API calls
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step B: Post simulated webhook call to trigger order completion
            // If real Stripe is configured, the frontend would use stripe.confirmCardPayment, and the backend webhook listener
            // would trigger async confirmation.
            // Since we are running in simulation/fallback mode, we trigger simulated completion
            const webhookRes = await fetch(`${API_BASE_URL}/orders/simulate-webhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_intent_id: paymentIntentId,
                    status: 'success'
                })
            });

            const webhookData = await webhookRes.json();

            if (!webhookRes.ok) {
                throw new Error(webhookData.message || 'Payment capture confirmation failed');
            }

            // Success checkout
            elements.confirmedOrderId.innerText = `#ORD-${lastOrderReference}`;
            
            // Clear frontend cart
            localStorage.removeItem('cart');
            
            // Show Success view
            elements.paymentModal.classList.add('hidden');
            elements.successScreen.classList.remove('hidden');

        } catch (error) {
            elements.paymentModal.classList.add('hidden');
            alert(`Checkout Error: ${error.message}`);
            
            // Reset checkout button
            elements.placeOrderBtn.disabled = false;
            elements.placeOrderBtn.innerHTML = `
                <span>Place Order</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            `;
        }
    };

    // Initialize Page
    renderCartItems();
    checkUserSession();

    // Attach theme toggle toggle Theme
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            window.toggleTheme();
        });
    }
});
