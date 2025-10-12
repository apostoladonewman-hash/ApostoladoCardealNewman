const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

/**
 * Script para executar migrations no PostgreSQL
 * Usage: node database/run-migration.js
 */

async function runMigration() {
  // Configuração do banco de dados
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    database: process.env.DATABASE_NAME || 'apostolado_db',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'aloq9563',
  });

  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado com sucesso!\n');

    // Ler o arquivo de migration
    const migrationPath = path.join(__dirname, 'migrations', '001_add_indexes.sql');
    console.log(`📄 Lendo migration: ${migrationPath}`);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Executar a migration
    console.log('🚀 Executando migration...\n');
    await client.query(sql);

    console.log('\n✅ Migration executada com sucesso!');
    console.log('\n📊 Índices criados:');

    // Listar índices criados
    const indexesQuery = `
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname;
    `;

    const result = await client.query(indexesQuery);

    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.indexname} em ${row.tablename}`);
    });

    console.log(`\n✨ Total de índices: ${result.rows.length}`);

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada.');
  }
}

runMigration();
