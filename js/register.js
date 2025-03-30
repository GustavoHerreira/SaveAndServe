/**
 * SaveAndServe Registration JavaScript
 * This file contains the registration functionality for the SaveAndServe platform
 */

// Import utilities
import StorageUtils from './utils/storageUtils.js';

// Initialize the registration page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize storage if needed
    StorageUtils.initializeStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize form validation
    setupFormValidation();
});

/**
 * Set up event listeners for the registration page
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
    
    // Recipient registration form submission
    const recipientRegistrationForm = document.getElementById('recipientRegistrationForm');
    if (recipientRegistrationForm) {
        recipientRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateRecipientForm()) {
                return;
            }
            
            // Get form values
            const userData = {
                name: document.getElementById('recipientName').value,
                cpf: document.getElementById('recipientCPF').value,
                email: document.getElementById('recipientEmail').value,
                password: document.getElementById('recipientPassword').value,
                phone: document.getElementById('recipientPhone').value,
                address: document.getElementById('recipientAddress').value,
                city: document.getElementById('recipientCity').value,
                state: document.getElementById('recipientState').value,
                zipCode: document.getElementById('recipientZipCode').value,
                termsAccepted: document.getElementById('recipientTerms').checked
            };
            
            // Register user
            registerUser('recipient', userData);
        });
    }
    
    // Vendor registration form submission
    const vendorRegistrationForm = document.getElementById('vendorRegistrationForm');
    if (vendorRegistrationForm) {
        vendorRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateVendorForm()) {
                return;
            }
            
            // Get form values
            const userData = {
                type: document.getElementById('vendorType').value,
                name: document.getElementById('vendorName').value,
                document: document.getElementById('vendorDocument').value,
                email: document.getElementById('vendorEmail').value,
                password: document.getElementById('vendorPassword').value,
                phone: document.getElementById('vendorPhone').value,
                address: document.getElementById('vendorAddress').value,
                city: document.getElementById('vendorCity').value,
                state: document.getElementById('vendorState').value,
                zipCode: document.getElementById('vendorZipCode').value,
                categories: getSelectedCategories(),
                description: document.getElementById('vendorDescription').value,
                termsAccepted: document.getElementById('vendorTerms').checked
            };
            
            // Register user
            registerUser('vendor', userData);
        });
    }
    
    // Handle vendor type change
    const vendorType = document.getElementById('vendorType');
    if (vendorType) {
        vendorType.addEventListener('change', function() {
            const documentLabel = document.querySelector('label[for="vendorDocument"]');
            const documentInput = document.getElementById('vendorDocument');
            
            if (this.value === 'individual') {
                documentLabel.textContent = 'CPF';
                documentInput.placeholder = '000.000.000-00';
            } else {
                documentLabel.textContent = 'CNPJ';
                documentInput.placeholder = '00.000.000/0000-00';
            }
        });
    }
}

/**
 * Set up form validation for registration forms
 */
function setupFormValidation() {
    // Add validation classes to form inputs on blur
    const formInputs = document.querySelectorAll('form input[required], form select[required]');
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
    
    // Validate password confirmation for recipient
    const recipientPassword = document.getElementById('recipientPassword');
    const recipientConfirmPassword = document.getElementById('recipientConfirmPassword');
    
    if (recipientPassword && recipientConfirmPassword) {
        recipientConfirmPassword.addEventListener('input', function() {
            if (this.value !== recipientPassword.value) {
                this.setCustomValidity('As senhas não coincidem');
                this.classList.add('is-invalid');
            } else {
                this.setCustomValidity('');
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        
        recipientPassword.addEventListener('input', function() {
            if (recipientConfirmPassword.value && this.value !== recipientConfirmPassword.value) {
                recipientConfirmPassword.setCustomValidity('As senhas não coincidem');
                recipientConfirmPassword.classList.add('is-invalid');
            } else if (recipientConfirmPassword.value) {
                recipientConfirmPassword.setCustomValidity('');
                recipientConfirmPassword.classList.remove('is-invalid');
                recipientConfirmPassword.classList.add('is-valid');
            }
        });
    }
    
    // Validate password confirmation for vendor
    const vendorPassword = document.getElementById('vendorPassword');
    const vendorConfirmPassword = document.getElementById('vendorConfirmPassword');
    
    if (vendorPassword && vendorConfirmPassword) {
        vendorConfirmPassword.addEventListener('input', function() {
            if (this.value !== vendorPassword.value) {
                this.setCustomValidity('As senhas não coincidem');
                this.classList.add('is-invalid');
            } else {
                this.setCustomValidity('');
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        
        vendorPassword.addEventListener('input', function() {
            if (vendorConfirmPassword.value && this.value !== vendorConfirmPassword.value) {
                vendorConfirmPassword.setCustomValidity('As senhas não coincidem');
                vendorConfirmPassword.classList.add('is-invalid');
            } else if (vendorConfirmPassword.value) {
                vendorConfirmPassword.setCustomValidity('');
                vendorConfirmPassword.classList.remove('is-invalid');
                vendorConfirmPassword.classList.add('is-valid');
            }
        });
    }
}

/**
 * Validate the recipient registration form
 * @returns {boolean} True if valid, false otherwise
 */
function validateRecipientForm() {
    // Check if passwords match
    const password = document.getElementById('recipientPassword').value;
    const confirmPassword = document.getElementById('recipientConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showRegistrationError('As senhas não coincidem.');
        return false;
    }
    
    // Check password length
    if (password.length < 8) {
        showRegistrationError('A senha deve ter pelo menos 8 caracteres.');
        return false;
    }
    
    // Check if email already exists
    const email = document.getElementById('recipientEmail').value;
    if (emailExists('recipient', email)) {
        showRegistrationError('Este email já está cadastrado.');
        return false;
    }
    
    return true;
}

/**
 * Validate the vendor registration form
 * @returns {boolean} True if valid, false otherwise
 */
function validateVendorForm() {
    // Check if passwords match
    const password = document.getElementById('vendorPassword').value;
    const confirmPassword = document.getElementById('vendorConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showRegistrationError('As senhas não coincidem.');
        return false;
    }
    
    // Check password length
    if (password.length < 8) {
        showRegistrationError('A senha deve ter pelo menos 8 caracteres.');
        return false;
    }
    
    // Check if email already exists
    const email = document.getElementById('vendorEmail').value;
    if (emailExists('vendor', email)) {
        showRegistrationError('Este email já está cadastrado.');
        return false;
    }
    
    // Check if at least one category is selected
    const categories = getSelectedCategories();
    if (categories.length === 0) {
        showRegistrationError('Selecione pelo menos uma categoria.');
        return false;
    }
    
    return true;
}

/**
 * Get selected categories from the vendor form
 * @returns {Array} Array of selected categories
 */
function getSelectedCategories() {
    const categoriesSelect = document.getElementById('vendorCategories');
    const selectedCategories = [];
    
    if (categoriesSelect) {
        for (let i = 0; i < categoriesSelect.options.length; i++) {
            if (categoriesSelect.options[i].selected) {
                selectedCategories.push(categoriesSelect.options[i].value);
            }
        }
    }
    
    return selectedCategories;
}

/**
 * Check if an email already exists in the system
 * @param {string} userType The type of user ('recipient' or 'vendor')
 * @param {string} email The email to check
 * @returns {boolean} True if the email exists, false otherwise
 */
function emailExists(userType, email) {
    const user = StorageUtils.getUserByEmail(userType, email);
    return user !== null;
}

/**
 * Register a new user
 * @param {string} userType The type of user ('recipient' or 'vendor')
 * @param {object} userData The user data to register
 */
function registerUser(userType, userData) {
    // Add user to storage
    const success = StorageUtils.addUser(userType, userData);
    
    if (success) {
        // Show success message
        showRegistrationSuccess();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showRegistrationError('Erro ao cadastrar usuário. Por favor, tente novamente.');
    }
}

/**
 * Show registration error message
 * @param {string} message Error message to display
 */
function showRegistrationError(message) {
    // Check if error alert already exists
    let errorAlert = document.querySelector('.registration-error');
    
    if (!errorAlert) {
        // Create error alert
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger registration-error mt-3';
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

/**
 * Show registration success message
 */
function showRegistrationSuccess() {
    // Check if success alert already exists
    let successAlert = document.querySelector('.registration-success');
    
    if (!successAlert) {
        // Create success alert
        successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success registration-success mt-3';
        successAlert.role = 'alert';
        
        // Get the active tab pane
        const activePane = document.querySelector('.tab-pane.active');
        if (activePane) {
            // Insert success alert before the form
            const form = activePane.querySelector('form');
            if (form) {
                form.insertAdjacentElement('beforebegin', successAlert);
            }
        }
    }
    
    // Set success message
    successAlert.textContent = 'Cadastro realizado com sucesso! Redirecionando para a página de login...';
}