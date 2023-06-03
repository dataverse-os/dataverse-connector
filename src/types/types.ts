import { UploadProviderName } from "./constants";

export interface UploadProvider {
  name: UploadProviderName;
  apiKey: string;
}
