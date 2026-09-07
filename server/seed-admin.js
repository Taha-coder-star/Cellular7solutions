/**
 * One-time creation of the single admin account. Not wired into any route —
 * there is no public registration flow by design.
 *
 * Run from server/:
 *   node seed-admin.js "Admin Name" admin@example.com yourPassword
 *
 * Re-running with the same email updates name/password on the existing doc
 * rather than creating a duplicate.
 */
require('dotenv').config({ override: true });
const dns = require('dns');
const connectDB = require('./config/db');
const User = require('./models/User');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

async function main() {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.error('Usage: node seed-admin.js "Admin Name" admin@example.com yourPassword');
    process.exit(1);
  }

  await connectDB();

  let admin = await User.findOne({ email: email.toLowerCase() });
  if (admin) {
    admin.name = name;
    admin.password = password;
    await admin.save();
    console.log(`Updated existing admin: ${admin.email}`);
  } else {
    admin = await User.create({ name, email, password, role: 'admin' });
    console.log(`Created admin: ${admin.email}`);
  }

  process.exit(0);
}

main();
