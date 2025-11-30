<?php
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    $conn = getConnection();
    $conn->beginTransaction();

    $id_produto = $_GET['id'] ?? null;

    if (!$id_produto) {
        throw new Exception('ID do produto não fornecido');
    }

    // Primeiro, pega a URL da imagem para poder excluí-la
    $stmt = $conn->prepare("SELECT imagem_url FROM produtos WHERE id_produto = ?");
    $stmt->execute([$id_produto]);
    $imagem_url = $stmt->fetchColumn();

    // Remove registros do estoque
    $stmt = $conn->prepare("DELETE FROM estoque WHERE id_produto = ?");
    $stmt->execute([$id_produto]);

    // Remove o produto
    $stmt = $conn->prepare("DELETE FROM produtos WHERE id_produto = ?");
    $stmt->execute([$id_produto]);

    // Se houver imagem e ela existir, exclui o arquivo
    if ($imagem_url) {
        $caminho_imagem = '../' . $imagem_url;
        if (file_exists($caminho_imagem)) {
            unlink($caminho_imagem);
        }
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Produto excluído com sucesso!']);
} catch(Exception $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>