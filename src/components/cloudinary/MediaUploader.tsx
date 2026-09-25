"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import type { UploadedMedia } from "../../types/cloudinary";


export type MediaUploaderVariant = "pill" | "dropzone" | "solid";

interface MediaUploaderProps {
  onUpload: (media: UploadedMedia) => void;
  multiple?: boolean;
  accept?: "image" | "video" | "all";
  folder?: string;
  buttonText?: string;
  variant?: MediaUploaderVariant;
  className?: string;
}

const VARIANT_BUTTON_CLASSES: Record<MediaUploaderVariant, string> = {
  pill: "w-full flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-[13px] font-extrabold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",

  dropzone:
    "w-full h-24 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center p-2 text-[11px] font-bold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50",

  solid:
    "w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-[13px] font-extrabold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
};

const VARIANT_ICON_CLASSES: Record<MediaUploaderVariant, string> = {
  pill: "w-4 h-4 text-gray-600",
  dropzone: "w-5 h-5 text-gray-400",
  solid: "w-4 h-4 text-white",
};

export default function MediaUploader({
  onUpload,
  multiple = false,
  accept = "all",
  folder,
  buttonText = "Upload Media",
  variant = "pill",
  className,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Convert our accept prop into the native file input accept attribute.
   */
  const getAcceptAttribute = () => {
    if (accept === "image") {
      return "image/*";
    }

    if (accept === "video") {
      return "video/*";
    }

    return "image/*,video/*";
  };

  /**
   * Get Cloudinary resource type.
   */
  const getResourceType = (file: File): "image" | "video" => {
    if (file.type.startsWith("video/")) {
      return "video";
    }

    return "image";
  };

  /**
   * Upload one file directly to Cloudinary.
   *
   * Flow:
   *
   * Browser
   *   ↓
   * /api/cloudinary/sign
   *   ↓
   * Cloudinary signed upload
   *   ↓
   * secure_url + public_id
   *   ↓
   * onUpload()
   */
  const uploadFile = async (file: File): Promise<UploadedMedia> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      throw new Error(
        "Cloudinary cloud name is not configured."
      );
    }

    if (!uploadPreset) {
      throw new Error(
        "Cloudinary upload preset is not configured."
      );
    }

    if (!folder) {
      throw new Error(
        "Cloudinary upload folder is not configured."
      );
    }

    const resourceType = getResourceType(file);

    /**
     * Cloudinary signatures use a Unix timestamp.
     */
    const timestamp = Math.round(Date.now() / 1000);

    /**
     * These exact parameters are sent to the server
     * for signing and then sent unchanged to Cloudinary.
     */
    const paramsToSign = {
      folder,
      timestamp,
      upload_preset: uploadPreset,
    };

    /**
     * Ask our server to generate the Cloudinary signature.
     *
     * IMPORTANT:
     * The API secret NEVER reaches the browser.
     */
    const signResponse = await fetch(
      "/api/cloudinary/sign",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paramsToSign,
        }),
      }
    );

    const signData = await signResponse.json();

    if (!signResponse.ok || !signData?.success) {
      throw new Error(
        signData?.message ||
          "Unable to generate Cloudinary signature."
      );
    }

    if (!signData.signature) {
      throw new Error(
        "Cloudinary signature was not returned."
      );
    }

    /**
     * Cloudinary upload endpoint.
     *
     * Images:
     * /image/upload
     *
     * Videos:
     * /video/upload
     */
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signData.signature);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    /**
     * Upload directly to Cloudinary.
     */
    const uploadResponse = await fetch(
      uploadUrl,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error(
        "Cloudinary upload response:",
        uploadData
      );

      throw new Error(
        uploadData?.error?.message ||
          "Cloudinary upload failed."
      );
    }

    if (!uploadData?.secure_url) {
      throw new Error(
        "Cloudinary did not return a secure URL."
      );
    }

    /**
     * Return the same structure expected by
     * the existing Gallery page.
     */
    return {
      url: uploadData.secure_url,
      publicId: uploadData.public_id,
      resourceType: uploadData.resource_type,
      format: uploadData.format,
      width: uploadData.width,
      height: uploadData.height,
      bytes: uploadData.bytes,
    };
  };

  /**
   * Handle file selection.
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    setError("");
    setUploading(true);

    try {
      /**
       * If multiple=false, only upload the first selected file.
       */
      const filesToUpload = multiple
        ? files
        : files.slice(0, 1);

      /**
       * Upload sequentially.
       *
       * This makes the UI easier to manage and avoids
       * sending many simultaneous uploads.
       */
      for (const file of filesToUpload) {
        try {
          setUploadingFile(file.name);

          const uploadedMedia = await uploadFile(file);

          console.log(
            "Cloudinary upload successful:",
            uploadedMedia
          );

          /**
           * Send the uploaded media back to the parent.
           */
          onUpload(uploadedMedia);
        } catch (fileError) {
          console.error(
            `Failed to upload ${file.name}:`,
            fileError
          );

          const message =
            fileError instanceof Error
              ? fileError.message
              : "Failed to upload file.";

          setError(
            `${file.name}: ${message}`
          );

          /**
           * Continue with the next file when
           * multiple files were selected.
           */
        }
      }
    } catch (error) {
      console.error(
        "Media upload error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Media upload failed."
      );
    } finally {
      setUploading(false);
      setUploadingFile("");

      /**
       * Reset the input so the user can select
       * the same file again.
       */
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  /**
   * Open the native file picker.
   */
  const handleButtonClick = () => {
    if (uploading) {
      return;
    }

    setError("");

    inputRef.current?.click();
  };

  const buttonClassName =
    className ?? VARIANT_BUTTON_CLASSES[variant];

  const iconClassName =
    VARIANT_ICON_CLASSES[variant];

  return (
    <div className="w-full">
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptAttribute()}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        className={buttonClassName}
      >
        <UploadCloud className={iconClassName} />

        <span>
          {uploading
            ? uploadingFile
              ? `Uploading ${uploadingFile}...`
              : "Uploading..."
            : buttonText}
        </span>
      </button>

      {/* Upload error */}
      {error && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          <span className="flex-1">
            {error}
          </span>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-red-400 transition-colors hover:text-red-600"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}