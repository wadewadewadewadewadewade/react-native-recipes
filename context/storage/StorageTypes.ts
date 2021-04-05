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
  getFile: (fileId: string) => Promise<any>
  saveFile: (name: string, body: string) => Promise<any>
  deleteFile: (fileId: string) => Promise<void>
}

export type ErrorType = string

export interface StorageContextType {
  list?: (searchTerm?: string) => Promise<Array<any>>
  get?: (fileId: string) => Promise<any>
  put?: (name: string, body: string) => Promise<any>
  delete?: (fileId: string) => Promise<void>
  initialized: InitializingPhases
  error?: ErrorType
}
