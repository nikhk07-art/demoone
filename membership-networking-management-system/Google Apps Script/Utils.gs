/**
 * Utils.gs — JSON formatting, header mapping, sheet batch reader/writer
 */

function createJsonResponse(success, message, data) {
  const payload = {
    success: success,
    message: message,
    data: data || null
  };
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetDataAsObjects(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const rows = values.slice(1);
  return rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function appendRowObject(sheetName, recordObj, orderedHeaders) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet not found: ' + sheetName);
  const rowData = orderedHeaders.map((header) =>
    recordObj[header] !== undefined ? recordObj[header] : ''
  );
  sheet.appendRow(rowData);
  return recordObj;
}

function logAuditAction(userId, actionType, moduleName, recordId, oldData, newData) {
  const timestamp = new Date().toISOString();
  appendRowObject(
    'Activity_Log',
    {
      log_id: 'LOG-' + new Date().getTime(),
      user_id: userId || 'SYSTEM',
      action_type: actionType,
      module_name: moduleName,
      record_id: recordId || '',
      old_data: oldData ? JSON.stringify(oldData) : '',
      new_data: newData ? JSON.stringify(newData) : '',
      created_at: timestamp
    },
    ['log_id', 'user_id', 'action_type', 'module_name', 'record_id', 'old_data', 'new_data', 'created_at']
  );
}
