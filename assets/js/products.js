// Product-related functions for ecommerce website
// Handles product display, filtering, and product-specific operations

// Load featured products on homepage
function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProducts');
    if (!featuredGrid) return;

    // Wait for products to load
    if (products.length === 0) {
        setTimeout(loadFeaturedProducts, 100);
        return;
    }

    const featuredProducts = products.slice(0, 3);
    featuredGrid.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Load all products on products page
function loadAllProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    // Wait for products to load
    if (products.length === 0) {
        setTimeout(loadAllProducts, 100);
        return;
    }

    productGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">${product.image}</div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">₹${product.price.toLocaleString()}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-actions">
                <button class="btn" onclick="viewProduct(${product.id})">View Details</button>
                <button class="btn btn-secondary" onclick="addToCart(${product.id})" style="margin-left: 10px;">Add to Cart</button>
            </div>
        </div>
    `;
}

// View product details
function viewProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Load product details on product details page
function loadProductDetails() {
    const productId = getUrlParameter('id');
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    // Wait for products to load
    if (products.length === 0) {
        setTimeout(loadProductDetails, 100);
        return;
    }

    const product = getProductById(productId);
    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    displayProductDetails(product);
    updateProductBreadcrumb(product.name);
    
    // Update page title
    document.title = `${product.name} - ShopDemo`;
}

// Display product details
function displayProductDetails(product) {
    const detailsContent = document.getElementById('productDetailsContent');
    if (!detailsContent) return;

    detailsContent.innerHTML = `
        <div class="product-details-grid">
            <div>
                <div class="product-image" style="height: 400px; font-size: 1.2rem;">${product.image}</div>
            </div>
            <div class="product-details-info">
                <h1>${product.name}</h1>
                <p class="price">₹${product.price.toLocaleString()}</p>
                <div class="product-meta">
                    <p><strong>Category:</strong> ${product.category || 'General'}</p>
                    <p><strong>SKU:</strong> SKU${product.id.toString().padStart(6, '0')}</p>
                    <p><strong>Availability:</strong> <span style="color: #27ae60;">In Stock</span></p>
                </div>
                <p class="description">${product.description}</p>
                <div class="product-actions">
                    <div class="quantity-selector" style="margin-bottom: 1rem;">
                        <label for="quantity" style="margin-right: 1rem;">Quantity:</label>
                        <button class="quantity-btn" onclick="changeDetailQuantity(-1)">-</button>
                        <span id="detailQuantity" style="margin: 0 1rem; font-weight: bold;">1</span>
                        <button class="quantity-btn" onclick="changeDetailQuantity(1)">+</button>
                    </div>
                    <button class="btn btn-secondary" onclick="addDetailToCart(${product.id})" style="margin-right: 1rem;">Add to Cart</button>
                    <button class="btn" onclick="window.history.back()">Back</button>
                </div>
                <div class="product-features" style="margin-top: 2rem;">
                    <h3>Features</h3>
                    <ul style="margin-top: 1rem; padding-left: 1rem;">
                        <li>High-quality materials</li>
                        <li>1-year warranty</li>
                        <li>Free shipping available</li>
                        <li>30-day return policy</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Change quantity in product details
let detailQuantity = 1;
function changeDetailQuantity(change) {
    detailQuantity = Math.max(1, detailQuantity + change);
    document.getElementById('detailQuantity').textContent = detailQuantity;
}

// Add to cart from product details
function addDetailToCart(productId) {
    addToCart(productId, detailQuantity);
    detailQuantity = 1; // Reset quantity
    document.getElementById('detailQuantity').textContent = detailQuantity;
}

// Update product breadcrumb
function updateProductBreadcrumb(productName) {
    const breadcrumb = document.getElementById('productBreadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = productName;
    }
}

// Load related products
function loadRelatedProducts() {
    const relatedGrid = document.getElementById('relatedProducts');
    const productId = getUrlParameter('id');
    
    if (!relatedGrid || !productId) return;

    // Wait for products to load
    if (products.length === 0) {
        setTimeout(loadRelatedProducts, 100);
        return;
    }

    const currentProduct = getProductById(productId);
    if (!currentProduct) return;

    // Get products from same category or random products
    let relatedProducts = products.filter(p => 
        p.id !== currentProduct.id && 
        (p.category === currentProduct.category || !currentProduct.category)
    );

    // If not enough related products, fill with others
    if (relatedProducts.length < 3) {
        const otherProducts = products.filter(p => 
            p.id !== currentProduct.id && 
            !relatedProducts.find(rp => rp.id === p.id)
        );
        relatedProducts = [...relatedProducts, ...otherProducts];
    }

    // Limit to 3 products
    relatedProducts = relatedProducts.slice(0, 3);

    relatedGrid.innerHTML = relatedProducts.map(product => createProductCard(product)).join('');
}

// Product search functionality
function searchProducts(query) {
    if (!query.trim()) return products;
    
    const searchTerm = query.toLowerCase().trim();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.category && product.category.toLowerCase().includes(searchTerm))
    );
}

// Filter products by category
function filterProductsByCategory(category) {
    if (!category || category === 'all') return products;
    
    return products.filter(product => 
        product.category && product.category.toLowerCase() === category.toLowerCase()
    );
}

// Sort products
function sortProducts(sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'name':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sortedProducts;
    }
}

// Get product categories
function getProductCategories() {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ['All', ...categories];
}

// Product recommendation based on cart
function getRecommendedProducts() {
    if (cart.length === 0) return products.slice(0, 4);
    
    // Get categories of items in cart
    const cartCategories = cart.map(item => {
        const product = getProductById(item.id);
        return product ? product.category : null;
    }).filter(Boolean);
    
    // Recommend products from same categories
    const recommended = products.filter(product => 
        !cart.find(item => item.id === product.id) && // Not in cart
        cartCategories.includes(product.category) // Same category
    );
    
    // Fill with other products if needed
    if (recommended.length < 4) {
        const others = products.filter(product => 
            !cart.find(item => item.id === product.id) &&
            !recommended.find(rec => rec.id === product.id)
        );
        recommended.push(...others);
    }
    
    return recommended.slice(0, 4);
}

// Quick view product (for future implementation)
function quickViewProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // This could open a modal with product details
    console.log('Quick view for:', product);
    // For now, just redirect to product page
    viewProduct(productId);
}

// Add to wishlist (for future implementation)
function addToWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.find(item => item.id === productId)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification(`${product.name} added to wishlist!`);
    } else {
        showNotification(`${product.name} is already in your wishlist`);
    }
}

// Compare products (for future implementation)
function addToCompare(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    let compareList = JSON.parse(localStorage.getItem('compareList')) || [];
    
    if (compareList.length >= 3) {
        showNotification('You can compare maximum 3 products at a time', 'error');
        return;
    }
    
    if (!compareList.find(item => item.id === productId)) {
        compareList.push(product);
        localStorage.setItem('compareList', JSON.stringify(compareList));
        showNotification(`${product.name} added to compare list!`);
    } else {
        showNotification(`${product.name} is already in compare list`);
    }
}
