# TODO: Tornar Páginas Dinâmicas com Node.js, EJS e MongoDB

## 1. Instalar Dependências
- [x] Instalar EJS via npm

## 2. Configurar Servidor
- [x] Atualizar api/server.js para usar EJS como engine de template
- [x] Criar pasta views/ para templates EJS
- [x] Configurar static files para servir CSS, JS, etc.

## 3. Criar Templates EJS
- [x] Criar views/categoria.ejs para páginas de categoria (masculino, feminino)
- [x] Criar views/produto.ejs para páginas de produto individual
- [x] Criar views/layout.ejs para layout base (header, footer)

## 4. Adicionar Rotas Dinâmicas
- [x] Adicionar rota GET /categoria/:categoria em server.js
- [x] Adicionar rota GET /produto/:id em server.js
- [x] Implementar lógica para buscar produtos do MongoDB nas rotas

## 5. Atualizar Navegação e Links
- [x] Atualizar links em templates para usar rotas dinâmicas
- [x] Remover ou redirecionar arquivos HTML estáticos

## 6. Testar e Ajustar
- [x] Testar carregamento de categorias e produtos
- [x] Verificar conexão MongoDB com MONGO_URI
- [x] Ajustar estilos e scripts se necessário
