import { test, expect } from '../../../fixtures/enterpriseFixtures.js';
import { CreateClaimPage } from '../../../pageObjects/enterprise/dashEnterprise/createNewClaim.po.js';
import claimDetails from '../../../testData/enterprise/enterpriseClaimData.json' with { type: 'json' };

const { claimDetails: createNewClaimDetails } = claimDetails;

test.skip('Analyze Claim Page Structure', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
  const createClaimPage = new CreateClaimPage(page);

  const referredBy = await createClaimPage.createNewClaimWithReferredBy(createNewClaimDetails);
  console.log(`Selected Referred By: "${referredBy}"`);

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Take a full page screenshot
  await page.screenshot({ path: 'claim-page-analysis.png', fullPage: true });

  console.log('\n=== PAGE URL ===');
  console.log(page.url());

  // Find ALL docks on the page
  console.log('\n=== ALL DOCKS ON PAGE ===');
  const allDocks = await page.locator('[id*="dock"]').all();
  for (const dock of allDocks) {
    const id = await dock.getAttribute('id');
    const isVisible = await dock.isVisible();
    console.log(`${id}: ${isVisible ? '✓ VISIBLE' : '✗ HIDDEN'}`);
  }

  // Find job-specific elements
  console.log('\n=== JOB INFORMATION ===');
  const jobElements = await page.locator('[id*="Job"], [class*="job"]').all();
  console.log(`Found ${jobElements.length} job-related elements`);

  // Get the Job Number from URL or page
  const url = page.url();
  const jobNumberMatch = url.match(/JobNumber=([^&]+)/);
  const jobIdMatch = url.match(/JobId=([^&]+)/);
  if (jobNumberMatch) console.log(`Job Number: ${jobNumberMatch[1]}`);
  if (jobIdMatch) console.log(`Job ID: ${jobIdMatch[1]}`);

  // Check for common slideboard elements
  console.log('\n=== SLIDEBOARD ELEMENTS ===');
  const slideboardElements = [
    '.PageTitle',
    '#PageTitle',
    '[class*="title"]',
    '[id*="Title"]',
    '[id*="Panel"]',
    '[class*="panel"]',
  ];

  for (const selector of slideboardElements) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`${selector}: Found ${count}`);
      const first = page.locator(selector).first();
      if (await first.isVisible()) {
        const text = await first.innerText().catch(() => '');
        if (text) console.log(`  Text: "${text.substring(0, 50)}..."`);
      }
    }
  }

  // Look for any text containing the created job/claim info
  console.log('\n=== VERIFICATION OPPORTUNITIES ===');
  
  // Check if Job Number is displayed
  const jobNumOnPage = await page.locator(`text=/16-0\\d+-AIR/`).count();
  console.log(`Job Number on page: ${jobNumOnPage > 0 ? '✓ FOUND' : '✗ NOT FOUND'}`);

  // Check for customer name
  const customerName = createNewClaimDetails.lastName;
  const customerOnPage = await page.locator(`text="${customerName}"`).count();
  console.log(`Customer name "${customerName}": ${customerOnPage > 0 ? '✓ FOUND' : '✗ NOT FOUND'}`);

  // Check for date of loss
  const dateOnPage = await page.locator(`text="${createNewClaimDetails.dateOfLoss}"`).count();
  console.log(`Date of Loss: ${dateOnPage > 0 ? '✓ FOUND' : '✗ NOT FOUND'}`);

  // Get ALL visible text to see what we can verify
  console.log('\n=== PAGE CONTENT SAMPLE ===');
  const bodyText = await page.locator('body').innerText();
  const lines = bodyText.split('\n').filter(l => l.trim().length > 0).slice(0, 30);
  lines.forEach((line, i) => console.log(`${i + 1}: ${line.trim().substring(0, 80)}`));

  // Pass  the test - this is just for analysis
  expect(true).toBeTruthy();
});
