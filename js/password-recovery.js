/**
 * SaveAndServe Password Recovery JavaScript
 * This file contains the password recovery functionality for the SaveAndServe platform
 */

// Import utilities
import StorageUtils from './utils/storageUtils.js';

// Initialize the password recovery page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize storage if needed
    StorageUtils.initializeStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize form validation
    setupFormValidation();
    
    // Check if we're in reset mode (via URL parameter)
    checkResetMode();
});

/**
 * Set up event listeners for the password recovery page
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
    
    // Password recovery form submission
    const passwordRecoveryForm = document.getElementById('passwordRecoveryForm');
    if (passwordRecoveryForm) {
        passwordRecoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email value
            const email = document.getElementById('recoveryEmail').value;
            
            // Process recovery request
            processRecoveryRequest(email);
        });
    }
    
    // Resend link button
    const resendLinkButton = document.getElementById('resendLink');
    if (resendLinkButton) {
        resendLinkButton.addEventListener('click', function() {
            const email = document.getElementById('recoveryEmail').value;
            processRecoveryRequest(email, true);
        });
    }
    
    // Reset password form submission
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get password values
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            // Process password reset
            processPasswordReset(newPassword, confirmNewPassword);
        });
    }
}

/**
 * Set up form validation for password recovery forms
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
    
    // Validate password confirmation
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    
    if (newPassword && confirmNewPassword) {
        confirmNewPassword.addEventListener('input', function() {
            if (this.value !== newPassword.value) {
                this.setCustomValidity('As senhas não coincidem');
                this.classList.add('is-invalid');
            } else {
                this.setCustomValidity('');
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        
        newPassword.addEventListener('input', function() {
            if (confirmNewPassword.value && this.value !== confirmNewPassword.value) {
                confirmNewPassword.setCustomValidity('As senhas não coincidem');
                confirmNewPassword.classList.add('is-invalid');
            } else if (confirmNewPassword.value) {
                confirmNewPassword.setCustomValidity('');
                confirmNewPassword.classList.remove('is-invalid');
                confirmNewPassword.classList.add('is-valid');
            }
        });
    }
}

/**
 * Check if we're in reset mode via URL parameter
 */
function checkResetMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    if (token && email) {
        // Store the email for later use
        sessionStorage.setItem('resetEmail', email);
        
        // Show the reset password form
        showStep(3);
    }
}

/**
 * Process a password recovery request
 * @param {string} email The email to send recovery link to
 * @param {boolean} isResend Whether this is a resend request
 */
function processRecoveryRequest(email, isResend = false) {
    // Check if email exists in the system
    const recipientUser = StorageUtils.getUserByEmail('recipient', email);
    const vendorUser = StorageUtils.getUserByEmail('vendor', email);
    
    if (!recipientUser && !vendorUser) {
        showRecoveryError('Email não encontrado no sistema.');
        return;
    }
    
    // In a real application, this would send an email with a recovery link
    // For this front-end only implementation, we'll simulate it
    
    // Store the email for the reset page
    sessionStorage.setItem('resetEmail', email);
    
    // Generate a fake token
    const token = generateFakeToken();
    
    // Store the token in sessionStorage (in a real app, this would be stored server-side)
    sessionStorage.setItem('resetToken', token);
    
    // Show success message
    showStep(2);
    
    // If this is a resend, show a specific message
    if (isResend) {
        const successAlert = document.querySelector('#recovery-step-2 .alert-success');
        if (successAlert) {
            successAlert.innerHTML = '<i class="fas fa-check-circle me-2"></i> Um novo link de recuperação foi enviado para o seu email.';
        }
    }
    
    // In a real application, we would now send an email with a link like:
    // https://example.com/password-recovery.html?token=TOKEN&email=EMAIL
    console.log(`Recovery link would be sent to ${email} with token ${token}`);
}

/**
 * Process a password reset
 * @param {string} newPassword The new password
 * @param {string} confirmNewPassword The confirmation of the new password
 */
function processPasswordReset(newPassword, confirmNewPassword) {
    // Validate passwords match
    if (newPassword !== confirmNewPassword) {
        showResetError('As senhas não coincidem.');
        return;
    }
    
    // Validate password length
    if (newPassword.length < 8) {
        showResetError('A senha deve ter pelo menos 8 caracteres.');
        return;
    }
    
    // Get the email from session storage
    const email = sessionStorage.getItem('resetEmail');
    if (!email) {
        showResetError('Sessão expirada. Por favor, inicie o processo novamente.');
        return;
    }
    
    // Find the user
    let user = StorageUtils.getUserByEmail('recipient', email);
    let userType = 'recipient';
    
    if (!user) {
        user = StorageUtils.getUserByEmail('vendor', email);
        userType = 'vendor';
    }
    
    if (!user) {
        showResetError('Usuário não encontrado. Por favor, inicie o processo novamente.');
        return;
    }
    
    // Update the user's password
    user.password = newPassword;
    
    // Save the updated user
    const users = StorageUtils.getData('users');
    const userIndex = users[userType + 's'].findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
        users[userType + 's'][userIndex] = user;
        StorageUtils.saveData('users', users);
        
        // Show success message
        showStep(4);
        
        // Clear session storage
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetToken');
    } else {
        showResetError('Erro ao atualizar a senha. Por favor, tente novamente.');
    }
}

/**
 * Show a specific step in the recovery process
 * @param {number} stepNumber The step number to show (1-4)
 */
function showStep(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`recovery-step-${i}`);
        if (step) {
            step.classList.add('d-none');
        }
    }
    
    // Show the requested step
    const stepToShow = document.getElementById(`recovery-step-${stepNumber}`);
    if (stepToShow) {
        stepToShow.classList.remove('d-none');
    }
}

/**
 * Show recovery error message
 * @param {string} message Error message to display
 */
function showRecoveryError(message) {
    // Check if error alert already exists
    let errorAlert = document.querySelector('#recovery-step-1 .alert-danger');
    
    if (!errorAlert) {
        // Create error alert
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mt-3';
        errorAlert.role = 'alert';
        
        // Insert error alert before the form
        const form = document.getElementById('passwordRecoveryForm');
        if (form) {
            form.insertAdjacentElement('beforebegin', errorAlert);
        }
    }
    
    // Set error message
    errorAlert.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i> ${message}`;
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorAlert.remove();
    }, 5000);
}

/**
 * Show reset error message
 * @param {string} message Error message to display
 */
function showResetError(message) {
    // Check if error alert already exists
    let errorAlert = document.querySelector('#recovery-step-3 .alert-danger');
    
    if (!errorAlert) {
        // Create error alert
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mt-3';
        errorAlert.role = 'alert';
        
        // Insert error alert before the form
        const form = document.getElementById('resetPasswordForm');
        if (form) {
            form.insertAdjacentElement('beforebegin', errorAlert);
        }
    }
    
    // Set error message
    errorAlert.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i> ${message}`;
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorAlert.remove();
    }, 5000);
}

/**
 * Generate a fake token for password reset
 * @returns {string} A fake token
 */
function generateFakeToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}