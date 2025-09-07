# Ecommerce Demo Website

A complete ecommerce demo website with Google Tag Manager (GTM) integration and enhanced ecommerce tracking. Built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

### 📱 **Multi-Page Structure**
- **Homepage** - Hero section with featured products
- **Product Listing** - Complete product catalog
- **Product Details** - Detailed product information with quantity selector
- **Shopping Cart** - Add/remove items with quantity controls
- **Checkout** - Shipping and payment information forms
- **Thank You** - Order confirmation with order details

### 🛒 **Ecommerce Functionality**
- Add multiple products to cart
- Update quantities and remove items
- Persistent cart using localStorage
- Real-time cart count in navigation
- Complete checkout flow with form validation
- Order confirmation with generated order ID

### 📊 **GTM Enhanced Ecommerce Tracking**
- `add_to_cart` - Product added to cart
- `view_cart` - Cart page viewed
- `begin_checkout` - Checkout process started
- `add_shipping_info` - Shipping information added
- `add_payment_info` - Payment information added
- `purchase` - Order completed successfully
- `view_item` - Product details viewed
- `view_item_list` - Product listing viewed
- `select_item` - Product clicked from listing

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Smooth animations and hover effects
- Professional gradient navigation
- Clean product cards with image placeholders
- Interactive cart and checkout forms
- Newsletter subscription section

## 📁 Project Structure

```
ecommerce-demo/
├── index.html                  # Homepage
├── products.html              # Product listing page
├── product-details.html       # Product details page
├── cart.html                  # Shopping cart page
├── checkout.html              # Checkout page
├── thank-you.html             # Order confirmation page
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       ├── main.js            # Core functionality
│       ├── products.js        # Product-related functions
│       └── gtm-events.js      # GTM event tracking
├── data/
│   └── products.json          # Product data
├── README.md                  # Project documentation
└── .gitignore                # Git ignore rules
```

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-demo.git
cd ecommerce-demo
```

### 2. GTM Setup
1. Create a Google Tag Manager container at [tagmanager.google.com](https://tagmanager.google.com)
2. Replace `GTM-XXXXXXX` in all HTML files with your actual GTM Container ID
3. Configure Enhanced Ecommerce in your GA4 property through GTM

### 3. Local Development
- Open `index.html` in a web browser to view locally
- For best results, serve files through a local web server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

### 4. GitHub Pages Deployment
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select "Deploy from a branch" and choose "main" branch
4. Your site will be available at: `https://YOUR_USERNAME.github.io/ecommerce-demo`

## 🏷️ GTM Configuration

### Required GTM Tags

#### 1. GA4 Configuration Tag
- Tag Type: Google Analytics: GA4 Configuration
- Measurement ID: Your GA4 Measurement ID
- Trigger: All Pages

#### 2. Enhanced Ecommerce Tags
Create triggers for each ecommerce event:
- `add_to_cart`
- `view_cart`
- `begin_checkout`
- `add_shipping_info`
- `add_payment_info`
- `purchase`

#### 3. Sample GA4 Event Tag Configuration
```
Tag Type: Google Analytics: GA4 Event
Event Name: {{Event}}
Parameters:
- currency: {{Ecommerce Currency}}
- value: {{Ecommerce Value}}
- items: {{Ecommerce Items}}
```

### Enhanced Ecommerce Variables
Create the following variables in GTM:
- `Ecommerce Currency` (Data Layer Variable: ecommerce.currency)
- `Ecommerce Value` (Data Layer Variable: ecommerce.value)
- `Ecommerce Items` (Data Layer Variable: ecommerce.items)

## 💰 Sample Products

The demo includes 12 sample products with INR pricing:
- Electronics: Headphones, Smart Watch, USB-C Hub, etc.
- Accessories: Laptop Stand, Phone Case, Desk Organizer, etc.
- Price range: ₹599 - ₹8,999

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (< 768px)

## 🔧 Customization

### Adding New Products
1. Edit `data/products.json` to add new products
2. Follow the existing JSON structure:
```json
{
    "id": 13,
    "name": "Product Name",
    "price": 1999,
    "description": "Product description",
    "image": "Product Image",
    "category": "Category",
    "inStock": true,
    "sku": "SKU013",
    "rating": 4.5,
    "reviews": 100
}
```

### Styling Changes
- Main styles are in `assets/css/style.css`
- CSS custom properties are used for easy theming
- Responsive breakpoints are clearly defined

### Functionality Extensions
- Core functions are in `assets/js/main.js`
- Product-specific functions in `assets/js/products.js`
- GTM events can be extended in `assets/js/gtm-events.js`

## 🧪 Testing GTM Events

### Using GTM Preview Mode
1. Enable Preview mode in GTM
2. Navigate through the website
3. Verify events are firing correctly
4. Check data layer in GTM debugger

### Using GA4 DebugView
1. Add `?debug_mode=1` to your URL
2. Events should appear in GA4 DebugView in real-time
3. Verify ecommerce data is correctly formatted

## 📊 Analytics Insights

The GTM implementation tracks:
- **Conversion Funnel**: View Product → Add to Cart → Checkout → Purchase
- **Cart Behavior**: Items added, removed, quantities changed
- **Product Performance**: Most viewed, most purchased items
- **Revenue Tracking**: Total sales, average order value
- **User Journey**: Page views, engagement, abandonment points

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Verify GTM container ID is correctly set
3. Ensure all files are properly served (not file:// protocol)
4. Check that localStorage is enabled in browser

## 🔮 Future Enhancements

- [ ] Product search and filtering
- [ ] User authentication system
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Payment gateway integration
- [ ] Order tracking system
- [ ] Admin dashboard

---

**Note**: This is a demo website for educational purposes. For production use, implement proper security measures, backend integration, and payment processing.
