document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const addProdutoBtn = document.getElementById('add-produto-btn');
    const modal = document.getElementById('produto-modal');
    const closeBtn = document.querySelector('.close-btn');
    const produtoForm = document.getElementById('produto-form');
    const searchInput = document.getElementById('search-produtos');
    const logoutBtn = document.getElementById('logout-btn');

    // Gerenciamento de abas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove classe active de todos os botões e conteúdos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Adiciona classe active ao botão clicado e conteúdo correspondente
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');

            // Carrega dados da aba selecionada
            loadTabData(btn.dataset.tab);
        });
    });

    // Função para carregar dados das abas
    function loadTabData(tab) {
        switch(tab) {
            case 'produtos':
                loadProdutos();
                break;
            case 'categorias':
                loadCategorias();
                break;
            case 'estoque':
                loadEstoque();
                break;
            case 'pedidos':
                loadPedidos();
                break;
        }
    }

    // Funções para carregar dados
    async function loadProdutos() {
        try {
            const response = await fetch('/api/products');
            const produtos = await response.json();
            displayProdutos(produtos);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    function displayProdutos(produtos) {
        const container = document.getElementById('products-container');
        container.innerHTML = '';

        produtos.forEach(produto => {
            const card = createProdutoCard(produto);
            container.appendChild(card);
        });
    }

    function createProdutoCard(produto) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${(produto.imagens && produto.imagens[0]) || '/public/uploads/.gitkeep'}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <p class="price">R$ ${Number(produto.preco || 0).toFixed(2)}</p>
            <div class="card-actions">
                <button class="btn-edit" data-id="${produto._id}">Editar</button>
                <button class="btn-delete" data-id="${produto._id}">Excluir</button>
            </div>
        `;

        // Adiciona event listeners para editar e excluir
        card.querySelector('.btn-edit').addEventListener('click', () => editProduto(produto));
        card.querySelector('.btn-delete').addEventListener('click', () => deleteProduto(produto._id));

        return card;
    }

    // Modal de produto
    addProdutoBtn.addEventListener('click', () => {
        clearProdutoForm();
        document.getElementById('modal-title').textContent = 'Adicionar Produto';
        modal.style.display = 'block';
    });

    // Floating add button (in header)
    const addFloatingBtn = document.getElementById('add-produto-floating-btn');
    if (addFloatingBtn) {
        addFloatingBtn.addEventListener('click', () => {
            clearProdutoForm();
            document.getElementById('modal-title').textContent = 'Adicionar Produto';
            modal.style.display = 'block';
        });
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Preview de imagem
    const imagemInput = document.getElementById('imagem');
    const previewImagem = document.getElementById('preview-imagem');

    imagemInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                previewImagem.innerHTML = '';
                previewImagem.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });

    // Manipulação do formulário
    produtoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(produtoForm);
        try {
            // determine if editing or creating
            const editingId = produtoForm.dataset.editingId;
            let url = '/api/products';
            let method = 'POST';
            if (editingId) {
                url = `/api/products/${editingId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                body: formData
            });

            const result = await response.json();
            if (result.success || result.id || result.modifiedCount >= 0) {
                modal.style.display = 'none';
                produtoForm.removeAttribute('data-editing-id');
                loadProdutos(); // Recarrega a lista de produtos
            } else {
                alert('Erro ao salvar produto: ' + (result.message || 'erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto');
        }
    });

    // Funções de edição e exclusão
    async function editProduto(produto) {
        document.getElementById('modal-title').textContent = 'Editar Produto';
        fillProdutoForm(produto);
        modal.style.display = 'block';
    }

    async function deleteProduto(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (result.success) {
                    loadProdutos(); // Recarrega a lista de produtos
                } else {
                    alert('Erro ao excluir produto: ' + (result.message || 'erro desconhecido'));
                }
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                alert('Erro ao excluir produto');
            }
        }
    }

    // Funções auxiliares
    function clearProdutoForm() {
        produtoForm.reset();
        previewImagem.innerHTML = '';
    }

    function fillProdutoForm(produto) {
        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('categoria').value = produto.id_categoria;
        // store editing id on form
        produtoForm.dataset.editingId = produto._id;

        if (produto.imagens && produto.imagens.length) {
            const img = document.createElement('img');
            img.src = produto.imagens[0];
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            previewImagem.innerHTML = '';
            previewImagem.appendChild(img);
        }
    }

    // Busca de produtos
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const produtos = document.querySelectorAll('.product-card');
        
        produtos.forEach(produto => {
            const nome = produto.querySelector('h3').textContent.toLowerCase();
            const descricao = produto.querySelector('p').textContent.toLowerCase();
            
            if (nome.includes(searchTerm) || descricao.includes(searchTerm)) {
                produto.style.display = '';
            } else {
                produto.style.display = 'none';
            }
        });
    }, 300));

    // Função de logout
    logoutBtn.addEventListener('click', async () => {
        try {
            // if your logout remains PHP based, keep it. Otherwise implement new API.
            const response = await fetch('/api/logout.php');
            const result = await response.json();
            if (result.success) {
                window.location.href = 'index3.html';
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    });

    // Utilidade
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Carrega produtos inicialmente
    loadProdutos();
});