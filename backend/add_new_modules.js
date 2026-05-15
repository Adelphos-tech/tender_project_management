/**
 * One-time migration: adds new project-master module permissions
 * to all existing Role documents that don't already have them.
 * Run with: node add_new_modules.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const newModules = [
  { module: 'tender',           canView: true, canCreate: true, canEdit: true, canDelete: true },
  { module: 'wip',              canView: true, canCreate: true, canEdit: true, canDelete: true },
  { module: 'property',         canView: true, canCreate: true, canEdit: true, canDelete: true },
  { module: 'inout',            canView: true, canCreate: true, canEdit: true, canDelete: true },
  { module: 'paymentSchedules', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { module: 'vehicleLogbook',   canView: true, canCreate: true, canEdit: true, canDelete: true },
];

async function migrate() {
  await connectDB();

  const Role = require('./models/Role');
  const roles = await Role.find({});
  console.log(`Found ${roles.length} role(s)`);

  for (const role of roles) {
    let changed = false;
    for (const mod of newModules) {
      const already = role.permissions.find(p => p.module === mod.module);
      if (!already) {
        role.permissions.push(mod);
        changed = true;
        console.log(`  + Added '${mod.module}' to role: ${role.name}`);
      } else {
        console.log(`  ~ '${mod.module}' already exists in role: ${role.name}`);
      }
    }
    if (changed) await role.save();
  }

  console.log('\nMigration complete.');
  mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
