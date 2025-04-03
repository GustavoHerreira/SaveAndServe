/**
 * SaveAndServe Vendor Orders JavaScript
 * This file contains the functionality for managing vendor orders
 */

// StorageUtils is loaded globally

// Initialize the page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize storage if needed
    StorageUtils.initializeStorage();
    
    // Load demo orders
    loadVendorOrders();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Load and display the vendor's orders
 */
function loadVendorOrders() {
    let orders = StorageUtils.getData('orders') || [];
    
    // If no orders exist in storage, create mock data
    if (orders.length === 0) {
        // Use a fixed demo vendor ID
        const demoVendorId = 'DEMO_VENDOR';
        orders = createMockOrders(demoVendorId);
        StorageUtils.saveData('orders', orders);
    }
    
    // Display all orders for demo purposes
    displayOrders(orders);
}

/**
 * Create mock orders for demonstration
 * @param {string} vendorId The vendor's ID
 * @returns {Array} Array of mock orders
 */
function createMockOrders(vendorId) {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'shipping', 'delivered', 'cancelled'];
    const mockOrders = [];
    
    // Lista de produtos fictícios
    const products = [
        { name: 'Arroz Integral', price: 8.99 },
        { name: 'Feijão Carioca', price: 6.99 },
        { name: 'Macarrão Integral', price: 5.49 },
        { name: 'Óleo de Soja', price: 9.99 },
        { name: 'Café em Pó', price: 15.99 },
        { name: 'Açúcar Cristal', price: 4.99 },
        { name: 'Leite em Pó', price: 12.99 },
        { name: 'Farinha de Trigo', price: 5.99 },
        { name: 'Sal Refinado', price: 2.99 },
        { name: 'Molho de Tomate', price: 3.99 }
    ];

    // Lista de nomes fictícios
    const firstNames = ['Maria', 'João', 'Ana', 'Pedro', 'Lucas', 'Julia', 'Carlos', 'Beatriz', 'Paulo', 'Laura'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Pereira', 'Lima', 'Costa'];

    // Métodos de pagamento
    const paymentMethods = ['Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Dinheiro', 'Transferência Bancária'];

    // Generate 15 mock orders
    for (let i = 1; i <= 15; i++) {
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
        
        // Gerar nome aleatório
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        // Gerar itens aleatórios (1 a 5 itens)
        const numItems = Math.floor(Math.random() * 4) + 1;
        const items = [];
        const usedProducts = new Set();
        
        for (let j = 0; j < numItems; j++) {
            let randomProduct;
            do {
                randomProduct = products[Math.floor(Math.random() * products.length)];
            } while (usedProducts.has(randomProduct.name));
            
            usedProducts.add(randomProduct.name);
            items.push({
                name: randomProduct.name,
                quantity: Math.floor(Math.random() * 5) + 1,
                price: randomProduct.price
            });
        }
        
        const order = {
            id: `ORD${String(i).padStart(5, '0')}`,
            vendorId: vendorId,
            customerId: `CUST${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            customerName: `${firstName} ${lastName}`,
            customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            customerPhone: `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
            deliveryAddress: {
                street: `Rua ${Math.floor(Math.random() * 100) + 1}`,
                number: Math.floor(Math.random() * 1000) + 1,
                complement: Math.random() > 0.5 ? `Apto ${Math.floor(Math.random() * 100) + 1}` : '',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                zipCode: `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`
            },
            items: items,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            statusHistory: [
                {
                    status: 'pending',
                    date: new Date(orderDate.getTime() - Math.random() * 86400000).toISOString(),
                    comment: 'Pedido recebido'
                }
            ],
            createdAt: orderDate.toISOString(),
            total: 0,
            notes: Math.random() > 0.7 ? 'Entregar no período da manhã' : ''
        };
        
        // Calculate total
        order.total = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        
        // Add status history based on current status
        const currentStatusIndex = statuses.indexOf(order.status);
        for (let j = 1; j <= currentStatusIndex; j++) {
            order.statusHistory.push({
                status: statuses[j],
                date: new Date(orderDate.getTime() + (j * Math.random() * 86400000)).toISOString(),
                comment: getStatusComment(statuses[j])
            });
        }
        
        mockOrders.push(order);
    }
    
    return mockOrders;
}

/**
 * Get a comment for a status change
 * @param {string} status The order status
 * @returns {string} A comment describing the status change
 */
function getStatusComment(status) {
    switch (status) {
        case 'confirmed':
            return 'Pedido confirmado pelo vendedor';
        case 'preparing':
            return 'Pedido em separação';
        case 'ready':
            return 'Pedido pronto para entrega';
        case 'shipping':
            return 'Pedido saiu para entrega';
        case 'delivered':
            return 'Pedido entregue com sucesso';
        case 'cancelled':
            return 'Pedido cancelado';
        default:
            return '';
    }
}

/**
 * Display orders in the table
 * @param {Array} orders Array of orders to display
 */
function displayOrders(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    
    if (orders.length === 0) {
        // Show no orders message
        tableBody.parentElement.style.display = 'none';
        noOrdersMessage.style.display = 'block';
        return;
    }
    
    // Show table and hide no orders message
    tableBody.parentElement.style.display = 'table';
    noOrdersMessage.style.display = 'none';
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Add order rows
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
            <td>
                <strong>${order.customerName}</strong><br>
                <small class="text-muted">${order.customerEmail}<br>${order.customerPhone}</small>
            </td>
            <td>
                ${order.items.map(item => `${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)})`).join('<br>')}
                ${order.notes ? `<br><small class="text-muted"><i class="fas fa-info-circle"></i> ${order.notes}</small>` : ''}
            </td>
            <td>
                <strong>R$ ${order.total.toFixed(2)}</strong><br>
                <small class="text-muted">${order.paymentMethod}</small>
            </td>
            <td>
                <span class="badge ${getStatusBadgeClass(order.status)}">
                    ${getStatusText(order.status)}
                </span><br>
                <small class="text-muted">${order.statusHistory.length} atualizações</small>
            </td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" onclick="updateOrderStatus('${order.id}')" title="Atualizar Status">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info ms-2" onclick="viewOrderDetails('${order.id}')" title="Ver Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Filter orders based on current filter values
 */
function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = parseInt(document.getElementById('dateFilter').value);
    const searchTerm = document.getElementById('searchOrder').value.toLowerCase();
    
    const currentUser = StorageUtils.getData('currentUser');
    const orders = StorageUtils.getData('orders') || [];
    let filteredOrders = orders.filter(order => order.vendorId === currentUser.id);
    
    // Apply status filter
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateFilter);
        filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= cutoffDate);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
            order.id.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm)
        );
    }
    
    // Display filtered orders
    displayOrders(filteredOrders);
}

/**
 * Get the appropriate badge class for an order status
 * @param {string} status The order status
 * @returns {string} The badge class
 */
function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-warning';
        case 'confirmed':
            return 'bg-info';
        case 'preparing':
            return 'bg-primary';
        case 'ready':
            return 'bg-success';
        case 'shipping':
            return 'bg-primary';
        case 'delivered':
            return 'bg-success';
        case 'cancelled':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

/**
 * Get the display text for an order status
 * @param {string} status The order status
 * @returns {string} The display text
 */
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'Aguardando Confirmação';
        case 'confirmed':
            return 'Confirmado';
        case 'preparing':
            return 'Separando';
        case 'ready':
            return 'Pronto para Retirada';
        case 'shipping':
            return 'Em Transporte';
        case 'delivered':
            return 'Entregue';
        case 'cancelled':
            return 'Cancelado';
        default:
            return 'Desconhecido';
    }
}

/**
 * Update the status of an order
 * @param {string} orderId The ID of the order to update
 */
function updateOrderStatus(orderId) {
    const orders = StorageUtils.getData('orders') || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Get next status based on current status
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'shipping', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : order.status;
    
    // Update order status
    order.status = nextStatus;
    
    // Save updated orders
    StorageUtils.saveData('orders', orders);
    
    // Refresh display
    filterOrders();
}

/**
 * View order details
 * @param {string} orderId The ID of the order to view
 */
function viewOrderDetails(orderId) {
    // TODO: Implement order details view
    alert(`Detalhes do pedido ${orderId} serão implementados em breve.`);
}

// Make functions available globally
window.updateOrderStatus = updateOrderStatus;
window.viewOrderDetails = viewOrderDetails;