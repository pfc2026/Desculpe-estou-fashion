<?php
session_start();
header('Content-Type: application/json');

// Destrói todas as variáveis de sessão
$_SESSION = array();

// Destrói a sessão
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logout realizado com sucesso']);
?>