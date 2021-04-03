import React, { createContext, useEffect, useState } from 'react';
import {
  StorageContextType,
  InitializingPhases,
  StoreType,
  storageTypes,
  StorageTypeIndexes
} from './storage/StorageTypes';
import {
  initClient as initGoogleDrive,
  listFiles as listGoogleDrive,
  signOut as signOutGoogleDrive
} from './storage/GoogleDrive'

export const StorageContext = createContext<StorageContextType | null>(null)

const StorageProvider = ({ children } : { children: JSX.Element | null }) => {
  const [initialized, setInitialized] = useState<InitializingPhases>(InitializingPhases.NOT_INITIALIZED);
  const [storage, setStorage] = useState<StoreType | undefined>(undefined);
  const [error, setError] = useState<any>();

  // at some point we could add multipel storage
  // endpoints and a way to select them here
  useEffect(() => {
    const initialize = async () => {
      try {
        await initGoogleDrive((status: boolean) => {
          if (status && initialized !== InitializingPhases.INITIALIZIED) {
            setInitialized(InitializingPhases.INITIALIZIED)
            setStorage({
              type: storageTypes[StorageTypeIndexes.GOOGLEDRIVE],
              listFiles: listGoogleDrive
            })
          } else if (!status && initialized !== InitializingPhases.NOT_INITIALIZED) {
            setInitialized(InitializingPhases.NOT_INITIALIZED)
            setStorage(undefined)
          }
        })
        setInitialized(InitializingPhases.INITIALIZIED)
        return signOutGoogleDrive
      } catch (ex) {
        if (initialized !== InitializingPhases.NOT_INITIALIZED) {
          setInitialized(InitializingPhases.NOT_INITIALIZED)
          setStorage(undefined)
          setError(ex)
        }
      }
    }
    setInitialized(InitializingPhases.INITIALIZING)
    initialize()
  }, [])
  
  return (
    <StorageContext.Provider
      value={{get: storage?.listFiles, initialized, error}}
    >
      {children}
    </StorageContext.Provider>
  )
}

export default StorageProvider