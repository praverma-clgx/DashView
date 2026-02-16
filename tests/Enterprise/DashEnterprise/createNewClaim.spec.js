import { test, expect } from '../../../fixtures/enterpriseFixtures.js';
import { CreateClaimPage } from '../../../pageObjects/enterprise/dashEnterprise/createNewClaim.po.js';
import claimDetails from '../../../testData/enterprise/enterpriseClaimData.json' with { type: 'json' };
import { isProduction } from '../../../utils/testTags.js';

const { claimDetails: createNewClaimDetails } = claimDetails;

test.skip(isProduction(), 'Skipping create claim test in production environment');

test('Create New Claim', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
  const createClaimPage = new CreateClaimPage(page);

  const referredBy = await createClaimPage.createNewClaimWithReferredBy(createNewClaimDetails);
  
  // Extract just the name from the returned value (first line only)
  const expectedReferredBy = referredBy.split('\n')[0].trim();
  console.log(`Selected Referred By value: "${expectedReferredBy}"`);

  await page.waitForLoadState('networkidle');
  
  // Wait for the Job/Claim slideboard to load - verify we're on the slideboard
  await expect(page).toHaveURL(/JobSlideBoard|ClaimSlideBoard/, { timeout: 15000 });

  // // Look for Referred By on the slideboard page
  // // Try to find the claim information dock (may not exist on all pages)
  // const claimInfoDock = page.locator('#ctl00_ContentPlaceHolder1_dockClaimInformation_C');
  // const hasClaimInfoDock = (await claimInfoDock.count()) > 0;

  // if (hasClaimInfoDock) {
  //   const referredByLocator = page.locator(
  //     '#ctl00_ContentPlaceHolder1_dockClaimInformation_C .parantDiv .innerDiv50pct:has-text("Referred By") .innerDiv30pct.fontBold',
  //   );
    
  //   // Only verify if the element exists
  //   const referredByCount = await referredByLocator.count();
  //   if (referredByCount > 0) {
  //     await expect(referredByLocator).toBeVisible({ timeout: 10000 });
  //     const displayedReferredBy = await referredByLocator.innerText();

  //     // Extract only the first line (the actual name) and clean up whitespace
  //     const cleanDisplayedReferredBy = displayedReferredBy
  //       ?.split('\n')[0]  // Get first line only
  //       .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
  //       .trim();

  //     // Assert the displayed value matches the selected value
  //     expect(cleanDisplayedReferredBy).toBe(expectedReferredBy);
  //     console.log(`✓ Displayed Referred By: "${cleanDisplayedReferredBy}"`);
  //     console.log(`✓ Expected Referred By: "${expectedReferredBy}"`);
  //   } else {
  //     console.log('⚠ Referred By field not found on slideboard - skipping verification');
  //   }
  // } else {
  //   console.log('⚠ Claim Information dock not present - skipping Referred By verification');
  // }

  // // Verify Year Built if it exists (conditional check)
  // const yearBuiltLocator = page.locator(
  //   '#ctl00_ContentPlaceHolder1_dockCustomerInformation_C .innerDiv50pct:has(.innerDiv20pct:text("Year Built")) .innerDiv30pct',
  // );
  // const yearBuiltCount = await yearBuiltLocator.count();
  // if (yearBuiltCount > 0) {
  //   await expect(yearBuiltLocator).toBeVisible({ timeout: 10000 });
  //   await expect(yearBuiltLocator).toContainText(createNewClaimDetails.yearBuilt);
  //   console.log(`✓ Year Built verified: ${createNewClaimDetails.yearBuilt}`);
  // } else {
  //   console.log('⚠ Year Built field not present on page');
  // }

  // // Check if phone number section exists (optional verification)
  // const phoneLocator = page.locator('#ctl00_ContentPlaceHolder1_PhoneNo');
  // const phoneExists = (await phoneLocator.count()) > 0;
  // if (phoneExists) {
  //   console.log('✓ Phone number field found on page');
  // } else {
  //   console.log('⚠ Phone number field not present on page');
  // }
  
  // // Final verification: Claim was created successfully
  // // Check that we landed on a slideboard page with a Job/Claim number in URL
  // const currentUrl = page.url();
  // const hasJobNumber = currentUrl.includes('JobNumber=') || currentUrl.includes('ClaimNumber=');
  // expect(hasJobNumber, 'Should navigate to slideboard with Job/Claim number').toBeTruthy();
  
  // console.log(`✅ Claim created successfully! URL: ${currentUrl}`);
});
