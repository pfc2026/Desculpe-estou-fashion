<?php

$dbname = 'desculpeestoufashion';
$host = 'localhost';
$username = 'Luiz';
$password = 'luiz2026';

// Se for a porta padrão (3306), não precisa passar o parâmetro da porta
$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

