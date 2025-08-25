-- --------------------------------------------------------
-- Servidor: 127.0.0.1
-- Versão do servidor: 10.4.28-MariaDB - mariadb.org binary distribution
-- OS do Servidor: Win64
-- HeidiSQL Versão: 12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para desculpe_estou_fashion_db
CREATE DATABASE IF NOT EXISTS `desculpe_estou_fashion_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `desculpe_estou_fashion_db`;

-- Copiando estrutura para tabela desculpe_estou_fashion_db.carrinho
CREATE TABLE IF NOT EXISTS `carrinho` (
  `id_carrinho` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_estoque` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 1,
  `data_adicao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_carrinho`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_estoque` (`id_estoque`),
  CONSTRAINT `carrinho_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `carrinho_ibfk_2` FOREIGN KEY (`id_estoque`) REFERENCES `estoque` (`id_estoque`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela desculpe_estou_fashion_db.carrinho: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela desculpe_estou_fashion_db.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela desculpe_estou_fashion_db.categorias: ~2 rows (aproximadamente)
INSERT INTO `categorias` (`id_categoria`, `nome`) VALUES
	(2, 'Feminino'),
	(1, 'Masculino');

-- Copiando estrutura para tabela desculpe_estou_fashion_db.estoque
CREATE TABLE IF NOT EXISTS `estoque` (
  `id_estoque` int(11) NOT NULL AUTO_INCREMENT,
  `id_produto` int(11) NOT NULL,
  `id_tamanho` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_estoque`),
  UNIQUE KEY `id_produto` (`id_produto`,`id_tamanho`),
  KEY `id_tamanho` (`id_tamanho`),
  CONSTRAINT `estoque_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE,
  CONSTRAINT `estoque_ibfk_2` FOREIGN KEY (`id_tamanho`) REFERENCES `tamanhos` (`id_tamanho`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela desculpe_estou_fashion_db.estoque: ~12 rows (aproximadamente)
INSERT INTO `estoque` (`id_estoque`, `id_produto`, `id_tamanho`, `quantidade`) VALUES
	(1, 1, 1, 10),
	(2, 1, 2, 10),
	(3, 2, 1, 10),
	(4, 2, 2, 10),
	(5, 3, 1, 10),
	(6, 3, 2, 10),
	(7, 4, 3, 10),
	(8, 4, 4, 10),
	(9, 5, 3, 10),
	(10, 5, 4, 10),
	(11, 6, 3, 10),
	(12, 6, 4, 10);

-- Copiando estrutura para tabela desculpe_estou_fashion_db.pedido_itens
CREATE TABLE IF NOT EXISTS `pedido_itens` (
  `id_item` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) DEFAULT NULL,
  `id_produto` int(11) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `preco_unitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_item`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `pedido_itens_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  CONSTRAINT `pedido_itens_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela desculpe_estou_fashion_db.pedido_itens: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela desculpe_estou_fashion_db.pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `data_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela desculpe_estou_fashion_db.pedidos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela desculpe_estou_fashion_db.produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `id_produto` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `imagem_url` varchar(255) DEFAULT NULL,
  `data_criacao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_produto`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela desculpe_estou_fashion_db.produtos: ~6 rows (aproximadamente)
INSERT INTO `produtos` (`id_produto`, `nome`, `descricao`, `preco`, `id_categoria`, `imagem_url`, `data_criacao`) VALUES
	(1, 'Calça Jeans Masculina', 'Calça jeans de alta qualidade e conforto.', 99.90, 1, 'compras/pagina de compras (2).png', '2025-08-18 15:00:00'),
	(2, 'Camisa Xadrez Masculina', 'Camisa xadrez estilosa para todas as ocasiões.', 79.90, 1, 'compras/pagina de compras (5).png', '2025-08-18 15:00:00'),
	(3, 'Camiseta Preta Basica', 'Camiseta básica preta, essencial no guarda-roupa.', 49.90, 1, 'compras/pagina de compras (1).png', '2025-08-18 15:00:00'),
	(4, 'Sunga Branca', 'Sunga branca para aproveitar o verão.', 39.90, 1, 'compras/pagina de compras (6).png', '2025-08-18 15:00:00'),
	(5, 'Macacão Feminino', 'Macacão florido, leve e elegante.', 85.50, 2, 'compras/pagina de compras (3).png', '2025-08-18 15:00:00'),
	(6, 'Vestido Verde Vintage', 'Vestido verde com um toque vintage e charmoso.', 120.00, 2, 'compras/pagina de compras (4).png', '2025-08-18 15:00:00');

-- Copiando estrutura para tabela desculpe_estou_fashion_db.tamanhos
CREATE TABLE IF NOT EXISTS `tamanhos` (
  `id_tamanho` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(20) NOT NULL,
  PRIMARY KEY (`id_tamanho`),
  UNIQUE KEY `descricao` (`descricao`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela desculpe_estou_fashion_db.tamanhos: ~4 rows (aproximadamente)
INSERT INTO `tamanhos` (`id_tamanho`, `descricao`) VALUES
	(2, 'G'),
	(1, 'M'),
	(3, 'P'),
	(4, 'Único');

-- Copiando estrutura para tabela desculpe_estou_fashion_db.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `data_cadastro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela desculpe_estou_fashion_db.usuarios: ~1 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `nome`, `email`, `senha_hash`, `data_cadastro`) VALUES
	(1, 'Luiz', 'luiz@gmail.com', '$2y$10$H9gL3q8zN4iJ5kO6/..fA.xY.Z/1b.2c.3d.4e.5f', '2025-08-18 14:30:00');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
