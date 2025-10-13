/**
 * Uploads Backup Script
 * Creates automated backups of uploaded files
 *
 * Usage:
 *   node scripts/backup-uploads.js
 */

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

// Configuration
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const BACKUP_DIR = path.join(__dirname, '..', 'backups', 'uploads');
const MAX_BACKUPS = 15; // Keep last 15 backups

/**
 * Create backup directory if it doesn't exist
 */
async function ensureBackupDir() {
  await fs.ensureDir(BACKUP_DIR);
  console.log(`✓ Backup directory ready: ${BACKUP_DIR}`);
}

/**
 * Generate backup filename with timestamp
 */
function getBackupFilename() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('.')[0];
  return `uploads-backup-${timestamp}.zip`;
}

/**
 * Create compressed backup of uploads directory
 */
async function createBackup() {
  const filename = getBackupFilename();
  const filepath = path.join(BACKUP_DIR, filename);

  console.log('🔄 Starting uploads backup...');
  console.log(`Source: ${UPLOADS_DIR}`);

  // Check if uploads directory exists
  if (!(await fs.pathExists(UPLOADS_DIR))) {
    console.log('⚠️  No uploads directory found, skipping backup');
    return null;
  }

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(filepath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', () => {
      const sizeInMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
      console.log(`✅ Backup created successfully!`);
      console.log(`File: ${filename}`);
      console.log(`Size: ${sizeInMB} MB`);
      console.log(`Path: ${filepath}`);
      resolve(filepath);
    });

    archive.on('error', (err) => {
      console.error('❌ Backup failed:', err.message);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(UPLOADS_DIR, false);
    archive.finalize();
  });
}

/**
 * Clean up old backups, keeping only the most recent ones
 */
async function cleanOldBackups() {
  console.log('\n🧹 Cleaning old backups...');

  const files = await fs.readdir(BACKUP_DIR);
  const backupFiles = [];

  for (const file of files) {
    if (file.startsWith('uploads-backup-') && file.endsWith('.zip')) {
      const filepath = path.join(BACKUP_DIR, file);
      const stats = await fs.stat(filepath);
      backupFiles.push({
        name: file,
        path: filepath,
        time: stats.mtime.getTime(),
      });
    }
  }

  backupFiles.sort((a, b) => b.time - a.time);

  if (backupFiles.length > MAX_BACKUPS) {
    const toDelete = backupFiles.slice(MAX_BACKUPS);
    for (const file of toDelete) {
      await fs.unlink(file.path);
      console.log(`  Deleted: ${file.name}`);
    }
    console.log(`✓ Removed ${toDelete.length} old backup(s)`);
  } else {
    console.log(
      `✓ No old backups to remove (${backupFiles.length}/${MAX_BACKUPS})`,
    );
  }
}

/**
 * Main backup function
 */
async function main() {
  try {
    console.log('📦 Uploads Backup Script');
    console.log('========================\n');

    await ensureBackupDir();
    await createBackup();
    await cleanOldBackups();

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
