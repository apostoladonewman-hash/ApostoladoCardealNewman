#!/bin/sh

# Sair imediatamente se um comando falhar
set -e

# Executar a migração do banco de dados
echo "Running database migrations..."
npm run db:migrate

# Executar o comando principal do container (passado como argumento para este script)
echo "Starting application..."
exec "$@"