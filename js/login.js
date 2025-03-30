/**
 * SaveAndServe Login JavaScript
 * This file contains the login functionality for the SaveAndServe platform
 */

// Import utilities
import StorageUtils from './utils/storageUtils.js';

// Initialize the login page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize form validation
    setupFormValidation();
});

/**
 * Set up event listeners for the login page
 */
function setupEventListeners() {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Recipient login form submission
    const recipientLoginForm = document.getElementById('recipientLoginForm');
    if (recipientLoginForm) {
        recipientLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('recipientEmail').value;
            const password = document.getElementById('recipientPassword').value;
            const remember = document.getElementById('recipientRemember').checked;
            
            // Attempt login
            loginUser(email, password, 'recipient', remember);
        });
    }
    
    // Vendor login form submission
    const vendorLoginForm = document.getElementById('vendorLoginForm');
    if (vendorLoginForm) {
        vendorLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('vendorEmail').value;
            const password = document.getElementById('vendorPassword').value;
            const remember = document.getElementById('vendorRemember').checked;
            
            // Attempt login
            loginUser(email, password, 'vendor', remember);
        });
    }
}

/**
 * Set up form validation for login forms
 */
function setupFormValidation() {
    // Add validation classes to form inputs on blur
    const formInputs = document.querySelectorAll('form input[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });
}

/**
 * Attempt to login a user
 * @param {string} email User's email
 * @param {string} password User's password
 * @param {string} userType Type of user ('recipient' or 'vendor')
 * @param {boolean} remember Whether to remember the user
 */
function loginUser(email, password, userType, remember) {
    // Get users from storage
    const users = StorageUtils.getData('users');
    
    if (!users) {
        showLoginError('Erro no sistema. Por favor, tente novamente mais tarde.');
        return;
    }
    
    // Determine which user list to check
    const userList = userType === 'recipient' ? users.recipients : users.vendors;
    
    // Find user by email
    const user = userList.find(u => u.email === email);
    
    if (!user) {
        showLoginError('Email ou senha incorretos.');
        return;
    }
    
    // Check password
    if (user.password !== password) { // In a real app, use proper password hashing
        showLoginError('Email ou senha incorretos.');
        return;
    }
    
    // Login successful
    const currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: userType,
        remember: remember
    };
    
    // Save current user to storage
    StorageUtils.saveData('currentUser', currentUser);
    
    // Redirect to appropriate page
    if (userType === 'recipient') {
        window.location.href = '../index.html'; // Redirect to home page for recipients
    } else {
        window.location.href = 'vendor-dashboard.html'; // Redirect to dashboard for vendors
    }
}

/**
 * Show login error message
 * @param {string} message Error message to display
 */
function showLoginError(message) {
    // Check if error alert already exists
    let errorAlert = document.querySelector('.login-error');
    
    if (!errorAlert) {
        // Create error alert
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger login-error mt-3';
        errorAlert.role = 'alert';
        
        // Get the active tab pane
        const activePane = document.querySelector('.tab-pane.active');
        if (activePane) {
            // Insert error alert before the form
            const form = activePane.querySelector('form');
            if (form) {
                form.insertAdjacentElement('beforebegin', errorAlert);
            }
        }
    }
    
    // Set error message
    errorAlert.textContent = message;
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorAlert.remove();
    }, 5000);
}