import { NextRequest, NextResponse } from "next/server";
import {
  GalleryCategory,
  GalleryMediaType,
  GalleryType,
  Role,
} from "@prisma/client";

import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";

/* ============================================================
   TYPES
============================================================ */

type UserGalleryType =
  | "Story"
  | "Photo"
  | "Video"
  | "Impact";

type GalleryWhere = {
  ngoId: string;
  isDeleted: boolean;
  isPublished: boolean;

  OR?: Array<{
    title?: {
      contains: string;
      mode: "insensitive";
    };
    description?: {
      contains: string;
      mode: "insensitive";
    };
    location?: {
      contains: string;
      mode: "insensitive";
    };
  }>;

  category?: GalleryCategory;
  type?: GalleryType;
  isFeatured?: boolean;
};

/* ============================================================
   HELPERS
============================================================ */

/**
 * Convert database GalleryType into the exact values
 * expected by the User Gallery page.
 *
 * User Gallery expects:
 * Story | Photo | Video | Impact
 */
function mapType(
  type: GalleryType,
  eventId: string | null,
  campaignId: string | null
): "Story" | "Photo" | "Video" | "Impact" {
  switch (type) {
    case GalleryType.Photo:
      return "Photo";

    case GalleryType.Video:
      return "Video";

    case GalleryType.Impact:
      return "Impact";

    case GalleryType.Story:
    default:
      return "Story";
  }
}

/**
 * Convert Prisma GalleryCategory into the category
 * strings used by the frontend.
 */
function mapCategory(category: GalleryCategory): string {
  switch (category) {
    case GalleryCategory.Education:
      return "EDUCATION";

    case GalleryCategory.Environment:
      return "ENVIRONMENT";

    case GalleryCategory.Health:
      return "HEALTH";

    case GalleryCategory.Emergency:
      return "EMERGENCY";

    default:
      return String(category);
  }
}

/**
 * Convert query-string type into Prisma GalleryType.
 */
function mapQueryType(
  type: string
): GalleryType | undefined {
  switch (type.toLowerCase()) {
    case "photo":
    case "photo story":
      return GalleryType.Photo;

    case "video":
    case "video story":
      return GalleryType.Video;

    case "impact":
    case "campaign":
    case "campaign story":
      return GalleryType.Impact;

    case "story":
    case "event":
    case "event story":
      return GalleryType.Story;

    default:
      return undefined;
  }
}

/**
 * Convert query-string category into Prisma GalleryCategory.
 */
function mapQueryCategory(
  category: string
): GalleryCategory | undefined {
  switch (category.toLowerCase()) {
    case "education":
      return GalleryCategory.Education;

    case "environment":
      return GalleryCategory.Environment;

    case "health":
      return GalleryCategory.Health;

    case "emergency":
      return GalleryCategory.Emergency;

    default:
      return undefined;
  }
}

/* ============================================================
   GET
   GET /api/user/gallery

   IMPORTANT:
   Only published gallery posts are returned.

   Conditions:
   - Logged-in user
   - User role must be USER
   - User account must not be deleted
   - User must belong to an NGO
   - Gallery must belong to that same NGO
   - Gallery must not be deleted
   - Gallery must be published
============================================================ */

export async function GET(req: NextRequest) {
  try {
    /* ========================================================
       1. GET JWT COOKIE
    ======================================================== */

    const token =
      req.cookies.get("token")?.value ?? "";

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /* ========================================================
       2. VERIFY JWT
    ======================================================== */

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /* ========================================================
       3. USER ROLE CHECK
    ======================================================== */

    if (payload.role !== Role.USER) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Access denied. User access required.",
        },
        { status: 403 }
      );
    }

    /* ========================================================
       4. LOAD USER FROM DATABASE

       We do NOT trust only the JWT ngoId.

       The current database record is loaded again so that:
       - deleted users cannot access gallery
       - NGO association is current
       - role is checked against database
    ======================================================== */

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
        role: Role.USER,
        isDeleted: false,
      },

      select: {
        id: true,
        name: true,
        email: true,
        ngoId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    /* ========================================================
       5. NGO CHECK
    ======================================================== */

    if (!user.ngoId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User is not associated with an NGO.",
        },
        { status: 403 }
      );
    }

    /* ========================================================
       6. QUERY PARAMETERS
    ======================================================== */

    const searchParams =
      req.nextUrl.searchParams;

    const category =
      searchParams.get("category")?.trim() || "";

    const type =
      searchParams.get("type")?.trim() || "";

    const featured =
      searchParams.get("featured");

    const search =
      searchParams.get("search")?.trim() || "";

    /* ========================================================
       7. BASE WHERE CONDITION

       THIS IS THE MOST IMPORTANT PART.

       User Gallery ONLY receives:

       isDeleted = false
       isPublished = true

       Therefore an Admin-created draft will NOT appear
       in the User Gallery.

       Once Admin publishes it:
       isPublished = true

       it automatically appears here.
    ======================================================== */

    const where: GalleryWhere = {
      ngoId: user.ngoId,
      isDeleted: false,
      isPublished: true,
    };

    /* ========================================================
       8. SEARCH
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
       9. CATEGORY FILTER
    ======================================================== */

    if (category) {
      const prismaCategory =
        mapQueryCategory(category);

      if (prismaCategory) {
        where.category = prismaCategory;
      }
    }

    /* ========================================================
       10. FEATURED FILTER
    ======================================================== */

    if (featured === "true") {
      where.isFeatured = true;
    }

    /* ========================================================
       11. TYPE FILTER
    ======================================================== */

    if (type) {
      const prismaType =
        mapQueryType(type);

      if (prismaType) {
        where.type = prismaType;
      }
    }

    /* ========================================================
       12. FETCH PUBLISHED GALLERY POSTS
    ======================================================== */

    const posts =
      await prisma.galleryPost.findMany({
        where,

        /*
         * Featured content first.
         * Then newest published content.
         */
        orderBy: [
          {
            isFeatured: "desc",
          },
          {
            publishedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        select: {
          id: true,
          title: true,
          description: true,

          type: true,
          category: true,

          thumbnailUrl: true,

          location: true,

          isFeatured: true,
          isPublished: true,
          publishedAt: true,

          eventId: true,
          campaignId: true,

          createdAt: true,
          updatedAt: true,

          /* ================================================
             EVENT
          ================================================ */

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

          /* ================================================
             CAMPAIGN
          ================================================ */

          campaign: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true,
            },
          },

          /* ================================================
             MEDIA
          ================================================ */

          media: {
            orderBy: {
              sortOrder: "asc",
            },

            select: {
              id: true,
              mediaUrl: true,
              thumbnailUrl: true,
              mediaType: true,
              sortOrder: true,
              createdAt: true,
            },
          },
        },
      });

    /* ========================================================
       13. FORMAT FOR USER GALLERY FRONTEND
    ======================================================== */

    const gallery = posts.map((post) => {
  const imageMedia = post.media.filter(
    (media) =>
      media.mediaType === GalleryMediaType.IMAGE
  );

  const videoMedia = post.media.filter(
    (media) =>
      media.mediaType === GalleryMediaType.VIDEO
  );

  // Main image URLs
  const images = imageMedia
    .map((media) => media.mediaUrl)
    .filter(Boolean);

  // Main video URLs
  const videos = videoMedia
    .map((media) => media.mediaUrl)
    .filter(Boolean);

  // Determine the best cover image.
  //
  // Priority:
  // 1. GalleryPost thumbnailUrl
  // 2. First image media URL
  // 3. First image media thumbnail
  // 4. First video thumbnail
  const coverImage =
    post.thumbnailUrl ||
    imageMedia[0]?.mediaUrl ||
    imageMedia[0]?.thumbnailUrl ||
    videoMedia[0]?.thumbnailUrl ||
    null;

  // Thumbnail used by video/photo cards
  const thumbnailUrl =
    post.thumbnailUrl ||
    imageMedia[0]?.thumbnailUrl ||
    videoMedia[0]?.thumbnailUrl ||
    null;
return {
  id: post.id,
  title: post.title,
  description: post.description,

  shortDesc: post.description,
  fullDesc: post.description,

  type: mapType(
    post.type,
    post.eventId,
    post.campaignId
  ),

  category: mapCategory(post.category),

  coverImage,
  thumbnailUrl,

  images,
  videos,

  media: post.media.map((media) => ({
    id: media.id,
    mediaUrl: media.mediaUrl,
    thumbnailUrl: media.thumbnailUrl,
    mediaType: media.mediaType,
    sortOrder: media.sortOrder,
    createdAt: media.createdAt.toISOString(),
  })),

  mediaCount: post.media.length,

  location:
    post.location ||
    post.event?.venue ||
    post.event?.city ||
    "Location not specified",

  date: new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}).format(
  post.publishedAt ??
  post.createdAt
),

  isFeatured: post.isFeatured,
  isPublished: post.isPublished,

  eventId: post.eventId,
  campaignId: post.campaignId,

  event: post.event,
  campaign: post.campaign,

  createdAt: post.createdAt.toISOString(),
  updatedAt: post.updatedAt.toISOString(),
};
});
    const [
      totalPosts,
      featuredPosts,
      imageCount,
      videoCount,
    ] = await Promise.all([
      /* ================================================
         TOTAL PUBLISHED POSTS
      ================================================ */

      prisma.galleryPost.count({
        where: {
          ngoId: user.ngoId,

          isDeleted: false,

          isPublished: true,
        },
      }),

      /* ================================================
         TOTAL FEATURED PUBLISHED POSTS
      ================================================ */

      prisma.galleryPost.count({
        where: {
          ngoId: user.ngoId,

          isDeleted: false,

          isPublished: true,

          isFeatured: true,
        },
      }),

      /* ================================================
         TOTAL PUBLISHED IMAGES
      ================================================ */

      prisma.galleryMedia.count({
        where: {
          galleryPost: {
            ngoId: user.ngoId,

            isDeleted: false,

            isPublished: true,
          },

          mediaType:
            GalleryMediaType.IMAGE,
        },
      }),

      /* ================================================
         TOTAL PUBLISHED VIDEOS
      ================================================ */

      prisma.galleryMedia.count({
        where: {
          galleryPost: {
            ngoId: user.ngoId,

            isDeleted: false,

            isPublished: true,
          },

          mediaType:
            GalleryMediaType.VIDEO,
        },
      }),
    ]);

    /* ========================================================
       15. RESPONSE
    ======================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "Gallery loaded successfully.",

        data: {
          /* ==============================================
             USER
          ============================================== */

          user: {
            id:
              user.id,

            name:
              user.name,

            email:
              user.email,
          },

          /* ==============================================
             GALLERY

             ONLY PUBLISHED ADMIN CONTENT
          ============================================== */

          gallery,

          /* ==============================================
             STATISTICS
          ============================================== */

          statistics: {
            totalPosts,

            featuredPosts,

            totalPhotos:
              imageCount,

            totalVideos:
              videoCount,

            totalMedia:
              imageCount +
              videoCount,
          },
        },
      },

      {
        status: 200,
      }
    );
  } catch (error) {
    /* ========================================================
       ERROR HANDLING
    ======================================================== */

    console.error(
      "GET /api/user/gallery ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to load gallery.",
      },
      {
        status: 500,
      }
    );
  }
}