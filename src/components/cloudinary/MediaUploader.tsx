"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

export type UploadedMedia = {
  url: string;
  publicId: string;
  resourceType: "image" | "video" | string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
};

interface MediaUploaderProps {
  onUpload: (media: UploadedMedia) => void;

  multiple?: boolean;

  accept?: "image" | "video" | "all";

  folder?: string;

  buttonText?: string;
}

export default function MediaUploader({
  onUpload,
  multiple = false,
  accept = "all",
  folder,
  buttonText = "Upload Media",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const getResourceType = () => {
    if (accept === "image") {
      return "image";
    }

    if (accept === "video") {
      return "video";
    }

    return "auto";
  };

  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign"
        uploadPreset={
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        }
        options={{
          multiple,
          resourceType: getResourceType(),

          sources: ["local"],

          ...(folder
            ? {
                folder,
              }
            : {}),
        }}
        onOpen={() => {
          setUploading(false);
        }}
        onUpload={() => {
          setUploading(true);
        }}
        onSuccess={(result) => {
          const info = result.info as any;

          console.log(
            "Cloudinary upload successful:",
            info
          );

          if (!info?.secure_url) {
            console.error(
              "Cloudinary did not return secure_url."
            );

            setUploading(false);
            return;
          }

          const uploadedMedia: UploadedMedia = {
            url: info.secure_url,
            publicId: info.public_id,
            resourceType: info.resource_type,
            format: info.format,
            width: info.width,
            height: info.height,
            bytes: info.bytes,
          };

          onUpload(uploadedMedia);

          setUploading(false);
        }}
        onError={(error) => {
          console.error(
            "Cloudinary upload error:",
            error
          );

          setUploading(false);
        }}
        onClose={() => {
          setUploading(false);
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={uploading}
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : buttonText}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}