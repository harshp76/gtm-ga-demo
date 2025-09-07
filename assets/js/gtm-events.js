// Google Tag Manager Enhanced Ecommerce Event Tracking
// Updated to match GA4 Enhanced Ecommerce specifications
// Reference: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm

// Initialize GTM dataLayer if not exists
window.dataLayer = window.dataLayer || [];

// Helper function to format items for GA4 Enhanced Ecommerce
function formatItemsForGA4(items) {
    return items.map((item, index) => ({
        item_id: item.id ? item.id.toString() : '',
        item_name: item.name || '',
        affiliation: 'ShopDemo Online Store',
        coupon: '', // Add coupon if applicable
        currency: 'INR',
        discount: 0, // Add discount if applicable
        index: index,
        item_brand: 'ShopDemo', // Add actual brand if available
        item_category: item.category || 'General',
        item_category2: '', // Add sub-category if applicable
        item_category3: '', // Add sub-sub-category if applicable
        item_category4: '', // Add sub-sub-sub-category if applicable
        item_category5: '', // Add sub-sub-sub-sub-category if applicable
        item_list_id: 'product_list', // Add list ID if applicable
        item_list_name: 'All Products', // Add list name if applicable
        item_variant: '', // Add variant if applicable (size, color, etc.)
        location_id: 'IN', // Location ID
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1
    }));
}

// Helper function to get current cart items formatted for GA4
function getCartItemsForGA4() {
    if (!window.cart || window.cart.length === 0) {
        return [];
    }
    return formatItemsForGA4(window.cart);
}

// Helper function to calculate total value
function calculateEventValue(items) {
    return items.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        return total + (price * quantity);
    }, 0);
}

// 1. Add to Cart Event
function fireAddToCartEvent(product, quantity = 1) {
    if (!product) {
        console.error('Product data is required for add_to_cart event');
        return;
    }

    const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        category: product.category || 'General'
    };

    const items = formatItemsForGA4([item]);
    const value = calculateEventValue([item]);

    // Push to dataLayer
    window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce data
    window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
            currency: 'INR',
            value: value,
            items: items
        }
    });

    console.log('GTM Event: add_to_cart', {
        product: product.name,
        quantity: quantity,
        value: value,
        items: items
    });
}

// 2. Remove from Cart Event
function fireRemoveFromCartEvent(product, quantity = 1) {
    if (!product) {
        console.error('Product data is required for remove_from_cart event');
        return;
    }

    const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        category: product.category || 'General'
    };

    const items = formatItemsForGA4([item]);
    const value = calculateEventValue([item]);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
            currency: 'INR',
            value: value,
            items: items
        }
    });

    console.log('GTM Event: remove_from_cart', {
        product: product.name,
        quantity: quantity,
        value: value,
        items: items
    });
}

// 3. View Cart Event
function fireViewCartEvent() {
    const cartItems = getCartItemsForGA4();
    
    if (cartItems.length === 0) {
        console.log('Cart is empty, skipping view_cart event');
        return;
    }

    const value = calculateEventValue(window.cart || []);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
            currency: 'INR',
            value: value,
            items: cartItems
        }
    });

    console.log('GTM Event: view_cart', {
        items_count: cartItems.length,
        value: value,
        items: cartItems
    });
}

// 4. Begin Checkout Event
function fireBeginCheckoutEvent() {
    const cartItems = getCartItemsForGA4();
    
    if (cartItems.length === 0) {
        console.log('Cart is empty, skipping begin_checkout event');
        return;
    }

    const value = calculateEventValue(window.cart || []);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
            currency: 'INR',
            value: value,
            items: cartItems
        }
    });

    console.log('GTM Event: begin_checkout', {
        items_count: cartItems.length,
        value: value,
        items: cartItems
    });
}

// 5. Add Shipping Info Event
function fireAddShippingInfoEvent() {
    const cartItems = getCartItemsForGA4();
    
    if (cartItems.length === 0) {
        console.log('Cart is empty, skipping add_shipping_info event');
        return;
    }

    const value = calculateEventValue(window.cart || []);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'add_shipping_info',
        ecommerce: {
            currency: 'INR',
            value: value,
            shipping_tier: 'Standard',
            items: cartItems
        }
    });

    console.log('GTM Event: add_shipping_info', {
        items_count: cartItems.length,
        value: value,
        shipping_tier: 'Standard',
        items: cartItems
    });
}

// 6. Add Payment Info Event
function fireAddPaymentInfoEvent() {
    const cartItems = getCartItemsForGA4();
    
    if (cartItems.length === 0) {
        console.log('Cart is empty, skipping add_payment_info event');
        return;
    }

    const value = calculateEventValue(window.cart || []);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'add_payment_info',
        ecommerce: {
            currency: 'INR',
            value: value,
            payment_type: 'credit_card',
            items: cartItems
        }
    });

    console.log('GTM Event: add_payment_info', {
        items_count: cartItems.length,
        value: value,
        payment_type: 'credit_card',
        items: cartItems
    });
}

// 7. Purchase Event
function firePurchaseEvent(orderData = null) {
    let purchaseItems, purchaseValue, transactionId;

    if (orderData && orderData.items) {
        // Use provided order data (from thank you page)
        purchaseItems = formatItemsForGA4(orderData.items);
        purchaseValue = orderData.total || calculateEventValue(orderData.items);
        transactionId = orderData.id || 'ORD' + Date.now();
    } else {
        // Use current cart data
        const cartItems = getCartItemsForGA4();
        if (cartItems.length === 0) {
            console.log('No items to purchase, skipping purchase event');
            return;
        }
        
        purchaseItems = cartItems;
        purchaseValue = calculateEventValue(window.cart || []);
        transactionId = 'ORD' + Date.now();
    }

    const shippingCost = window.SHIPPING_COST || 99;
    const tax = 0; // No tax in this demo

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
            transaction_id: transactionId,
            affiliation: 'ShopDemo Online Store',
            value: purchaseValue,
            tax: tax,
            shipping: shippingCost,
            currency: 'INR',
            coupon: '', // Add coupon code if applicable
            items: purchaseItems
        }
    });

    console.log('GTM Event: purchase', {
        transaction_id: transactionId,
        value: purchaseValue,
        tax: tax,
        shipping: shippingCost,
        items_count: purchaseItems.length,
        items: purchaseItems
    });
}

// 8. View Item Event (Product Details Page)
function fireViewItemEvent(product) {
    if (!product) {
        console.error('Product data is required for view_item event');
        return;
    }

    const items = formatItemsForGA4([{
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category || 'General'
    }]);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
            currency: 'INR',
            value: parseFloat(product.price) || 0,
            items: items
        }
    });

    console.log('GTM Event: view_item', {
        product: product.name,
        value: product.price,
        items: items
    });
}

// 9. View Item List Event (Products Page)
function fireViewItemListEvent(productList, listName = 'All Products', listId = 'product_list') {
    if (!productList || productList.length === 0) {
        console.log('No products to display in list');
        return;
    }

    const items = productList.map((product, index) => ({
        item_id: product.id ? product.id.toString() : '',
        item_name: product.name || '',
        affiliation: 'ShopDemo Online Store',
        currency: 'INR',
        discount: 0,
        index: index,
        item_brand: 'ShopDemo',
        item_category: product.category || 'General',
        item_list_id: listId,
        item_list_name: listName,
        item_variant: '',
        location_id: 'IN',
        price: parseFloat(product.price) || 0,
        quantity: 1
    }));

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'view_item_list',
        ecommerce: {
            item_list_id: listId,
            item_list_name: listName,
            items: items
        }
    });

    console.log('GTM Event: view_item_list', {
        list_name: listName,
        list_id: listId,
        items_count: items.length,
        items: items
    });
}

// 10. Select Item Event (When clicking on product)
function fireSelectItemEvent(product, listName = 'All Products', listId = 'product_list') {
    if (!product) {
        console.error('Product data is required for select_item event');
        return;
    }

    const items = [{
        item_id: product.id ? product.id.toString() : '',
        item_name: product.name || '',
        affiliation: 'ShopDemo Online Store',
        currency: 'INR',
        discount: 0,
        index: 0,
        item_brand: 'ShopDemo',
        item_category: product.category || 'General',
        item_list_id: listId,
        item_list_name: listName,
        item_variant: '',
        location_id: 'IN',
        price: parseFloat(product.price) || 0,
        quantity: 1
    }];

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'select_item',
        ecommerce: {
            item_list_id: listId,
            item_list_name: listName,
            items: items
        }
    });

    console.log('GTM Event: select_item', {
        product: product.name,
        list_name: listName,
        list_id: listId,
        items: items
    });
}

// Additional Enhanced Ecommerce Events

// Search Event
function fireSearchEvent(searchTerm, resultsCount = 0) {
    window.dataLayer.push({
        event: 'search',
        search_term: searchTerm,
        number_of_results: resultsCount
    });

    console.log('GTM Event: search', {
        search_term: searchTerm,
        number_of_results: resultsCount
    });
}

// Newsletter Signup Event
function fireNewsletterSignupEvent(email) {
    window.dataLayer.push({
        event: 'sign_up',
        method: 'newsletter',
        user_email: email, // Be careful with PII
        signup_location: window.location.pathname
    });

    console.log('GTM Event: sign_up (newsletter)', {
        method: 'newsletter',
        location: window.location.pathname
    });
}

// Custom Events for Business Insights

// Category View Event
function fireCategoryViewEvent(categoryName, productCount) {
    window.dataLayer.push({
        event: 'view_promotion',
        creative_name: categoryName,
        creative_slot: 'category_banner',
        promotion_id: categoryName.toLowerCase().replace(' ', '_'),
        promotion_name: `${categoryName} Category`,
        items_count: productCount
    });

    console.log('GTM Event: view_promotion (category)', {
        category: categoryName,
        products: productCount
    });
}

// Filter Applied Event
function fireFilterAppliedEvent(filterType, filterValue) {
    window.dataLayer.push({
        event: 'select_content',
        content_type: 'filter',
        content_id: `${filterType}_${filterValue}`.toLowerCase(),
        custom_parameters: {
            filter_type: filterType,
            filter_value: filterValue
        }
    });

    console.log('GTM Event: select_content (filter)', {
        type: filterType,
        value: filterValue
    });
}

// Error Events
function fireErrorEvent(errorType, errorMessage, errorLocation) {
    window.dataLayer.push({
        event: 'exception',
        description: errorMessage,
        fatal: false,
        error_type: errorType,
        error_location: errorLocation
    });

    console.log('GTM Event: exception', {
        type: errorType,
        message: errorMessage,
        location: errorLocation
    });
}

// Page View Enhancement
function fireEnhancedPageView(pageTitle, pageLocation, customParameters = {}) {
    window.dataLayer.push({
        event: 'page_view',
        page_title: pageTitle,
        page_location: pageLocation,
        content_group1: customParameters.section || 'main',
        content_group2: customParameters.category || 'general',
        user_properties: {
            cart_items_count: (window.cart || []).length,
            user_type: (window.cart || []).length > 0 ? 'engaged' : 'visitor'
        }
    });

    console.log('GTM Event: page_view (enhanced)', {
        title: pageTitle,
        location: pageLocation,
        cart_items: (window.cart || []).length
    });
}

// Auto-trigger events based on user behavior
document.addEventListener('DOMContentLoaded', function() {
    // Fire enhanced page view
    fireEnhancedPageView(document.title, window.location.href);
    
    // Track page abandonment for cart users
    let abandonmentTimeout;
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && window.cart && window.cart.length > 0) {
            abandonmentTimeout = setTimeout(() => {
                // Fire a custom cart abandonment event
                window.dataLayer.push({
                    event: 'cart_abandonment',
                    ecommerce: {
                        currency: 'INR',
                        value: calculateEventValue(window.cart || []),
                        items: getCartItemsForGA4()
                    }
                });
            }, 30000); // 30 seconds
        } else if (abandonmentTimeout) {
            clearTimeout(abandonmentTimeout);
        }
    });
});

// Debug mode for GTM events
const GTM_DEBUG = true; // Set to false for production

if (GTM_DEBUG) {
    console.log('GTM Enhanced Ecommerce Events - Debug Mode Enabled');
    
    // Override dataLayer push for debugging
    const originalPush = window.dataLayer.push;
    window.dataLayer.push = function(data) {
        console.log('🏷️ GTM DataLayer Push:', data);
        return originalPush.apply(window.dataLayer, arguments);
    };
}

// Export functions for global use
window.GTMEvents = {
    fireAddToCartEvent,
    fireRemoveFromCartEvent,
    fireViewCartEvent,
    fireBeginCheckoutEvent,
    fireAddShippingInfoEvent,
    fireAddPaymentInfoEvent,
    firePurchaseEvent,
    fireViewItemEvent,
    fireViewItemListEvent,
    fireSelectItemEvent,
    fireSearchEvent,
    fireNewsletterSignupEvent,
    fireCategoryViewEvent,
    fireFilterAppliedEvent,
    fireErrorEvent,
    fireEnhancedPageView,
    formatItemsForGA4,
    calculateEventValue
};
