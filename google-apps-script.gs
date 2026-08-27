/**
 * SIR 2026-27 Form — Google Apps Script
 * ---------------------------------------
 * SETUP:
 * 1. Open your Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1OdlnoTLI2pclrv93NBDFxPHTbCiPZuOQSCbOSYpBAO4
 * 2. Go to Extensions → Apps Script.
 * 3. Delete any starter code, paste this whole file in, and save.
 * 4. Update SHEET_NAME below if your response tab is not named "Form Responses 1".
 *    PHOTO_FOLDER_ID is already set to your Drive folder — change it if you move folders.
 * 5. Click Deploy → New deployment → type: "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Copy the deployment URL it gives you.
 * 7. Paste that URL into SCRIPT_URL at the top of index.html's <script> and re-save the HTML file.
 * 8. Every time you edit this script, create a NEW deployment (or "Manage deployments" → edit → new version)
 *    for changes to take effect.
 */

const SHEET_NAME = 'Form Responses 1'; // change this to match your actual tab name
const PHOTO_FOLDER_ID = '1dT6ti2QUCBzDetoaYUjX7XtkuaPJ8EqX0LG00bn_DJzznRcYb2JoBzvOJQGdUPIZN56SWR-r'; // your Drive folder

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Upload photo to Drive folder, if one was sent
    let photoUrl = '';
    if (data.photoBase64) {
      const folder = DriveApp.getFolderById(PHOTO_FOLDER_ID);
      const bytes = Utilities.base64Decode(data.photoBase64);
      const fileName = (data.uniqueNo || data.dataId || 'SIR_photo') + '_' + new Date().getTime();
      const blob = Utilities.newBlob(bytes, data.photoType || 'image/jpeg', fileName);
      const file = folder.createFile(blob);
      // make it viewable via link (remove this line if your folder is already shared)
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      photoUrl = file.getUrl();
    }

    // Column order matches the existing sheet header (A → AD)
    const row = [
      data.timestamp || new Date(),          // A  Timestamp
      data.dateOfDamage || '',               // B  DATE OF DAMAGE
      data.dateOfSIR || '',                  // C  DATE OF SIR
      data.zone || '',                       // D  ZONE
      data.circle || '',                     // E  CIRCLE
      data.divisionName || '',               // F  DIVISION NAME
      data.substationName || '',             // G  SUBSTAION NAME
      data.placeOfDT || '',                  // H  PLACE/LOCATION OF DT
      data.capacityOfDT || '',               // I  CAPACITY OF DT
      data.jeName || '',                     // J  NAME OF JE (DISTRIBUTION)
      data.jeMobile || '',                   // K  JE MOBILE NO.
      data.dataId || '',                     // L  DATA ID
      data.uniqueNo || '',                   // M  Unique No.
      data.htProtection || '',               // N  [HT PROCTION]
      data.ltProtection || '',               // O  [LT PROTECTION]
      data.bodyEarthing || '',               // P  [BODY EARTHING]
      data.neutralEarthing || '',            // Q  [NEUTRAL EARTHING]
      data.onsiteMaint || '',                // R  [ON SITE MAINTENCE REQUIRED]
      data.pictureTaken || '',               // S  [PICTURE TAKEN]
      data.oilLevel || '',                   // T  [OIL LEVEL]
      data.repeatedDamage || '',             // U  [REPEATED DAMAGE]
      '',                                    // V  (unused research-equipment column)
      data.connectedLoad || '',              // W  CONNECTED LOAD (KV)
      data.noOfConnections || '',            // X  NO OF CONNECTION CONNECTED (QTY)
      data.ltCableCondition || '',           // Y  [LT CABLE CONDITION]
      data.plinthCondition || '',            // Z  [PLINTH/DP CONDITION]
      data.fencingCondition || '',           // AA [FENCING CONDITION]
      data.remark || '',                     // AB ANY OTHER REMARK
      photoUrl,                              // AC PHOTOGRAPH (auto-uploaded to Drive)
      data.prNo || ''                        // AD PR NO.
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Returns a lightweight list of submitted reports for the "Submitted Reports" tab.
 * Only sends: Division, Substation, Place, PR No, Unique No, Timestamp, and the
 * merged PDF link (column AG "Merged Doc URL - SIR FORM") if it has been generated yet.
 * Called as a GET request: SCRIPT_URL?action=list
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const values = sheet.getDataRange().getValues();

    // column indexes (0-based): F=5 division, G=6 substation, H=7 place, AD=29 prNo, AG=32 mergedDocUrl
    const COL_DIVISION = 5;
    const COL_SUBSTATION = 6;
    const COL_PLACE = 7;
    const COL_PRNO = 29;
    const COL_UNIQUE = 12;
    const COL_MERGED_URL = 32;

    const list = [];
    for (let i = 2; i < values.length; i++) { // skip header row(s)
      const r = values[i];
      const division = r[COL_DIVISION];
      if (!division) continue; // skip blank rows
      list.push({
        timestamp: r[0] ? r[0].toString() : '',
        division: division,
        substation: r[COL_SUBSTATION] || '',
        place: r[COL_PLACE] || '',
        prNo: r[COL_PRNO] || '',
        uniqueNo: r[COL_UNIQUE] || '',
        pdfUrl: r[COL_MERGED_URL] || ''
      });
    }
    list.reverse(); // newest first

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', reports: list }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
