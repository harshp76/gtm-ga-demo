// Main JavaScript file for ecommerce website
// Handles cart operations, navigation, and general functionality

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
const SHIPPING_COST = 99;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
});

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to hardcoded products
        products = getDefaultProducts();
    }
}

// Default products if JSON fails to load
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: "Wireless Headphones",
            price: 2999,
            description: "High-quality wireless headphones with noise cancellation feature. Perfect for music lovers and professionals.",
            image: "Wireless Headphones Image",
            category: "Electronics"
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 8999,
            description: "Feature-rich smartwatch with health monitoring, GPS tracking, and smartphone connectivity.",
            image: "Smart Watch Image",
            category: "Electronics"
        },
        {
            id: 3,
            name: "Laptop Stand",
            price: 1499,
            description: "Ergonomic laptop stand for better posture and improved workspace organization.",
            image: "Laptop Stand Image",
            category: "Accessories"
        },
        {
            id: 4,
            name: "USB-C Hub",
            price: 2499,
            description: "Multi-port USB-C hub with fast charging capability and multiple connectivity options.",
            image: "USB-C Hub Image",
            category: "Electronics"
        },
        {
            id: 5,
            name: "Bluetooth Speaker",
            price: 3999,
            description: "Portable Bluetooth speaker with rich bass and crystal clear sound quality.",
            image: "Bluetooth Speaker Image",
            category: "Electronics"
        },
        {
            id: 6,
            name: "Phone Case",
            price: 799,
            description: "Protective phone case with elegant design and superior drop protection.",
            image: "Phone Case Image",
            category: "Accessories"
        }
    ];
}

// Cart Operations
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

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
    fireAddToCartEvent(product, quantity);
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartCount();
        showNotification(`${removedItem.name} removed from cart`);
        
        // Refresh cart display if on cart page
        if (window.location.pathname.includes('cart.html')) {
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
            if (window.location.pathname.includes('cart.html')) {
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
        element.textContent = totalItems;
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
    fireAddShippingInfoEvent();
    fireAddPaymentInfoEvent();
    
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
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('orderDate').textContent = new Date(orderData.date).toLocaleDateString();
    document.getElementById('orderTotal').textContent = orderData.total.toLocaleString();
    
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
    firePurchaseEvent(orderData);
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
    return products.find(product => product.id === parseInt(id));
}

// URL Parameter Helper
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
