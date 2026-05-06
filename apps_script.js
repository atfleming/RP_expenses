// ─────────────────────────────────────────────
//  CONFIGURATION — fill these in before deploying
// ─────────────────────────────────────────────
const DRIVE_FOLDER_ID = "1cy455QpG-N0D_3qrVvZUTKSX-cfDMNpL";   // The shared folder's ID (from its URL)
const SHEET_ID        = "1ja7s7-omJTMUkAINMzB_5i1BraCVRwESdorjZYV8Srg";   // Optional: logs every submission row-by-row

// ─────────────────────────────────────────────
//  Handle preflight CORS (OPTIONS)
// ─────────────────────────────────────────────
function doOptions(e) {
  return buildCorsOutput("");
}

// ─────────────────────────────────────────────
//  Main POST handler
// ─────────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { submitterName, submitterEmail, items, files } = payload;

    // 1. Upload receipt files to Drive
    const folder    = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
    const fileLinks = [];

    (files || []).forEach((f, i) => {
      const bytes    = Utilities.base64Decode(f.data);
      const blob     = Utilities.newBlob(bytes, f.mimeType, `${timestamp}_${submitterName}_receipt_${i + 1}_${f.name}`);
      const uploaded = folder.createFile(blob);
      uploaded.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileLinks.push(uploaded.getUrl());
    });

    const fileLinksStr = fileLinks.join("\n");

    // 2. Log to Google Sheet (one row per line item)
    if (SHEET_ID) {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

      // Write header row if sheet is empty
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "Submitted At", "Submitter Name", "Email",
          "Expense Date", "Project", "Category", "Amount ($)", "Description",
          "Receipt Links"
        ]);
        sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
      }

      const submittedAt = new Date();
      (items || []).forEach(item => {
        sheet.appendRow([
          submittedAt,
          submitterName,
          submitterEmail,
          item.date,
          item.project,
          item.category,
          item.amount,
          item.description,
          fileLinksStr
        ]);
      });
    }

    return buildCorsOutput(JSON.stringify({ success: true, filesUploaded: fileLinks.length }));

  } catch (err) {
    return buildCorsOutput(JSON.stringify({ success: false, error: err.toString() }));
  }
}

// ─────────────────────────────────────────────
//  Helper: build a CORS-friendly JSON response
// ─────────────────────────────────────────────
function buildCorsOutput(body) {
  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}
