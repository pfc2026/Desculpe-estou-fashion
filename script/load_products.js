document.addEventListener('DOMContentLoaded', function() {
    const listContainer = document.querySelector('.product-list');
    if (!listContainer) return;

    async function loadProducts() {
        try {
            const res = await fetch('/api/products');
            const products = await res.json();
            renderProducts(products);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
        }
    }

    function renderProducts(products) {
        listContainer.innerHTML = '';
        if (!products || !products.length) {
            listContainer.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
            return;
        }

        products.forEach(p => {
            const item = document.createElement('div');
            item.className = 'product-item';
            const image = (p.imagens && p.imagens[0]) ? p.imagens[0] : 'compras/pagina de compras (1).png';
            const price = Number(p.preco || 0).toFixed(2);
            const desc = p.descricao || '';
            const gender = p.categoria || '';
            const href = p.slug ? `produto.html?slug=${p.slug}` : '#';

            item.innerHTML = `
                <a href="${href}">
                    <img src="${image}" alt="${p.nome}">
                    <span class="price">R$ ${price}</span>
                    <p class="description">${p.nome} ${desc ? ('- ' + desc) : ''}</p>
                    <p class="gender">${gender}</p>
                </a>
            `;

            listContainer.appendChild(item);
        });
    }

    loadProducts();
});
