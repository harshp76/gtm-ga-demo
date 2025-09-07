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
            description
