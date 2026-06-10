/**
 * Admin Engine Controller - Phase 7
 * Handles orchestration of analytics, moderation, and data management
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. IMMEDIATE AUTH GUARD (PROMPT 12/13)
    const authHeader = { 
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
    };
    const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

    if (!localStorage.getItem('auth_token') || userProfile.role !== 'admin') {
        console.error('SEC_LEAK_PREVENTION: Non-admin attempt blocked.');
        window.location.href = 'login.html';
        return;
    }

    // 2. UI CONFIGURATION
    const API_BASE = '/api';
    const SECTIONS = ['stats', 'orders', 'inventory', 'users', 'feedback'];
    
    // UI Elements
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    // 3. NAVIGATION (TAB SWITCHING)
    window.switchTab = (target) => {
        SECTIONS.forEach(s => {
            const el = document.getElementById(`section-${s}`);
            const nav = document.getElementById(`nav-${s}`);
            if (s === target) {
                el.classList.remove('hidden');
                nav.classList.add('tab-active');
                nav.classList.remove('tab-inactive');
            } else {
                if (el) el.classList.add('hidden');
                if (nav) {
                    nav.classList.add('tab-inactive');
                    nav.classList.remove('tab-active');
                }
            }
        });
        
        // Refresh data for the specific tab
        if (target === 'stats') fetchStats();
        if (target === 'orders') fetchOrders();
        if (target === 'inventory') fetchInventory();
        if (target === 'users') fetchUsers();
        if (target === 'feedback') { fetchReviews(); fetchInquiries(); }
    };

    // 4. DATA FETCHING (PROMPT 12)
    async function fetchStats() {
        try {
            const res = await fetch(`${API_BASE}/admin/dashboard-stats`, { headers: authHeader });
            const data = await res.json();
            if (data.success) {
                const s = data.stats;
                document.getElementById('stat-revenue').innerText = `PKR ${s.total_revenue.toLocaleString()}`;
                document.getElementById('stat-total-users').innerText = s.total_users;
                document.getElementById('stat-pending-orders').innerText = s.pending_orders;
                document.getElementById('stat-low-stock').innerText = s.low_stock_alerts;
                document.getElementById('stat-total-products').innerText = s.total_products;
                document.getElementById('stat-total-orders').innerText = s.total_orders;
            }
        } catch (e) { showToast('Stats refresh failed', true); }
    }

    async function fetchOrders() {
        try {
            const res = await fetch(`${API_BASE}/orders`, { headers: authHeader });
            const data = await res.json();
            if (data.success) renderOrders(data.orders);
        } catch (e) { showToast('Orders load failed', true); }
    }

    async function fetchInventory() {
        try {
            const res = await fetch(`${API_BASE}/products`, { headers: authHeader });
            const data = await res.json();
            if (data.success) renderInventory(data.products);
        } catch (e) { showToast('Inventory load failed', true); }
    }

    async function fetchUsers() {
        try {
            const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeader });
            const data = await res.json();
            if (data.success) renderUsers(data.users);
        } catch (e) { showToast('Users load failed', true); }
    }

    async function fetchReviews() {
        try {
            const res = await fetch(`${API_BASE}/admin/reviews`, { headers: authHeader });
            const data = await res.json();
            if (data.success) renderReviews(data.reviews);
        } catch (e) { showToast('Reviews load failed', true); }
    }

    async function fetchInquiries() {
        try {
            const res = await fetch(`${API_BASE}/admin/contact`, { headers: authHeader });
            const data = await res.json();
            if (data.success) renderContact(data.inquiries);
        } catch (e) { showToast('Inquiries load failed', true); }
    }

    // 5. RENDERING LOGIC (PROMPT 13)
    function renderOrders(orders) {
        const body = document.getElementById('orders-table-body');
        body.innerHTML = orders.map(o => `
            <tr class="hover:bg-gray-50 dark:hover:bg-spectra-dark-card/30 transition-colors">
                <td class="px-8 py-5 font-mono text-[10px] text-gray-400">#${o.order_id.toString().padStart(6, '0')}</td>
                <td class="px-8 py-5">
                    <div class="font-bold text-sm">${o.customer_name}</div>
                    <div class="text-[10px] text-gray-400 lowercase">${o.customer_email}</div>
                </td>
                <td class="px-8 py-5 font-bold text-sm uppercase">PKR ${o.total_amount.toLocaleString()}</td>
                <td class="px-8 py-5">
                    <select onchange="updateOrderStatus(${o.order_id}, this.value)" class="text-[10px] font-bold uppercase py-1 px-3 rounded-md bg-gray-100 dark:bg-spectra-dark-card border-none outline-none focus:ring-2 focus:ring-spectra-orange transition-all">
                        <option value="pending" ${o.order_status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${o.order_status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${o.order_status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${o.order_status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${o.order_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td class="px-8 py-5 text-right">
                    <span class="text-[10px] font-bold text-gray-400 uppercase">${new Date(o.order_date).toLocaleDateString()}</span>
                </td>
            </tr>
        `).join('');
    }

    function renderInventory(products) {
        const body = document.getElementById('inventory-table-body');
        body.innerHTML = products.map(p => `
            <tr class="hover:bg-gray-50 dark:hover:bg-spectra-dark-card/30 transition-colors">
                <td class="px-8 py-5 flex items-center gap-4">
                    <img src="${p.image_url}" class="w-10 h-10 object-cover rounded-lg shadow-sm">
                    <div class="font-bold text-sm">${p.product_name}</div>
                </td>
                <td class="px-8 py-5 text-[10px] font-bold uppercase text-gray-400">${p.category}</td>
                <td class="px-8 py-5"><span class="font-bold ${p.stock_quantity < 5 ? 'text-red-500 underline decoration-wavy' : ''}">${p.stock_quantity}</span></td>
                <td class="px-8 py-5 font-bold text-sm">PKR ${p.price.toLocaleString()}</td>
                <td class="px-8 py-5 text-right space-x-3">
                    <button onclick='editProduct(${JSON.stringify(p).replace(/'/g, "&apos;")})' class="text-[10px] font-black tracking-widest text-spectra-gold uppercase hover:text-spectra-orange transition-colors">Modify</button>
                    <button onclick="deleteProduct(${p.product_id})" class="text-[10px] font-black tracking-widest text-red-500 uppercase hover:text-red-700">Purge</button>
                </td>
            </tr>
        `).join('');
    }

    function renderUsers(users) {
        const body = document.getElementById('users-table-body');
        body.innerHTML = users.map(u => `
            <tr class="hover:bg-gray-50 dark:hover:bg-spectra-dark-card/30 transition-colors">
                <td class="px-8 py-5">
                    <div class="font-bold text-sm">${u.full_name}</div>
                    <div class="text-[10px] text-gray-400">${u.email}</div>
                </td>
                <td class="px-8 py-5"><span class="px-2 py-1 text-[9px] font-black uppercase rounded bg-gray-100 dark:bg-spectra-dark-card">${u.role}</span></td>
                <td class="px-8 py-5 text-[10px] text-gray-400 uppercase">${new Date(u.created_at).toLocaleDateString()}</td>
                <td class="px-8 py-5"><span class="w-2 h-2 rounded-full inline-block ${u.is_active ? 'bg-green-500' : 'bg-red-500'}"></span></td>
            </tr>
        `).join('');
    }

    function renderReviews(reviews) {
        const body = document.getElementById('reviews-table-body');
        body.innerHTML = reviews.map(r => `
            <tr class="hover:bg-gray-50 dark:hover:bg-spectra-dark-card/30 transition-colors">
                <td class="px-8 py-5 font-bold text-xs uppercase text-spectra-gold">${r.product_name}</td>
                <td class="px-8 py-5">
                    <div class="text-[10px] font-bold uppercase text-gray-400 mb-1">${r.user_name}</div>
                    <div class="text-xs max-w-xs truncate italic">"${r.comment}"</div>
                </td>
                <td class="px-8 py-5 text-yellow-500 text-xs">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</td>
                <td class="px-8 py-5 text-right">
                    <button onclick="deleteReview(${r.review_id})" class="text-[10px] font-black uppercase text-red-500 hover:underline">Moderation: Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function renderContact(inquiries) {
        const body = document.getElementById('contact-table-body');
        body.innerHTML = inquiries.map(i => `
            <tr class="hover:bg-gray-50 dark:hover:bg-spectra-dark-card/30 transition-colors">
                <td class="px-8 py-5 font-bold text-sm">${i.subject}</td>
                <td class="px-8 py-5 text-xs max-w-xs truncate text-gray-500">${i.message}</td>
                <td class="px-8 py-5">
                    <div class="font-bold text-[10px] uppercase">${i.name}</div>
                    <div class="text-[10px] text-spectra-orange">${i.email}</div>
                </td>
                <td class="px-8 py-5">
                    ${i.status === 'pending' 
                        ? `<button onclick="resolveInquiry(${i.inquiry_id})" class="text-[9px] font-black uppercase px-2 py-1 bg-spectra-orange/10 text-spectra-orange hover:bg-spectra-orange hover:text-white rounded transition-all">Resolve</button>`
                        : `<span class="text-[9px] font-black uppercase px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600">Resolved</span>`
                    }
                </td>
            </tr>
        `).join('');
    }

    // 6. ACTIONS (PROMPT 13)
    window.resolveInquiry = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/admin/contact/${id}/resolve`, {
                method: 'PATCH',
                headers: authHeader
            });
            if (res.ok) {
                showToast(`Inquiry #${id} marked as resolved`);
                fetchInquiries();
            }
        } catch (e) { showToast('Resolution failed', true); }
    };
    window.updateOrderStatus = async (id, status) => {
        try {
            const res = await fetch(`${API_BASE}/orders/${id}/status`, {
                method: 'PUT',
                headers: authHeader,
                body: JSON.stringify({ order_status: status })
            });
            if (res.ok) {
                showToast(`Order #${id} -> ${status.toUpperCase()}`);
                fetchOrders(); // Immediate refresh
            }
        } catch (e) { showToast('Protocol failure', true); }
    };

    window.deleteReview = async (id) => {
        if (!confirm('MODERATION ACTION: Delete this customer review permanentely?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/reviews/${id}`, { method: 'DELETE', headers: authHeader });
            if (res.ok) { showToast('Review Purged'); fetchReviews(); }
        } catch (e) { showToast('Moderation failed', true); }
    };

    window.editProduct = (p) => {
        document.getElementById('modal-title').innerText = 'Modify Frame Settings';
        document.getElementById('edit-product-id').value = p.product_id;
        const f = document.getElementById('product-form');
        f.product_name.value = p.product_name;
        f.brand.value = p.brand;
        f.category.value = p.category;
        f.price.value = p.price;
        f.stock_quantity.value = p.stock_quantity;
        f.image_url.value = p.image_url;
        productModal.classList.remove('hidden');
    };

    window.deleteProduct = async (id) => {
        if (!confirm('PURGE ACTION: Delete product from inventory?')) return;
        try {
            const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: authHeader });
            if (res.ok) { showToast('Stock Item Purged'); fetchInventory(); }
        } catch (e) { showToast('Purge failed', true); }
    };

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(productForm);
        const pData = Object.fromEntries(fd.entries());
        const pid = document.getElementById('edit-product-id').value;

        const url = pid ? `${API_BASE}/products/${pid}` : `${API_BASE}/products`;
        const method = pid ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: authHeader,
                body: JSON.stringify(pData)
            });
            if (res.ok) {
                showToast(pid ? 'Settings Synchronized' : 'Asset Created');
                closeProductModal();
                fetchInventory();
            }
        } catch (err) { showToast('Sync failed', true); }
    });

    // 7. UTILITIES
    window.openProductModal = () => {
        document.getElementById('modal-title').innerText = 'Direct Inventory Insertion';
        document.getElementById('edit-product-id').value = '';
        productForm.reset();
        productModal.classList.remove('hidden');
    };

    window.closeProductModal = () => productModal.classList.add('hidden');

    function showToast(msg, isErr = false) {
        toastMsg.innerText = msg;
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
    }

    window.fetchAllData = () => {
        fetchStats(); fetchOrders(); fetchInventory(); fetchUsers(); fetchReviews(); fetchInquiries();
        showToast('Telemetry refreshed');
    };

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_profile');
        window.location.href = 'login.html';
    });

    // 8. INITIAL BOOT
    fetchAllData();
});
