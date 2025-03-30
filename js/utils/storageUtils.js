/**
 * SaveAndServe Storage Utilities
 * This file contains utilities for managing local storage data
 */

const StorageUtils = {
    /**
     * Save data to local storage
     * @param {string} key The key to store the data under
     * @param {any} data The data to store
     */
    saveData: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data to local storage:', error);
            return false;
        }
    },
    
    /**
     * Get data from local storage
     * @param {string} key The key to retrieve data from
     * @returns {any} The retrieved data or null if not found
     */
    getData: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting data from local storage:', error);
            return null;
        }
    },
    
    /**
     * Remove data from local storage
     * @param {string} key The key to remove
     */
    removeData: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing data from local storage:', error);
            return false;
        }
    },
    
    /**
     * Clear all data from local storage
     */
    clearAllData: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing local storage:', error);
            return false;
        }
    },
    
    /**
     * Check if a key exists in local storage
     * @param {string} key The key to check
     * @returns {boolean} True if the key exists, false otherwise
     */
    hasKey: function(key) {
        return localStorage.getItem(key) !== null;
    },
    
    /**
     * Initialize local storage with default data
     */
    initializeStorage: function() {
        // Initialize users if not exists
        if (!this.hasKey('users')) {
            this.saveData('users', {
                recipients: [],
                vendors: []
            });
        }
        
        // Initialize products if not exists
        if (!this.hasKey('products')) {
            this.saveData('products', []);
        }
        
        // Initialize orders if not exists
        if (!this.hasKey('orders')) {
            this.saveData('orders', []);
        }
        
        // Initialize cart if not exists
        if (!this.hasKey('cart')) {
            this.saveData('cart', {
                items: [],
                total: 0
            });
        }
    },
    
    /**
     * Add a new user to local storage
     * @param {string} userType The type of user ('recipient' or 'vendor')
     * @param {object} userData The user data to store
     * @returns {boolean} True if successful, false otherwise
     */
    addUser: function(userType, userData) {
        try {
            if (userType !== 'recipient' && userType !== 'vendor') {
                console.error('Invalid user type. Must be "recipient" or "vendor"');
                return false;
            }
            
            // Generate a unique ID for the user
            userData.id = this.generateUniqueId();
            
            // Add timestamp
            userData.createdAt = new Date().toISOString();
            
            // Get current users
            const users = this.getData('users') || { recipients: [], vendors: [] };
            
            // Add new user to appropriate array
            users[userType + 's'].push(userData);
            
            // Save updated users
            return this.saveData('users', users);
        } catch (error) {
            console.error('Error adding user to local storage:', error);
            return false;
        }
    },
    
    /**
     * Get a user by ID
     * @param {string} userType The type of user ('recipient' or 'vendor')
     * @param {string} userId The ID of the user to retrieve
     * @returns {object|null} The user object or null if not found
     */
    getUserById: function(userType, userId) {
        try {
            if (userType !== 'recipient' && userType !== 'vendor') {
                console.error('Invalid user type. Must be "recipient" or "vendor"');
                return null;
            }
            
            const users = this.getData('users');
            if (!users) return null;
            
            const userArray = users[userType + 's'];
            return userArray.find(user => user.id === userId) || null;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return null;
        }
    },
    
    /**
     * Get a user by email (for login)
     * @param {string} userType The type of user ('recipient' or 'vendor')
     * @param {string} email The email of the user
     * @returns {object|null} The user object or null if not found
     */
    getUserByEmail: function(userType, email) {
        try {
            if (userType !== 'recipient' && userType !== 'vendor') {
                console.error('Invalid user type. Must be "recipient" or "vendor"');
                return null;
            }
            
            const users = this.getData('users');
            if (!users) return null;
            
            const userArray = users[userType + 's'];
            return userArray.find(user => user.email === email) || null;
        } catch (error) {
            console.error('Error getting user by email:', error);
            return null;
        }
    },
    
    /**
     * Update a user's information
     * @param {string} userType The type of user ('recipient' or 'vendor')
     * @param {string} userId The ID of the user to update
     * @param {object} updatedData The updated user data
     * @returns {boolean} True if successful, false otherwise
     */
    updateUser: function(userType, userId, updatedData) {
        try {
            if (userType !== 'recipient' && userType !== 'vendor') {
                console.error('Invalid user type. Must be "recipient" or "vendor"');
                return false;
            }
            
            const users = this.getData('users');
            if (!users) return false;
            
            const userArray = users[userType + 's'];
            const userIndex = userArray.findIndex(user => user.id === userId);
            
            if (userIndex === -1) return false;
            
            // Update user data while preserving id and createdAt
            const originalUser = userArray[userIndex];
            userArray[userIndex] = {
                ...originalUser,
                ...updatedData,
                id: originalUser.id, // Ensure ID doesn't change
                createdAt: originalUser.createdAt, // Preserve creation date
                updatedAt: new Date().toISOString() // Add update timestamp
            };
            
            // Save updated users
            return this.saveData('users', users);
        } catch (error) {
            console.error('Error updating user:', error);
            return false;
        }
    },
    
    /**
     * Delete a user
     * @param {string} userType The type of user ('recipient' or 'vendor')
     * @param {string} userId The ID of the user to delete
     * @returns {boolean} True if successful, false otherwise
     */
    deleteUser: function(userType, userId) {
        try {
            if (userType !== 'recipient' && userType !== 'vendor') {
                console.error('Invalid user type. Must be "recipient" or "vendor"');
                return false;
            }
            
            const users = this.getData('users');
            if (!users) return false;
            
            const userArray = users[userType + 's'];
            const userIndex = userArray.findIndex(user => user.id === userId);
            
            if (userIndex === -1) return false;
            
            // Remove user from array
            userArray.splice(userIndex, 1);
            
            // Save updated users
            return this.saveData('users', users);
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    },
    
    /**
     * Authenticate a user (for login)
     * @param {string} userType The type of user ('recipient' or 'vendor')
     * @param {string} email The user's email
     * @param {string} password The user's password
     * @returns {object|null} The user object if authentication successful, null otherwise
     */
    authenticateUser: function(userType, email, password) {
        try {
            const user = this.getUserByEmail(userType, email);
            
            if (!user) return null;
            
            // In a real application, you would use proper password hashing
            // For this front-end only implementation, we're doing a simple comparison
            if (user.password === password) {
                // Don't return the password to the caller
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }
            
            return null;
        } catch (error) {
            console.error('Error authenticating user:', error);
            return null;
        }
    },
    
    /**
     * Set the current logged in user
     * @param {object} user The user object to store as current user
     * @returns {boolean} True if successful, false otherwise
     */
    setCurrentUser: function(user) {
        return this.saveData('currentUser', user);
    },
    
    /**
     * Generate a unique ID for new entities
     * @returns {string} A unique ID
     */
    generateUniqueId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },
    
    /**
     * Add a product to local storage
     * @param {object} productData The product data to store
     * @returns {boolean} True if successful, false otherwise
     */
    addProduct: function(productData) {
        try {
            // Generate a unique ID for the product
            productData.id = this.generateUniqueId();
            
            // Add timestamps
            productData.createdAt = new Date().toISOString();
            
            // Get current products
            const products = this.getData('products') || [];
            
            // Add new product
            products.push(productData);
            
            // Save updated products
            return this.saveData('products', products);
        } catch (error) {
            console.error('Error adding product to local storage:', error);
            return false;
        }
    },
    
    /**
     * Update a product
     * @param {string} productId The ID of the product to update
     * @param {object} updatedData The updated product data
     * @returns {boolean} True if successful, false otherwise
     */
    updateProduct: function(productId, updatedData) {
        try {
            const products = this.getData('products');
            if (!products) return false;
            
            const productIndex = products.findIndex(product => product.id === productId);
            
            if (productIndex === -1) return false;
            
            // Update product data while preserving id and createdAt
            const originalProduct = products[productIndex];
            products[productIndex] = {
                ...originalProduct,
                ...updatedData,
                id: originalProduct.id, // Ensure ID doesn't change
                createdAt: originalProduct.createdAt, // Preserve creation date
                updatedAt: new Date().toISOString() // Add update timestamp
            };
            
            // Save updated products
            return this.saveData('products', products);
        } catch (error) {
            console.error('Error updating product:', error);
            return false;
        }
    },
    
    /**
     * Delete a product
     * @param {string} productId The ID of the product to delete
     * @returns {boolean} True if successful, false otherwise
     */
    deleteProduct: function(productId) {
        try {
            const products = this.getData('products');
            if (!products) return false;
            
            const productIndex = products.findIndex(product => product.id === productId);
            
            if (productIndex === -1) return false;
            
            // Remove product from array
            products.splice(productIndex, 1);
            
            // Save updated products
            return this.saveData('products', products);
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    },
    
    /**
     * Add an item to the cart
     * @param {object} item The item to add to the cart
     * @returns {boolean} True if successful, false otherwise
     */
    addToCart: function(item) {
        try {
            // Get current cart
            const cart = this.getData('cart') || { items: [], total: 0 };
            
            // Check if item already exists in cart
            const existingItemIndex = cart.items.findIndex(cartItem => cartItem.id === item.id);
            
            if (existingItemIndex !== -1) {
                // Update quantity if item already exists
                cart.items[existingItemIndex].quantity += item.quantity || 1;
            } else {
                // Add new item to cart
                cart.items.push({
                    ...item,
                    quantity: item.quantity || 1
                });
            }
            
            // Recalculate total
            cart.total = cart.items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
            
            // Save updated cart
            return this.saveData('cart', cart);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return false;
        }
    },
    
    /**
     * Remove an item from the cart
     * @param {string} itemId The ID of the item to remove
     * @returns {boolean} True if successful, false otherwise
     */
    removeFromCart: function(itemId) {
        try {
            // Get current cart
            const cart = this.getData('cart');
            if (!cart) return false;
            
            // Remove item from cart
            cart.items = cart.items.filter(item => item.id !== itemId);
            
            // Recalculate total
            cart.total = cart.items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
            
            // Save updated cart
            return this.saveData('cart', cart);
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return false;
        }
    },
    
    /**
     * Update cart item quantity
     * @param {string} itemId The ID of the item to update
     * @param {number} quantity The new quantity
     * @returns {boolean} True if successful, false otherwise
     */
    updateCartItemQuantity: function(itemId, quantity) {
        try {
            // Get current cart
            const cart = this.getData('cart');
            if (!cart) return false;
            
            // Find item in cart
            const itemIndex = cart.items.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return false;
            
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
            
            // Remove item if quantity is 0
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
            
            // Recalculate total
            cart.total = cart.items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
            
            // Save updated cart
            return this.saveData('cart', cart);
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            return false;
        }
    },
    
    /**
     * Clear the cart
     * @returns {boolean} True if successful, false otherwise
     */
    clearCart: function() {
        return this.saveData('cart', { items: [], total: 0 });
    },
    
    /**
     * Create a new order
     * @param {object} orderData The order data
     * @returns {string|null} The order ID if successful, null otherwise
     */
    createOrder: function(orderData) {
        try {
            // Generate a unique ID for the order
            const orderId = this.generateUniqueId();
            orderData.id = orderId;
            
            // Add timestamps
            orderData.createdAt = new Date().toISOString();
            orderData.status = orderData.status || 'pending';
            
            // Get current orders
            const orders = this.getData('orders') || [];
            
            // Add new order
            orders.push(orderData);
            
            // Save updated orders
            if (this.saveData('orders', orders)) {
                return orderId;
            }
            
            return null;
        } catch (error) {
            console.error('Error creating order:', error);
            return null;
        }
    },
    
    /**
     * Update an order's status
     * @param {string} orderId The ID of the order to update
     * @param {string} status The new status
     * @returns {boolean} True if successful, false otherwise
     */
    updateOrderStatus: function(orderId, status) {
        try {
            const orders = this.getData('orders');
            if (!orders) return false;
            
            const orderIndex = orders.findIndex(order => order.id === orderId);
            
            if (orderIndex === -1) return false;
            
            // Update status
            orders[orderIndex].status = status;
            orders[orderIndex].updatedAt = new Date().toISOString();
            
            // Save updated orders
            return this.saveData('orders', orders);
        } catch (error) {
            console.error('Error updating order status:', error);
            return false;
        }
    },
    
    /**
     * Get orders by user ID
     * @param {string} userId The ID of the user
     * @param {string} userType The type of user ('recipient' or 'vendor')
     * @returns {array} Array of orders
     */
    getOrdersByUser: function(userId, userType) {
        try {
            const orders = this.getData('orders') || [];
            
            // Filter orders by user ID based on user type
            if (userType === 'recipient') {
                return orders.filter(order => order.recipientId === userId);
            } else if (userType === 'vendor') {
                return orders.filter(order => order.vendorId === userId);
            }
            
            return [];
        } catch (error) {
            console.error('Error getting orders by user:', error);
            return [];
        }
    }
}