/**
 * Products Controller - Handles data fetching, filtering, and UI updates
 * for the Eyewear Catalog.
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filter-form');
    const priceSlider = document.getElementById('price-slider');
    const priceDisplay = document.getElementById('price-display');
    const productGrid = document.getElementById('product-grid');
    const productCountText = document.getElementById('product-count');
    const emptyState = document.getElementById('empty-state');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const sortSelect = document.getElementById('sort-select');

    let allProducts = [];
    let debounceTimer;

    /**
     * Fetch products from the API with optional query parameters
     */
    async function fetchProducts(queryParams = '') {
        try {
            // Show skeleton loaders if grid is empty
            if (productGrid.children.length === 0 || !productGrid.querySelector('.animate-pulse')) {
                renderSkeletons();
            }

            const response = await fetch(`/api/products${queryParams}`);
            const data = await response.json();

            if (data.success) {
                allProducts = data.products;
                renderProducts(allProducts);
            } else {
                console.error('Failed to fetch products:', data.message);
                showEmptyState(true);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            showEmptyState(true);
        }
    }

    /**
     * Render product cards into the grid
     */
    function renderProducts(products) {
        productGrid.innerHTML = '';
        
        if (products.length === 0) {
            showEmptyState(true);
            productCountText.innerText = 'No products found';
            return;
        }

        showEmptyState(false);
        productCountText.innerText = `Showing ${products.length} product${products.length === 1 ? '' : 's'}`;

        // Apply sorting before render (client-side sorting for responsiveness)
        const sortedProducts = sortProducts(products, sortSelect.value);

        sortedProducts.forEach(product => {
            const card = createProductCard(product);
            productGrid.appendChild(card);
        });
    }

    /**
     * Create a single product card element
     */
    function createProductCard(product) {
        const div = document.createElement('div');
        div.setAttribute('data-product-id', product.product_id);
        div.className = 'product-card group bg-white dark:bg-spectra-dark-surface rounded-2xl border border-spectra-border dark:border-spectra-dark-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full';
        
        const priceFormatted = new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0
        }).format(product.price);

        // Fallback image if image_url is missing
        const imageUrl = product.image_url || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800';

        div.innerHTML = `
            <div class="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-spectra-dark-card">
                <img src="${imageUrl}" alt="${product.product_name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors"></div>
                <div class="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span class="px-2 py-1 bg-white/90 dark:bg-spectra-dark-surface/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                        ${product.brand}
                    </span>
                    ${product.stock_quantity < 5 ? '<span class="px-2 py-1 bg-spectra-orange text-white text-[10px] font-bold uppercase rounded-md shadow-sm">Low Stock</span>' : ''}
                </div>
                <button class="add-to-cart absolute bottom-4 left-4 right-4 py-2.5 bg-spectra-navy text-white text-sm font-bold rounded-xl shadow-lg hover:bg-spectra-orange transition-colors flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Add to Cart
                </button>
            </div>
            <div class="p-5 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] text-spectra-orange font-bold uppercase tracking-widest">${product.category}</span>
                    <span class="text-xs text-gray-400 capitalize">${product.gender}</span>
                </div>
                <h3 class="font-serif text-lg font-bold italic mb-3 flex-1">${product.product_name}</h3>
                <div class="flex items-center justify-between mt-auto">
                    <span class="text-xl font-bold font-sans">${priceFormatted}</span>
                    <div class="flex gap-1">
                        <div class="w-3 h-3 rounded-full bg-black border border-white"></div>
                        <div class="w-3 h-3 rounded-full bg-amber-800 border border-white"></div>
                    </div>
                </div>
            </div>
        `;

        // Add event listener to the "Add to Cart" button
        const addToCartBtn = div.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product, addToCartBtn);
        });

        return div;
    }

    /**
     * Cart Management Logic
     */
    function addToCart(product, btnElement) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        const existingItem = cart.find(item => item.product_id === product.product_id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                product_id: product.product_id,
                product_name: product.product_name,
                price: product.price,
                image_url: product.image_url,
                brand: product.brand,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Visual feedback
        const btn = btnElement || document.querySelector(`[data-product-id="${product.product_id}"] .add-to-cart`);
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<svg class="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg> Added!';
            btn.classList.add('bg-green-600');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('bg-green-600');
            }, 1500);
        }
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const countBadge = document.querySelector('header .relative span');
        if (countBadge) {
            countBadge.innerText = count;
            countBadge.classList.toggle('hidden', count === 0);
        }
    }

    /**
     * Show/Hide empty state
     */
    function showEmptyState(show) {
        if (show) {
            productGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
        } else {
            productGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            emptyState.classList.remove('flex');
        }
    }

    /**
     * Render skeletons during loading
     */
    function renderSkeletons() {
        productGrid.innerHTML = Array(6).fill(0).map(() => `
            <div class="animate-pulse bg-white dark:bg-spectra-dark-surface rounded-2xl border border-spectra-border dark:border-spectra-dark-border overflow-hidden shadow-sm aspect-[4/5]"></div>
        `).join('');
    }

    /**
     * Build query string from form data
     */
    function buildQueryString() {
        const formData = new FormData(filterForm);
        const params = new URLSearchParams();

        // Group checkboxes (brand, frame_type)
        const brands = [];
        const frameTypes = [];

        for (const [key, value] of formData.entries()) {
            if (key === 'brand') brands.push(value);
            else if (key === 'frame_type') frameTypes.push(value);
            else if (value) params.append(key, value);
        }

        if (brands.length > 0) params.append('brand', brands.join(','));
        if (frameTypes.length > 0) params.append('frame_type', frameTypes.join(','));

        const qs = params.toString();
        return qs ? `?${qs}` : '';
    }

    /**
     * Sort products locally
     */
    function sortProducts(products, sortBy) {
        const items = [...products];
        switch (sortBy) {
            case 'price-low':
                return items.sort((a, b) => a.price - b.price);
            case 'price-high':
                return items.sort((a, b) => b.price - a.price);
            case 'newest':
            default:
                return items.sort((a, b) => b.product_id - a.product_id); // Assuming higher ID is newer
        }
    }

    /**
     * Dynamic update on filter change
     */
    function handleFilterUpdate() {
        const queryString = buildQueryString();
        fetchProducts(queryString);
    }

    /**
     * Debounced price slider update
     */
    function handlePriceSlider(e) {
        const val = e.target.value;
        priceDisplay.innerText = `Max: ${new Intl.NumberFormat('en-PK').format(val)} PKR`;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            handleFilterUpdate();
        }, 300);
    }

    // Event Listeners
    filterForm.addEventListener('change', (e) => {
        // Range slider is handled separately with debounce
        if (e.target.name === 'max_price') return;
        handleFilterUpdate();
    });

    filterForm.addEventListener('input', (e) => {
        // Search field update (could also be debounced but 'change' or 'input' choice depends on UX)
        if (e.target.name === 'search') {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => handleFilterUpdate(), 500);
        }
    });

    priceSlider.addEventListener('input', handlePriceSlider);

    sortSelect.addEventListener('change', () => {
        renderProducts(allProducts);
    });

    clearFiltersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        filterForm.reset();
        priceDisplay.innerText = 'Max: 50,000 PKR';
        handleFilterUpdate();
    });

    // Initial Fetch
    fetchProducts();
    updateCartCount();
});
