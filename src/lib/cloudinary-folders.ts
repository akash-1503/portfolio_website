export const CLOUDINARY_FOLDERS = {
  gallery: {
    images: "ngo/gallery/images",
    videos: "ngo/gallery/videos",
  },

  events: {
    covers: "ngo/events/covers",
    images: "ngo/events/images",
    videos: "ngo/events/videos",
  },

  campaigns: {
    covers: "ngo/campaigns/covers",
    images: "ngo/campaigns/images",
    videos: "ngo/campaigns/videos",
  },

  programs: {
    covers: "ngo/programs/covers",
    images: "ngo/programs/images",
    videos: "ngo/programs/videos",
  },

  team: "ngo/team",

  profile: {
    avatar: "ngo/profile/avatar",
    logo: "ngo/profile/logo",
    banner: "ngo/profile/banner",
  },

  certificates: "ngo/certificates",
} as const;

export const ALLOWED_CLOUDINARY_FOLDERS = new Set([
  CLOUDINARY_FOLDERS.gallery.images,
  CLOUDINARY_FOLDERS.gallery.videos,

  CLOUDINARY_FOLDERS.events.covers,
  CLOUDINARY_FOLDERS.campaigns.covers,
  CLOUDINARY_FOLDERS.programs.covers,

  CLOUDINARY_FOLDERS.profile.logo,
  CLOUDINARY_FOLDERS.profile.banner,
]);