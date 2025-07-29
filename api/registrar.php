<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "db_connect.php"; // Usa $conn

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
    header("Location: ../index3.html?status=success");
    exit();
} else {
    header("Location: ../index7.html?status=error");
    exit();
}

$stmt->close();
$conn->close();
?>