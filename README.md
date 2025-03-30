# SaveAndServe

SaveAndServe is a platform designed to connect food donors/vendors with recipients, helping reduce food waste and serve those in need. This project implements a front-end only solution using HTML, Bootstrap, and JavaScript without any frameworks.

## Project Overview

SaveAndServe aims to create a user-friendly platform where:

- **Vendors/Donors** can register, list available food items, manage orders, and track their impact
- **Recipients** can browse available food items, place orders, and track deliveries

This implementation focuses on creating a functional front-end with mock data persistence using local storage to simulate back-end functionality.

## Technology Stack

- **HTML5** - For structure and content
- **CSS3/Bootstrap** - For responsive design and styling
- **JavaScript** - For client-side functionality and data management
- **Local Storage** - For client-side data persistence

## Features

### High Priority Features

- **User Authentication**
  - Registration and login for both vendors/donors and recipients
  - Password recovery system

- **Vendor/Donor Dashboard**
  - Product/food item registration
  - Sales dashboard with donation summary and impact reports
  - Messaging system to communicate with recipients

- **Food Listing and Shopping**
  - Vendor listing with filtering options
  - Food items listing with detailed views
  - Shopping cart functionality

- **Order Processing**
  - Order checkout with delivery options
  - Order status tracking
  - Vendor rating system

- **User Profiles and Dashboards**
  - User profile management
  - Purchase history for recipients

### Low Priority Features

- Home page with platform information
- About us page
- Contact and support page
- Footer with links to policies

## Project Structure

```
SaveAndServe/
├── assets/            # Images, icons, and other static assets
├── css/               # CSS files including Bootstrap and custom styles
├── js/                # JavaScript files
│   ├── data/          # Mock data and data management
│   ├── controllers/   # Page controllers
│   └── utils/         # Utility functions
├── pages/             # HTML pages
├── index.html         # Main entry point
├── README.md          # Project documentation
└── Requirements.md    # Original requirements
```

## Setup and Installation

1. Clone the repository
   ```
   git clone [repository-url]
   cd SaveAndServe
   ```

2. No build process is required as this is a front-end only project using vanilla HTML, CSS, and JavaScript

3. Open `index.html` in your browser to start using the application

## Development Plan

The development is organized into phases, focusing on high-priority features first:

1. Project Setup and Structure
2. Mock Data Implementation
3. User Authentication
4. Vendor/Donor Dashboard
5. Food Listing and Shopping
6. Order Processing
7. User Profiles and Dashboards
8. General Pages
9. Navigation and UI Integration
10. Testing and Deployment
11. Post-Launch

For detailed information about each phase, refer to the `plan.md` file.

## Data Management

Since this is a front-end only implementation, all data is managed client-side:

- User data, products, orders, and messages are stored in the browser's local storage
- JavaScript modules handle CRUD operations for all data types
- Search and filter functionality is implemented client-side

## Future Enhancements

- Integration with a real back-end system
- Progressive enhancement to modern frameworks
- Mobile application development
- Advanced analytics and reporting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[License information]