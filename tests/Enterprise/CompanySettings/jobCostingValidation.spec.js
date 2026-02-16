import { test } from '../../../fixtures/enterpriseFixtures.js';
import EnterpriseJobCostingPage from '../../../pageObjects/enterprise/companySetting/enterpriseJobCosting.po.js';
import jobCostingValidationData from '../../../testData/enterprise/enterpriseCompanySettings/JobCostingValidationData.json' with { type: 'json' };
import { searchJobNumber } from '../../../utils/searchJobNumber.js';

test('Job Costing Validation', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
  const jobCostingPage = new EnterpriseJobCostingPage(page);

  // Step 1: Search for job by number
  await searchJobNumber(page, jobCostingValidationData.jobNumber);

  // Step 2: Navigate to accounting details
  await jobCostingPage.waitAndClickAcctDetailsImg();

  // Step 4: Click Job Costing button
  await jobCostingPage.clickJobCostingButton();

  // Step 5: Assert all cost category buttons are visible
  await jobCostingPage.assertAllCostCategoryButtonsVisible();

  // Step 6: Click All Category Cost button
  await jobCostingPage.clickAllCategoryCostButton();

  // Step 8: Click Add New Record button
  await jobCostingPage.clickAddNewRecordButton();

  // Step 9: Assert category all cost table label
  await jobCostingPage.assertCategoryAllCostTableLabel();

  // Step 10: Assert add new date input is visible
  await jobCostingPage.assertAddNewDateInputVisible();

  // Step 11: Check billable checkbox
  await jobCostingPage.checkBillableCheckbox();

  // Step 14: Select Paid To first option from dropdown
  await jobCostingPage.selectPaidToFirstOption();

  // Step 20: Assert extended amount input is visible
  await jobCostingPage.assertExtendedAmountInputVisible();
});
