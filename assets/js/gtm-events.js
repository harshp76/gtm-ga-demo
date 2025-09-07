// Google Tag Manager Enhanced Ecommerce Event Tracking
// This file handles all GTM ecommerce events for the website

// Initialize GTM dataLayer if not exists
window.dataLayer = window.dataLayer || [];

// Helper function to format items for GTM
function formatItemsForGTM(items) {
    return items.map(item => ({
        item_id: item.id.toString(),
        item_name: item.name,
        currency: 'INR',
        price: item.price,
        quantity: item.quantity || 1,
        item_category: item.category || 'General'
    }));
}

// Helper function to get cart items formatted for GTM
function getCartItemsForGTM() {
    return formatItemsForGTM(cart);
}

// 1. Add to Cart Event
function fireAddToCartEvent(product, quantity = 1) {
    const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        category: product.category || 'General'
    };

    window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
            currency: 'INR',
            value: product.price * quantity,
            items: formatItemsForGTM([item])
        }
    });

    console.log('GTM Event: add_to_cart', {
        product: product.name,
        quantity: quantity,
        value: product.price * quantity
        // items: formatItemsForGTM([item])
    });
}

// 2. View Cart Event
function fireViewCartEvent() {
    if (cart.length === 0) return;

    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
            currency: 'INR',
            value: totalValue,
            items: getCartItemsForGTM()
        }
    });

    console.log('GTM Event: view_cart', {
        items: cart.length,
        value: totalValue
    });
}

// 3. Begin Checkout Event
function fireBeginCheckoutEvent() {
    if (cart.length === 0) return;

    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
            currency: 'INR',
            value: totalValue,
            items: getCartItemsForGTM()
        }
    });

    console.log('GTM Event: begin_checkout', {
        items: cart.length,
        value: totalValue
    });
}

// 4. Add Shipping Info Event
function fireAddShippingInfoEvent() {
    if (cart.length === 0) return;

    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    window.dataLayer.push({
        event: 'add_shipping_info',
        ecommerce: {
            currency: 'INR',
            value: totalValue,
            shipping_tier: 'Standard',
            items: getCartItemsForGTM()
        }
    });

    console.log('GTM Event: add_shipping_info', {
        items: cart.length,
        value: totalValue
    });
}

// 5. Add Payment Info Event
function fireAddPaymentInfoEvent() {
    if (cart.length === 0) return;

    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    window.dataLayer.push({
        event: 'add_payment_info',
        ecommerce: {
            currency: 'INR',
            value: totalValue,
            payment_type: 'credit_card',
            items: getCartItemsForGTM()
        }
    });

    console.log('GTM Event: add_payment_info', {
        items: cart.length,
        value: totalValue,
        payment_type: 'credit_card'
    });
}

// 6. Purchase Event
function firePurchaseEvent(orderData = null) {
    let purchaseData;

    if (orderData) {
        // Use provided order data (from thank you page)
        purchaseData = {
            transaction_id: orderData.id,
            value: orderData.total,
            items: formatItemsForGTM(orderData.items)
        };
    } else {
        // Use current cart data
        if (cart.length === 0) return;
        
        const orderId = 'ORD' + Date.now();
        const totalValue = calculateTotal();
        
        purchaseData = {
            transaction_id: orderId,
            value: totalValue,
            items: getCartItemsForGTM()
        };
    }

    window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
            currency: 'INR',
            transaction_id: purchaseData.transaction_id,
            value: purchaseData.value,
            shipping: SHIPPING_COST,
            tax: 0, // No tax in this demo
            items: purchaseData.items
        }
    });

    console.log('GTM Event: purchase', {
        transaction_id: purchaseData.transaction_id,
        value: purchaseData.value,
        items: purchaseData.items.length
    });
}

// Additional Enhanced Ecommerce Events (Optional)

// View Item Event (Product Details Page)
function fireViewItemEvent(product) {
    window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
            currency: 'INR',
            value: product.price,
            items: [{
                item_id: product.id.toString(),
                item_name: product.name,
                currency: 'INR',
                price: product.price,
                quantity: 1,
                item_category: product.category || 'General'
            }]
        }
    });

    console.log('GTM Event: view_item', {
        product: product.name,
        value: product.price
    });
}

// View Item List Event (Products Page)
function fireViewItemListEvent(products, listName = 'Product Listing') {
    window.dataLayer.push({
        event: 'view_item_list',
        ecommerce: {
            item_list_name: listName,
            items: products.map((product, index) => ({
                item_id: product.id.toString(),
                item_name: product.name,
                currency: 'INR',
                price: product.price,
                quantity: 1,
                item_category: product.category || 'General',
                index: index
            }))
        }
    });

    console.log('GTM Event: view_item_list', {
        list: listName,
        items: products.length
    });
}

// Select Item Event (When clicking on product)
function fireSelectItemEvent(product, listName = 'Product Listing') {
    window.dataLayer.push({
        event: 'select_item',
        ecommerce: {
            item_list_name: listName,
            items: [{
                item_id: product.id.toString(),
                item_name: product.name,
                currency: 'INR',
                price: product.price,
                quantity: 1,
                item_category: product.category || 'General'
            }]
        }
    });

    console.log('GTM Event: select_item', {
        product: product.name,
        list: listName
    });
}

// Remove from Cart Event
function fireRemoveFromCartEvent(product, quantity = 1) {
    window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
            currency: 'INR',
            value: product.price * quantity,
            items: [{
                item_id: product.id.toString(),
                item_name: product.name,
                currency: 'INR',
                price: product.price,
                quantity: quantity,
                item_category: product.category || 'General'
            }]
        }
    });

    console.log('GTM Event: remove_from_cart', {
        product: product.name,
        quantity: quantity,
        value: product.price * quantity
    });
}

// Search Event
function fireSearchEvent(searchTerm, resultsCount = 0) {
    window.dataLayer.push({
        event: 'search',
        search_term: searchTerm,
        results_count: resultsCount
    });

    console.log('GTM Event: search', {
        term: searchTerm,
        results: resultsCount
    });
}

// Newsletter Signup Event
function fireNewsletterSignupEvent(email) {
    window.dataLayer.push({
        event: 'newsletter_signup',
        user_email: email,
        signup_location: window.location.pathname
    });

    console.log('GTM Event: newsletter_signup', {
        location: window.location.pathname
    });
}

// Page View Event (Enhanced)
function firePageViewEvent(pageTitle, pageLocation) {
    window.dataLayer.push({
        event: 'page_view',
        page_title: pageTitle,
        page_location: pageLocation,
        user_type: cart.length > 0 ? 'engaged' : 'visitor'
    });

    console.log('GTM Event: page_view', {
        title: pageTitle,
        location: pageLocation
    });
}

// Custom Events for Business Insights

// Category View Event
function fireCategoryViewEvent(categoryName, productCount) {
    window.dataLayer.push({
        event: 'category_view',
        category_name: categoryName,
        product_count: productCount
    });

    console.log('GTM Event: category_view', {
        category: categoryName,
        products: productCount
    });
}

// Filter Applied Event
function fireFilterAppliedEvent(filterType, filterValue) {
    window.dataLayer.push({
        event: 'filter_applied',
        filter_type: filterType,
        filter_value: filterValue
    });

    console.log('GTM Event: filter_applied', {
        type: filterType,
        value: filterValue
    });
}

// Sort Applied Event
function fireSortAppliedEvent(sortType) {
    window.dataLayer.push({
        event: 'sort_applied',
        sort_type: sortType
    });

    console.log('GTM Event: sort_applied', {
        type: sortType
    });
}

// Cart Abandonment Event (when user leaves with items in cart)
function fireCartAbandonmentEvent() {
    if (cart.length === 0) return;

    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    window.dataLayer.push({
        event: 'cart_abandonment',
        ecommerce: {
            currency: 'INR',
            value: totalValue,
            items: getCartItemsForGTM()
        }
    });

    console.log('GTM Event: cart_abandonment', {
        items: cart.length,
        value: totalValue
    });
}

// Product Recommendation Click Event
function fireRecommendationClickEvent(product, recommendationType) {
    window.dataLayer.push({
        event: 'recommendation_click',
        ecommerce: {
            currency: 'INR',
            value: product.price,
            items: [{
                item_id: product.id.toString(),
                item_name: product.name,
                currency: 'INR',
                price: product.price,
                quantity: 1,
                item_category: product.category || 'General'
            }]
        },
        recommendation_type: recommendationType
    });

    console.log('GTM Event: recommendation_click', {
        product: product.name,
        type: recommendationType
    });
}

// Checkout Step Events (for detailed funnel analysis)
function fireCheckoutStepEvent(step, stepName, options = {}) {
    if (cart.length === 0) return;

    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    window.dataLayer.push({
        event: 'checkout_step',
        ecommerce: {
            currency: 'INR',
            value: totalValue,
            items: getCartItemsForGTM()
        },
        checkout_step: step,
        checkout_step_name: stepName,
        ...options
    });

    console.log('GTM Event: checkout_step', {
        step: step,
        name: stepName,
        value: totalValue
    });
}

// Error Events
function fireErrorEvent(errorType, errorMessage, errorLocation) {
    window.dataLayer.push({
        event: 'error',
        error_type: errorType,
        error_message: errorMessage,
        error_location: errorLocation
    });

    console.log('GTM Event: error', {
        type: errorType,
        message: errorMessage,
        location: errorLocation
    });
}

// Auto-trigger events based on user behavior
document.addEventListener('DOMContentLoaded', function() {
    // Track page abandonment for cart users
    let isPageActive = true;
    let abandonmentTimeout;

    // Set up visibility change detection
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && cart.length > 0) {
            // User switched tab/minimized with items in cart
            abandonmentTimeout = setTimeout(() => {
                if (!isPageActive) {
                    fireCartAbandonmentEvent();
                }
            }, 30000); // 30 seconds
        } else {
            isPageActive = true;
            if (abandonmentTimeout) {
                clearTimeout(abandonmentTimeout);
            }
        }
    });

    // Track page before user leaves
    window.addEventListener('beforeunload', function() {
        isPageActive = false;
        if (cart.length > 0) {
            fireCartAbandonmentEvent();
        }
    });

    // Fire page view event
    firePageViewEvent(document.title, window.location.href);
});

// Debug mode for GTM events
const GTM_DEBUG = false; // Set to true for debugging

if (GTM_DEBUG) {
    // Override console.log for GTM events
    const originalLog = console.log;
    console.log = function(...args) {
        if (args[0] && args[0].includes('GTM Event')) {
            originalLog.apply(console, ['🏷️', ...args]);
        } else {
            originalLog.apply(console, args);
        }
    };
}

// Export functions for global use
window.GTMEvents = {
    fireAddToCartEvent,
    fireViewCartEvent,
    fireBeginCheckoutEvent,
    fireAddShippingInfoEvent,
    fireAddPaymentInfoEvent,
    firePurchaseEvent,
    fireViewItemEvent,
    fireViewItemListEvent,
    fireSelectItemEvent,
    fireRemoveFromCartEvent,
    fireSearchEvent,
    fireNewsletterSignupEvent,
    firePageViewEvent,
    fireCategoryViewEvent,
    fireFilterAppliedEvent,
    fireSortAppliedEvent,
    fireCartAbandonmentEvent,
    fireRecommendationClickEvent,
    fireCheckoutStepEvent,
    fireErrorEvent
};
