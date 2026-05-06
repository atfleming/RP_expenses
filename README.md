# Running Pony — Expense Reimbursement Form

A branded, dark-mode expense reimbursement form for internal use at Running Pony Creative Agency. Allows team members to submit multiple expense line items and upload receipt images/PDFs directly to a shared Google Drive folder, with all submissions automatically logged to a Google Sheet.

---

## Features

- Multiple expense line items in a single submission (date, project code, category, amount, description)
- Running total calculated automatically
- Receipt upload — images or PDFs up to 50 MB each, multiple files accepted
- Files saved directly to a shared Google Drive folder (no permission issues)
- Every submission logged row-by-row in a Google Sheet
- Dark mode UI matching Running Pony brand colors

---

## Project Structure

```
rp-expense-form/
├── index.html       # The expense form (frontend)
├── Code.gs          # Google Apps Script backend (not deployed here — see setup)
└── README.md
```

---

## Setup & Configuration

### 1. Google Apps Script (Backend)

The backend runs as a Google Apps Script Web App. It handles file uploads to Drive and logging to Sheets — no server required.

- Script deployed at: `https://script.google.com/macros/s/AKfycbzslXjyrrynK1sy_Tj8jzINiRP4CUR8nKqBFT0rNu1JxcmpC02y7vFThQ6h84QjJj4/exec`
- Google Drive folder ID: `1cy455QpG-N0D_3qrVvZUTKSX-cfDMNpL`
- Google Sheet ID: `1ja7s7-omJTMUkAINMzB_5i1BraCVRwESdorjZYV8Srg`

If you ever need to redeploy the Apps Script (e.g. after making changes to `Code.gs`):
1. Go to [script.google.com](https://script.google.com)
2. Open the project → **Deploy → Manage deployments**
3. Click the edit (pencil) icon → bump the version → **Deploy**
4. The URL stays the same — no changes needed in `index.html`

### 2. Frontend (`index.html`)

All configuration is already set. The Apps Script URL is hardcoded near the top of the script block:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/...";
```

No other changes are needed for normal use.

---

## Deployment

The form is hosted as a static site on Netlify, connected to this GitHub repository.

- Any push to the `main` branch automatically redeploys the site
- No build step required — Netlify serves `index.html` directly

To update the form:
```bash
git add .
git commit -m "your change description"
git push
```

---

## How It Works

1. Team member fills out the form and uploads receipts
2. On submit, receipt files are converted to base64 in the browser
3. A JSON payload (form data + files) is sent via `POST` to the Apps Script Web App
4. The Apps Script runs as the owner, uploads files to the shared Drive folder, and logs each line item as a row in the Google Sheet
5. A success message is shown to the user

---

## Links

| Resource | Link |
|---|---|
| Live Form | *(your Netlify URL)* |
| Google Sheet Log | [Open Sheet](https://docs.google.com/spreadsheets/d/1ja7s7-omJTMUkAINMzB_5i1BraCVRwESdorjZYV8Srg/edit) |
| Drive Receipts Folder | [Open Folder](https://drive.google.com/drive/folders/1cy455QpG-N0D_3qrVvZUTKSX-cfDMNpL) |
| Apps Script Project | [Open Script](https://script.google.com) |
