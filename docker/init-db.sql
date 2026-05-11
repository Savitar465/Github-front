-- Inicialización de bases de datos para GitHubX
-- Este script se ejecuta al crear el contenedor de PostgreSQL

-- Crear base de datos para Keycloak
CREATE DATABASE keycloak_db;

-- La base de datos github_files_db ya se crea por POSTGRES_DB env var

-- Conectar a github_files_db y crear schema
\c github_files_db;

-- Tabla de repositorios
CREATE TABLE IF NOT EXISTS repositories (
    id BIGSERIAL PRIMARY KEY,
    owner VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    visibility VARCHAR(10) NOT NULL DEFAULT 'PRIVATE',
    default_branch VARCHAR(100) DEFAULT 'main',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_repositories_owner_name UNIQUE (owner, name)
);

-- Tabla de archivos
CREATE TABLE IF NOT EXISTS files (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(1000) NOT NULL,
    sha VARCHAR(40) NOT NULL,
    type VARCHAR(10) NOT NULL,
    size BIGINT,
    content TEXT,
    encoding VARCHAR(20),
    branch VARCHAR(100) DEFAULT 'main',
    last_commit_sha VARCHAR(40),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_files_repository FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE,
    CONSTRAINT uk_files_repo_path_branch UNIQUE (repository_id, path, branch)
);

-- Tabla de commits
CREATE TABLE IF NOT EXISTS commits (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL,
    sha VARCHAR(40) NOT NULL,
    message TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_date TIMESTAMP WITH TIME ZONE NOT NULL,
    committer_name VARCHAR(100) NOT NULL,
    committer_email VARCHAR(255) NOT NULL,
    committer_date TIMESTAMP WITH TIME ZONE NOT NULL,
    parent_sha VARCHAR(40),
    branch VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commits_repository FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE,
    CONSTRAINT uk_commits_repo_sha UNIQUE (repository_id, sha)
);

-- Tabla de archivos modificados en commits
CREATE TABLE IF NOT EXISTS commit_files (
    id BIGSERIAL PRIMARY KEY,
    commit_id BIGINT NOT NULL,
    filename VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL,
    additions INTEGER DEFAULT 0,
    deletions INTEGER DEFAULT 0,
    changes INTEGER DEFAULT 0,
    patch TEXT,
    CONSTRAINT fk_commit_files_commit FOREIGN KEY (commit_id) REFERENCES commits(id) ON DELETE CASCADE
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_files_repository_branch ON files(repository_id, branch);
CREATE INDEX IF NOT EXISTS idx_commits_repository_branch ON commits(repository_id, branch);
CREATE INDEX IF NOT EXISTS idx_commits_committer_date ON commits(committer_date DESC);
CREATE INDEX IF NOT EXISTS idx_commit_files_commit ON commit_files(commit_id);

-- Datos de prueba
INSERT INTO repositories (owner, name, description, visibility, default_branch)
VALUES
    ('demo-user', 'demo-repo', 'Repositorio de demostración', 'PUBLIC', 'main'),
    ('davichox', 'github-front', 'Frontend Next.js para GitHubX', 'PUBLIC', 'main'),
    ('davichox', 'github-files-ms', 'Microservicio de archivos Spring Boot', 'PUBLIC', 'main')
ON CONFLICT (owner, name) DO NOTHING;

-- Archivos de prueba para demo-repo
INSERT INTO files (repository_id, name, path, sha, type, size, content, encoding, branch, last_commit_sha)
SELECT r.id, 'README.md', 'README.md', 'a1b2c3d4e5f6789012345678901234567890abcd', 'FILE', 150,
    'IyBEZW1vIFJlcG9zaXRvcnkKCkJpZW52ZW5pZG8gYWwgcmVwb3NpdG9yaW8gZGUgZGVtby4=', 'base64', 'main', 'abc123'
FROM repositories r WHERE r.owner = 'demo-user' AND r.name = 'demo-repo'
ON CONFLICT DO NOTHING;

INSERT INTO files (repository_id, name, path, sha, type, branch, last_commit_sha)
SELECT r.id, 'src', 'src', 'b2c3d4e5f67890123456789012345678901234ab', 'DIRECTORY', 'main', 'abc123'
FROM repositories r WHERE r.owner = 'demo-user' AND r.name = 'demo-repo'
ON CONFLICT DO NOTHING;

-- Commit de prueba
INSERT INTO commits (repository_id, sha, message, author_name, author_email, author_date, committer_name, committer_email, committer_date, branch)
SELECT r.id, 'abc123def456789012345678901234567890abcd', 'Initial commit', 'Demo User', 'demo@example.com', NOW(), 'Demo User', 'demo@example.com', NOW(), 'main'
FROM repositories r WHERE r.owner = 'demo-user' AND r.name = 'demo-repo'
ON CONFLICT DO NOTHING;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
