import { StorageProviderName } from './constants';

export interface StorageProvider {
  name: StorageProviderName;
  apiKey: string;
}
