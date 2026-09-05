import { NextRequest, NextResponse } from "next/server";
import {
  GalleryCategory,
  GalleryMediaType,
  GalleryType,
  Prisma,
  Role,
} from "@prisma/client";

import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";
import cloudinary from "../../../../lib/cloudinary";

/* ============================================================
   TYPES
============================================================ */

type FrontendGalleryType =
  | "Photo Story"
  | "Video Story"
  | "Event Story"
  | "Campaign Story";

type FrontendGalleryStatus =
  | "Published"
  | "Draft"
  | "Archived";

interface GalleryMediaInput {
  id?: string;
  mediaUrl: string;
  publicId?: string | null;
  thumbnailUrl?: string | null;
  thumbnailPublicId?: string | null;
  mediaType: "IMAGE" | "VIDEO";
  sortOrder?: number;
}

/* ============================================================
   AUTHENTICATION
============================================================ */

async function authenticateAdmin(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value ?? "";

    if (!token) {
      return {
        success: false as const,
        response: NextResponse.json(
          {
            success: false,
            message: "Unauthorized.",
          },
          { status: 401 }
        ),
      };
    }

    let payload;

    try {
      payload = await verifyToken(token);
    } catch (error) {
      console.error("JWT verification failed:", error);

      return {
        success: false as const,
        response: NextResponse.json(
          {
            success: false,
            message: "Invalid or expired authentication token.",
          },
          { status: 401 }
        ),
      };
    }

    if (!payload) {
      return {
        success: false as const,
        response: NextResponse.json(
          {
            success: false,
            message: "Invalid or expired authentication token.",
          },
          { status: 401 }
        ),
      };
    }

    if (payload.role !== Role.ADMIN) {
      return {
        success: false as const,
        response: NextResponse.json(
          {
            success: false,
            message: "Access denied. Admin access required.",
          },
          { status: 403 }
        ),
      };
    }

    /*
     * Always load the admin from DB.
     *
     * Do not trust ngoId from the client or JWT alone.
     */
    const admin = await prisma.user.findFirst({
      where: {
        id: payload.id,
        role: Role.ADMIN,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        ngoId: true,
      },
    });

    if (!admin) {
      return {
        success: false as const,
        response: NextResponse.json(
          {
            success: false,
            message: "Admin account not found.",
          },
          { status: 404 }
        ),
      };
    }

    if (!admin.ngoId) {
      return {
        success: false as const,
        response: NextResponse.json(
          {
            success: false,
            message: "Admin is not associated with an NGO.",
          },
          { status: 403 }
        ),
      };
    }

    return {
      success: true as const,
      admin: {
        ...admin,
        ngoId: admin.ngoId,
      },
    };
  } catch (error) {
    console.error("authenticateAdmin ERROR:", error);

    return {
      success: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication failed.",
        },
        { status: 401 }
      ),
    };
  }
}

/* ============================================================
   FRONTEND TYPE -> PRISMA TYPE
============================================================ */

function mapFrontendTypeToPrisma(
  type: string
): GalleryType | null {
  switch (type.trim().toLowerCase()) {
    case "photo story":
    case "photo":
      return GalleryType.Photo;

    case "video story":
    case "video":
      return GalleryType.Video;

    case "event story":
    case "event":
    case "story":
      return GalleryType.Story;

    case "campaign story":
    case "campaign":
    case "impact":
      return GalleryType.Impact;

    default:
      return null;
  }
}

/* ============================================================
   PRISMA TYPE -> FRONTEND TYPE
============================================================ */

function mapPrismaTypeToFrontend(
  type: GalleryType,
  eventId: string | null,
  campaignId: string | null
): FrontendGalleryType {
  /*
   * Relationship has priority.
   */
  if (eventId) {
    return "Event Story";
  }

  if (campaignId) {
    return "Campaign Story";
  }

  switch (type) {
    case GalleryType.Photo:
      return "Photo Story";

    case GalleryType.Video:
      return "Video Story";

    case GalleryType.Impact:
      return "Campaign Story";

    case GalleryType.Story:
    default:
      return "Event Story";
  }
}

/* ============================================================
   CATEGORY -> PRISMA
============================================================ */

function mapCategoryToPrisma(
  category: string
): GalleryCategory | null {
  switch (category.trim().toLowerCase()) {
    case "education":
      return GalleryCategory.Education;

    case "environment":
      return GalleryCategory.Environment;

    case "health":
      return GalleryCategory.Health;

    case "emergency":
      return GalleryCategory.Emergency;

    default:
      return null;
  }
}

/* ============================================================
   CATEGORY -> FRONTEND
============================================================ */

function mapCategoryToFrontend(
  category: GalleryCategory
): string {
  switch (category) {
    case GalleryCategory.Education:
      return "Education";

    case GalleryCategory.Environment:
      return "Environment";

    case GalleryCategory.Health:
      return "Health";

    case GalleryCategory.Emergency:
      return "Emergency";

    default:
      return category;
  }
}

/* ============================================================
   STATUS -> FRONTEND
============================================================ */

function mapStatusToFrontend(
  isPublished: boolean
): FrontendGalleryStatus {
  return isPublished ? "Published" : "Draft";
}

/* ============================================================
   FORMAT MEDIA
============================================================ */

function formatMedia(media: any[]) {
  return (media ?? []).map((item: any) => ({
    id: item.id,
    mediaUrl: item.mediaUrl,
    publicId: item.publicId ?? null,
    thumbnailUrl: item.thumbnailUrl ?? null,
    thumbnailPublicId: item.thumbnailPublicId ?? null,
    mediaType: item.mediaType,
    sortOrder: item.sortOrder,
    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : item.createdAt,
  }));
}

/* ============================================================
   FORMAT GALLERY POST
============================================================ */

function formatGalleryPost(post: any) {
  const formattedMedia = formatMedia(post.media ?? []);

  const firstImage =
    formattedMedia.find(
      (item: any) => item.mediaType === "IMAGE"
    )?.mediaUrl ?? null;

  const firstVideo =
    formattedMedia.find(
      (item: any) => item.mediaType === "VIDEO"
    )?.mediaUrl ?? null;

  const coverImage =
    post.thumbnailUrl ??
    firstImage ??
    firstVideo ??
    null;

  return {
    id: post.id,

    title: post.title,

    description: post.description,

    type: mapPrismaTypeToFrontend(
      post.type,
      post.eventId ?? null,
      post.campaignId ?? null
    ),

    status: mapStatusToFrontend(post.isPublished),

    date: (
      post.publishedAt ??
      post.createdAt
    )
      .toISOString()
      .split("T")[0],

    location:
      post.location ??
      post.event?.venue ??
      post.event?.city ??
      "Location not specified",

    coverImage,

    thumbnailUrl:
      post.thumbnailUrl ?? null,

    thumbnailPublicId:
      post.thumbnailPublicId ?? null,

    category: mapCategoryToFrontend(
      post.category
    ),

    isFeatured: post.isFeatured,

    isPublished: post.isPublished,

    publishedAt:
      post.publishedAt?.toISOString() ??
      null,

    eventId:
      post.eventId ?? null,

    campaignId:
      post.campaignId ?? null,

    event: post.event
      ? {
          id: post.event.id,
          title: post.event.title,
          startDate:
            post.event.startDate?.toISOString() ??
            null,
          endDate:
            post.event.endDate?.toISOString() ??
            null,
          venue: post.event.venue ?? null,
          city: post.event.city ?? null,
        }
      : null,

    campaign: post.campaign
      ? {
          id: post.campaign.id,
          title: post.campaign.title,
          startDate:
            post.campaign.startDate?.toISOString() ??
            null,
          endDate:
            post.campaign.endDate?.toISOString() ??
            null,
        }
      : null,

    createdBy: post.createdBy,

    creator: post.creator
      ? {
          id: post.creator.id,
          name: post.creator.name,
          email: post.creator.email,
        }
      : null,

    mediaCount: formattedMedia.length,

    media: formattedMedia,

    images: formattedMedia.filter(
      (item: any) =>
        item.mediaType === "IMAGE"
    ),

    videos: formattedMedia.filter(
      (item: any) =>
        item.mediaType === "VIDEO"
    ),

    createdAt:
      post.createdAt.toISOString(),

    updatedAt:
      post.updatedAt.toISOString(),
  };
}

/* ============================================================
   COMMON SELECT
============================================================ */

const gallerySelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  category: true,

  thumbnailUrl: true,
  thumbnailPublicId: true,

  location: true,

  isFeatured: true,
  isPublished: true,
  publishedAt: true,

  eventId: true,
  campaignId: true,

  createdBy: true,

  createdAt: true,
  updatedAt: true,

  event: {
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      venue: true,
      city: true,
    },
  },

  campaign: {
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
    },
  },

  creator: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  media: {
    orderBy: {
      sortOrder: "asc" as const,
    },

    select: {
      id: true,
      mediaUrl: true,
      publicId: true,
      thumbnailUrl: true,
      thumbnailPublicId: true,
      mediaType: true,
      sortOrder: true,
      createdAt: true,
    },
  },
};

/* ============================================================
   CLOUDINARY DELETE HELPER
============================================================ */

async function deleteCloudinaryAsset(
  publicId: string | null | undefined,
  resourceType: "image" | "video"
) {
  if (!publicId) {
    return {
      result: "skipped",
    };
  }

  try {
    const result =
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: resourceType,
          invalidate: true,
        }
      );

    console.log(
      "Cloudinary asset deletion:",
      {
        publicId,
        resourceType,
        result: result.result,
      }
    );

    /*
     * Cloudinary can return "not found"
     * when an asset was already removed.
     *
     * Treat that as idempotent success.
     */
    if (
      result.result !== "ok" &&
      result.result !== "not found"
    ) {
      throw new Error(
        `Cloudinary deletion returned: ${result.result}`
      );
    }

    return result;
  } catch (error) {
    console.error(
      "Cloudinary asset deletion failed:",
      {
        publicId,
        resourceType,
        error,
      }
    );

    throw error;
  }
}

/* ============================================================
   GET
   GET /api/admin/gallery
============================================================ */

export async function GET(
  req: NextRequest
) {
  try {
    const auth =
      await authenticateAdmin(req);

    if (!auth.success) {
      return auth.response;
    }

    const { admin } = auth;

    const searchParams =
      req.nextUrl.searchParams;

    const id =
      searchParams.get("id")?.trim() || null;

    const search =
      searchParams.get("search")?.trim() || "";

    const type =
      searchParams.get("type")?.trim() || "";

    const status =
      searchParams.get("status")?.trim() || "";

    const category =
      searchParams.get("category")?.trim() || "";

    /* ========================================================
       SINGLE RECORD
    ======================================================== */

    if (id) {
      const galleryPost =
        await prisma.galleryPost.findFirst({
          where: {
            id,
            ngoId: admin.ngoId,
            isDeleted: false,
          },

          select: gallerySelect,
        });

      if (!galleryPost) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Gallery story not found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Gallery story loaded successfully.",
          data:
            formatGalleryPost(
              galleryPost
            ),
        },
        { status: 200 }
      );
    }

    /* ========================================================
       BASE WHERE
    ======================================================== */

    const where: Prisma.GalleryPostWhereInput = {
      ngoId: admin.ngoId,
      isDeleted: false,
    };

    /* ========================================================
       SEARCH
    ======================================================== */

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    /* ========================================================
       STATUS
    ======================================================== */

    /*
     * Archived records are soft deleted.
     *
     * Since the normal base query excludes deleted
     * records, use a separate where object for Archived.
     */
    if (status === "Archived") {
      where.isDeleted = true;
    }

    if (status === "Published") {
      where.isPublished = true;
    }

    if (status === "Draft") {
      where.isPublished = false;
    }

    /* ========================================================
       CATEGORY
    ======================================================== */

    if (category) {
      const prismaCategory =
        mapCategoryToPrisma(category);

      if (!prismaCategory) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid gallery category.",
          },
          { status: 400 }
        );
      }

      where.category =
        prismaCategory;
    }

    /* ========================================================
       TYPE
    ======================================================== */

    if (type) {
      switch (
        type.toLowerCase()
      ) {
        case "photo story":
        case "photo":
          where.type =
            GalleryType.Photo;
          break;

        case "video story":
        case "video":
          where.type =
            GalleryType.Video;
          break;

        case "event story":
        case "event":
          where.type =
            GalleryType.Story;

          where.eventId = {
            not: null,
          };

          break;

        case "campaign story":
        case "campaign":
          where.type =
            GalleryType.Impact;

          where.campaignId = {
            not: null,
          };

          break;

        default:
          return NextResponse.json(
            {
              success: false,
              message:
                "Invalid gallery type.",
              allowedTypes: [
                "Photo Story",
                "Video Story",
                "Event Story",
                "Campaign Story",
              ],
            },
            { status: 400 }
          );
      }
    }

    /* ========================================================
       LOAD GALLERY
    ======================================================== */

    const galleryPosts =
      await prisma.galleryPost.findMany({
        where,

        orderBy: [
          {
            isFeatured: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        select:
          gallerySelect,
      });

    /* ========================================================
       STATISTICS
    ======================================================== */

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalImages,
      totalVideos,
    ] = await Promise.all([
      prisma.galleryPost.count({
        where: {
          ngoId: admin.ngoId,
          isDeleted: false,
        },
      }),

      prisma.galleryPost.count({
        where: {
          ngoId: admin.ngoId,
          isDeleted: false,
          isPublished: true,
        },
      }),

      prisma.galleryPost.count({
        where: {
          ngoId: admin.ngoId,
          isDeleted: false,
          isPublished: false,
        },
      }),

      prisma.galleryPost.count({
        where: {
          ngoId: admin.ngoId,
          isDeleted: false,
          isFeatured: true,
        },
      }),

      prisma.galleryMedia.count({
        where: {
          mediaType:
            GalleryMediaType.IMAGE,

          galleryPost: {
            ngoId: admin.ngoId,
            isDeleted: false,
          },
        },
      }),

      prisma.galleryMedia.count({
        where: {
          mediaType:
            GalleryMediaType.VIDEO,

          galleryPost: {
            ngoId: admin.ngoId,
            isDeleted: false,
          },
        },
      }),
    ]);

    const records =
      galleryPosts.map(
        formatGalleryPost
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Gallery loaded successfully.",

        data: {
          records,

          /*
           * Keep both aliases so the existing
           * frontend can consume either one.
           */
          gallery: records,

          statistics: {
            totalPosts,
            publishedPosts,
            draftPosts,
            featuredPosts,
            totalImages,
            totalVideos,
            totalMedia:
              totalImages +
              totalVideos,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/gallery ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load gallery.",
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   POST
   POST /api/admin/gallery

   IMPORTANT:
   This endpoint receives JSON.

   Files should NOT be sent directly here.
   Cloudinary uploads happen separately.

   The media field contains Cloudinary URLs
   and public IDs.
============================================================ */

export async function POST(
  req: NextRequest
) {
  try {
    const auth =
      await authenticateAdmin(req);

    if (!auth.success) {
      return auth.response;
    }

    const { admin } = auth;

    /* ========================================================
       CONTENT TYPE
    ======================================================== */

    const contentType =
      req.headers.get(
        "content-type"
      ) || "";

    if (
      !contentType
        .toLowerCase()
        .includes("application/json")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request format. Gallery creation requires JSON. Upload files separately and send their URLs.",
        },
        { status: 415 }
      );
    }

    /* ========================================================
       READ JSON
    ======================================================== */

    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    /* ========================================================
       BASIC DATA
    ======================================================== */

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const type =
      typeof body.type === "string"
        ? body.type.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim() || null
        : null;

    const thumbnailUrl =
      typeof body.thumbnailUrl === "string"
        ? body.thumbnailUrl.trim() || null
        : typeof body.coverImage === "string"
          ? body.coverImage.trim() || null
          : null;

    const thumbnailPublicId =
      typeof body.thumbnailPublicId === "string"
        ? body.thumbnailPublicId.trim() || null
        : null;

    const isFeatured =
      typeof body.isFeatured === "boolean"
        ? body.isFeatured
        : false;

    const isPublished =
      typeof body.isPublished === "boolean"
        ? body.isPublished
        : false;

    const eventId =
      typeof body.eventId === "string" &&
      body.eventId.trim()
        ? body.eventId.trim()
        : null;

    const campaignId =
      typeof body.campaignId === "string" &&
      body.campaignId.trim()
        ? body.campaignId.trim()
        : null;

    const media: GalleryMediaInput[] =
      Array.isArray(body.media)
        ? body.media
        : [];

    /* ========================================================
       REQUIRED VALIDATION
    ======================================================== */

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gallery title is required.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gallery description is required.",
        },
        { status: 400 }
      );
    }

    /* ========================================================
       TYPE
    ======================================================== */

    const prismaType =
      mapFrontendTypeToPrisma(type);

    if (!prismaType) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid gallery type.",
          allowedTypes: [
            "Photo Story",
            "Video Story",
            "Event Story",
            "Campaign Story",
          ],
        },
        { status: 400 }
      );
    }

    /* ========================================================
       CATEGORY
    ======================================================== */

    const prismaCategory =
      mapCategoryToPrisma(category);

    if (!prismaCategory) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid gallery category.",
          allowedCategories: [
            "Education",
            "Environment",
            "Health",
            "Emergency",
          ],
        },
        { status: 400 }
      );
    }

    /* ========================================================
       RELATION RULES
    ======================================================== */

    if (
      type.toLowerCase() ===
        "event story" &&
      !eventId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Event Story requires an event.",
        },
        { status: 400 }
      );
    }

    if (
      type.toLowerCase() ===
        "campaign story" &&
      !campaignId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Campaign Story requires a campaign.",
        },
        { status: 400 }
      );
    }

    if (
      eventId &&
      campaignId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A gallery story cannot be connected to both an event and a campaign.",
        },
        { status: 400 }
      );
    }

    /* ========================================================
       VALIDATE EVENT
    ======================================================== */

    if (eventId) {
      const event =
        await prisma.event.findFirst({
          where: {
            id: eventId,
            ngoId: admin.ngoId,
            isDeleted: false,
          },

          select: {
            id: true,
          },
        });

      if (!event) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected event was not found or does not belong to this NGO.",
          },
          { status: 400 }
        );
      }
    }

    /* ========================================================
       VALIDATE CAMPAIGN
    ======================================================== */

    if (campaignId) {
      const campaign =
        await prisma.campaign.findFirst({
          where: {
            id: campaignId,
            ngoId: admin.ngoId,
            isDeleted: false,
          },

          select: {
            id: true,
          },
        });

      if (!campaign) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected campaign was not found or does not belong to this NGO.",
          },
          { status: 400 }
        );
      }
    }

    /* ========================================================
       VALIDATE MEDIA
    ======================================================== */

    if (!Array.isArray(body.media)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Media must be an array.",
        },
        { status: 400 }
      );
    }

    for (
      let index = 0;
      index < media.length;
      index++
    ) {
      const item =
        media[index];

      if (
        !item ||
        typeof item.mediaUrl !==
          "string" ||
        !item.mediaUrl.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid media URL at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }

      if (
        item.mediaType !==
          "IMAGE" &&
        item.mediaType !==
          "VIDEO"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid media type at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }

      if (
        item.thumbnailUrl !==
          undefined &&
        item.thumbnailUrl !==
          null &&
        typeof item.thumbnailUrl !==
          "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid thumbnail URL at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }

      if (
        item.publicId !==
          undefined &&
        item.publicId !==
          null &&
        typeof item.publicId !==
          "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid Cloudinary public ID at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }

      if (
        item.thumbnailPublicId !==
          undefined &&
        item.thumbnailPublicId !==
          null &&
        typeof item.thumbnailPublicId !==
          "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid Cloudinary thumbnail public ID at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }
    }

    /* ========================================================
       CREATE GALLERY POST
    ======================================================== */

    const galleryPost =
      await prisma.galleryPost.create({
        data: {
          ngoId: admin.ngoId,

          title,

          description,

          type: prismaType,

          category:
            prismaCategory,

          thumbnailUrl,

          thumbnailPublicId,

          location,

          isFeatured,

          isPublished,

          publishedAt:
            isPublished
              ? new Date()
              : null,

          eventId,

          campaignId,

          createdBy:
            admin.id,

          media: {
            create:
              media.map(
                (
                  item,
                  index
                ) => ({
                  mediaUrl:
                    item.mediaUrl.trim(),

                  publicId:
                    typeof item.publicId ===
                      "string"
                      ? item.publicId.trim() ||
                        null
                      : null,

                  thumbnailUrl:
                    typeof item.thumbnailUrl ===
                      "string"
                      ? item.thumbnailUrl.trim() ||
                        null
                      : null,

                  thumbnailPublicId:
                    typeof item.thumbnailPublicId ===
                      "string"
                      ? item.thumbnailPublicId.trim() ||
                        null
                      : null,

                  mediaType:
                    item.mediaType ===
                      "VIDEO"
                      ? GalleryMediaType.VIDEO
                      : GalleryMediaType.IMAGE,

                  sortOrder:
                    typeof item.sortOrder ===
                      "number"
                      ? item.sortOrder
                      : index,
                })
              ),
          },
        },

        select:
          gallerySelect,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Gallery story created successfully.",
        data:
          formatGalleryPost(
            galleryPost
          ),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/gallery ERROR:",
      error
    );

    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Database error while creating gallery story.",
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create gallery story.",
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   PATCH
   PATCH /api/admin/gallery
============================================================ */

export async function PATCH(
  req: NextRequest
) {
  try {
    const auth =
      await authenticateAdmin(req);

    if (!auth.success) {
      return auth.response;
    }

    const { admin } = auth;

    /* ========================================================
       CONTENT TYPE
    ======================================================== */

    const contentType =
      req.headers.get(
        "content-type"
      ) || "";

    if (
      !contentType
        .toLowerCase()
        .includes("application/json")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request format. Gallery updates require JSON.",
        },
        { status: 415 }
      );
    }

    /* ========================================================
       READ JSON
    ======================================================== */

    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gallery ID is required.",
        },
        { status: 400 }
      );
    }

    /* ========================================================
       FIND EXISTING
    ======================================================== */

    const existing =
      await prisma.galleryPost.findFirst({
        where: {
          id,
          ngoId: admin.ngoId,
          isDeleted: false,
        },

        select: {
          id: true,
          type: true,
          isPublished: true,
          publishedAt: true,
          eventId: true,
          campaignId: true,

          thumbnailPublicId: true,

          media: {
            select: {
              publicId: true,
              thumbnailPublicId: true,
              mediaType: true,
            },
          },
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gallery story not found.",
        },
        { status: 404 }
      );
    }

    /* ========================================================
       UPDATE DATA
    ======================================================== */

    const updateData:
      Prisma.GalleryPostUpdateInput =
      {};

    /* ========================================================
       TITLE
    ======================================================== */

    if (
      body.title !==
      undefined
    ) {
      if (
        typeof body.title !==
          "string" ||
        !body.title.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Gallery title cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.title =
        body.title.trim();
    }

    /* ========================================================
       DESCRIPTION
    ======================================================== */

    if (
      body.description !==
      undefined
    ) {
      if (
        typeof body.description !==
          "string" ||
        !body.description.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Gallery description cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.description =
        body.description.trim();
    }

    /* ========================================================
       TYPE
    ======================================================== */

    let resultingType:
      | GalleryType
      | undefined =
      undefined;

    if (
      body.type !==
      undefined
    ) {
      if (
        typeof body.type !==
        "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid gallery type.",
          },
          { status: 400 }
        );
      }

      const prismaType =
        mapFrontendTypeToPrisma(
          body.type
        );

      if (!prismaType) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid gallery type.",
          },
          { status: 400 }
        );
      }

      resultingType =
        prismaType;

      updateData.type =
        prismaType;
    } else {
      resultingType =
        existing.type;
    }

    /* ========================================================
       CATEGORY
    ======================================================== */

    if (
      body.category !==
      undefined
    ) {
      if (
        typeof body.category !==
        "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid gallery category.",
          },
          { status: 400 }
        );
      }

      const prismaCategory =
        mapCategoryToPrisma(
          body.category
        );

      if (!prismaCategory) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid gallery category.",
          },
          { status: 400 }
        );
      }

      updateData.category =
        prismaCategory;
    }

    /* ========================================================
       LOCATION
    ======================================================== */

    if (
      body.location !==
      undefined
    ) {
      updateData.location =
        typeof body.location ===
          "string"
          ? body.location.trim() ||
            null
          : null;
    }

    /* ========================================================
       THUMBNAIL URL
    ======================================================== */

    if (
      body.thumbnailUrl !==
      undefined
    ) {
      updateData.thumbnailUrl =
        typeof body.thumbnailUrl ===
          "string"
          ? body.thumbnailUrl.trim() ||
            null
          : null;
    } else if (
      body.coverImage !==
      undefined
    ) {
      updateData.thumbnailUrl =
        typeof body.coverImage ===
          "string"
          ? body.coverImage.trim() ||
            null
          : null;
    }

    /* ========================================================
       THUMBNAIL PUBLIC ID
    ======================================================== */

    if (
      body.thumbnailPublicId !==
      undefined
    ) {
      updateData.thumbnailPublicId =
        typeof body.thumbnailPublicId ===
          "string"
          ? body.thumbnailPublicId.trim() ||
            null
          : null;
    }

    /* ========================================================
       FEATURED
    ======================================================== */

    if (
      typeof body.isFeatured ===
      "boolean"
    ) {
      updateData.isFeatured =
        body.isFeatured;
    }

    /* ========================================================
       PUBLISHED
    ======================================================== */

    if (
      typeof body.isPublished ===
      "boolean"
    ) {
      updateData.isPublished =
        body.isPublished;

      if (
        body.isPublished &&
        !existing.isPublished
      ) {
        updateData.publishedAt =
          new Date();
      }

      if (
        !body.isPublished
      ) {
        updateData.publishedAt =
          null;
      }
    }

    /* ========================================================
       EVENT
    ======================================================== */

    let newEventId:
      | string
      | null =
      existing.eventId;

    if (
      body.eventId !==
      undefined
    ) {
      newEventId =
        typeof body.eventId ===
          "string" &&
        body.eventId.trim()
          ? body.eventId.trim()
          : null;

      if (newEventId) {
        const event =
          await prisma.event.findFirst({
            where: {
              id: newEventId,
              ngoId: admin.ngoId,
              isDeleted: false,
            },

            select: {
              id: true,
            },
          });

        if (!event) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Selected event was not found or does not belong to this NGO.",
            },
            { status: 400 }
          );
        }

        updateData.event = {
          connect: {
            id: event.id,
          },
        };
      } else {
        updateData.event = {
          disconnect: true,
        };
      }
    }

    /* ========================================================
       CAMPAIGN
    ======================================================== */

    let newCampaignId:
      | string
      | null =
      existing.campaignId;

    if (
      body.campaignId !==
      undefined
    ) {
      newCampaignId =
        typeof body.campaignId ===
          "string" &&
        body.campaignId.trim()
          ? body.campaignId.trim()
          : null;

      if (newCampaignId) {
        const campaign =
          await prisma.campaign.findFirst({
            where: {
              id: newCampaignId,
              ngoId: admin.ngoId,
              isDeleted: false,
            },

            select: {
              id: true,
            },
          });

        if (!campaign) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Selected campaign was not found or does not belong to this NGO.",
            },
            { status: 400 }
          );
        }

        updateData.campaign = {
          connect: {
            id: campaign.id,
          },
        };
      } else {
        updateData.campaign = {
          disconnect: true,
        };
      }
    }

    /* ========================================================
       PREVENT BOTH RELATIONS
    ======================================================== */

    if (
      newEventId &&
      newCampaignId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A gallery story cannot be connected to both an event and a campaign.",
        },
        { status: 400 }
      );
    }

    /* ========================================================
       TYPE + RELATION VALIDATION
    ======================================================== */

    if (
      resultingType ===
        GalleryType.Story &&
      !newEventId
    ) {
      if (
        typeof body.type ===
          "string" &&
        body.type
          .trim()
          .toLowerCase() ===
          "event story"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Event Story requires an event.",
          },
          { status: 400 }
        );
      }
    }

    if (
      resultingType ===
        GalleryType.Impact &&
      !newCampaignId
    ) {
      if (
        typeof body.type ===
          "string" &&
        body.type
          .trim()
          .toLowerCase() ===
          "campaign story"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Campaign Story requires a campaign.",
          },
          { status: 400 }
        );
      }
    }

    /* ========================================================
       MEDIA
    ======================================================== */

    const mediaWasProvided =
      body.media !==
      undefined;

    let media:
      GalleryMediaInput[] =
      [];

    if (mediaWasProvided) {
      if (
        !Array.isArray(
          body.media
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Media must be an array.",
          },
          { status: 400 }
        );
      }

      media =
        body.media;
    }

    /* ========================================================
       VALIDATE MEDIA
    ======================================================== */

    for (
      let index = 0;
      index < media.length;
      index++
    ) {
      const item =
        media[index];

      if (
        !item ||
        typeof item.mediaUrl !==
          "string" ||
        !item.mediaUrl.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid media URL at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }

      if (
        item.mediaType !==
          "IMAGE" &&
        item.mediaType !==
          "VIDEO"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid media type at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }

      if (
        item.thumbnailUrl !==
          undefined &&
        item.thumbnailUrl !==
          null &&
        typeof item.thumbnailUrl !==
          "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid thumbnail URL at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }

      if (
        item.publicId !==
          undefined &&
        item.publicId !==
          null &&
        typeof item.publicId !==
          "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid Cloudinary public ID at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }

      if (
        item.thumbnailPublicId !==
          undefined &&
        item.thumbnailPublicId !==
          null &&
        typeof item.thumbnailPublicId !==
          "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid Cloudinary thumbnail public ID at position ${
                index + 1
              }.`,
          },
          { status: 400 }
        );
      }
    }

    /* ========================================================
       DELETE OLD CLOUDINARY MEDIA WHEN MEDIA IS REPLACED
    ======================================================== */

    const oldCloudinaryAssetsToDelete: {
      publicId: string;
      resourceType: "image" | "video";
    }[] = [];

    if (mediaWasProvided) {
      for (const oldMedia of existing.media) {
        if (oldMedia.publicId) {
          oldCloudinaryAssetsToDelete.push({
            publicId:
              oldMedia.publicId,
            resourceType:
              oldMedia.mediaType ===
              GalleryMediaType.VIDEO
                ? "video"
                : "image",
          });
        }

        if (
          oldMedia.thumbnailPublicId
        ) {
          oldCloudinaryAssetsToDelete.push({
            publicId:
              oldMedia.thumbnailPublicId,
            resourceType: "image",
          });
        }
      }
    }

    /*
     * If the gallery thumbnail itself is being changed,
     * remember the old thumbnail for deletion.
     */
    const thumbnailIsBeingChanged =
      body.thumbnailUrl !==
        undefined ||
      body.coverImage !==
        undefined ||
      body.thumbnailPublicId !==
        undefined;

    if (
      thumbnailIsBeingChanged &&
      existing.thumbnailPublicId
    ) {
      oldCloudinaryAssetsToDelete.push({
        publicId:
          existing.thumbnailPublicId,
        resourceType: "image",
      });
    }

    /* ========================================================
       DATABASE TRANSACTION
    ======================================================== */

    const updated =
      await prisma.$transaction(
        async (tx) => {
          const post =
            await tx.galleryPost.update({
              where: {
                id: existing.id,
              },

              data:
                updateData,

              select: {
                id: true,
              },
            });

          /*
           * Only replace media if media was
           * actually supplied.
           */
          if (
            mediaWasProvided
          ) {
            await tx.galleryMedia.deleteMany(
              {
                where: {
                  galleryPostId:
                    existing.id,
                },
              }
            );

            if (
              media.length >
              0
            ) {
              await tx.galleryMedia.createMany(
                {
                  data:
                    media.map(
                      (
                        item,
                        index
                      ) => ({
                        galleryPostId:
                          existing.id,

                        mediaUrl:
                          item.mediaUrl.trim(),

                        /*
                         * IMPORTANT:
                         * Save Cloudinary publicId.
                         */
                        publicId:
                          typeof item.publicId ===
                            "string"
                            ? item.publicId.trim() ||
                              null
                            : null,

                        thumbnailUrl:
                          typeof item.thumbnailUrl ===
                            "string"
                            ? item.thumbnailUrl.trim() ||
                              null
                            : null,

                        /*
                         * IMPORTANT:
                         * Save Cloudinary thumbnail publicId.
                         */
                        thumbnailPublicId:
                          typeof item.thumbnailPublicId ===
                            "string"
                            ? item.thumbnailPublicId.trim() ||
                              null
                            : null,

                        mediaType:
                          item.mediaType ===
                            "VIDEO"
                            ? GalleryMediaType.VIDEO
                            : GalleryMediaType.IMAGE,

                        sortOrder:
                          typeof item.sortOrder ===
                            "number"
                            ? item.sortOrder
                            : index,
                      })
                    ),
                }
              );
            }
          }

          return post;
        }
      );

    /* ========================================================
       DELETE OLD CLOUDINARY ASSETS
       
       This happens AFTER the database update succeeds.
       Therefore a failed Cloudinary deletion will not
       rollback the gallery update.
    ======================================================== */

    const cloudinaryDeletionErrors: string[] =
      [];

    /*
     * Remove duplicate public IDs so the same asset
     * is not deleted twice.
     */
    const uniqueCloudinaryAssets =
      new Map<
        string,
        "image" | "video"
      >();

    for (
      const asset of
        oldCloudinaryAssetsToDelete
    ) {
      if (
        !uniqueCloudinaryAssets.has(
          asset.publicId
        )
      ) {
        uniqueCloudinaryAssets.set(
          asset.publicId,
          asset.resourceType
        );
      }
    }

    for (
      const [
        publicId,
        resourceType,
      ] of uniqueCloudinaryAssets
    ) {
      try {
        await deleteCloudinaryAsset(
          publicId,
          resourceType
        );
      } catch {
        cloudinaryDeletionErrors.push(
          `Failed to delete old Cloudinary asset: ${publicId}`
        );
      }
    }

    /* ========================================================
       LOAD FINAL RECORD
    ======================================================== */

    const finalPost =
      await prisma.galleryPost.findFirst({
        where: {
          id: updated.id,
          ngoId: admin.ngoId,
          isDeleted: false,
        },

        select:
          gallerySelect,
      });

    if (!finalPost) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Updated gallery story could not be loaded.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          cloudinaryDeletionErrors.length >
          0
            ? "Gallery story updated successfully, but some old Cloudinary assets could not be deleted."
            : "Gallery story updated successfully.",

        data: {
          ...formatGalleryPost(
            finalPost
          ),

          cloudinaryDeletionErrors,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "PATCH /api/admin/gallery ERROR:",
      error
    );

    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Database error while updating gallery story.",
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update gallery story.",
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   DELETE
   DELETE /api/admin/gallery

   Deletes:
   1. Gallery thumbnail from Cloudinary
   2. Gallery media from Cloudinary
   3. Media thumbnails from Cloudinary
   4. Gallery record is soft-deleted from database
============================================================ */

export async function DELETE(
  req: NextRequest
) {
  try {
    const auth =
      await authenticateAdmin(req);

    if (!auth.success) {
      return auth.response;
    }

    const { admin } = auth;

    /* ========================================================
       CONTENT TYPE
    ======================================================== */

    const contentType =
      req.headers.get(
        "content-type"
      ) || "";

    if (
      !contentType
        .toLowerCase()
        .includes("application/json")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request format. Gallery deletion requires JSON.",
        },
        { status: 415 }
      );
    }

    /* ========================================================
       READ JSON
    ======================================================== */

    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gallery ID is required.",
        },
        { status: 400 }
      );
    }

    /* ========================================================
       FIND GALLERY
    ======================================================== */

    const galleryPost =
      await prisma.galleryPost.findFirst({
        where: {
          id,
          ngoId: admin.ngoId,
          isDeleted: false,
        },

        select: {
          id: true,
          title: true,

          thumbnailPublicId: true,

          media: {
            select: {
              publicId: true,
              thumbnailPublicId: true,
              mediaType: true,
            },
          },
        },
      });

    if (!galleryPost) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gallery story not found.",
        },
        { status: 404 }
      );
    }

    /* ========================================================
       COLLECT CLOUDINARY ASSETS
    ======================================================== */

    const cloudinaryAssets = new Map<
      string,
      "image" | "video"
    >();

    if (
      galleryPost.thumbnailPublicId
    ) {
      cloudinaryAssets.set(
        galleryPost.thumbnailPublicId,
        "image"
      );
    }

    for (
      const media of
        galleryPost.media
    ) {
      if (media.publicId) {
        cloudinaryAssets.set(
          media.publicId,
          media.mediaType ===
            GalleryMediaType.VIDEO
            ? "video"
            : "image"
        );
      }

      if (
        media.thumbnailPublicId
      ) {
        cloudinaryAssets.set(
          media.thumbnailPublicId,
          "image"
        );
      }
    }

    /* ========================================================
       DELETE CLOUDINARY ASSETS
    ======================================================== */

    const cloudinaryDeletionErrors: string[] =
      [];

    for (
      const [
        publicId,
        resourceType,
      ] of cloudinaryAssets
    ) {
      try {
        await deleteCloudinaryAsset(
          publicId,
          resourceType
        );
      } catch {
        cloudinaryDeletionErrors.push(
          `Failed to delete Cloudinary asset: ${publicId}`
        );
      }
    }

    /* ========================================================
       SOFT DELETE DATABASE RECORD
       
       We intentionally still soft-delete the DB record
       even if Cloudinary has a temporary deletion failure.
    ======================================================== */

    await prisma.galleryPost.update({
      where: {
        id: galleryPost.id,
      },

      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    /* ========================================================
       RESPONSE
    ======================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          cloudinaryDeletionErrors.length >
          0
            ? "Gallery story deleted from the database, but some Cloudinary assets could not be deleted."
            : "Gallery story and its Cloudinary media were deleted successfully.",

        data: {
          id:
            galleryPost.id,

          title:
            galleryPost.title,

          cloudinaryAssetsDeleted:
            cloudinaryAssets.size -
            cloudinaryDeletionErrors.length,

          cloudinaryDeletionErrors,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/admin/gallery ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete gallery story.",
      },
      { status: 500 }
    );
  }
}