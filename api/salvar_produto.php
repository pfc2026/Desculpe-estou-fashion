<?php
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    $conn = getConnection();
    $conn->beginTransaction();

    $data = $_POST;
    $id_produto = isset($data['id_produto']) ? $data['id_produto'] : null;
    
    // Upload da imagem
    $imagem_url = null;
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../compras/';
        $temp_name = $_FILES['imagem']['tmp_name'];
        $original_name = $_FILES['imagem']['name'];
        $extension = pathinfo($original_name, PATHINFO_EXTENSION);
        $new_name = uniqid() . '.' . $extension;
        $upload_path = $upload_dir . $new_name;
        
        if (move_uploaded_file($temp_name, $upload_path)) {
            $imagem_url = 'compras/' . $new_name;
        }
    }

    // Inserir ou atualizar produto
    if ($id_produto) {
        $query = "UPDATE produtos SET 
                  nome = ?, descricao = ?, preco = ?, 
                  id_categoria = ?, imagem_url = COALESCE(?, imagem_url)
                  WHERE id_produto = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            $data['nome'],
            $data['descricao'],
            $data['preco'],
            $data['categoria'],
            $imagem_url,
            $id_produto
        ]);
    } else {
        $query = "INSERT INTO produtos (nome, descricao, preco, id_categoria, imagem_url)
                  VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            $data['nome'],
            $data['descricao'],
            $data['preco'],
            $data['categoria'],
            $imagem_url
        ]);
        $id_produto = $conn->lastInsertId();
    }

    // Atualizar estoque para cada tamanho
    if (isset($data['tamanhos']) && is_array($data['tamanhos'])) {
        // Primeiro, remove todos os registros de estoque existentes
        $stmt = $conn->prepare("DELETE FROM estoque WHERE id_produto = ?");
        $stmt->execute([$id_produto]);
        
        // Depois, insere os novos registros
        $stmt = $conn->prepare("INSERT INTO estoque (id_produto, id_tamanho, quantidade) VALUES (?, ?, 10)");
        foreach ($data['tamanhos'] as $tamanho) {
            // Pega o id_tamanho baseado na descrição
            $query = "SELECT id_tamanho FROM tamanhos WHERE descricao = ?";
            $stmtTamanho = $conn->prepare($query);
            $stmtTamanho->execute([$tamanho]);
            $id_tamanho = $stmtTamanho->fetchColumn();
            
            if ($id_tamanho) {
                $stmt->execute([$id_produto, $id_tamanho]);
            }
        }
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Produto salvo com sucesso!']);
} catch(PDOException $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>