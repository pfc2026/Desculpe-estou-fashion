-- --------------------------------------------------------
-- PASSO 1: CRIAR O BANCO DE DADOS E AS TABELAS
-- --------------------------------------------------------

-- Cria o banco de dados com o nome da sua loja
CREATE DATABASE IF NOT EXISTS desculpe_estou_fashion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleciona o banco de dados para usar
USE desculpe_estou_fashion_db;

-- Cria todas as tabelas
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Tamanhos (
    id_tamanho INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    id_categoria INT,
    imagem_url VARCHAR(255),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria)
);

CREATE TABLE IF NOT EXISTS Estoque (
    id_estoque INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_tamanho INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    UNIQUE KEY (id_produto, id_tamanho),
    FOREIGN KEY (id_produto) REFERENCES Produtos(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (id_tamanho) REFERENCES Tamanhos(id_tamanho) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Carrinho (
    id_carrinho INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_estoque INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    data_adicao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_estoque) REFERENCES Estoque(id_estoque) ON DELETE CASCADE
);

CREATE INDEX idx_produto_nome ON Produtos(nome);
CREATE INDEX idx_usuario_email ON Usuarios(email);

-- --------------------------------------------------------
-- PASSO 2: INSERIR DADOS DE EXEMPLO (PRODUTOS)
-- --------------------------------------------------------

INSERT INTO Categorias (nome) VALUES ('Camisetas'), ('Calças'), ('Vestidos'), ('Casacos');

INSERT INTO Tamanhos (descricao) VALUES ('2 anos'), ('4 anos'), ('6 anos'), ('8 anos');

INSERT INTO Produtos (nome, descricao, preco, id_categoria, imagem_url) VALUES
('Camiseta Básica Preta Masculina', 'camiseta básica Preta masculina', 49.90, 1, 'compras/pagina de compras (1).png'),
('Calça Jeans Masculina', 'Calça jeans masculina', 99.90, 2, 'compras/pagina de compras (2).png'),
('Macacão Florido', 'macacão florido', 85.50, 3, 'compras/pagina de compras (3).png'),
('Vestido Verde Vintage', 'Vestido verde vintage', 120.00, 3, 'compras/pagina de compras (4).png'),
('Camisa Masculina Xadrez', 'Camisa masculina xadrez', 79.90, 1, 'compras/pagina de compras (5).png'),
('Sunga Branca Básica', 'sunga branca básica', 29.90, 2, 'compras/pagina de compras (6).png'),
('Camiseta Básica Preta Feminina', 'camiseta básica Preta feminina', 49.90, 1, 'compras/Captura de tela 2025-05-13 143719.png');