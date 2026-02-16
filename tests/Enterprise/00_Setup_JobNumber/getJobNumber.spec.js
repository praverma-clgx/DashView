import { test } from '../../../fixtures/enterpriseFixtures.js';
import fs from 'fs';
import path from 'path';

test('Get Existing Job Number from Enter Job Number in Advance Job Search', async ({ authenticatedPage }) => {

  const page = authenticatedPage;

  const clientLackingButton = '#ctl00_ctl45_ClientLackingButton';
  const jobNumberInput = '#ctl00_ctl45_ddlJobNumber_Input';
  const jobNumberDropdownList = '#ctl00_ctl45_ddlJobNumber_DropDown ul.rcbList li';
  const loadingIndicator = '#ctl00_ctl45_ddlJobNumber_DropDown .loading-class';
  const searchBoxBtn = '#ctl00_ctl45_btnMJobSearch';

  const searchBox = page.locator(clientLackingButton);
  await searchBox.waitFor({ state: 'visible', timeout: 30000 });
  await searchBox.click();
  await page.waitForLoadState('networkidle');

  const searchBoxInput = page.locator(jobNumberInput);
  await searchBoxInput.click();

  const loadingIndicatorElement = page.locator(loadingIndicator);
  if (await loadingIndicatorElement.isVisible({ timeout: 10000 }).catch(() => false)) {
    await loadingIndicatorElement.waitFor({ state: 'hidden', timeout: 10000 });
  }

  const dropdownList = page.locator(jobNumberDropdownList);
  await dropdownList.first().waitFor({ state: 'visible', timeout: 10000 });
  await dropdownList.first().click();

  const searchBoxBtnElement = page.locator(searchBoxBtn);
  await searchBoxBtnElement.click();
  await page.waitForLoadState('networkidle');

  // Extract job number from the URL
  const currentUrl = page.url();
  const jobNumberFromUrl = currentUrl.match(/JobNumber=([^&]+)/)?.[1] || '';

  // Write the extracted job number and update time to the JSON file
  const jsonPath = path.resolve('testData/enterprise/commonJobNumber.json');
  const updatedData = {
    jobNumber: jobNumberFromUrl,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(jsonPath, JSON.stringify(updatedData, null, 2));
});
