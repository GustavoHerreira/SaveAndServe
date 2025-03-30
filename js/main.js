/**
 * SaveAndServe Main JavaScript
 * This file contains the main JavaScript functionality for the SaveAndServe platform
 */

// Import utilities
import StorageUtils from './utils/storageUtils.js';
// Removida importação do módulo de idiomas, pois o site agora é apenas em português

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize local storage with default data
    StorageUtils.initializeStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if user is logged in
    checkUserAuthentication();
});

/**
 * Set up event listeners for the page
 */
function setupEventListeners() {
    // Newsletter subscription form
    const newsletterForm = document.querySelector('.input-group');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // In a real application, this would send the email to a server
                const message = 'Obrigado por se inscrever em nossa newsletter!';
                alert(message);
                emailInput.value = '';
            }
        });
    }
    
    // Add click event for newsletter button
    const newsletterButton = document.querySelector('.input-group button');
    if (newsletterButton) {
        newsletterButton.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = this.previousElementSibling;
            if (emailInput && emailInput.value) {
                // In a real application, this would send the email to a server
                const message = 'Obrigado por se inscrever em nossa newsletter!';
                alert(message);
                emailInput.value = '';
            }
        });
    }
}

/**
 * Check if user is authenticated and update UI accordingly
 */
function checkUserAuthentication() {
    const currentUser = StorageUtils.getData('currentUser');
    
    if (currentUser) {
        // User is logged in, update navigation
        updateNavForLoggedInUser(currentUser);
    }
}

/**
 * Update navigation for logged in users
 * @param {object} user The current user object
 */
function updateNavForLoggedInUser(user) {
    const loginBtn = document.querySelector('a.btn-outline-primary');
    const registerBtn = document.querySelector('a.btn-primary');
    
    if (loginBtn && registerBtn) {
        // Replace login/register buttons with user menu
        const parentDiv = loginBtn.parentElement;
        
        // Remove existing buttons
        loginBtn.remove();
        registerBtn.remove();
        
        // Create user dropdown
        const userDropdown = document.createElement('div');
        userDropdown.className = 'dropdown';
        userDropdown.innerHTML = `
            <button class="btn btn-outline-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-user-circle me-1"></i> ${user.name || 'User'}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="pages/profile.html"><i class="fas fa-user me-2"></i> Perfil</a></li>
                ${user.userType === 'vendor' ? 
                    `<li><a class="dropdown-item" href="pages/vendor-dashboard.html"><i class="fas fa-tachometer-alt me-2"></i> Painel</a></li>
                    <li><a class="dropdown-item" href="pages/add-product.html"><i class="fas fa-plus-circle me-2"></i> Adicionar Produto</a></li>` : 
                    `<li><a class="dropdown-item" href="pages/orders.html"><i class="fas fa-shopping-bag me-2"></i> Meus Pedidos</a></li>`
                }
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i> Sair</a></li>
            </ul>
        `;
        
        parentDiv.appendChild(userDropdown);
        
        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            StorageUtils.removeData('currentUser');
            window.location.reload();
        });
    }
}