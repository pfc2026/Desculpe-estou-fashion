
<?php
session_start();
require_once "db_connect.php";

$nome = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['password'] ?? '';

if (empty($nome) || empty($email) || empty($senha)) {
    header("Location: ../index7.html?status=error");
    exit();
}

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

$insert = "INSERT INTO Usuarios (nome, email, senha_hash) VALUES (?, ?, ?)";
$stmt = $conn->prepare($insert);
$stmt->bind_param("sss", $nome, $email, $senha_hash);

if ($stmt->execute()) {
    // Salva dados do usuário na sessão
    $_SESSION['id_usuario'] = $stmt->insert_id;
    $_SESSION['nome'] = $nome;
    $_SESSION['email'] = $email;
    header("Location: ../index3.html?status=success");
    exit();
} else {
    header("Location: ../index7.html?status=error");
    exit();
}

$stmt->close();
$conn->close();
?>