// run-all-envs.js
// Runs the Playwright test suite sequentially for each environment in the .env file

import { execSync } from 'child_process';
import fs from 'fs';

const environments = [
  'first_general',
  'paul_devis',
  'service_master',
  'evans',
  // add more if needed
];

for (const env of environments) {
  console.log(`\n==============================`);
  console.log(`Running tests for environment: ${env}`);
  console.log(`==============================`);
  // Update TEST_ENV in .env file
  let envFile = fs.readFileSync('.env', 'utf-8');
  envFile = envFile.replace(/^(TEST_ENV=).*/m, `$1${env}`);
  fs.writeFileSync('.env', envFile);
  try {
    execSync('npx playwright test --headed', { stdio: 'inherit' });
  } catch (err) {
    console.error(`Tests failed for environment: ${env}`);
    process.exit(1);
  }
}
console.log('\nAll environments tested successfully!');
