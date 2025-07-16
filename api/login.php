<?php

include_once 'db_connect.php';

$conn = new mysqli("localhost", "Luiz", "luiz2026", "desculpe_estou_fashion_db");
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Busca o hash da senha pelo e-mail
$sql = "SELECT senha_hash FROM Usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();
    if (password_verify($password, $hashedPassword)) {
        // Login OK, redireciona para página principal
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