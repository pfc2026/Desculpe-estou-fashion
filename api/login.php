<?php

include_once 'db_connect.php';

$email = $_POST['email'];
$password = $_POST['password'];
$sql = "SELECT * FROM users WHERE email = ? AND password = ?";
$stmt = $sql->prepare($sql);