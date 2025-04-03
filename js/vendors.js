// Mock data for products
const mockProducts = [
    {
        title: "Pães do Dia",
        vendor: "Padaria Bom Pão",
        location: "São Paulo - SP",
        description: "Diversos tipos de pães do dia anterior com 50% de desconto.",
        offerType: "Venda com Desconto",
        price: "R$ 5,00/kg",
        category: "Padaria",
        availableUntil: "Hoje, 20:00",
        image: "https://placehold.co/600x400/e9ecef/495057?text=Alimento"
    },
    {
        title: "Frutas e Legumes",
        vendor: "Mercado Fresh",
        location: "Rio de Janeiro - RJ",
        description: "Frutas e legumes frescos para doação. Próprios para consumo imediato.",
        offerType: "Doação",
        price: "Gratuito",
        category: "Hortifruti",
        availableUntil: "Hoje, 18:00",
        image: "https://placehold.co/600x400/e9ecef/495057?text=Alimento"
    },
    {
        title: "Refeições Prontas",
        vendor: "Restaurante Sabor & Cia",
        location: "Belo Horizonte - MG",
        description: "Marmitas do almoço com 70% de desconto. Pratos variados.",
        offerType: "Venda com Desconto",
        price: "R$ 8,00/un",
        category: "Restaurante",
        availableUntil: "Hoje, 15:00",
        image: "https://placehold.co/600x400/e9ecef/495057?text=Alimento"
    },
    {
        title: "Feijoada Completa",
        vendor: "Restaurante do Zé",
        location: "Salvador - BA",
        description: "Feijoada tradicional com acompanhamentos. Última hora do almoço.",
        offerType: "Venda com Desconto",
        price: "R$ 15,00/porção",
        category: "Restaurante",
        availableUntil: "Hoje, 16:00",
        image: "https://placehold.co/600x400/e9ecef/495057?text=Alimento"
    },
    {
        title: "Produtos de Padaria",
        vendor: "Padaria Nova Era",
        location: "Curitiba - PR",
        description: "Bolos, tortas e salgados do dia com 40% de desconto.",
        offerType: "Venda com Desconto",
        price: "A partir de R$ 3,00",
        category: "Padaria",
        availableUntil: "Hoje, 19:00",
        image: "https://placehold.co/600x400/e9ecef/495057?text=Alimento"
    },
    {
        title: "Hortifruti do Dia",
        vendor: "Feira Livre Central",
        location: "São Paulo - SP",
        description: "Verduras e legumes frescos para doação no fim da feira.",
        offerType: "Doação",
        price: "Gratuito",
        category: "Hortifruti",
        availableUntil: "Hoje, 14:00",
        image: "https://placehold.co/600x400/e9ecef/495057?text=Alimento"
    }
];

// Function to create product card HTML
function createProductCard(product) {
    return `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="Imagem do produto">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${product.vendor} - ${product.location}</h6>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge ${product.offerType === 'Doação' ? 'bg-info' : 'bg-success'}">${product.offerType}</span>
                        <span class="text-primary fw-bold">${product.price}</span>
                    </div>
                    <p class="card-text"><small class="text-muted">Disponível até: ${product.availableUntil}</small></p>
                    <button class="btn btn-primary w-100" onclick="addToCart(${JSON.stringify(product)})">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    `;
}

// Function to filter and display products
function filterAndDisplayProducts() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';
    
    const categorySelect = document.querySelector('select:nth-of-type(1)');
    const selectedCategory = categorySelect ? categorySelect.value : 'Categoria';
    
    const offerTypeSelect = document.querySelector('select:nth-of-type(2)');
    const selectedOfferType = offerTypeSelect ? offerTypeSelect.value : 'Tipo de Oferta';
    
    const locationSelect = document.querySelector('select:nth-of-type(3)');
    console.log(locationSelect);
    const selectedLocation = locationSelect ? locationSelect.value : 'Localização';
    
    const sortBySelect = document.querySelector('select:nth-of-type(4)');
    const sortBy = sortBySelect ? sortBySelect.value : 'Ordenar por';

    let filteredProducts = [...mockProducts];

    // Apply filters only if they are actively selected
    const activeFilters = [];

    // Add text search filter if there's input
    if (searchText) {
        activeFilters.push(product =>
            product.title.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText)
        );
    }

    // Add category filter if selected
    if (selectedCategory && selectedCategory !== 'Categoria') {
        activeFilters.push(product => product.category === selectedCategory);
    }

    // Add offer type filter if selected
    if (selectedOfferType && selectedOfferType !== 'Tipo de Oferta') {
        activeFilters.push(product => product.offerType === selectedOfferType);
    }

    // Add location filter if selected
    if (selectedLocation && selectedLocation !== 'Localização') {
        activeFilters.push(product => product.location === selectedLocation);
    }

    // Apply only the active filters
    activeFilters.forEach(filter => {
        filteredProducts = filteredProducts.filter(filter);
    })

    // Apply sorting
    if (sortBy && sortBy !== 'Ordenar por') {
        switch (sortBy) {
            case 'Mais Recentes':
                // In this mock data, we don't have dates, so we'll keep the original order
                break;
            case 'Menor Preço':
                filteredProducts.sort((a, b) => {
                    if (a.price === 'Gratuito') return -1;
                    if (b.price === 'Gratuito') return 1;
                    const priceA = parseFloat(a.price.replace(/[^0-9,]/g, '').replace(',', '.'));
                    const priceB = parseFloat(b.price.replace(/[^0-9,]/g, '').replace(',', '.'));
                    return priceA - priceB;
                });
                break;
            case 'Maior Desconto':
                // In this mock data, we don't have discount percentages, so we'll keep the original order
                break;
        }
    }

    // Display filtered products
    const productsContainer = document.querySelector('.products .row');
    productsContainer.innerHTML = filteredProducts.map(createProductCard).join('');
}

// Função para adicionar produto ao carrinho
function addToCart(product) {
    if (window.shoppingCart) {
        window.shoppingCart.addItem(product);
        updateCartDisplay();
    } else {
        alert('Erro ao adicionar produto ao carrinho. Por favor, tente novamente.');
    }
}

// Função para atualizar o contador do carrinho
function updateCartCount() {
    const cartItems = StorageUtils.getData('saveandserve_cart') || [];
    const cartCount = document.getElementById('cart-count');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }
    if (cartCountMobile) {
        cartCountMobile.textContent = cartItems.length;
    }
}

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
    const cartItems = StorageUtils.getData('saveandserve_cart') || [];
    const cartContainer = document.getElementById('cart-items');
    const cartContainerMobile = document.getElementById('cart-items-mobile');
    const emptyMessage = document.getElementById('empty-cart-message');
    const emptyMessageMobile = document.getElementById('empty-cart-message-mobile');

    updateCartCount();

    if (cartItems.length === 0) {
        if (emptyMessage) emptyMessage.classList.remove('d-none');
        if (emptyMessageMobile) emptyMessageMobile.classList.remove('d-none');
        if (cartContainer) cartContainer.innerHTML = '';
        if (cartContainerMobile) cartContainerMobile.innerHTML = '';
        return;
    }

    if (emptyMessage) emptyMessage.classList.add('d-none');
    if (emptyMessageMobile) emptyMessageMobile.classList.add('d-none');

    const cartHTML = cartItems.map(item => `
        <div class="cart-item mb-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-0">${item.title}</h6>
                    <small class="text-muted">${item.price}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.title}')">×</button>
            </div>
        </div>
    `).join('');

    if (cartContainer) cartContainer.innerHTML = cartHTML;
    if (cartContainerMobile) cartContainerMobile.innerHTML = cartHTML;
}

// Função para remover item do carrinho
function removeFromCart(productTitle) {
    const cartItems = StorageUtils.getData('saveandserve_cart') || [];
    const updatedCart = cartItems.filter(item => item.title !== productTitle);
    StorageUtils.saveData('saveandserve_cart', updatedCart);
    updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    filterAndDisplayProducts();
    
    // Inicializar o carrinho
    window.shoppingCart = new ShoppingCart();
    updateCartDisplay();

    // Configurar eventos do carrinho
    document.getElementById('clear-cart')?.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            StorageUtils.saveData('saveandserve_cart', []);
            updateCartDisplay();
        }
    });

    const checkoutButtons = ['checkout', 'checkout-mobile'].map(id =>
        document.getElementById(id)?.addEventListener('click', () => {
            alert('Funcionalidade de finalização do pedido será implementada em breve!');
        })
    );
});