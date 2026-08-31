/**
 * Drive.gs — Structured Google Drive File Upload
 * Stores files under:
 * Membership Network/
 *   Members/
 *   Posts/
 *   Announcements/
 *   Events/
 *   Trainings/
 *   Documents/
 */

function getOrCreateSubFolder(subFolderName) {
  const folders = DriveApp.getFoldersByName(CONFIG.DRIVE_ROOT_FOLDER_NAME);
  let rootFolder;
  if (folders.hasNext()) {
    rootFolder = folders.next();
  } else {
    rootFolder = DriveApp.createFolder(CONFIG.DRIVE_ROOT_FOLDER_NAME);
  }

  const subFolders = rootFolder.getFoldersByName(subFolderName || 'Documents');
  if (subFolders.hasNext()) {
    return subFolders.next();
  }
  return rootFolder.createFolder(subFolderName || 'Documents');
}

function uploadFileToDrive(base64Data, fileName, mimeType, subFolder) {
  if (!base64Data || !fileName) {
    throw new Error('Missing file base64 payload or fileName');
  }
  const folder = getOrCreateSubFolder(subFolder || 'Documents');
  const decodedBytes = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decodedBytes, mimeType || 'application/octet-stream', fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    file_id: file.getId(),
    file_name: file.getName(),
    file_url: file.getUrl(),
    download_url: file.getDownloadUrl(),
    sub_folder: subFolder || 'Documents'
  };
}
