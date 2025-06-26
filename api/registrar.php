<?php
// Conexão com o banco de dados
$servername = "localhost";
$username = "Luiz"; // ajuste para o seu usuário do banco
$password = "luiz2026"; // padrão XAMPP
$dbname = "desculpe_estou_fashion_db"; 

$sql = new mysqli($servername, $username, $password, $dbname);

if ($sql->connect_error) {
    die("Falha na conexão: " . $sql->connect_error);
}

// Recebe os dados do formulário
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Validação simples
if (empty($name) || empty($email) || empty($password)) {
    echo "Preencha todos os campos!";
    exit();
}

// Hash da senha para segurança
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prepara e executa o insert
$insert = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
$stmt = $sql->prepare($insert);
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    // Redireciona para a página principal após cadastro
    header("Location: ../index3.html");
    exit();
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$sql->close();
?>