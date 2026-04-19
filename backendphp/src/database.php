<?php

function getConnection(): PDO
{
    $host     = getenv('DB_HOST')     ?: 'localhost';
    $port     = getenv('DB_PORT')     ?: '3306';
    $dbname   = getenv('DB_NAME')     ?: 'clinica';
    $user     = getenv('DB_USER')     ?: 'user';
    $password = getenv('DB_PASSWORD') ?: 'password';

    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}
