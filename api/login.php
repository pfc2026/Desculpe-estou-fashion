
<?php
session_start();
require_once 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');

    // Validar dados
    if (empty($email) || empty($senha)) {
        header("Location: ../index.html?error=empty");
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: ../index.html?error=invalid_email");
        exit();
    }

    // Buscar usuário
    $sql = "SELECT id_usuario, nome, email, senha_hash FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($senha, $row['senha_hash'])) {
            // Login bem sucedido
            $_SESSION['id_usuario'] = $row['id_usuario'];
            $_SESSION['nome'] = $row['nome'];
            $_SESSION['email'] = $row['email'];
        $_SESSION['nome'] = $nome;
        $_SESSION['email'] = $email;
        header("Location: ../index3.html");
        exit();
    } else {
        echo "Senha incorreta!";
    }
} else {
    echo "Usuário não encontrado!";
}

$stmt->close();
$conn->close();
?>