/**
 * SaveAndServe Vendor Products JavaScript
 * This file contains the functionality for managing vendor products
 */

// Import utilities
import StorageUtils from './utils/storageUtils.js';

// Initialize the page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize storage if needed
    StorageUtils.initializeStorage();
    
    // Check if user is logged in and is a vendor
    checkVendorAuthentication();
    
    // Load vendor's products
    loadVendorProducts();
});

/**
 * Check if the current user is authenticated and is a vendor
 * If not, redirect to the login page
 */
function checkVendorAuthentication() {
    const currentUser = StorageUtils.getData('currentUser');
    
    if (!currentUser) {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html?redirect=vendor-products.html&message=Você precisa estar logado como doador/vendedor para ver seus produtos.';
        return;
    }
    
    if (currentUser.userType !== 'vendor') {
        // User is not a vendor, redirect to home page
        window.location.href = '../index.html?message=Apenas doadores/vendedores podem acessar esta página.';
        return;
    }
    
    // Update navigation for logged in user
    updateNavForLoggedInUser(currentUser);
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
                <i class="fas fa-user-circle me-1"></i> ${user.name || user.organizationName || 'Usuário'}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user me-2"></i> Perfil</a></li>
                <li><a class="dropdown-item" href="vendor-dashboard.html"><i class="fas fa-tachometer-alt me-2"></i> Painel</a></li>
                <li><a class="dropdown-item" href="vendor-products.html"><i class="fas fa-box me-2"></i> Meus Produtos</a></li>
                <li><a class="dropdown-item" href="add-product.html"><i class="fas fa-plus-circle me-2"></i> Adicionar Produto</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i> Sair</a></li>
            </ul>
        `;
        
        parentDiv.appendChild(userDropdown);
        
        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            StorageUtils.removeData('currentUser');
            window.location.href = '../index.html?message=Você saiu da sua conta com sucesso.';
        });
    }
}

/**
 * Load and display the vendor's products
 */
function loadVendorProducts() {
    const currentUser = StorageUtils.getData('currentUser');
    const products = StorageUtils.getData('products') || [];
    
    // Filter products by vendor ID
    const vendorProducts = products.filter(product => product.vendorId === currentUser.id);
    
    const tableBody = document.getElementById('productsTableBody');
    const noProductsMessage = document.getElementById('noProductsMessage');
    
    if (vendorProducts.length === 0) {
        // Show no products message
        tableBody.parentElement.style.display = 'none';
        noProductsMessage.style.display = 'block';
        return;
    }
    
    // Show table and hide no products message
    tableBody.parentElement.style.display = 'table';
    noProductsMessage.style.display = 'none';
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add product rows
    vendorProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" class="img-thumbnail" style="max-height: 50px;">` :
                    '<i class="fas fa-image text-muted"></i>'
                }
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>
                <span class="badge ${product.offerType === 'donation' ? 'bg-success' : 'bg-primary'}">
                    ${product.offerType === 'donation' ? 'Doação' : 'Venda'}
                </span>
            </td>
            <td>${product.offerType === 'sale' ? `R$ ${product.price.toFixed(2)}` : '-'}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(product.status)}">
                    ${getStatusText(product.status)}
                </span>
            </td>
            <td>${new Date(product.createdAt).toLocaleDateString('pt-BR')}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Get the appropriate badge class for a product status
 * @param {string} status The product status
 * @returns {string} The badge class
 */
function getStatusBadgeClass(status) {
    switch (status) {
        case 'available':
            return 'bg-success';
        case 'reserved':
            return 'bg-warning';
        case 'sold':
            return 'bg-secondary';
        default:
            return 'bg-secondary';
    }
}

/**
 * Get the display text for a product status
 * @param {string} status The product status
 * @returns {string} The display text
 */
function getStatusText(status) {
    switch (status) {
        case 'available':
            return 'Disponível';
        case 'reserved':
            return 'Reservado';
        case 'sold':
            return 'Vendido/Doado';
        default:
            return 'Desconhecido';
    }
}

/**
 * Edit a product
 * @param {string} productId The ID of the product to edit
 */
function editProduct(productId) {
    // Store the product ID in session storage for the edit page
    sessionStorage.setItem('editProductId', productId);
    // Redirect to add-product page in edit mode
    window.location.href = `add-product.html?mode=edit&id=${productId}`;
}

/**
 * Delete a product
 * @param {string} productId The ID of the product to delete
 */
function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        // Get products from storage
        let products = StorageUtils.getData('products') || [];
        
        // Remove the product
        products = products.filter(product => product.id !== productId);
        
        // Save updated products
        if (StorageUtils.saveData('products', products)) {
            // Reload products list
            loadVendorProducts();
            
            // Show success message
            const messageDiv = document.createElement('div');
            messageDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
            messageDiv.innerHTML = `
                Produto excluído com sucesso!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
            `;
            
            const mainContent = document.querySelector('main');
            mainContent.insertBefore(messageDiv, mainContent.firstChild);
            
            // Remove message after 5 seconds
            setTimeout(() => messageDiv.remove(), 5000);
        }
    }
}

// Make functions available globally
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;