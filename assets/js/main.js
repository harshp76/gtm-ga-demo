// Main JavaScript file for ecommerce website
// Handles cart operations, navigation, and general functionality

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
const SHIPPING_COST = 99;

// Default products (embedded to avoid CORS issues)
const defaultProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 2999,
        description: "High-quality wireless headphones with noise cancellation feature. Perfect for music lovers and professionals who demand crystal clear audio quality.",
        image: "Wireless Headphones Image",
        category: "Electronics",
        inStock: true,
        sku: "WH001",
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 8999,
        description: "Feature-rich smartwatch with health monitoring, GPS tracking, and smartphone connectivity. Track your fitness goals and stay connected on the go.",
        image: "Smart Watch Image",
        category: "Electronics",
        inStock: true,
        sku: "SW002",
        rating: 4.3,
        reviews: 89
    },
    {
        id: 3,
        name: "Laptop Stand",
        price: 1499,
        description: "Ergonomic laptop stand for better posture and improved workspace organization. Made from premium aluminum with adjustable height settings.",
        image: "Laptop Stand Image",
        category: "Accessories",
        inStock: true,
        sku: "LS003",
        rating: 4.7,
        reviews: 156
    },
    {
        id: 4,
        name: "USB-C Hub",
        price: 2499,
        description: "Multi-port USB-C hub with fast charging capability and multiple connectivity options. Expand your laptop's connectivity with ease.",
        image: "USB-C Hub Image",
        category: "Electronics",
        inStock: true,
        sku: "UH004",
        rating: 4.4,
        reviews: 73
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 3999,
        description: "Portable Bluetooth speaker with rich bass and crystal clear sound quality. Waterproof design perfect for outdoor adventures.",
        image: "Bluetooth Speaker Image",
        category: "Electronics",
        inStock: true,
        sku: "BS005",
        rating: 4.6,
        reviews: 204
    },
    {
        id: 6,
        name: "Phone Case",
        price: 799,
        description: "Protective phone case with elegant design and superior drop protection. Available in multiple colors to match your style.",
        image: "Phone Case Image",
        category: "Accessories",
        inStock: true,
        sku: "PC006",
        rating: 4.2,
        reviews: 92
    },
    {
        id: 7,
        name: "Wireless Mouse",
        price: 1299,
        description: "Ergonomic wireless mouse with precision tracking and long battery life. Perfect for work and gaming applications.",
        image: "Wireless Mouse Image",
        category: "Electronics",
        inStock: true,
        sku: "WM007",
        rating: 4.3,
        reviews: 67
    },
    {
        id: 8,
        name: "Power Bank",
        price: 1999,
        description: "High-capacity power bank with fast charging support. Keep your devices powered throughout the day with 20000mAh capacity.",
        image: "Power Bank Image",
        category: "Electronics",
        inStock: true,
        sku: "PB008",
        rating: 4.5,
        reviews: 143
    },
    {
        id: 9,
        name: "Desk Organizer",
        price: 899,
        description: "Wooden desk organizer to keep your workspace tidy and organized. Multiple compartments for pens, papers, and accessories.",
        image: "Desk Organizer Image",
        category: "Accessories",
        inStock: true,
        sku: "DO009",
        rating: 4.1,
        reviews: 45
    },
    {
        id: 10,
        name: "LED Desk Lamp",
        price: 2299,
        description: "Adjustable LED desk lamp with multiple brightness levels and color temperatures. Perfect for reading and working late hours.",
        image: "LED Desk Lamp Image",
        category: "Accessories",
        inStock: true,
        sku: "DL010",
        rating: 4.4,
        reviews: 78
    },
    {
        id: 11,
        name: "Wireless Earbuds",
        price: 4999,
        description: "True wireless earbuds with active noise cancellation and premium sound quality. Comfortable fit for all-day listening.",
        image: "Wireless Earbuds Image",
        category: "Electronics",
        inStock: true,
        sku: "WE011",
        rating: 4.7,
        reviews: 189
    },
    {
        id: 12,
        name: "Keyboard Cover",
        price: 599,
        description: "Silicone keyboard cover to protect your laptop keyboard from dust and spills. Ultra-thin design maintains typing comfort.",
        image: "Keyboard Cover Image",
        category: "Accessories",
        inStock: true,
        sku: "KC012",
        rating: 4.0,
        reviews: 34
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
async function initializeApp() {
    await loadProducts();
    updateCartCount();
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'index':
            loadFeaturedProducts();
            break;
        case 'products':
            loadAllProducts();
            break;
        case 'product-details':
            loadProductDetails();
            loadRelatedProducts();
            break;
        case 'cart':
            displayCart();
            fireViewCartEvent();
            break;
        case 'checkout':
            displayCheckoutItems();
            fireBeginCheckoutEvent();
            setupFormValidation();
            break;
        case 'thank-you':
            displayOrderConfirmation();
            break;
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page;
}

// Load products - try JSON first, fallback to embedded data
async function loadProducts() {
    try {
        // Try to load from JSON file first
        const response = await fetch('./data/products.json');
        if (response.ok) {
            products = await response.json();
            console.log('Products loaded from JSON file');
        } else {
            throw new Error('Failed to load JSON');
        }
    } catch (error) {
        console.log('Using embedded product data');
        products = defaultProducts;
    }
    
    // Ensure products are loaded
    if (products.length === 0) {
        products = defaultProducts;
    }
    
    console.log(`${products.length} products loaded successfully`);
}

// Cart Operations
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
    
    // Fire GTM add_to_cart event
    if (typeof fireAddToCartEvent === 'function') {
        fireAddToCartEvent(product, quantity);
    }
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        const product = getProductById(productId);
        
        // Fire GTM remove_from_cart event before removing
        if (product && typeof fireRemoveFromCartEvent === 'function') {
            fireRemoveFromCartEvent(product, removedItem.quantity);
        }
        
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartCount();
        showNotification(`${removedItem.name} removed from cart`);
        
        // Refresh cart display if on cart page
        if (getCurrentPage() === 'cart') {
            displayCart();
        }
    }
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            
            // Refresh displays
            if (getCurrentPage() === 'cart') {
                displayCart();
            }
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
        }
    });
}

// Cart Display Functions
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummaryContainer = document.getElementById('cartSummary');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items to your cart</p>
                <a href="products.html" class="btn">Browse Products</a>
            </div>
        `;
        if (cartSummaryContainer) {
            cartSummaryContainer.style.display = 'none';
        }
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price.toLocaleString()}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    // Update totals
    updateCartTotals();
    
    if (cartSummaryContainer) {
        cartSummaryContainer.style.display = 'block';
    }
}

function updateCartTotals() {
    const subtotal = calculateSubtotal();
    const total = subtotal + (subtotal > 0 ? SHIPPING_COST : 0);
    
    // Update all total elements
    const elements = {
        'subtotalAmount': subtotal,
        'shippingAmount': subtotal > 0 ? SHIPPING_COST : 0,
        'totalAmount': total,
        'checkoutSubtotal': subtotal,
        'checkoutShipping': subtotal > 0 ? SHIPPING_COST : 0,
        'checkoutTotal': total
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    });
}

function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    return subtotal + (subtotal > 0 ? SHIPPING_COST : 0);
}

// Checkout Functions
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    if (!checkoutItemsContainer || cart.length === 0) return;
    
    checkoutItemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <div class="item-details">Qty: ${item.quantity} × ₹${item.price.toLocaleString()}</div>
            </div>
            <div class="item-total">₹${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');
    
    updateCartTotals();
}

function isShippingFormValid() {
    const form = document.getElementById('shippingForm');
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('input[required]');
    return Array.from(requiredFields).every(field => field.value.trim() !== '');
}

function isPaymentFormValid() {
    const form = document.getElementById('paymentForm');
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('input[required]');
    return Array.from(requiredFields).every(field => field.value.trim() !== '');
}

function completeOrder() {
    // Validate forms
    if (!isShippingFormValid()) {
        showNotification('Please fill in all shipping information', 'error');
        return;
    }
    
    if (!isPaymentFormValid()) {
        showNotification('Please fill in all payment information', 'error');
        return;
    }
    
    // Generate order ID and store order data
    const orderId = 'ORD' + Date.now();
    const orderData = {
        id: orderId,
        items: [...cart],
        total: calculateTotal(),
        date: new Date().toISOString(),
        shipping: getShippingData(),
        payment: getPaymentData()
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Fire GTM events
    if (typeof fireAddShippingInfoEvent === 'function') {
        fireAddShippingInfoEvent();
    }
    if (typeof fireAddPaymentInfoEvent === 'function') {
        fireAddPaymentInfoEvent();
    }
    
    // Clear cart and redirect
    clearCart();
    window.location.href = `thank-you.html?order=${orderId}`;
}

function getShippingData() {
    const form = document.getElementById('shippingForm');
    if (!form) return {};
    
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

function getPaymentData() {
    return {
        method: 'credit_card',
        // Don't store sensitive payment info
        last4: '****'
    };
}

// Thank You Page Functions
function displayOrderConfirmation() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    const orderData = JSON.parse(localStorage.getItem('lastOrder') || '{}');
    
    if (!orderId || !orderData.id) {
        // Redirect to home if no order data
        window.location.href = 'index.html';
        return;
    }
    
    // Update order information
    const orderIdElement = document.getElementById('orderId');
    const orderDateElement = document.getElementById('orderDate');
    const orderTotalElement = document.getElementById('orderTotal');
    
    if (orderIdElement) orderIdElement.textContent = orderId;
    if (orderDateElement) orderDateElement.textContent = new Date(orderData.date).toLocaleDateString();
    if (orderTotalElement) orderTotalElement.textContent = orderData.total.toLocaleString();
    
    // Display ordered items
    const orderedItemsContainer = document.getElementById('orderedItems');
    if (orderedItemsContainer && orderData.items) {
        orderedItemsContainer.innerHTML = orderData.items.map(item => `
            <div class="ordered-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('');
    }
    
    // Fire purchase event
    if (typeof firePurchaseEvent === 'function') {
        firePurchaseEvent(orderData);
    }
}

// Form validation setup
function setupFormValidation() {
    // Add shipping info event
    const shippingInputs = document.querySelectorAll('#shippingForm input');
    shippingInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (isShippingFormValid()) {
                if (typeof fireAddShippingInfoEvent === 'function') {
                    fireAddShippingInfoEvent();
                }
            }
        });
    });

    // Add payment info event
    const paymentInputs = document.querySelectorAll('#paymentForm input');
    paymentInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (isPaymentFormValid()) {
                if (typeof fireAddPaymentInfoEvent === 'function') {
                    fireAddPaymentInfoEvent();
                }
            }
        });
    });
}

// Utility Functions
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#ff4757'};
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Remove notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function formatPrice(price) {
    return `₹${price.toLocaleString()}`;
}

function getProductById(id) {
    const productsToUse = window.products || products || [];
    return productsToUse.find(product => product.id === parseInt(id));
}

// URL Parameter Helper
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
