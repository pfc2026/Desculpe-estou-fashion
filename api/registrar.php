
<?php
session_start();
require_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');

    // Validar dados
    if (empty($nome) || empty($email) || empty($senha)) {
        header("Location: ../index7.html?error=empty");
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: ../index7.html?error=invalid_email");
        exit();
    }

    if (strlen($senha) < 8) {
        header("Location: ../index7.html?error=weak_password");
        exit();
    }

    // Verificar se o email já existe
    $check_sql = "SELECT id_usuario FROM usuarios WHERE email = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        $check_stmt->close();
        header("Location: ../index7.html?error=email_exists");
        exit();
    }
    $check_stmt->close();

    // Hash da senha
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

    // Inserir novo usuário
    $insert_sql = "INSERT INTO usuarios (nome, email, senha_hash, data_cadastro) VALUES (?, ?, ?, NOW())";
    $stmt = $conn->prepare($insert_sql);
    $stmt->bind_param("sss", $nome, $email, $senha_hash);

    if ($stmt->execute()) {
        // Login automático após registro
        $_SESSION['id_usuario'] = $stmt->insert_id;
        $_SESSION['nome'] = $nome;
        $_SESSION['email'] = $email;

        $stmt->close();
        $conn->close();
        header("Location: ../index2.html?status=success"); // Redireciona para a página de termos/sucesso
        exit();
    } else {
        $stmt->close();
        $conn->close();
        header("Location: ../index7.html?error=db_error"); // Erro ao inserir no banco
        exit();
    }
} else {
    // Se o método não for POST, redireciona para a página de registro
    header("Location: ../index7.html");
    exit();
}
?>