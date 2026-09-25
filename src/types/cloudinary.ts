export interface UploadedMedia {
  url: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}