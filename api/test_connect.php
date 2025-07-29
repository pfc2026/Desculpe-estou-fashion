<?php
// api/teste_conexao.php

// Puxa as configurações do nosso arquivo principal de conexão
require_once "db_connect.php";

// A mágica acontece aqui: a variável $conn foi criada no arquivo db_connect.php.
// Vamos verificar se ela existe e se não há erros de conexão.

if ($conn && $conn->connect_error) {

    echo "<h1 style='color: red;'>FALHA NA CONEXÃO!</h1>";
    echo "<p>Erro: " . $conn->connect_error . "</p>";
    echo "<p><strong>O que fazer:</strong> Verifique se o MySQL está ligado no XAMPP e se o nome de usuário, senha e nome do banco de dados no arquivo `api/db_connect.php` estão corretos.</p>";
} elseif ($conn) {
    
    echo "<h1 style='color: green;'>CONEXÃO BEM-SUCEDIDA!</h1>";
    echo "<p>O PHP está conectado ao banco de dados <strong>" . $dbname . "</strong> com sucesso.</p>";
    echo "<p>Pode apagar este arquivo de teste (`teste_conexao.php`) e continuar o projeto.</p>";
} else {
    
    echo "<h1 style='color: red;'>ERRO CRÍTICO!</h1>";
    echo "<p>O arquivo `db_connect.php` não foi encontrado ou está com um erro grave.</p>";
}

if ($conn) {
    $conn->close();
}
?>