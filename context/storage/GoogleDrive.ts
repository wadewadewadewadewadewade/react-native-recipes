import GDrive from 'react-native-google-drive-api-wrapper';

/*const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];
const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly"
const API_KEY = process.env.REACT_APP_GAPI_API_KEY
const CLIENT_ID = process.env.REACT_APP_GAPI_CLIENT_ID*/

let initializied = GDrive.isInitialized();

const initialize = (accessToken: string) => {
  GDrive.setAccessToken(accessToken);
  GDrive.init();
  initializied = GDrive.isInitialized();
};

/**
 * List files.
 */
const listFiles = async (searchTerm?: string): Promise<Array<any>> => {
  const response = await GDrive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
    q: searchTerm,
  });
  const res = JSON.parse(response.body);
  return res.files;
};

/**
 * Save file.
 */
const saveFile = async (name: string, body: string): Promise<any> => {
  const response = await GDrive.files.createFileMultipart(
    body,
    'text/plain',
    {
      parents: ['root'],
      name,
    },
    false,
  );
  const res = JSON.parse(response.body);
  return res.file;
};

/**
 * Get file.
 */
const getFile = async (fileId: string): Promise<any> => {
  const response = await GDrive.files.get(fileId, {alt: 'media'});
  const res = JSON.parse(response.body);
  return res.file;
};

/**
 * Delete file.
 */
const deleteFile = async (fileId: string): Promise<void> => {
  await GDrive.files.delete(fileId);
  return;
};

export {initializied, initialize, listFiles, saveFile, getFile, deleteFile};
