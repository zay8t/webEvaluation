/**
 * Order History Controller
 * Fetches and displays past orders with status tracking
 */

document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = '/api';
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');
    const token = localStorage.getItem('auth_token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    async function fetchOrders() {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (!data.success) throw new Error(data.message);

            renderOrders(data.orders);
        } catch (error) {
            console.error('Fetch Orders Error:', error);
            ordersList.innerHTML = `<p class="text-red-500 text-center">Failed to load orders: ${error.message}</p>`;
        }
    }

    function renderOrders(orders) {
        if (!orders || orders.length === 0) {
            ordersList.innerHTML = '';
            noOrders.classList.remove('hidden');
            return;
        }

        noOrders.classList.add('hidden');
        ordersList.innerHTML = orders.map(order => {
            const date = new Date(order.order_date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            });

            const statusColors = {
                'pending': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                'processing': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                'shipped': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                'delivered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                'cancelled': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            };

            const statusClass = statusColors[order.order_status] || 'bg-gray-100';

            return `
                <div class="bg-white dark:bg-spectra-dark-surface rounded-2xl border border-spectra-border dark:border-spectra-dark-border overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div class="p-6 border-b border-gray-100 dark:border-spectra-dark-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <span class="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">Order Placed</span>
                            <span class="font-bold">${date}</span>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">Total Amount</span>
                            <span class="font-bold text-spectra-orange">${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(order.total_amount)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">Status</span>
                            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass}">${order.order_status}</span>
                        </div>
                        <div class="md:text-right">
                            <span class="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">Order #</span>
                            <span class="font-mono font-bold">ORD-${order.order_id}</span>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        ${order.items.map(item => `
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-gray-50 dark:bg-spectra-dark-card rounded-lg overflow-hidden border border-spectra-border dark:border-spectra-dark-border">
                                    <img src="${item.image_url}" class="w-full h-full object-cover">
                                </div>
                                <div class="flex-grow">
                                    <h5 class="text-sm font-bold">${item.product_name}</h5>
                                    <p class="text-[10px] text-gray-400 uppercase tracking-widest">${item.brand} | Qty: ${item.quantity}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-bold">${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(item.price)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    ${order.order_status === 'pending' ? `
                        <div class="px-6 py-4 bg-gray-50 dark:bg-spectra-dark-card/50 border-t border-gray-100 dark:border-spectra-dark-border flex justify-end">
                            <button onclick="cancelOrder(${order.order_id})" class="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                Cancel Order
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    window.cancelOrder = async (id) => {
        if (!confirm('Are you sure you want to cancel this order? Item stock will be restored.')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (!data.success) throw new Error(data.message);

            alert('Order cancelled successfully.');
            fetchOrders(); // Refresh list
        } catch (error) {
            alert(error.message);
        }
    };

    fetchOrders();
});
