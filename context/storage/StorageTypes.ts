export const storageTypes = ['UNKNOWN', 'GOOGLEDRIVE']
export enum StorageTypeIndexes {
  UNKNOWN = 0,
  GOOGLEDRIVE = 1
}
export type StorageTypes = typeof storageTypes[number]
export const isStorageType = (storageType: string) => storageTypes.includes(storageType)

export enum InitializingPhases {
  NOT_INITIALIZED,
  INITIALIZING,
  INITIALIZIED
}

export interface StoreType {
  type: StorageTypes
  listFiles: (searchTerm?: string) => Promise<Array<any>>
}

export type ErrorType = string

export interface StorageContextType {
  get?: (searchTerm?: string) => Promise<Array<any>>
  initialized: InitializingPhases
  error?: ErrorType
}
