/**
 * Config.gs — Spreadsheet & Google Drive folder configuration
 */

const CONFIG = {
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '',
  DRIVE_ROOT_FOLDER_NAME: 'Membership Network',
  SUBFOLDERS: ['Members', 'Posts', 'Announcements', 'Events', 'Trainings', 'Documents'],
  SHEET_NAMES: [
    'Members',
    'Categories',
    'Chapters',
    'Users',
    'Posts',
    'Post_Comments',
    'Post_Likes',
    'Announcements',
    'Events',
    'Event_Attendance',
    'Visitors',
    'Referrals',
    'Business_Transactions',
    'Organization_Settings',
    'Notifications',
    'Activity_Log',
    'Membership_Plans',
    'Payments',
    'Trainings',
    'Training_Attendance'
  ]
};

function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}
