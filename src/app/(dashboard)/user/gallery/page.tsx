"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Search, Image as ImageIcon, Video, FileText,
  MapPin, Calendar, Heart, Play, ArrowRight, X,
  ArrowLeft, Users, Target, Sparkles, Maximize2,
  AlertCircle, RefreshCw
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// TYPES
// ============================================================================

type ContentType =
  | "Story"
  | "Photo"
  | "Video"
  | "Impact";

interface GalleryMedia {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  mediaType: "IMAGE" | "VIDEO";
  sortOrder: number;
  createdAt?: string;
}

interface GalleryRecord {
  id: string;

  type: ContentType;

  category: string;

  isFeatured?: boolean;

  isPublished?: boolean;

  title: string;

  date: string;

  location: string;

  shortDesc: string;

  fullDesc?: string;

  coverImage: string | null;

  thumbnailUrl?: string | null;

  images: string[];

  videos: string[];

  media: GalleryMedia[];

  mediaCount: number;

  eventId?: string | null;

  campaignId?: string | null;

  event?: any | null;

  campaign?: any | null;

  createdAt: string;

  updatedAt: string;
}

interface GalleryStatistics {
  totalPosts: number;
  featuredPosts: number;
  totalPhotos: number;
  totalVideos: number;
  totalMedia: number;
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function UserGalleryPage() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"LOADING" | "ERROR" | "SUCCESS">("LOADING");
  const [content, setContent] = useState<GalleryRecord[]>([]);
  const [statistics, setStatistics] = useState<GalleryStatistics | null>(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  // Modals State
  const [viewingStory, setViewingStory] = useState<GalleryRecord | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<GalleryRecord | null>(null);
  const [viewingVideo, setViewingVideo] = useState<GalleryRecord | null>(null);

  // Fetch published gallery content from the real backend
  const fetchGalleryData = async () => {
    try {
      setStatus("LOADING");

      const response = await fetch(
        "/api/user/gallery",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
          result?.error ||
          "Failed to load gallery."
        );
      }

      const gallery =
        Array.isArray(result?.data?.gallery)
          ? result.data.gallery
          : [];

      setContent(gallery);

      setStatistics(
        result?.data?.statistics || null
      );

      setVisibleCount(6);

      setStatus("SUCCESS");
    } catch (error) {
      console.error(
        "User gallery error:",
        error
      );

      setContent([]);

      setStatistics(null);

      setStatus("ERROR");
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchGalleryData();
  }, []);

  // Filtering Logic
  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      item.title
        .toLowerCase()
        .includes(normalizedSearch) ||
      item.shortDesc
        .toLowerCase()
        .includes(normalizedSearch) ||
      item.location
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesSearch;
  });

  const displayedContent = filteredContent.slice(0, visibleCount);
  const hasMore = visibleCount < filteredContent.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  // Animations
  const containerVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  // ============================================================================
  // CONDITIONAL RENDER: LOADING STATE
  // ============================================================================
  if (status === "LOADING") {
    return (
      <div className="relative flex flex-col gap-10 min-h-screen pb-24 overflow-x-hidden w-full bg-[#fafafa] p-4 md:p-8">
        <div className="max-w-4xl space-y-4">
          <div className="w-48 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="w-3/4 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex gap-4 mt-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>)}
        </div>
        <div className="w-full h-80 bg-gray-200 rounded-[2.5rem] mt-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-full h-64 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
              <div className="h-32 bg-gray-200 animate-pulse w-full"></div>
              <div className="p-4 space-y-3 flex-1">
                <div className="w-1/3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-full h-5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded-full animate-pulse mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // CONDITIONAL RENDER: ERROR STATE
  // ============================================================================
  if (status === "ERROR") {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[70vh] w-full bg-[#fafafa] p-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Unable to load stories</h2>
        <p className="text-[14px] font-bold text-gray-500 mb-8 max-w-sm text-center">Something went wrong while loading our latest updates. Please try again.</p>
        <button onClick={fetchGalleryData} className="px-8 py-3.5 bg-white border border-gray-300 text-gray-900 rounded-full text-[13px] font-extrabold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER (SUCCESS)
  // ============================================================================

  // Editorial Content Grouping
  const isEditorialMode = searchQuery === "";
  const featuredStory =
    content.find(
      (item) => item.isFeatured
    ) || content.find(
      (item) => item.type === "Story"
    );
  const editorialLatest = content.filter(i => i.type === "Story" && !i.isFeatured).slice(0, 3);
  const editorialImpact = content.filter(i => i.type === "Impact").slice(0, 2);
  const editorialPhotos = content.filter(i => i.type === "Photo").slice(0, 3);
  const editorialVideos = content.filter(i => i.type === "Video").slice(0, 3);

  return (
    <div className="relative flex flex-col gap-10 min-h-screen pb-24 overflow-x-hidden w-full bg-[#fafafa]">

      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] left-[-5%] w-[350px] h-[350px] bg-green-300/10 rounded-full blur-[100px]" />

        <div className="absolute top-[5%] right-[5%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] opacity-20 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 50 150 C 50 50, 150 50, 200 150" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-20">
            <Sparkles className="w-8 h-8 text-green-500 opacity-60 drop-shadow-md" />
          </motion.div>
        </div>
      </div>

      {/* --- 1. HERO SECTION --- */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 px-4 md:px-8 mt-6 mb-4 max-w-4xl">
        <motion.p variants={itemVariants} className="text-[12px] font-extrabold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Our Stories & Impact
        </motion.p>
        <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Stories That Create Change
        </motion.h1>
        <motion.p variants={itemVariants} className="text-[14px] md:text-[16px] font-medium text-gray-600 leading-relaxed max-w-2xl">
          See the people, activities, and moments behind our mission. Every story represents a step toward building a better community together.
        </motion.p>
      </motion.div>

      {/* --- 3. DYNAMIC CONTENT RENDERING --- */}

      {/* EMPTY STATE */}
      {filteredContent.length === 0 ? (
        <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Sparkles className="w-8 h-8 text-blue-500 opacity-80" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Stories are coming soon</h3>
          <p className="text-[14px] font-bold text-gray-500 max-w-sm text-center">We're preparing new updates from our community work. Check back soon!</p>
          {searchQuery !== "" && (
            <button onClick={() => setSearchQuery("")} className="mt-6 px-6 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-full text-[12px] font-extrabold shadow-sm hover:bg-gray-50 transition-colors">
              Clear Search
            </button>
          )}
        </div>
      ) :

        /* EDITORIAL LAYOUT (If 'All' is active and no search) */
        isEditorialMode ? (
          <div className="flex flex-col gap-16 pb-12">

            {/* FEATURED STORY */}
            {featuredStory && (
              <div className="relative z-10 px-4 md:px-8">
                <section className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:shadow-md transition-shadow">
                  <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-gray-100 relative flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-200 overflow-hidden">
                    {featuredStory.coverImage ? (
                      <img src={featuredStory.coverImage} alt={featuredStory.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <ImageIcon className="w-20 h-20 text-blue-300 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white text-gray-900 rounded-lg text-[10px] font-extrabold uppercase tracking-widest shadow-sm border border-gray-200">
                      Featured Story
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{featuredStory.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-[12px] font-bold text-gray-500 mb-6 bg-gray-50 w-fit px-4 py-2.5 rounded-xl border border-gray-100">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-500" /> {featuredStory.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-500" /> {featuredStory.location}</span>
                    </div>

                    <p className="text-[15px] font-medium text-gray-600 leading-relaxed mb-8">
                      {featuredStory.shortDesc}
                    </p>

                    <button onClick={() => setViewingStory(featuredStory)} className="w-fit px-8 py-4 bg-white text-gray-900 border border-gray-300 rounded-full text-[13px] font-extrabold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                      Read Full Story <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </section>
              </div>
            )}
     {/* LATEST STORIES */}
            {editorialLatest.length > 0 && (
              <div className="relative z-10 px-4 md:px-8">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-500" /> Latest Stories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {editorialLatest.map(story => (
                    <div key={story.id} className="bg-white rounded-[2rem] border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="h-48 w-full bg-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden relative">
                        {story.coverImage ? (
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(
                                "Story cover failed:",
                                story.coverImage
                              );

                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-[11px] font-bold text-gray-500 mb-2">{story.date}</p>
                        <h4 className="text-[18px] font-extrabold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">{story.title}</h4>
                        <p className="text-[13px] font-medium text-gray-600 line-clamp-2 mb-6">{story.shortDesc}</p>
                        <button onClick={() => setViewingStory(story)} className="mt-auto w-fit text-[12px] font-extrabold text-gray-900 bg-white border border-gray-300 shadow-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                          Read Story <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IMPACT STORIES */}
            {editorialImpact.length > 0 && (
              <div className="relative z-10 px-4 md:px-8">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                      <Target className="w-6 h-6 text-orange-500" /> Impact Stories
                    </h3>
                    <p className="text-[13px] font-bold text-gray-500 mt-1">Here is what happened because people supported us.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {editorialImpact.map((impact) => (
                    <div
                      key={impact.id}
                      className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                    >
                      {/* COVER IMAGE */}
                      <div className="h-56 w-full bg-gray-100 overflow-hidden relative border-b border-gray-100">
                        {impact.coverImage ? (
                          <img
                            src={impact.coverImage}
                            alt={impact.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              console.error(
                                "Impact cover image failed:",
                                impact.coverImage
                              );

                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-6">
                          <p className="text-[10px] font-extrabold text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                            {impact.category}
                          </p>

                          <p className="text-[12px] font-bold text-gray-500">
                            {impact.date}
                          </p>
                        </div>

                        <h4 className="text-2xl font-extrabold text-gray-900 mb-6">
                          {impact.title}
                        </h4>

                        <p className="text-[14px] font-medium text-gray-600 leading-relaxed mb-8">
                          {impact.shortDesc}
                        </p>

                        <button
                          onClick={() => setViewingStory(impact)}
                          className="mt-auto w-fit text-[12px] font-extrabold text-orange-700 bg-white border border-orange-200 shadow-sm px-6 py-3 rounded-full flex items-center gap-1.5 hover:bg-orange-50 transition-colors"
                        >
                          Read Full Report
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

       
            {/* PHOTO HIGHLIGHTS */}
            {editorialPhotos.length > 0 && (
              <div id="photo-highlights" className="relative z-10 px-4 md:px-8">
                <div className="flex items-end justify-between mb-6">
                  <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-green-500" /> Photo Highlights
                  </h3>
                  <button
                    onClick={() => {
                      document
                        .getElementById("photo-highlights")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                    className="text-[12px] font-extrabold text-gray-900 flex items-center gap-1 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-full bg-white shadow-sm transition-colors"
                  >
                    View All Photos <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {editorialPhotos.map(photo => (
                    <button key={photo.id} onClick={() => setViewingPhoto(photo)} className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-100 border border-gray-200 group text-left">
                      {photo.coverImage ? (
                        <img
                          src={photo.coverImage}
                          alt={photo.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-sm border border-gray-200">
                        <Maximize2 size={16} />
                      </div>
                      <div className="absolute bottom-5 left-5 right-5">
                        <h4 className="text-[15px] font-extrabold text-white leading-tight mb-1">{photo.title}</h4>
                        <p className="text-[11px] font-bold text-gray-300">{photo.date}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* VIDEO STORIES */}
            {editorialVideos.length > 0 && (
              <div className="relative z-10 px-4 md:px-8">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <Video className="w-6 h-6 text-purple-500" /> Stories in Motion
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editorialVideos.map(video => (
                    <button key={video.id} onClick={() => setViewingVideo(video)} className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm p-4 flex flex-col group text-left hover:shadow-md transition-shadow">
                      <div className="relative aspect-video rounded-[2rem] bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-100">
                        {video.videos.length > 0 ? (
                          <video
                            src={video.videos[0]}
                            poster={video.thumbnailUrl || video.coverImage || undefined}
                            muted
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : video.coverImage ? (
                          <img
                            src={video.coverImage}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <Video
                            className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/30 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-lg group-hover:scale-110 transition-transform border border-gray-200">
                            <Play size={20} fill="currentColor" className="ml-1" />
                          </div>
                        </div>
                        {video.mediaCount > 1 && (
                          <div className="absolute bottom-4 right-4 bg-white text-gray-900 text-[10px] font-extrabold px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                            {video.mediaCount} videos
                          </div>
                        )}
                      </div>
                      <div className="p-4 pt-6">
                        <h4 className="text-[18px] font-extrabold text-gray-900 mb-2">{video.title}</h4>
                        <p className="text-[13px] font-medium text-gray-500">{video.shortDesc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (

          /* GRID / FILTERED LAYOUT */
          <div className="relative z-10 px-4 md:px-8 flex flex-col gap-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {displayedContent.map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                    {item.type === "Photo" ? (
                      <button onClick={() => setViewingPhoto(item)} className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden bg-gray-100 border border-gray-200 group text-left shadow-sm hover:shadow-md transition-shadow">
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/10 to-transparent opacity-80" />
                        <div className="absolute bottom-5 left-5 right-5">
                          <h4 className="text-[15px] font-extrabold text-white leading-tight mb-1">{item.title}</h4>
                          <p className="text-[11px] font-bold text-gray-300">{item.date}</p>
                        </div>
                      </button>
                    ) : item.type === "Video" ? (
                      <button onClick={() => setViewingVideo(item)} className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm p-4 flex flex-col group text-left w-full h-full hover:shadow-md transition-shadow">
                        <div className="relative aspect-video rounded-[2rem] bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-100">
                          {item.videos.length > 0 ? (
                            <video
                              src={item.videos[0]}
                              poster={
                                item.thumbnailUrl ||
                                item.coverImage ||
                                undefined
                              }
                              muted
                              playsInline
                              preload="metadata"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <Video className="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform" />
                          )}
                          <div className="absolute inset-0 bg-gray-900/20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-purple-600 shadow-lg">
                              <Play size={18} fill="currentColor" className="ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 pt-5 flex-1 flex flex-col">
                          <h4 className="text-[16px] font-extrabold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-[13px] font-medium text-gray-500 line-clamp-2">{item.shortDesc}</p>
                        </div>
                      </button>
                    ) : (
                      // Stories & Impact Cards
                      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full group hover:shadow-md transition-shadow">
                        <div className="h-48 w-full bg-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden relative">
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <ImageIcon className="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform duration-700" />
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-3 px-2.5 py-1 rounded-md w-fit border ${item.type === 'Impact' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>{item.type}</p>
                          <h4 className="text-[18px] font-extrabold text-gray-900 mb-3 leading-tight">{item.title}</h4>
                          <p className="text-[13px] font-medium text-gray-600 line-clamp-3 mb-6">{item.shortDesc}</p>
                          <button onClick={() => setViewingStory(item)} className="mt-auto w-fit text-[12px] font-extrabold text-gray-900 bg-white border border-gray-300 shadow-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                            Read {item.type} <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* PAGINATION / LOAD MORE */}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button onClick={loadMore} className="px-8 py-3.5 bg-white text-gray-900 border border-gray-300 rounded-full text-[13px] font-extrabold shadow-sm hover:bg-gray-50 transition-colors">
                  Load More Content
                </button>
              </div>
            )}
          </div>
        )}

      {/* ==================================================== */}
      {/* --- COMPACT & CENTERED STORY DETAIL MODAL --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {viewingStory && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 9999999 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingStory(null)} className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-2xl bg-white shadow-2xl flex flex-col rounded-[2rem] overflow-hidden max-h-[85vh] border border-gray-200"
              >
                {/* Fixed Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {viewingStory.category}
                    </span>
                    <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                      {viewingStory.type}
                    </span>
                  </div>
                  <button onClick={() => setViewingStory(null)} className="p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition-colors shadow-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar p-6 space-y-6 bg-white">

                  {/* Hero Cover Banner */}
                  <div className="w-full h-48 bg-gray-100 rounded-2xl relative flex items-center justify-center overflow-hidden border border-gray-200">
                    {viewingStory.coverImage ? (
                      <img
                        src={viewingStory.coverImage}
                        alt={viewingStory.title}
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.error(
                            "MODAL COVER FAILED:",
                            viewingStory.coverImage
                          );
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-blue-300 opacity-60" />
                      </div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-3">
                      {viewingStory.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 w-fit">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {viewingStory.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {viewingStory.location}</span>
                    </div>
                  </div>

                  {/* Full Story Description */}
                  <div className="space-y-2">
                    <h4 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wider">Our Story</h4>
                    <p className="text-[14px] font-medium text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/60 p-4 rounded-xl border border-gray-200">
                      {viewingStory.fullDesc || viewingStory.shortDesc}
                    </p>
                  </div>

                  {/* Story Media */}
                  {viewingStory.media && viewingStory.media.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wider mb-3">
                        Gallery
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {viewingStory.media
                          ?.slice()
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((media, index) => {

                            {/* VIDEO */ }
                            if (media.mediaType === "VIDEO") {
                              return (
                                <div
                                  key={`${viewingStory.id}-video-${media.id}`}
                                  className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 col-span-2 md:col-span-3"
                                >
                                  <video
                                    src={media.mediaUrl}
                                    poster={
                                      media.thumbnailUrl ||
                                      viewingStory.thumbnailUrl ||
                                      viewingStory.coverImage ||
                                      undefined
                                    }
                                    controls
                                    playsInline
                                    preload="metadata"
                                  />
                                </div>
                              );
                            }

                            {/* IMAGE */ }
                            return (
                              <div
                                key={`${viewingStory.id}-image-${media.id}`}
                                className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                              >
                                <img
                                  src={media.mediaUrl}
                                  alt={`${viewingStory.title} image`}
                                  className="w-full h-full object-cover"
                                  onError={() => {
                                    console.error(
                                      "GALLERY IMAGE FAILED:",
                                      media.mediaUrl
                                    );
                                  }}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Related Event */}
                  {viewingStory.event && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                        Related Event
                      </p>

                      <p className="text-[14px] font-extrabold text-gray-900">
                        {viewingStory.event.title}
                      </p>
                    </div>
                  )}

                  {/* Related Campaign */}
                  {viewingStory.campaign && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                        Related Campaign
                      </p>

                      <p className="text-[14px] font-extrabold text-gray-900">
                        {viewingStory.campaign.title}
                      </p>
                    </div>
                  )}

                </div>

                {/* Fixed Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white shrink-0 flex justify-end">
                  <button onClick={() => setViewingStory(null)} className="px-6 py-2.5 rounded-full font-bold text-[12px] text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                    Close Story
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ==================================================== */}
      {/* --- PHOTO LIGHTBOX MODAL --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {viewingPhoto && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-10" style={{ zIndex: 9999999 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingPhoto(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

              <button onClick={() => setViewingPhoto(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20 backdrop-blur-md border border-white/20 shadow-sm">
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="relative z-10 w-full max-w-4xl flex flex-col items-center"
              >
                <div className="w-full aspect-[4/3] max-h-[70vh] bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-800 overflow-hidden">
                  {viewingPhoto.coverImage ? (
                    <img
                      src={viewingPhoto.coverImage}
                      alt={viewingPhoto.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-gray-700" />
                  )}
                </div>

                <div className="w-full mt-4 bg-gray-900/60 backdrop-blur-md p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
                  <h3 className="text-[16px] font-extrabold text-white">{viewingPhoto.title}</h3>
                  <p className="text-[12px] font-medium text-gray-400">{viewingPhoto.location} • {viewingPhoto.date}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ==================================================== */}
      {/* --- VIDEO PLAYER MODAL --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {viewingVideo && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-10" style={{ zIndex: 9999999 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingVideo(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

              <button onClick={() => setViewingVideo(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20 backdrop-blur-md border border-white/20 shadow-sm">
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="relative z-10 w-full max-w-4xl flex flex-col"
              >
                <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-800 overflow-hidden relative">
                  {viewingVideo.videos.length > 0 ? (
                    <video
                      src={viewingVideo.videos[0]}
                      poster={
                        viewingVideo.thumbnailUrl ||
                        viewingVideo.coverImage ||
                        undefined
                      }
                      controls
                      autoPlay
                      playsInline
                      className="w-full max-h-[75vh] object-contain rounded-2xl"
                    />
                  ) : (
                    <Video className="w-16 h-16 text-gray-700" />
                  )}
                </div>

                <div className="w-full mt-4 bg-gray-900/60 backdrop-blur-md p-4 rounded-xl border border-gray-800 shadow-sm">
                  <h3 className="text-[16px] font-extrabold text-white mb-1">{viewingVideo.title}</h3>
                  <p className="text-[13px] font-medium text-gray-400">{viewingVideo.shortDesc}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}