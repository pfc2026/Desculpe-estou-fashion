<?php


$servername = "localhost";
$username = "Luiz"; // ajuste conforme seu usuário do MySQL
$password = "luiz2026"; // ajuste conforme sua senha do MySQL
$dbname = "desculpe_estou_fashion_db";


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>

