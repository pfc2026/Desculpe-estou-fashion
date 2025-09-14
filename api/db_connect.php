<?php


$servername = "localhost";
$username = "root"; // usuário padrão do XAMPP
$password = ""; // senha padrão do XAMPP (vazia)
$dbname = "desculpe_estou_fashion_db";


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>

