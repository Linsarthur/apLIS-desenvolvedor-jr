
CREATE TABLE IF NOT EXISTS medicos (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nome          VARCHAR(255)  NOT NULL,
    CRM           VARCHAR(20)   NOT NULL,
    UFCRM         CHAR(2)       NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pacientes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(255)  NOT NULL,
    dataNascimento  DATE          NULL,
    carteirinha     VARCHAR(50)   NOT NULL,
    cpf             VARCHAR(11)   NOT NULL,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);