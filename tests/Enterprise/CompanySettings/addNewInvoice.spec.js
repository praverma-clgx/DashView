import { test } from '../../../fixtures/enterpriseFixtures.js';
import EnterpriseAddInvoicePage from '../../../pageObjects/enterprise/companySetting/enterpriseAddInvoice.po.js';
import addNewInvoiceData from '../../../testData/enterprise/enterpriseCompanySettings/AddNewInvoiceData.json' with { type: 'json' };
import { searchJobNumber } from '../../../utils/searchJobNumber.js';

test('Add New Record in Invoices Detail', async ({ authenticatedPage }) => {
  //------------Code Starts Here------------

  const page = authenticatedPage;
  const addInvoicePage = new EnterpriseAddInvoicePage(page);

  // Search for job by number
  await searchJobNumber(page, addNewInvoiceData.jobNumber);

  // Wait for Acct. Details image to be visible and click it
  await addInvoicePage.waitAndClickAcctDetailsImg();

  // Verify job number is displayed correctly
  await addInvoicePage.assertJobNumberContains(addNewInvoiceData.jobNumber);

  // Click Invoice Details button
  await addInvoicePage.clickInvoiceDetailsButton();

  // Verify invoice details job number
  await addInvoicePage.assertInvoiceDetailsJobNumber(addNewInvoiceData.jobNumber);

  // Click Add New Invoice button
  await addInvoicePage.clickAddNewInvoiceButton();

  // Verify Invoice Memo label is visible
  await addInvoicePage.assertInvoiceMemoLabelVisible();


  // Verify Additional Info label is visible
  await addInvoicePage.assertAdditionalInfoLabelVisible();

  // Verify Date Invoiced label is visible
  await addInvoicePage.assertDateInvoicedLabelVisible();

  // Select today's date
  await addInvoicePage.selectTodayDate();

  // Verify Bill To label is visible
  await addInvoicePage.assertBillToLabelVisible();

  // Verify Class label is visible
  await addInvoicePage.assertClassLabelVisible();

  // Verify Invoiced Amount label is visible
  await addInvoicePage.assertInvoicedAmountLabelVisible();

  // Verify Sales Tax label is visible
  await addInvoicePage.assertSalesTaxLabelVisible();
});
