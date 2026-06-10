/**
 * MY EYES E-Commerce Checkout Controller
 * Coordinates multi-step validations, pricing arithmetic, coupon application,
 * card mask input formatters, and secure payment submission.
 */

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '/api';

    // ============================================================================
    // 1. SESSION & CART PRE-CHECKS
    // ============================================================================
    const token = localStorage.getItem('auth_token');

    // Load Cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Form inputs and structures cache
    const ui = {
        errorBanner: document.getElementById('error-banner'),
        
        // Accordions
        accContent1: document.getElementById('accordion-content-1'),
        accContent2: document.getElementById('accordion-content-2'),
        accContent3: document.getElementById('accordion-content-3'),
        accArrow1: document.getElementById('accordion-arrow-1'),
        accArrow2: document.getElementById('accordion-arrow-2'),
        accArrow3: document.getElementById('accordion-arrow-3'),
        
        // Forms
        shipForm: document.getElementById('shipping-form'),
        cardForm: document.getElementById('payment-card-form'),
        paypalBlock: document.getElementById('paypal-block'),
        
        // Shipping Fields
        shipName: document.getElementById('ship-name'),
        shipEmail: document.getElementById('ship-email'),
        shipPhone: document.getElementById('ship-phone'),
        shipAddress: document.getElementById('ship-address'),
        shipCity: document.getElementById('ship-city'),
        shipZip: document.getElementById('ship-zip'),
        
        // Payment Fields
        cardName: document.getElementById('card-name'),
        cardNum: document.getElementById('card-number'),
        cardExpiry: document.getElementById('card-expiry'),
        cardCvc: document.getElementById('card-cvv'),
        formFeedback: document.getElementById('form-error-feedback'),
        submitBtn: document.getElementById('checkout-submit-btn'),
        overlay: document.getElementById('authorizing-overlay'),
        
        // Summary List
        summaryItems: document.getElementById('summary-items'),
        subtotal: document.getElementById('summary-subtotal'),
        shipping: document.getElementById('summary-shipping'),
        tax: document.getElementById('summary-tax'),
        total: document.getElementById('summary-total'),
        
        // Discount
        discountRow: document.getElementById('summary-discount-row'),
        discountVal: document.getElementById('summary-discount'),
        couponInput: document.getElementById('coupon-input'),
        couponApplyBtn: document.getElementById('coupon-apply-btn'),
        couponStatus: document.getElementById('coupon-status'),
        themeToggle: document.getElementById('theme-toggle')
    };

    // Show error banner if cart is empty
    if (cart.length === 0) {
        ui.errorBanner.classList.remove('hidden');
        ui.submitBtn.disabled = true;
        ui.submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        ui.couponApplyBtn.disabled = true;
    }

    // ============================================================================
    // 2. PRICING & DISCOUNTS LOGIC
    // ============================================================================
    let appliedCoupon = null;
    let appliedDiscount = 0;

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function calculateOrderTotals() {
        const subtotalVal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Calculate Discount
        if (appliedCoupon === 'MYEYES10') {
            appliedDiscount = subtotalVal * 0.1; // 10% discount
        } else {
            appliedDiscount = 0;
        }

        // Shipping Cost: $10 standard, $0 if subtotal > $150
        const shippingCostVal = subtotalVal > 150 || subtotalVal === 0 ? 0 : 10;
        
        // Estimated Tax: 8% of (Subtotal - Discount)
        const taxableSubtotal = Math.max(0, subtotalVal - appliedDiscount);
        const taxVal = Math.round(taxableSubtotal * 0.08 * 100) / 100;
        
        // Grand Total
        const totalVal = Math.max(0, taxableSubtotal + shippingCostVal + taxVal);

        // Update UI
        ui.subtotal.innerText = formatCurrency(subtotalVal);
        ui.shipping.innerText = shippingCostVal === 0 ? 'FREE' : formatCurrency(shippingCostVal);
        ui.tax.innerText = formatCurrency(taxVal);
        ui.total.innerText = formatCurrency(totalVal);

        if (appliedDiscount > 0) {
            ui.discountRow.classList.remove('hidden');
            ui.discountVal.innerText = `-${formatCurrency(appliedDiscount)}`;
        } else {
            ui.discountRow.classList.add('hidden');
        }

        return {
            subtotal: subtotalVal,
            shipping: shippingCostVal,
            tax: taxVal,
            discount: appliedDiscount,
            total: totalVal
        };
    }

    // Apply Coupon
    window.validateCoupon = () => {
        const code = ui.couponInput.value.trim().toUpperCase();
        if (code === 'MYEYES10') {
            appliedCoupon = code;
            calculateOrderTotals();
            ui.couponStatus.innerText = 'Coupon Code "MYEYES10" applied (10% off)!';
            ui.couponStatus.className = 'text-xs font-semibold mt-1 text-green-500';
        } else if (!code) {
            ui.couponStatus.innerText = 'Please enter a coupon code.';
            ui.couponStatus.className = 'text-xs font-semibold mt-1 text-red-500';
        } else {
            appliedCoupon = null;
            calculateOrderTotals();
            ui.couponStatus.innerText = 'Invalid coupon code.';
            ui.couponStatus.className = 'text-xs font-semibold mt-1 text-red-500';
        }
    };

    // Render Order Items Summary (Right Column)
    function renderSummaryItems() {
        if (cart.length === 0) {
            ui.summaryItems.innerHTML = '<p class="text-xs text-gray-400 py-4 text-center">No items to check out.</p>';
            return;
        }

        ui.summaryItems.innerHTML = cart.map((item, index) => `
            <div class="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div class="w-12 h-12 bg-gray-50 dark:bg-spectra-dark-card rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-spectra-dark-border">
                    <img src="${item.image_url}" alt="${item.product_name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow min-w-0">
                    <h5 class="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">${item.product_name}</h5>
                    <p class="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">${item.brand}</p>
                    <p class="text-xs text-spectra-orange font-bold mt-1">${formatCurrency(item.price)} <span class="text-gray-400 font-medium text-[10px]">x ${item.quantity}</span></p>
                </div>
                <button onclick="removeFromSummary(${index})" class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Remove item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `).join('');

        calculateOrderTotals();
    }

    window.removeFromSummary = (index) => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Sync with React and other pages
        window.dispatchEvent(new CustomEvent('cart-updated'));
        
        renderSummaryItems();
        
        if (cart.length === 0) {
            ui.errorBanner.classList.remove('hidden');
            ui.submitBtn.disabled = true;
            ui.submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            ui.couponApplyBtn.disabled = true;
        }
    };

    // ============================================================================
    // 3. ACCORDION CONTROL
    // ============================================================================
    window.toggleAccordion = (step) => {
        if (step === 1) {
            ui.accContent1.classList.add('open');
            ui.accContent2.classList.remove('open');
            ui.accContent3.classList.remove('open');
            ui.accArrow1.classList.add('rotate-180');
            ui.accArrow2.classList.remove('rotate-180');
            ui.accArrow3.classList.remove('rotate-180');
        } else if (step === 2) {
            // Check shipping validation before allowing section 2 open
            if (validateShippingForm()) {
                ui.accContent2.classList.add('open');
                ui.accContent1.classList.remove('open');
                ui.accContent3.classList.remove('open');
                ui.accArrow2.classList.add('rotate-180');
                ui.accArrow1.classList.remove('rotate-180');
                ui.accArrow3.classList.remove('rotate-180');
            }
        } else if (step === 3) {
            // Check shipping & payment validation before allowing section 3 open
            if (validateShippingForm() && validatePaymentForm()) {
                populateReviewDetails();
                ui.accContent3.classList.add('open');
                ui.accContent1.classList.remove('open');
                ui.accContent2.classList.remove('open');
                ui.accArrow3.classList.add('rotate-180');
                ui.accArrow1.classList.remove('rotate-180');
                ui.accArrow2.classList.remove('rotate-180');
            }
        }
    };

    window.goToPaymentStep = () => {
        toggleAccordion(2);
    };

    window.goToReviewStep = () => {
        toggleAccordion(3);
    };

    function populateReviewDetails() {
        const reviewName = document.getElementById('review-shipping-name');
        const reviewPhone = document.getElementById('review-shipping-phone');
        const reviewAddress = document.getElementById('review-shipping-address');
        
        if (reviewName) reviewName.innerText = ui.shipName.value.trim();
        if (reviewPhone) reviewPhone.innerText = ui.shipPhone.value.trim();
        if (reviewAddress) {
            reviewAddress.innerText = `${ui.shipAddress.value.trim()}, ${ui.shipCity.value.trim()}, ${ui.shipZip.value.trim()}`;
        }

        const reviewMethod = document.getElementById('review-payment-method');
        const reviewCard = document.getElementById('review-card-details');

        if (reviewMethod) {
            reviewMethod.innerText = activePaymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal Wallet';
        }
        if (reviewCard) {
            if (activePaymentMethod === 'card') {
                const num = ui.cardNum.value.replace(/\s+/g, '');
                const last4 = num.substring(num.length - 4);
                reviewCard.innerText = `Card ending in: **** **** **** ${last4 || '****'}`;
            } else {
                reviewCard.innerText = 'Connected via PayPal Express Secure';
            }
        }
    }

    // ============================================================================
    // 4. PAYMENT SWITCHER LOGIC
    // ============================================================================
    let activePaymentMethod = 'card';

    window.switchPaymentMethod = (method) => {
        activePaymentMethod = method;
        ui.formFeedback.classList.add('hidden');
        
        if (method === 'card') {
            ui.cardForm.classList.remove('hidden');
            ui.paypalBlock.classList.add('hidden');
        } else {
            ui.cardForm.classList.add('hidden');
            ui.paypalBlock.classList.remove('hidden');
        }
    };

    // ============================================================================
    // 5. INPUT FORMATTING & FORM VALIDATIONS
    // ============================================================================

    // Expiry Slash Auto-insert (MM/YY)
    ui.cardExpiry.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
        } else {
            e.target.value = val;
        }
        clearInputError(ui.cardExpiry);
    });

    // Card spaces formatter (xxxx xxxx xxxx xxxx)
    ui.cardNum.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        for (let i = 0; i < val.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += val[i];
        }
        e.target.value = formatted;
        clearInputError(ui.cardNum);
    });

    // Clean inputs error status
    [ui.shipName, ui.shipEmail, ui.shipPhone, ui.shipAddress, ui.shipCity, ui.shipZip, ui.cardName, ui.cardNum, ui.cardExpiry, ui.cardCvc].forEach(input => {
        if (input) {
            input.addEventListener('input', () => clearInputError(input));
        }
    });

    function clearInputError(input) {
        input.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
        const errSpan = input.nextElementSibling;
        if (errSpan && errSpan.classList.contains('error-label')) {
            errSpan.classList.add('hidden');
        }
    }

    function showInputErr(input, msg) {
        input.classList.add('border-red-500', 'ring-2', 'ring-red-200');
        const errSpan = input.nextElementSibling;
        if (errSpan && errSpan.classList.contains('error-label')) {
            errSpan.innerText = msg;
            errSpan.classList.remove('hidden');
        }
    }

    function validateShippingForm() {
        let ok = true;

        if (!ui.shipName.value.trim()) {
            showInputErr(ui.shipName, 'Full name is required.');
            ok = false;
        }

        const emailVal = ui.shipEmail.value.trim();
        if (!emailVal) {
            showInputErr(ui.shipEmail, 'Email address is required.');
            ok = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            showInputErr(ui.shipEmail, 'Enter a valid email address.');
            ok = false;
        }

        const phoneVal = ui.shipPhone.value.replace(/[-\s]/g, '');
        if (!phoneVal) {
            showInputErr(ui.shipPhone, 'Phone number is required.');
            ok = false;
        } else if (!/^\+?\d{9,14}$/.test(phoneVal)) {
            showInputErr(ui.shipPhone, 'Enter a valid telephone number (9-14 digits).');
            ok = false;
        }

        if (!ui.shipAddress.value.trim()) {
            showInputErr(ui.shipAddress, 'Street address is required.');
            ok = false;
        }

        if (!ui.shipCity.value.trim()) {
            showInputErr(ui.shipCity, 'City is required.');
            ok = false;
        }

        const zipVal = ui.shipZip.value.trim();
        if (!zipVal) {
            showInputErr(ui.shipZip, 'Zip Code is required.');
            ok = false;
        } else if (zipVal.length < 3 || zipVal.length > 10) {
            showInputErr(ui.shipZip, 'Zip Code must be between 3 and 10 characters.');
            ok = false;
        }

        return ok;
    }

    function validatePaymentForm() {
        if (activePaymentMethod === 'paypal') return true;

        let ok = true;

        if (!ui.cardName.value.trim()) {
            showInputErr(ui.cardName, 'Cardholder name is required.');
            ok = false;
        }

        const cleanCardNum = ui.cardNum.value.replace(/\s+/g, '');
        if (!cleanCardNum) {
            showInputErr(ui.cardNum, 'Card number is required.');
            ok = false;
        } else if (!/^\d{16}$/.test(cleanCardNum)) {
            showInputErr(ui.cardNum, 'Card number must be exactly 16 digits.');
            ok = false;
        }

        const expiryVal = ui.cardExpiry.value;
        if (!expiryVal || !/^\d{2}\/\d{2}$/.test(expiryVal)) {
            showInputErr(ui.cardExpiry, 'Use MM/YY format.');
            ok = false;
        } else {
            const parts = expiryVal.split('/');
            const month = parseInt(parts[0], 10);
            const year = parseInt('20' + parts[1], 10);
            const now = new Date();
            const currMonth = now.getMonth() + 1;
            const currYear = now.getFullYear();

            if (month < 1 || month > 12) {
                showInputErr(ui.cardExpiry, 'Invalid month (01-12).');
                ok = false;
            } else if (year < currYear || (year === currYear && month < currMonth)) {
                showInputErr(ui.cardExpiry, 'Card has expired.');
                ok = false;
            }
        }

        if (!ui.cardCvc.value) {
            showInputErr(ui.cardCvc, 'CVV required.');
            ok = false;
        } else if (!/^\d{3}$/.test(ui.cardCvc.value)) {
            showInputErr(ui.cardCvc, 'Must be 3 digits.');
            ok = false;
        }

        return ok;
    }

    // ============================================================================
    // 6. FINAL CHECKOUT SUBMISSION
    // ============================================================================
    window.submitCheckoutOrder = async () => {
        ui.formFeedback.classList.add('hidden');

        // 1. Validate Forms
        if (!validateShippingForm()) {
            toggleAccordion(1);
            return;
        }
        if (!validatePaymentForm()) {
            toggleAccordion(2);
            return;
        }

        // 2. Lock controls, show overlays, simulate gateway latency
        ui.submitBtn.disabled = true;
        ui.submitBtn.innerText = 'Processing Authorization...';
        ui.overlay.classList.remove('hidden');

        // Latency timer simulation of 2500ms
        setTimeout(async () => {
            const shippingStr = `${ui.shipAddress.value}, ${ui.shipCity.value}, ${ui.shipZip.value} | Phone: ${ui.shipPhone.value}`;
            
            const billingDetails = activePaymentMethod === 'card' ? {
                name: ui.cardName.value.trim(),
                address: ui.shipAddress.value, // mock matching
                city: ui.shipCity.value,
                zip: ui.shipZip.value,
                phone: ui.shipPhone.value
            } : null;

            const totals = calculateOrderTotals();

            const payload = {
                cartItems: cart.map(item => ({
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: shippingStr,
                billingDetails: billingDetails,
                paymentMethod: activePaymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal Wallet',
                totalDiscount: totals.discount,
                guestName: ui.shipName.value.trim(),
                guestEmail: ui.shipEmail ? ui.shipEmail.value.trim() : ''
            };

            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                let data;
                try {
                    data = await res.json();
                } catch (e) {
                    throw new Error(`Gateway returned invalid response (Status: ${res.status}). Please verify if the backend server is running.`);
                }

                if (!res.ok) {
                    throw new Error(data.message || 'Transaction authorization failed.');
                }

                // Successful Purchase Lifecycle
                localStorage.removeItem('cart'); // Wipe cart
                ui.overlay.classList.add('hidden'); // Clear loader
                
                // Boot into confirmation page with order database ID
                window.location.href = `confirmation.html?id=${data.orderId}`;

            } catch (error) {
                // Reset controls on error
                ui.overlay.classList.add('hidden');
                ui.submitBtn.disabled = false;
                ui.submitBtn.innerText = 'Place Order';
                
                ui.formFeedback.innerText = `Gateway Authorization Error: ${error.message}`;
                ui.formFeedback.classList.remove('hidden');
                toggleAccordion(3);
            }
        }, 2500);
    };

    // Theme toggle
    if (ui.themeToggle) {
        ui.themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            if (isDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme_preference', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme_preference', 'dark');
            }
        });
    }

    async function preloadUserProfile() {
        const profile = JSON.parse(localStorage.getItem('user_profile') || 'null');
        if (profile) {
            if (profile.full_name && ui.shipName) ui.shipName.value = profile.full_name;
            if (profile.email && ui.shipEmail) ui.shipEmail.value = profile.email;
        }
        
        if (token) {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.user) {
                    const u = data.user;
                    if (u.full_name && ui.shipName) ui.shipName.value = u.full_name;
                    if (u.email && ui.shipEmail) ui.shipEmail.value = u.email;
                    if (u.phone && ui.shipPhone) ui.shipPhone.value = u.phone;
                    if (u.address && ui.shipAddress) ui.shipAddress.value = u.address;
                }
            } catch (e) {
                console.error('Failed to pre-populate user profile:', e);
            }
        }
    }

    // Initial renders
    renderSummaryItems();
    preloadUserProfile();
});
