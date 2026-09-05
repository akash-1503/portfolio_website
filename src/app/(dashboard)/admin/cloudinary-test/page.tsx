"use client";

import { useState } from "react";

import MediaUploader, {
  type UploadedMedia,
} from "../../../../components/cloudinary/MediaUploader";

export default function CloudinaryTestPage() {
  const [uploadedMedia, setUploadedMedia] = useState<
    UploadedMedia[]
  >([]);

  const handleUpload = (media: UploadedMedia) => {
    console.log("Uploaded media:", media);

    setUploadedMedia((previous) => [
      ...previous,
      media,
    ]);
  };

  return (
    <main className="min-h-screen p-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Cloudinary Upload Test
          </h1>

          <p className="mt-2 text-gray-600">
            Test image and video uploads using the
            reusable Cloudinary uploader.
          </p>
        </div>

        {/* Image Upload */}
        <section className="mb-10 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Test Gallery Image Upload
          </h2>

          <p className="mt-2 mb-5 text-sm text-gray-600">
            Upload an image to the Gallery images folder.
          </p>

          <MediaUploader
            accept="image"
            multiple={false}
            folder="ngo/gallery/images"
            buttonText="Upload Test Gallery Image"
            onUpload={handleUpload}
          />
        </section>

        {/* Video Upload */}
        <section className="mb-10 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Test Gallery Video Upload
          </h2>

          <p className="mt-2 mb-5 text-sm text-gray-600">
            Upload a video to the Gallery videos folder.
          </p>

          <MediaUploader
            accept="video"
            multiple={false}
            folder="ngo/gallery/videos"
            buttonText="Upload Test Gallery Video"
            onUpload={handleUpload}
          />
        </section>

        {/* Uploaded Media */}
        {uploadedMedia.length > 0 && (
          <section className="rounded-xl border p-6">
            <h2 className="mb-6 text-xl font-semibold">
              Uploaded Media
            </h2>

            <div className="space-y-8">
              {uploadedMedia.map((media, index) => (
                <div
                  key={`${media.publicId}-${index}`}
                  className="rounded-xl border p-5"
                >
                  {/* Information */}
                  <div className="mb-4 space-y-1 text-sm">
                    <p>
                      <strong>Type:</strong>{" "}
                      {media.resourceType}
                    </p>

                    <p>
                      <strong>Format:</strong>{" "}
                      {media.format || "N/A"}
                    </p>

                    <p className="break-all">
                      <strong>Public ID:</strong>{" "}
                      {media.publicId}
                    </p>

                    <p className="break-all">
                      <strong>URL:</strong>{" "}
                      {media.url}
                    </p>

                    {media.width && media.height && (
                      <p>
                        <strong>Dimensions:</strong>{" "}
                        {media.width} × {media.height}
                      </p>
                    )}

                    {media.bytes && (
                      <p>
                        <strong>Size:</strong>{" "}
                        {(
                          media.bytes /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>
                    )}
                  </div>

                  {/* Image Preview */}
                  {media.resourceType === "image" && (
                    <img
                      src={media.url}
                      alt="Uploaded Cloudinary media"
                      className="max-h-96 w-full rounded-lg object-contain"
                    />
                  )}

                  {/* Video Preview */}
                  {media.resourceType === "video" && (
                    <video
                      src={media.url}
                      controls
                      className="max-h-96 w-full rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}