import { gapi } from 'gapi-script'

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];
const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly"
const API_KEY = process.env.REACT_APP_GAPI_API_KEY
const CLIENT_ID = process.env.REACT_APP_GAPI_CLIENT_ID

let initializied = false
let user = undefined

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
 const updateSigninStatus = async (isSignedIn: boolean) => {
  if (isSignedIn) {
    // Set the signed in user
    const authInstance = await gapi.auth2.getAuthInstance()
    user = authInstance.currentUser.je.Qt
  } else {
    user = undefined
  }
};

const initClient = async (
  statusChange: (status: boolean) => void
): Promise<boolean> => {
  if (initializied) {
    return true
  }
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  });
  // Listen for sign-in state changes.
  gapi.auth2.getAuthInstance().isSignedIn.listen(
    async (status: boolean) => {
      await updateSigninStatus(status)
      statusChange(status)
    }
  )
  // Handle the initial sign-in state.
  return await gapi.auth2.getAuthInstance().isSignedIn.get()
};

 /**
 *  Sign out the user upon button click.
 */
  const signOut = async () => {
    await gapi.auth2.getAuthInstance().signOut();
  };

 /**
 * List files.
 */
const listFiles = async (searchTerm?: string): Promise<Array<any>> => {
  const response = await gapi.client.drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
    q: searchTerm,
  })
  const res = JSON.parse(response.body);
  return res.files;
};

export {
  initClient,
  signOut,
  listFiles
}
