import { NextRequest, NextResponse } from "next/server";
import {
  GalleryCategory,
  GalleryType,
  Role,
} from "@prisma/client";

import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";

// ============================================================================
// TYPES
// ============================================================================

type AuthResult =
  | {
      success: true;
      user: {
        id: string;
        name: string | null;
        email: string;
        ngoId: string;
      };
    }
  | {
      success: false;
      error: string;
      status: number;
    };

// ============================================================================
// AUTHENTICATION
// ============================================================================

async function authenticateUser(): Promise<AuthResult> {
  try {
    const cookieStore = await (await import("next/headers")).cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required.",
        status: 401,
      };
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return {
        success: false,
        error: "Invalid or expired authentication token.",
        status: 401,
      };
    }

    if (payload.role !== Role.USER) {
      return {
        success: false,
        error: "Unauthorized. User access required.",
        status: 403,
      };
    }

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
      return {
        success: false,
        error: "User account not found.",
        status: 401,
      };
    }

    if (!user.ngoId) {
      return {
        success: false,
        error: "User is not associated with an NGO.",
        status: 400,
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        ngoId: user.ngoId,
      },
    };
  } catch (error) {
    console.error("User gallery authentication error:", error);

    return {
      success: false,
      error: "Authentication failed.",
      status: 401,
    };
  }
}

// ============================================================================
// CATEGORY HELPERS
// ============================================================================

function categoryToFrontend(category: GalleryCategory): string {
  return String(category)
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());
}

// ============================================================================
// TYPE HELPERS
// ============================================================================

/**
 * The database uses:
 *
 * Story  -> Event Story when eventId exists
 * Impact -> Campaign Story when campaignId exists
 *
 * The User Gallery UI currently understands:
 *
 * Story
 * Photo
 * Video
 * Impact
 *
 * We keep the API type within those four values.
 */
function typeToFrontend(
  type: GalleryType,
  eventId: string | null,
  campaignId: string | null
): "Story" | "Photo" | "Video" | "Impact" {
  if (type === GalleryType.Photo) {
    return "Photo";
  }

  if (type === GalleryType.Video) {
    return "Video";
  }

  if (type === GalleryType.Impact) {
    return "Impact";
  }

  return "Story";
}

// ============================================================================
// DATE FORMATTER
// ============================================================================

function formatDate(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// ============================================================================
// URL / MEDIA HELPERS
// ============================================================================

function getCoverImage(
  thumbnailUrl: string | null,
  media: Array<{
    mediaUrl: string;
    mediaType: "IMAGE" | "VIDEO";
  }>
): string | null {
  if (thumbnailUrl) {
    return thumbnailUrl;
  }

  const firstImage = media.find(
    (item) => item.mediaType === "IMAGE"
  );

  return firstImage?.mediaUrl ?? null;
}

// ============================================================================
// GET USER GALLERY
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    // ------------------------------------------------------------------------
    // 1. Authenticate user
    // ------------------------------------------------------------------------

    const auth = await authenticateUser();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          error: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    const user = auth.user;

    // ------------------------------------------------------------------------
    // 2. Read query parameters
    // ------------------------------------------------------------------------

    const { searchParams } = new URL(req.url);

    const categoryParam = searchParams.get("category");
    const typeParam = searchParams.get("type");
    const featuredParam = searchParams.get("featured");
    const searchParam = searchParams.get("search");

    // ------------------------------------------------------------------------
    // 3. Build WHERE condition
    // ------------------------------------------------------------------------

    const where: any = {
      ngoId: user.ngoId,

      // Deleted gallery posts must never be visible to users.
      isDeleted: false,

      // Users can only see published gallery posts.
      isPublished: true,
    };

    // ------------------------------------------------------------------------
    // 4. Category filter
    // ------------------------------------------------------------------------

    if (categoryParam && categoryParam !== "All") {
      const normalizedCategory =
        categoryParam.trim().toLowerCase();

      const categoryMap: Record<string, GalleryCategory> = {
        education: GalleryCategory.Education,
        environment: GalleryCategory.Environment,
        health: GalleryCategory.Health,
        emergency: GalleryCategory.Emergency,
      };

      const prismaCategory =
        categoryMap[normalizedCategory];

      if (prismaCategory) {
        where.category = prismaCategory;
      }
    }

    // ------------------------------------------------------------------------
    // 5. Type filter
    // ------------------------------------------------------------------------

    if (typeParam && typeParam !== "All") {
      switch (typeParam.trim().toLowerCase()) {
        case "photo":
        case "photos":
          where.type = GalleryType.Photo;
          break;

        case "video":
        case "videos":
          where.type = GalleryType.Video;
          break;

        case "story":
        case "stories":
        case "event story":
          where.type = GalleryType.Story;

          // Event Story specifically means Story connected to an event.
          if (
            typeParam.trim().toLowerCase() === "event story"
          ) {
            where.eventId = {
              not: null,
            };
          }

          break;

        case "impact":
        case "impact story":
        case "campaign story":
          where.type = GalleryType.Impact;

          // Campaign Story specifically means Impact connected
          // to a campaign.
          if (
            typeParam.trim().toLowerCase() === "campaign story"
          ) {
            where.campaignId = {
              not: null,
            };
          }

          break;
      }
    }

    // ------------------------------------------------------------------------
    // 6. Featured filter
    // ------------------------------------------------------------------------

    if (featuredParam === "true") {
      where.isFeatured = true;
    }

    // ------------------------------------------------------------------------
    // 7. Search
    // ------------------------------------------------------------------------

    if (searchParam?.trim()) {
      const search = searchParam.trim();

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

    // ------------------------------------------------------------------------
    // 8. Fetch published gallery posts
    // ------------------------------------------------------------------------

    const posts = await prisma.galleryPost.findMany({
      where,

      include: {
        event: true,
        campaign: true,

        media: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },

      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    // ------------------------------------------------------------------------
    // 9. Format gallery records for User Gallery page
    // ------------------------------------------------------------------------

    const gallery = posts.map((post) => {
      const frontendType = typeToFrontend(
        post.type,
        post.eventId,
        post.campaignId
      );

      // ----------------------------------------------------------------------
      // Media
      // ----------------------------------------------------------------------

      const images = post.media
        .filter((media) => media.mediaType === "IMAGE")
        .map((media) => media.mediaUrl);

      const videos = post.media
        .filter((media) => media.mediaType === "VIDEO")
        .map((media) => media.mediaUrl);

      // ----------------------------------------------------------------------
      // Cover image
      // ----------------------------------------------------------------------

      const coverImage = getCoverImage(
        post.thumbnailUrl,
        post.media
      );

      // ----------------------------------------------------------------------
      // Location
      // ----------------------------------------------------------------------

      let location = post.location ?? "";

      /*
       * Event has known venue/city fields in your project.
       *
       * If GalleryPost.location is empty, use Event location.
       */
      if (!location && post.event) {
        const eventLocation = [
          post.event.venue,
          post.event.city,
        ]
          .filter(Boolean)
          .join(", ");

        location = eventLocation;
      }

      // ----------------------------------------------------------------------
      // Related Event / Campaign
      // ----------------------------------------------------------------------

      let related:
        | {
            type: "Event" | "Campaign";
            name: string;
            link: string;
          }
        | undefined;

      /*
       * Event relationship
       *
       * We use the event name/title that exists on the Event record.
       *
       * The `as any` here is intentional because the exact Event naming
       * property can differ depending on your Prisma Event model.
       */
      if (post.eventId && post.event) {
        const eventRecord = post.event as any;

        const eventName =
          eventRecord.title ??
          eventRecord.name ??
          "Related Event";

        related = {
          type: "Event",
          name: eventName,
          link: "/user/eventcamp",
        };
      }

      /*
       * Campaign relationship
       *
       * If a campaign exists, use its available title/name.
       */
      if (post.campaignId && post.campaign) {
        const campaignRecord = post.campaign as any;

        const campaignName =
          campaignRecord.title ??
          campaignRecord.name ??
          "Related Campaign";

        related = {
          type: "Campaign",
          name: campaignName,
          link: "/user/eventcamp",
        };
      }

      // ----------------------------------------------------------------------
      // Description
      // ----------------------------------------------------------------------

      const fullDesc = post.description ?? "";

      /*
       * Your current UI uses both shortDesc and fullDesc.
       *
       * GalleryPost has one description field, so we expose the same
       * description as both values.
       *
       * The frontend already uses line-clamping where needed.
       */
      const shortDesc = fullDesc;

      // ----------------------------------------------------------------------
      // Return record
      // ----------------------------------------------------------------------

      return {
        id: post.id,

        type: frontendType,

        category: categoryToFrontend(post.category),

        isFeatured: post.isFeatured,

        title: post.title,

        date: formatDate(
          post.publishedAt ?? post.createdAt
        ),

        location,

        shortDesc,

        fullDesc,

        coverImage,

        images,

        /*
         * GalleryPost does not currently have a duration field.
         * Therefore we do not invent one.
         */
        duration: undefined,

        /*
         * GalleryPost does not currently have a stats field.
         * Therefore we do not invent impact statistics.
         */
        stats: undefined,

        related,

        // Useful extra information for future UI requirements.
        eventId: post.eventId,

        campaignId: post.campaignId,

        media: post.media.map((media) => ({
          id: media.id,
          mediaUrl: media.mediaUrl,
          thumbnailUrl: media.thumbnailUrl,
          mediaType: media.mediaType,
          sortOrder: media.sortOrder,
        })),

        videos,

        mediaCount: post.media.length,

        createdAt: post.createdAt.toISOString(),

        updatedAt: post.updatedAt.toISOString(),
      };
    });

    // ------------------------------------------------------------------------
    // 10. Statistics
    // ------------------------------------------------------------------------

    const totalPosts = gallery.length;

    const featuredPosts = gallery.filter(
      (item) => item.isFeatured
    ).length;

    const totalPhotos = gallery.reduce(
      (total, item) => total + item.images.length,
      0
    );

    const totalVideos = gallery.reduce(
      (total, item) => total + item.videos.length,
      0
    );

    // ------------------------------------------------------------------------
    // 11. Response
    // ------------------------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message: "Gallery loaded successfully.",

        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },

          gallery,

          statistics: {
            totalPosts,
            featuredPosts,
            totalPhotos,
            totalVideos,
            totalMedia: totalPhotos + totalVideos,
          },
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("User gallery GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server error while loading gallery.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================================
// UNSUPPORTED METHODS
// ============================================================================

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. User gallery is read-only.",
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
      },
    }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. User gallery is read-only.",
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
      },
    }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. User gallery is read-only.",
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
      },
    }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. User gallery is read-only.",
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
      },
    }
  );
}