<?php
header('Content-Type: application/json; charset=utf-8');
include_once 'db_connect.php';

$sql = "SELECT id_produto, nome, descricao, preco, categoria, tamanho, quantidade_estoque, imagem_url FROM produtos";
$result = $conn->query($sql);

$produtos = array();
if ($result && $result->num_rows > 0) {
	while ($row = $result->fetch_assoc()) {
		$produtos[] = $row;
	}
}

echo json_encode($produtos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$conn->close();
