// Espera o documento HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS ---
    // Selecionamos todos os elementos interativos da página de uma vez
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnails img');
    
    // Seletores para a lógica de validação do carrinho
    const colorOptions = document.querySelectorAll('.color-selector .swatch');
    const sizeOptions = document.querySelectorAll('.size-buttons button');
    const addToCartButton = document.querySelector('.add-to-cart');

    // Outros elementos interativos
    const wishlistButton = document.querySelector('.wishlist');
    const copySkuIcon = document.querySelector('.sku .fa-copy');

    // --- LÓGICA DE VALIDAÇÃO PARA HABILITAR O BOTÃO "ADICIONAR AO CARRINHO" ---

    /**
     * Função que verifica se as seleções obrigatórias (tamanho e cor) foram feitas.
     * Habilita ou desabilita o botão "Adicionar ao Carrinho" com base nisso.
     */
    const checkSelections = () => {
        // 1. Verifica se um tamanho foi selecionado
        // Procura por um botão de tamanho que tenha a classe 'active'. Se encontrar, isSizeSelected será true.
        const isSizeSelected = document.querySelector('.size-buttons button.active') !== null;
        
        // 2. Verifica se uma cor foi selecionada (APENAS se houver opções de cor)
        // Primeiro, vemos se existem botões de cor na página.
        const areColorOptionsAvailable = colorOptions.length > 0;
        // A condição de cor é válida se:
        // a) Não houver opções de cor na página (isColorSelected = true)
        // b) Ou se houver opções e uma delas estiver com a classe 'active'
        const isColorSelected = !areColorOptionsAvailable || document.querySelector('.color-selector .swatch.active') !== null;

        // 3. Habilita ou desabilita o botão
        // O botão será habilitado (disabled = false) SOMENTE se AMBAS as condições (tamanho e cor) forem verdadeiras.
        if (isSizeSelected && isColorSelected) {
            addToCartButton.disabled = false;
        } else {
            addToCartButton.disabled = true;
        }
    };

    // --- FUNÇÕES DE INTERAÇÃO COM O USUÁRIO ---

    // 1. GALERIA DE IMAGENS
    // Adiciona um evento de clique para cada imagem em miniatura (thumbnail)
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Atualiza a imagem principal para ser a mesma da miniatura clicada
            mainImage.src = thumb.src;

            // Remove o destaque de todas as miniaturas
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Adiciona o destaque apenas na miniatura que foi clicada
            thumb.classList.add('active');
        });
    });

    // 2. SELETORES (Cor, Tamanho, Envio)
    /**
     * Função genérica para lidar com a seleção em grupos de botões.
     * @param {string} selector - O seletor CSS para os botões do grupo (ex: '.size-buttons button').
     */
    function handleSelector(selector) {
        const buttons = document.querySelectorAll(selector);
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove a classe 'active' de todos os botões do mesmo grupo
                buttons.forEach(btn => btn.classList.remove('active'));
                // Adiciona a classe 'active' apenas no botão clicado
                button.classList.add('active');
                
                // IMPORTANTE: Após qualquer clique, chama a verificação para habilitar/desabilitar o botão do carrinho
                checkSelections();
            });
        });
    }

    // Aplica a função de seleção para cada grupo de botões
    handleSelector('.color-selector .swatch');
    handleSelector('.size-buttons button');
    handleSelector('.shipping-options button');


    // 3. BOTÕES DE AÇÃO (Carrinho e Wishlist)
    
    // Ação do botão "Adicionar ao Carrinho"
    addToCartButton.addEventListener('click', () => {
        // Como o botão só está habilitado quando as seleções estão feitas, podemos pegar os valores com segurança
        const selectedSize = document.querySelector('.size-buttons button.active').textContent;
        const selectedColorElement = document.querySelector('.color-selector .swatch.active');
        
        let selectedColorInfo = 'Não aplicável';
        if (selectedColorElement) {
            // Tenta pegar a cor do estilo, se não for uma imagem
             selectedColorInfo = selectedColorElement.style.backgroundColor || 'Cor selecionada';
        }

        // Exibe uma mensagem de confirmação para o usuário
        alert(`Produto adicionado ao carrinho!\nTamanho: ${selectedSize}\nCor: ${selectedColorInfo}`);
    });

    // Ação do botão de Wishlist (coração)
    wishlistButton.addEventListener('click', () => {
        const heartIcon = wishlistButton.querySelector('i');
        // Alterna o ícone entre coração vazio (far) e coração cheio (fas) a cada clique
        heartIcon.classList.toggle('far'); // remove se tiver, adiciona se não tiver
        heartIcon.classList.toggle('fas'); // adiciona se não tiver, remove se tiver
    });

    // --- 4. UTILIDADES ---
    
    // Ação do ícone de copiar SKU
    copySkuIcon.addEventListener('click', () => {
        // Pega o texto do elemento pai (<p>) e extrai apenas o código do SKU
        const skuText = copySkuIcon.parentElement.textContent.split(' ')[1];

        // Usa a API moderna do navegador para copiar o texto para a área de transferência
        navigator.clipboard.writeText(skuText).then(() => {
            alert(`SKU "${skuText}" copiado para a área de transferência!`);
        }).catch(err => {
            console.error('Falha ao copiar o SKU: ', err);
            alert('Não foi possível copiar o SKU. Verifique as permissões do navegador.');
        });
    });
    
    // --- EXECUÇÃO INICIAL ---
    // Chama a função `checkSelections` uma vez assim que a página carrega.
    // Isso garante que o botão "Adicionar ao Carrinho" comece desabilitado.
    checkSelections();

});