document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos principais da página
    const cartContainer = document.querySelector('#cart-items');
    const selectAllCheckbox = document.querySelector('#select-all');
    const summaryItemsContainer = document.querySelector('#summary-items');
    const totalPriceElement = document.querySelector('#total-price');
    const productCountElement = document.querySelector('#product-count');

    // Função principal para atualizar o resumo e o total
    const updateSummary = () => {
        let total = 0;
        let summaryHtml = '';
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');

        // Itera sobre cada item selecionado (com o 'X')
        selectedItems.forEach(checkbox => {
            const item = checkbox.closest('.cart-item');
            const price = parseFloat(item.dataset.price);
            const name = item.querySelector('.item-name').textContent;
            const priceText = item.querySelector('.item-price').textContent;

            total += price;
            summaryHtml += `
                <div class="summary-item">
                    <span>${name}</span>
                    <span>${priceText}</span>
                </div>
            `;
        });

        // Atualiza o HTML do resumo e o valor total
        summaryItemsContainer.innerHTML = summaryHtml;
        totalPriceElement.textContent = `Total a pagar: R$${total.toFixed(2).replace('.', ',')}`;
    };
    
    // Função para atualizar a contagem de produtos
    const updateProductCount = () => {
        const totalItems = document.querySelectorAll('.cart-item').length;
        productCountElement.textContent = totalItems;
    };


    // --- EVENT LISTENERS ---

    // 1. Escuta cliques nos checkboxes dos itens
    cartContainer.addEventListener('click', (event) => {
        // Se o clique foi em um checkbox de item, atualiza o resumo
        if (event.target.classList.contains('item-checkbox')) {
            updateSummary();
        }
    });

    // 2. Escuta evento no checkbox "Selecionar Todos"
    selectAllCheckbox.addEventListener('change', () => {
        const allItemCheckboxes = document.querySelectorAll('.item-checkbox');
        // Marca ou desmarca todos os checkboxes com base no estado do "Selecionar Todos"
        allItemCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateSummary(); // Atualiza o resumo após a ação
    });

    // --- INICIALIZAÇÃO ---
    // Chama as funções uma vez no início para definir o estado inicial da página
    updateProductCount();
    updateSummary();
});