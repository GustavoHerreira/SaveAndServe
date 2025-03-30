/**
 * SaveAndServe Add Product JavaScript
 * This file contains the functionality for adding new products to the SaveAndServe platform
 */

// Import utilities
import StorageUtils from './utils/storageUtils.js';

// Initialize the page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize local storage
    StorageUtils.initializeStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize form validation
    setupFormValidation();
    
    // Check if user is logged in and is a vendor
    checkVendorAuthentication();
    
    // Set minimum date for expiration date to today
    setMinExpirationDate();
});

/**
 * Set up event listeners for the add product page
 */
function setupEventListeners() {
    // Toggle price field visibility based on offer type selection
    const donationRadio = document.getElementById('donation');
    const saleRadio = document.getElementById('sale');
    const priceField = document.getElementById('priceField');
    
    if (donationRadio && saleRadio && priceField) {
        donationRadio.addEventListener('change', function() {
            priceField.style.display = 'none';
            document.getElementById('productPrice').removeAttribute('required');
        });
        
        saleRadio.addEventListener('change', function() {
            priceField.style.display = 'block';
            document.getElementById('productPrice').setAttribute('required', 'required');
        });
    }
    
    // Handle image preview
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.addEventListener('change', function() {
            previewImage(this);
        });
    }
    
    // Handle form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }
            
            // Submit the product
            submitProduct();
        });
    }
}

/**
 * Set up form validation for the product form
 */
function setupFormValidation() {
    // Add validation classes to form inputs on blur
    const formInputs = document.querySelectorAll('form input[required], form textarea[required], form select[required]');
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
 * Check if the current user is authenticated and is a vendor
 * If not, redirect to the login page
 */
function checkVendorAuthentication() {
    const currentUser = StorageUtils.getData('currentUser');
    
    if (!currentUser) {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html?redirect=add-product.html&message=Você precisa estar logado como doador/vendedor para adicionar produtos.';
        return;
    }
    
    if (currentUser.userType !== 'vendor') {
        // User is not a vendor, redirect to home page
        window.location.href = '../index.html?message=Apenas doadores/vendedores podem adicionar produtos.';
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
                <li><a class="dropdown-item" href="add-product.html"><i class="fas fa-plus-circle me-2"></i> Adicionar Produto</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i> Sair</a></li>
            </ul>
        `;
        
        // Add to navigation
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
 * Set minimum date for expiration date input to today
 */
function setMinExpirationDate() {
    const expirationDateInput = document.getElementById('expirationDate');
    if (expirationDateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        expirationDateInput.setAttribute('min', formattedDate);
    }
}

/**
 * Preview the selected image
 * @param {HTMLInputElement} input The file input element
 */
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        // Create or get the image preview container
        let previewContainer = document.getElementById('imagePreviewContainer');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'imagePreviewContainer';
            previewContainer.className = 'mt-2 text-center';
            input.parentNode.appendChild(previewContainer);
        }
        
        reader.onload = function(e) {
            previewContainer.innerHTML = `
                <img src="${e.target.result}" class="img-thumbnail" style="max-height: 200px;" alt="Preview da imagem do produto">
                <p class="text-muted small mt-1">Pré-visualização da imagem</p>
            `;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

/**
 * Submit the product to local storage
 */
function submitProduct() {
    try {
        // Get form values
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productCategory = document.getElementById('productCategory').value;
        const productQuantity = document.getElementById('productQuantity').value;
        const quantityUnit = document.getElementById('quantityUnit').value;
        const expirationDate = document.getElementById('expirationDate').value;
        const nutritionalInfo = document.getElementById('nutritionalInfo').value;
        const offerType = document.querySelector('input[name="offerType"]:checked').value;
        
        // Get dietary restrictions
        const dietaryRestrictions = {
            glutenFree: document.getElementById('glutenFree').checked,
            lactoseFree: document.getElementById('lactoseFree').checked,
            vegan: document.getElementById('vegan').checked,
            vegetarian: document.getElementById('vegetarian').checked,
            sugarFree: document.getElementById('sugarFree').checked,
            organic: document.getElementById('organic').checked
        };
        
        // Get price if offer type is sale
        let price = 0;
        if (offerType === 'sale') {
            price = parseFloat(document.getElementById('productPrice').value);
        }
        
        // Get current user (vendor)
        const currentUser = StorageUtils.getData('currentUser');
        
        // Handle image
        const imageInput = document.getElementById('productImage');
        let imageData = null;
        
        if (imageInput.files && imageInput.files[0]) {
            // In a real application, this would upload the image to a server
            // For this mock, we'll store the image as a data URL
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imageData = e.target.result;
                
                // Create product object
                const product = {
                    id: generateUniqueId(),
                    name: productName,
                    description: productDescription,
                    category: productCategory,
                    quantity: {
                        value: parseInt(productQuantity),
                        unit: quantityUnit
                    },
                    expirationDate: expirationDate,
                    nutritionalInfo: nutritionalInfo,
                    dietaryRestrictions: dietaryRestrictions,
                    offerType: offerType,
                    price: price,
                    image: imageData,
                    vendorId: currentUser.id,
                    vendorName: currentUser.organizationName || currentUser.name,
                    createdAt: new Date().toISOString(),
                    status: 'available'
                };
                
                // Save product to local storage
                saveProduct(product);
            };
            
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            // No image provided, create product without image
            const product = {
                id: generateUniqueId(),
                name: productName,
                description: productDescription,
                category: productCategory,
                quantity: {
                    value: parseInt(productQuantity),
                    unit: quantityUnit
                },
                expirationDate: expirationDate,
                nutritionalInfo: nutritionalInfo,
                dietaryRestrictions: dietaryRestrictions,
                offerType: offerType,
                price: price,
                image: null,
                vendorId: currentUser.id,
                vendorName: currentUser.organizationName || currentUser.name,
                createdAt: new Date().toISOString(),
                status: 'available'
            };
            
            // Save product to local storage
            saveProduct(product);
        }
    } catch (error) {
        console.error('Error submitting product:', error);
        showAlert('Erro ao cadastrar produto. Por favor, tente novamente.', 'danger');
    }
}

/**
 * Save a product to local storage
 * @param {object} product The product to save
 */
function saveProduct(product) {
    // Get existing products
    const products = StorageUtils.getData('products') || [];
    
    // Add new product
    products.push(product);
    
    // Save updated products
    const success = StorageUtils.saveData('products', products);
    
    if (success) {
        // Show success message
        showAlert('Produto cadastrado com sucesso!', 'success');
        
        // Reset form
        document.getElementById('productForm').reset();
        document.getElementById('productForm').classList.remove('was-validated');
        
        // Remove image preview if exists
        const previewContainer = document.getElementById('imagePreviewContainer');
        if (previewContainer) {
            previewContainer.remove();
        }
        
        // Reset form inputs validation classes
        const formInputs = document.querySelectorAll('form input, form textarea, form select');
        formInputs.forEach(input => {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        });
        
        // Hide price field if visible
        document.getElementById('priceField').style.display = 'none';
    } else {
        // Show error message
        showAlert('Erro ao salvar o produto. Por favor, tente novamente.', 'danger');
    }
}

/**
 * Generate a unique ID for a product
 * @returns {string} A unique ID
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Show an alert message
 * @param {string} message The message to show
 * @param {string} type The type of alert (success, danger, warning, info)
 */
function showAlert(message, type) {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertElement.setAttribute('role', 'alert');
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Find the form
    const form = document.getElementById('productForm');
    
    // Insert alert before the form
    form.parentNode.insertBefore(alertElement, form);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertElement.classList.remove('show');
        setTimeout(() => alertElement.remove(), 300);
    }, 5000);
}