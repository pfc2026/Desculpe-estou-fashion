document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('#cart-items');
    const selectAllCheckbox = document.querySelector('#select-all');
    const summaryItemsContainer = document.querySelector('#summary-items');
    const totalPriceElement = document.querySelector('#total-price');
    const productCountElement = document.querySelector('#product-count');
    const emptyCartMessage = document.createElement('p');
    emptyCartMessage.textContent = 'Seu carrinho está vazio.';
    emptyCartMessage.style.textAlign = 'center';
    emptyCartMessage.style.marginTop = '20px';

    // Carrega os itens do localStorage
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    /**
     * Renderiza os itens do carrinho na página.
     */
    const renderCart = () => {
        cartContainer.innerHTML = ''; // Limpa o container antes de renderizar

        if (cart.length === 0) {
            cartContainer.appendChild(emptyCartMessage);
        } else {
            cart.forEach(item => {
                const itemHtml = `
                    <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
                        <input type="checkbox" class="item-checkbox custom-checkbox" checked>
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <p class="item-name">${item.name}</p>
                            <p class="item-size">Tamanho: ${item.size}</p>
                            <p class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="quantity-selector">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartContainer.innerHTML += itemHtml;
            });
        }
        updateProductCount();
        updateSummary();
    };

    /**
     * Atualiza o resumo do pedido (itens selecionados e total).
     */
    const updateSummary = () => {
        let total = 0;
        let summaryHtml = '';
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');

        selectedItems.forEach(checkbox => {
            const itemElement = checkbox.closest('.cart-item');
            const id = itemElement.dataset.id;
            const itemInCart = cart.find(item => item.id === id);

            if (itemInCart) {
                const itemTotal = itemInCart.price * itemInCart.quantity;
                total += itemTotal;
                summaryHtml += `
                    <div class="summary-item">
                        <span>${itemInCart.name} (x${itemInCart.quantity})</span>
                        <span>R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                `;
            }
        });

        summaryItemsContainer.innerHTML = summaryHtml;
        totalPriceElement.textContent = `Total a pagar: R$ ${total.toFixed(2).replace('.', ',')}`;
    };

    /**
     * Atualiza a contagem de produtos no cabeçalho da lista.
     */
    const updateProductCount = () => {
        productCountElement.textContent = cart.length;
    };

    /**
     * Salva o estado atual do carrinho no localStorage.
     */
    const saveCart = () => {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    };

    // --- EVENT LISTENERS ---

    cartContainer.addEventListener('click', (event) => {
        const target = event.target;
        const id = target.dataset.id || target.closest('[data-id]')?.dataset.id;
        if (!id) return;

        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex === -1) return;

        // Botões de quantidade
        if (target.classList.contains('plus')) {
            cart[itemIndex].quantity++;
        } else if (target.classList.contains('minus')) {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Remove se a quantidade for 0 ou menos
            }
        }
        // Botão de remover
        else if (target.closest('.remove-item')) {
            cart.splice(itemIndex, 1);
        }
        // Checkbox de item
        else if (target.classList.contains('item-checkbox')) {
            updateSummary();
            return; // Não precisa re-renderizar, apenas atualizar o resumo
        }

        saveCart();
        renderCart();
    });

    selectAllCheckbox.addEventListener('change', () => {
        const allItemCheckboxes = document.querySelectorAll('.item-checkbox');
        allItemCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateSummary();
    });

    // --- INICIALIZAÇÃO ---
    renderCart();
});