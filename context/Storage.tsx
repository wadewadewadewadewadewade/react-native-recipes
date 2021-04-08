import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  StorageContextType,
  InitializingPhases,
  StoreType,
  storageTypes,
  StorageTypeIndexes,
} from './storage/StorageTypes';
import {
  listFiles as listGoogleDrive,
  initialize as initializeGoogleDrive,
  initializied as GoogleDriveInitialized,
  getFile as getFileGoogleDrive,
  saveFile as saveFileGoogleDrive,
  deleteFile as deleteFileGoogleDrive,
} from './storage/GoogleDrive';
import {AuthenticationContext} from './Authentication';

export const StorageContext = createContext<StorageContextType | null>(null);

const StorageProvider = ({children}: {children: JSX.Element | null}) => {
  const [initialized, setInitialized] = useState<InitializingPhases>(
    InitializingPhases.NOT_INITIALIZED,
  );
  const [storage, setStorage] = useState<StoreType | undefined>(undefined);
  const [error, setError] = useState<any>();
  const authContext = useContext(AuthenticationContext);

  // at some point we could add multiple storage
  // endpoints and a way to select them here
  useEffect(() => {
    const initialize = async () => {
      try {
        authContext &&
          authContext.user &&
          initializeGoogleDrive(await authContext.user.getIdToken());
        if (
          GoogleDriveInitialized &&
          initialized !== InitializingPhases.INITIALIZIED
        ) {
          setInitialized(InitializingPhases.INITIALIZIED);
          setStorage({
            type: storageTypes[StorageTypeIndexes.GOOGLEDRIVE],
            listFiles: listGoogleDrive,
            getFile: getFileGoogleDrive,
            saveFile: saveFileGoogleDrive,
            deleteFile: deleteFileGoogleDrive,
          });
        } else if (
          !GoogleDriveInitialized &&
          initialized !== InitializingPhases.NOT_INITIALIZED
        ) {
          setInitialized(InitializingPhases.NOT_INITIALIZED);
          setStorage(undefined);
        }
        setError(undefined);
      } catch (ex) {
        if (initialized !== InitializingPhases.NOT_INITIALIZED) {
          setInitialized(InitializingPhases.NOT_INITIALIZED);
          setStorage(undefined);
          setError(ex);
        }
      }
    };
    setInitialized(InitializingPhases.INITIALIZING);
    initialize();
  }, [authContext, initialized]);

  return (
    <StorageContext.Provider
      value={{
        list: storage?.listFiles,
        get: storage?.getFile,
        put: storage?.saveFile,
        delete: storage?.deleteFile,
        initialized,
        error,
      }}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageProvider;
