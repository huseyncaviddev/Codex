export interface FileStorageService {
  getUploadUrl(key: string, contentType: string, expiresInSeconds?: number): Promise<string>;
  getDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
