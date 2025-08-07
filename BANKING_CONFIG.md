# Banking Configuration Setup

This invoice generator supports pre-populated banking information that can be configured without storing sensitive data in the source code repository.

## Setup Instructions

1. **Copy the example config file:**
   ```bash
   cp banking-config.example.json banking-config.json
   ```

2. **Edit your banking information:**
   Open `banking-config.json` and fill in your banking details:
   ```json
   {
     "defaultBankingInfo": {
       "beneficiaryAccountNumber": "YOUR_ACCOUNT_NUMBER",
       "beneficiaryName": "YOUR_COMPANY_NAME",
       "beneficiaryBankName": "YOUR_BANK_NAME",
       "beneficiaryBankAddress": "YOUR_BANK_ADDRESS\nCITY, STATE ZIP\nCOUNTRY"
     }
   }
   ```

3. **The configuration is secure:**
   - `banking-config.json` is automatically excluded from Git commits
   - Your sensitive banking information will not be stored in the repository
   - Each developer/deployment can have their own configuration

## How It Works

- When creating a new invoice, the banking fields are automatically pre-populated with values from `banking-config.json`
- If the config file doesn't exist, the fields will be empty and can be filled manually
- Banking information is saved with each invoice in localStorage
- The config is only used for default values in new invoices

## Deployment

For production deployments:
1. Create the `banking-config.json` file on your server
2. Ensure it's readable by the web server
3. The file should be placed in the public directory so it can be accessed via HTTP

## Security Notes

- Never commit `banking-config.json` to version control
- Keep the example file (`banking-config.example.json`) for other developers
- Banking information in the config file will be visible to anyone who can access your deployed application
- Consider using environment variables or server-side configuration for highly sensitive deployments
