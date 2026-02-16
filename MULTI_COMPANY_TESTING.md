# Multi-Company Testing Guide

## Overview
This framework now supports running all tests sequentially across multiple company IDs with separate authentication and reports for each company.

## Features
- ✅ Sequential execution (one company at a time)
- ✅ Separate authentication per company
- ✅ Individual HTML reports per company
- ✅ Comprehensive summary at the end
- ✅ Support for multiple environments (prod, stage, dkirc)
- ✅ No modification of `.env` file needed

## Configuration

### Company Configuration File
Edit `company-configs.json` to add/remove companies for each environment:

```json
{
  "prod": [
    {
      "companyId": "13133",
      "name": "Company 13133",
      "username": "NGS_QA",
      "password": "q21A11@6"
    },
    {
      "companyId": "13131",
      "name": "Company 13131",
      "username": "NGS_QA",
      "password": "q21A11@6"
    }
  ]
}
```

## Usage

### Run all tests for all PROD companies
```powershell
.\run-tests-multiple-companies.ps1 -Environment prod
```

### Run all tests for all STAGE companies
```powershell
.\run-tests-multiple-companies.ps1 -Environment stage
```

### Run in headed mode (see browser)
```powershell
.\run-tests-multiple-companies.ps1 -Environment prod -Headed
```

### Skip setup tests (use existing data)
```powershell
.\run-tests-multiple-companies.ps1 -Environment prod -SkipSetup
```

### Run specific project only
```powershell
# Run only enterprise tests
.\run-tests-multiple-companies.ps1 -Environment prod -Project enterprise-chromium

# Run only admin tests
.\run-tests-multiple-companies.ps1 -Environment prod -Project admin-chromium

# Run only mixed tests
.\run-tests-multiple-companies.ps1 -Environment prod -Project mixed-chromium
```

### Run setup tests only
```powershell
.\run-tests-multiple-companies.ps1 -Environment prod -Project enterprise-setup
```

## How It Works

1. **Authentication Cleanup**: Before each company test run, authentication files are cleared to ensure fresh login with new credentials

2. **Runtime Override**: The script sets environment variables:
   - `RUNTIME_COMPANY_ID` - Overrides the company ID
   - `RUNTIME_USERNAME` - Overrides the username
   - `RUNTIME_PASSWORD` - Overrides the password

3. **Sequential Execution**: Tests run one company at a time to prevent credential conflicts

4. **Separate Reports**: Each company gets its own timestamped HTML report in the format:
   ```
   playwright-report/report-2026-02-10T15-30-45-company-13133/index.html
   playwright-report/report-2026-02-10T15-45-20-company-13131/index.html
   ```

5. **Summary**: At the end, a comprehensive summary shows pass/fail status for each company

## Report Locations

Reports are saved in:
```
playwright-report/
  ├── report-{timestamp}-company-13133/
  │   └── index.html
  ├── report-{timestamp}-company-13131/
  │   └── index.html
  └── ...
```

## Example Output

```
╔══════════════════════════════════════════════════════════════╗
║  Multi-Company Test Runner - Environment: PROD              ║
╚══════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────┐
│  Testing Company ID: 13133                                 │
│  Company Name: Company 13133                               │
└────────────────────────────────────────────────────────────┘

🔐 Cleared authentication cache for fresh login
▶ Running tests...
✅ Tests PASSED for Company ID: 13133 (Duration: 05:23)
📊 Report: playwright-report\report-2026-02-10T15-30-45-company-13133\index.html

┌────────────────────────────────────────────────────────────┐
│  Testing Company ID: 13131                                 │
│  Company Name: Company 13131                               │
└────────────────────────────────────────────────────────────┘

🔐 Cleared authentication cache for fresh login
▶ Running tests...
✅ Tests PASSED for Company ID: 13131 (Duration: 05:18)
📊 Report: playwright-report\report-2026-02-10T15-45-20-company-13131\index.html

╔══════════════════════════════════════════════════════════════╗
║                    EXECUTION SUMMARY                         ║
╚══════════════════════════════════════════════════════════════╝

✅ Company ID: 13133      | Company 13133                  | PASSED   | 05:23
✅ Company ID: 13131      | Company 13131                  | PASSED   | 05:18

─────────────────────────────────────────────────────────────
Total Companies Tested: 2
Passed: 2
Failed: 0
─────────────────────────────────────────────────────────────

🎉 All company tests completed successfully!
```

## Troubleshooting

### Issue: "No companies configured for environment"
**Solution**: Check that `company-configs.json` has entries for the specified environment

### Issue: Authentication failures
**Solution**: Verify credentials in `company-configs.json` match your `.env` file

### Issue: Tests using wrong company ID
**Solution**: Ensure `.auth` directory is being cleared before each run. The script does this automatically.

## Adding More Companies

Edit `company-configs.json`:

```json
{
  "prod": [
    {
      "companyId": "13133",
      "name": "Company 13133",
      "username": "NGS_QA",
      "password": "q21A11@6"
    },
    {
      "companyId": "13131",
      "name": "Company 13131",
      "username": "NGS_QA",
      "password": "q21A11@6"
    },
    {
      "companyId": "13135",
      "name": "New Company",
      "username": "NGS_QA",
      "password": "q21A11@6"
    }
  ]
}
```

## Notes

- Your `.env` file remains unchanged
- Original single-company test execution still works normally
- Each company test run is completely isolated
- Authentication is refreshed for each company
