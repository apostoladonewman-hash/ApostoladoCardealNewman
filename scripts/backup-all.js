/**
 * Complete Backup Script
 * Runs all backup tasks (database + uploads)
 *
 * Usage:
 *   node scripts/backup-all.js
 */

const { createBackup: backupDatabase } = require('./backup-database');
const { createBackup: backupUploads } = require('./backup-uploads');

async function main() {
  console.log('🚀 Complete Backup Process');
  console.log('===========================\n');

  const startTime = Date.now();

  try {
    // Backup database
    console.log('1️⃣  DATABASE BACKUP');
    console.log('-------------------');
    await backupDatabase();

    console.log('\n');

    // Backup uploads
    console.log('2️⃣  UPLOADS BACKUP');
    console.log('------------------');
    await backupUploads();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n');
    console.log('✅ All backups completed successfully!');
    console.log(`⏱️  Total time: ${duration}s`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Backup process failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
