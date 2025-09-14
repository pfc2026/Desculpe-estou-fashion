
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
            
            // Atualizar último login do usuário
            $update_sql = "UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id_usuario = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param("i", $row['id_usuario']);
            $update_stmt->execute();
            
            // Registrar o login
            $ip = $_SERVER['REMOTE_ADDR'];
            $user_agent = $_SERVER['HTTP_USER_AGENT'];
            $log_sql = "INSERT INTO registro_login (id_usuario, ip, user_agent, sucesso) VALUES (?, ?, ?, 1)";
            $log_stmt = $conn->prepare($log_sql);
            $log_stmt->bind_param("iss", $row['id_usuario'], $ip, $user_agent);
            $log_stmt->execute();
            
            $stmt->close();
            $update_stmt->close();
            $log_stmt->close();
            $conn->close();
            header("Location: ../index3.html");
            exit();
        }
    }

    // Se o script chegou aqui, o login falhou (usuário não encontrado ou senha incorreta)
    if ($row) {
        // Registrar tentativa falha de login (usuário existe mas senha errada)
        $ip = $_SERVER['REMOTE_ADDR'];
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $log_sql = "INSERT INTO registro_login (id_usuario, ip, user_agent, sucesso) VALUES (?, ?, ?, 0)";
        $log_stmt = $conn->prepare($log_sql);
        $log_stmt->bind_param("iss", $row['id_usuario'], $ip, $user_agent);
        $log_stmt->execute();
        $log_stmt->close();
    }
    
    $stmt->close();
    $conn->close();
    header("Location: ../index.html?error=invalid");
    exit();
} else {
    // Se o método não for POST, redireciona para a página de login
    header("Location: ../index.html");
    exit();
}
// c:\xampp\htdocs\GitHub\Desculpe-estou-fashion\api\login.php
?>