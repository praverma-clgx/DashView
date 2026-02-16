import { test } from '../../../fixtures/enterpriseFixtures.js';
import EnterpriseAddPaymentPage from '../../../pageObjects/enterprise/companySetting/enterpriseAddPayment.po.js';
import jobNumberData from '../../../testData/enterprise/commonJobNumber.json' with { type: 'json' };
import { searchJobNumber } from '../../../utils/searchJobNumber.js';

test('Add New Payment Details', async ({ authenticatedPage }) => {
  //------------Code Starts Here------------

  const page = authenticatedPage;
  const addPaymentPage = new EnterpriseAddPaymentPage(page);

  // Search for job by number
  await searchJobNumber(page, jobNumberData.jobNumber);

  // Wait for Acct. Details image to be visible and click it
  await addPaymentPage.waitAndClickAcctDetailsImg();

  // Verify job number is displayed correctly
  await addPaymentPage.assertJobNumberContains(jobNumberData.jobNumber);

  // Click Payments button
  await addPaymentPage.clickPaymentsButton();

  // Click Add New Payment button
  await addPaymentPage.clickAddNewPaymentButton();

  // Verify Payment Mode label is visible
  await addPaymentPage.assertPaymentModeLabelVisible();

  // Verify Memo label is visible
  await addPaymentPage.assertMemoLabelVisible();

  // Verify Invoice Number label is visible
  await addPaymentPage.assertInvoiceNumberLabelVisible();

  // Select today's date
  await addPaymentPage.selectTodayDateForPayment();

  // Verify Reference Number label is visible
  await addPaymentPage.assertReferenceNumberLabelVisible();

  // Verify Payment Amount label is visible
  await addPaymentPage.assertPaymentAmountLabelVisible();

  // Verify Discount Amount label is visible
  await addPaymentPage.assertDiscountAmountLabelVisible();

});
