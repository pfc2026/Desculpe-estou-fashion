<?php

$dbname ='desculpe_estou_fashion_db';
$host = 'localhost';
$username = 'Luiz';
$password = 'luiz2026';

$sql = new mysqli($host, $username, $password, $dbname);
if ($sql->connect_error) {
    die("Connection failed: " . $sql->connect_error);
}

