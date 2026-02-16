# Environment URL and Credential Mapping

## How It Works

### URL Source (from .env file)
Each environment uses its **base URL from the `.env` file**. The URL is **NOT** specified in `company-configs.json`.

| Environment | Enterprise URL (from .env) | Admin URL (from .env) |
|-------------|---------------------------|----------------------|
| **PROD** | `PROD_ENTERPRISE_LOGIN_URL`<br>`https://dash-ngs.net/NextGear/Enterprise/Module/User/Login.aspx` | `PROD_ADMIN_LOGIN_URL` |
| **STAGE** | `STAGE_ENTERPRISE_LOGIN_URL`<br>`https://stage.ngsdevapps.net/Enterprise/Module/User/Login.aspx` | `STAGE_ADMIN_LOGIN_URL` |
| **DKIRC** | `DKIRC_ENTERPRISE_LOGIN_URL`<br>`https://dkirc.ngsdevapps.net/Enterprise/Module/User/Login.aspx` | `DKIRC_ADMIN_LOGIN_URL` |

### Credential Override (from company-configs.json)
Each company entry specifies **only credentials** (Company ID, Username, Password):

```json
{
  "prod": [
    {
      "companyId": "13133",
      "username": "NGS_QA",
      "password": "q21A11@6"
    },
    {
      "companyId": "13131",
      "username": "NGS_QA",
      "password": "q21A11@6"
    }
  ]
}
```

## Complete Flow Example

When you run:
```powershell
.\run-tests-multiple-companies.ps1 -Environment prod
```

### For Company 13133:
1. **URL**: `https://dash-ngs.net/NextGear/Enterprise/Module/User/Login.aspx` (from `.env` → `PROD_ENTERPRISE_LOGIN_URL`)
2. **Company ID**: `13133` (from `company-configs.json`)
3. **Username**: `NGS_QA` (from `company-configs.json`)
4. **Password**: `q21A11@6` (from `company-configs.json`)

### For Company 13131:
1. **URL**: `https://dash-ngs.net/NextGear/Enterprise/Module/User/Login.aspx` (from `.env` → `PROD_ENTERPRISE_LOGIN_URL`) ← **SAME URL**
2. **Company ID**: `13131` (from `company-configs.json`)
3. **Username**: `NGS_QA` (from `company-configs.json`)
4. **Password**: `q21A11@6` (from `company-configs.json`)

## Key Points

✅ **Same Environment = Same URL**  
All companies in the `prod` section use the PROD URL from `.env`

✅ **Different Credentials Per Company**  
Each company has its own Company ID, Username, and Password

✅ **No URL Duplication**  
URLs are defined once in `.env` and shared across all companies in that environment

✅ **Easy Environment Switching**  
Change environment with `-Environment` parameter:
- `-Environment prod` → Uses PROD URLs
- `-Environment stage` → Uses STAGE URLs
- `-Environment dkirc` → Uses DKIRC URLs

## Configuration Summary

### .env File (URLs - One per Environment)
```env
# PROD URLs (shared by all PROD companies)
PROD_ENTERPRISE_LOGIN_URL=https://dash-ngs.net/NextGear/Enterprise/Module/User/Login.aspx
PROD_ADMIN_LOGIN_URL=https://dash-ngs.net/NextGear/Admin/Module/User/FranchisorLogin.aspx

# STAGE URLs (shared by all STAGE companies)
STAGE_ENTERPRISE_LOGIN_URL=https://stage.ngsdevapps.net/Enterprise/Module/User/Login.aspx
STAGE_ADMIN_LOGIN_URL=https://stage.ngsdevapps.net/Admin/Module/User/Login.aspx
```

### company-configs.json (Credentials - Multiple per Environment)
```json
{
  "prod": [
    {"companyId": "13133", "username": "NGS_QA", "password": "q21A11@6"},
    {"companyId": "13131", "username": "NGS_QA", "password": "q21A11@6"}
  ]
}
```

## Runtime Behavior

The script sets these environment variables **at runtime**:
```powershell
$env:TEST_ENV = "prod"                    # Tells framework to use PROD URLs
$env:RUNTIME_COMPANY_ID = "13133"         # Overrides company ID
$env:RUNTIME_USERNAME = "NGS_QA"          # Overrides username  
$env:RUNTIME_PASSWORD = "q21A11@6"        # Overrides password
```

The framework's `environment.config.js` then:
1. Reads `TEST_ENV` to determine which environment URLs to use
2. Checks if `RUNTIME_*` variables exist (they do during multi-company runs)
3. Uses runtime values for credentials, `.env` values for URLs

## Example Output

```
╔══════════════════════════════════════════════════════════════╗
║  Multi-Company Test Runner - Environment: PROD              ║
╚══════════════════════════════════════════════════════════════╝

🌐 Environment URL: https://dash-ngs.net/NextGear/Enterprise/Module/User/Login.aspx

┌────────────────────────────────────────────────────────────┐
│  Testing Company ID: 13133                                 │
│  Company Name: Company 13133 - NGS QA                      │
│  Environment: PROD                                         │
└────────────────────────────────────────────────────────────┘

🔑 Using credentials - Username: NGS_QA | Company ID: 13133
🔐 Cleared authentication cache for fresh login
▶ Running tests...

┌────────────────────────────────────────────────────────────┐
│  Testing Company ID: 13131                                 │
│  Company Name: Company 13131 - NGS QA                      │
│  Environment: PROD                                         │
└────────────────────────────────────────────────────────────┘

🔑 Using credentials - Username: NGS_QA | Company ID: 13131
🔐 Cleared authentication cache for fresh login
▶ Running tests...
```

Notice: Both companies show the **same environment URL** but **different credentials**!
