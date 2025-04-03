/**
 * SaveAndServe Shopping Cart
 * This file handles all shopping cart related functionality
 */

class ShoppingCart {
    constructor() {
        this.cartKey = 'saveandserve_cart';
        this.cartItems = [];
        this.loadCart();
        this.initializeEventListeners();
    }

    loadCart() {
        this.cartItems = StorageUtils.getData(this.cartKey) || [];
        this.updateCartDisplay();
    }

    saveCart() {
        StorageUtils.saveData(this.cartKey, this.cartItems);
    }

    addItem(item) {
        const existingItem = this.cartItems.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({ ...item, quantity: 1 });
        }
        this.saveCart();
        this.updateCartDisplay();
    }

    removeItem(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateItemQuantity(itemId, quantity) {
        const item = this.cartItems.find(i => i.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.cartItems = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalItemsElement = document.getElementById('total-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        if (this.cartItems.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartMessage.classList.remove('hidden');
            totalItemsElement.textContent = '0';
            return;
        }

        emptyCartMessage.classList.add('hidden');
        totalItemsElement.textContent = this.cartItems.length;

        cartItemsContainer.innerHTML = this.cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Validade: ${item.expiryDate}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    <button class="quantity-btn increase">+</button>
                </div>
                <button class="remove-item">Remover</button>
            </div>
        `).join('');

        this.attachItemEventListeners();
    }

    attachItemEventListeners() {
        document.querySelectorAll('.cart-item').forEach(item => {
            const itemId = item.dataset.id;
            const quantityInput = item.querySelector('.quantity-input');

            item.querySelector('.decrease').addEventListener('click', () => {
                const newQuantity = parseInt(quantityInput.value) - 1;
                this.updateItemQuantity(itemId, newQuantity);
            });

            item.querySelector('.increase').addEventListener('click', () => {
                const newQuantity = parseInt(quantityInput.value) + 1;
                this.updateItemQuantity(itemId, newQuantity);
            });

            quantityInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                this.updateItemQuantity(itemId, newQuantity);
            });

            item.querySelector('.remove-item').addEventListener('click', () => {
                this.removeItem(itemId);
            });
        });
    }

    initializeEventListeners() {
        document.getElementById('clear-cart').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                this.clearCart();
            }
        });

        document.getElementById('checkout').addEventListener('click', () => {
            // TODO: Implementar a lógica de finalização do pedido
            alert('Funcionalidade de finalização do pedido será implementada em breve!');
        });
    }
}

// Inicializar o carrinho quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});