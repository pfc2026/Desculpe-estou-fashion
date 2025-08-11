
<?php
session_start();
include_once 'db_connect.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$sql = "SELECT id_usuario, nome, senha_hash FROM Usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($id_usuario, $nome, $hashedPassword);
    $stmt->fetch();
    if (password_verify($password, $hashedPassword)) {
        // Salva dados do usuário na sessão
        $_SESSION['id_usuario'] = $id_usuario;
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