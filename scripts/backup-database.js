/**
 * Database Backup Script
 * Creates automated backups of PostgreSQL database
 *
 * Usage:
 *   node scripts/backup-database.js
 *
 * Environment variables required:
 *   DATABASE_HOST, DATABASE_PORT, DATABASE_NAME,
 *   DATABASE_USERNAME, DATABASE_PASSWORD
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'backups', 'database');
const MAX_BACKUPS = 30; // Keep last 30 backups

// Database configuration
const DB_CONFIG = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || '5432',
  database: process.env.DATABASE_NAME || 'apostolado_db',
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
};

/**
 * Create backup directory if it doesn't exist
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`✓ Created backup directory: ${BACKUP_DIR}`);
  }
}

/**
 * Generate backup filename with timestamp
 */
function getBackupFilename() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('.')[0];
  return `backup-${DB_CONFIG.database}-${timestamp}.sql`;
}

/**
 * Create database backup using pg_dump
 */
function createBackup() {
  const filename = getBackupFilename();
  const filepath = path.join(BACKUP_DIR, filename);

  console.log('🔄 Starting database backup...');
  console.log(`Database: ${DB_CONFIG.database}`);
  console.log(`Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);

  try {
    // Set PGPASSWORD environment variable for pg_dump
    const env = {
      ...process.env,
      PGPASSWORD: DB_CONFIG.password,
    };

    // Execute pg_dump command
    const command = `pg_dump -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -U ${DB_CONFIG.username} -d ${DB_CONFIG.database} -F p -f "${filepath}"`;

    execSync(command, { env, stdio: 'pipe' });

    const stats = fs.statSync(filepath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`✅ Backup created successfully!`);
    console.log(`File: ${filename}`);
    console.log(`Size: ${sizeInMB} MB`);
    console.log(`Path: ${filepath}`);

    return filepath;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    throw error;
  }
}

/**
 * Clean up old backups, keeping only the most recent ones
 */
function cleanOldBackups() {
  console.log('\n🧹 Cleaning old backups...');

  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.startsWith('backup-') && file.endsWith('.sql'))
    .map(file => ({
      name: file,
      path: path.join(BACKUP_DIR, file),
      time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length > MAX_BACKUPS) {
    const toDelete = files.slice(MAX_BACKUPS);
    toDelete.forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`  Deleted: ${file.name}`);
    });
    console.log(`✓ Removed ${toDelete.length} old backup(s)`);
  } else {
    console.log(`✓ No old backups to remove (${files.length}/${MAX_BACKUPS})`);
  }
}

/**
 * Main backup function
 */
async function main() {
  try {
    console.log('🗄️  Database Backup Script');
    console.log('========================\n');

    ensureBackupDir();
    const backupPath = createBackup();
    cleanOldBackups();

    console.log('\n✨ Backup process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Backup process failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { createBackup, cleanOldBackups };
