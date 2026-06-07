"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Search,
  SlidersHorizontal,
  Star,
  Store,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { listings } from "@/data/listings";
import { useLocalOwnerListings } from "@/hooks/use-local-owner-listings";
import { useSavedListings } from "@/hooks/use-saved-listings";
import type { Listing } from "@/types/listing";

type DirectoryMode = "places" | "events" | "saved";

type ListingDirectoryExperienceProps = {
  mode: DirectoryMode;
};

const pageCopy = {
  places: {
    eyebrow: "Places",
    title: "Find restaurants, cafés and local spots.",
    description:
      "Browse places listed around your area, from food spots and cafés to venues, study corners and hidden gems.",
  },
  events: {
    eyebrow: "Events",
    title: "Find what is happening around you.",
    description:
      "Explore markets, student nights, live shows, pop-ups and weekend events listed by local hosts.",
  },
  saved: {
    eyebrow: "Saved",
    title: "Your saved plans live here.",
    description:
      "Everything you save across SPOTTED appears here so you can come back to it before you go.",
  },
};

export function ListingDirectoryExperience({
  mode,
}: ListingDirectoryExperienceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArea, setActiveArea] = useState("All");

  const { approvedListings } = useLocalOwnerListings();
  const { savedListingIds, toggleSavedListing, isListingSaved } =
    useSavedListings();

  const allListings = useMemo(
    () => [...approvedListings, ...listings],
    [approvedListings],
  );

  const areaOptions = useMemo(() => {
    const areas = allListings.map((listing) => listing.area);
    return ["All", ...Array.from(new Set(areas))];
  }, [allListings]);

  const visibleListings = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return allListings.filter((listing) => {
      const matchesMode =
        mode === "events"
          ? listing.type === "event"
          : mode === "places"
            ? listing.type === "place"
            : savedListingIds.includes(listing.id);

      const matchesArea = activeArea === "All" || listing.area === activeArea;

      const matchesSearch =
        !cleanQuery ||
        [
          listing.title,
          listing.area,
          listing.location,
          listing.description,
          listing.category,
          ...listing.moods,
        ]
          .join(" ")
          .toLowerCase()
          .includes(cleanQuery);

      return matchesMode && matchesArea && matchesSearch;
    });
  }, [activeArea, allListings, mode, savedListingIds, searchQuery]);

  const copy = pageCopy[mode];

  return (
    <main className="min-h-dvh w-full overflow-hidden bg-[#f8f8f8]">
      <section className="min-h-dvh px-5 py-6 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between">
          <BrandWordmark />

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)] sm:inline-flex"
            >
              Discover
            </Link>

            <Link
              href="/for-owners"
              className="rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
            >
              For owners
            </Link>
          </div>
        </header>

        <section className="pt-10 lg:pt-14">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-black/55 shadow-[0_14px_34px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                {copy.eyebrow}
              </p>

              <h1 className="mt-5 max-w-[760px] text-[58px] font-medium leading-[0.84] tracking-[-0.09em] text-black sm:text-[78px] lg:text-[96px]">
                {copy.title}
              </h1>

              <p className="mt-7 max-w-[520px] text-[15px] leading-relaxed text-black/48">
                {copy.description}
              </p>
            </div>

            <div className="rounded-[34px] bg-white p-4 shadow-[0_18px_44px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3 rounded-full bg-[#f4f4f2] px-4 py-3">
                <Search size={18} className="text-black/60" />

                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by place, area, mood..."
                  className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-black outline-none placeholder:text-black/30"
                />

                <span className="flex size-9 items-center justify-center rounded-full bg-[#1d1e20] text-white">
                  <SlidersHorizontal size={14} />
                </span>
              </div>

              <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
                {areaOptions.map((area) => {
                  const active = activeArea === area;

                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setActiveArea(area)}
                      className={`shrink-0 rounded-full px-4 py-2.5 text-[11px] font-semibold transition-colors ${
                        active
                          ? "bg-[#1d1e20] text-white"
                          : "bg-[#f4f4f2] text-black/45"
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
                Results
              </p>

              <h2 className="mt-2 text-[34px] font-semibold leading-[0.9] tracking-[-0.075em] text-black">
                {visibleListings.length} listings found
              </h2>
            </div>
          </div>

          {visibleListings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleListings.map((listing) => (
                <DirectoryListingCard
                  key={listing.id}
                  listing={listing}
                  saved={isListingSaved(listing.id)}
                  onToggleSaved={() => toggleSavedListing(listing.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyDirectoryState mode={mode} />
          )}
        </section>
      </section>
    </main>
  );
}

function DirectoryListingCard({
  listing,
  saved,
  onToggleSaved,
}: {
  listing: Listing;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_44px_rgba(0,0,0,0.05)]">
      <div className="relative h-[360px] overflow-hidden">
        <Link href={`/listings/${listing.slug}`} className="group block h-full">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-black">
            {listing.area}
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="text-[11px] font-medium text-white/70">
              {listing.category} · {listing.priceLabel}
            </p>

            <h3 className="mt-2 max-w-[300px] text-[34px] font-semibold leading-[0.9] tracking-[-0.075em]">
              {listing.title}
            </h3>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[12px] font-semibold text-white/80">
                <span className="flex items-center gap-1">
                  <Star size={13} fill="currentColor" />
                  {listing.rating.toFixed(1)}
                </span>

                <span>{listing.saves} saves</span>
              </div>

              <span className="flex siz-12 items-center justify-center rounded-full bg-white text-black">
                <ArrowRight size={18} />
              </span>
            </div>
          </div>
        </Link>

        <button
          type="button"
          aria-label={saved ? "Remove saved listing" : "Save listing"}
          onClick={onToggleSaved}
          className={`absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full ${
            saved ? "bg-[#1d1e20] text-white" : "bg-white text-black"
          }`}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}

function EmptyDirectoryState({ mode }: { mode: DirectoryMode }) {
  const isSaved = mode === "saved";

  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-[36px] bg-white px-6 text-center shadow-[0_18px_44px_rgba(0,0,0,0.05)]">
      <div className="max-w-[460px]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f4f4f2]">
          {isSaved ? <Heart size={20} /> : <Store size={20} />}
        </span>

        <h3 className="mt-6 text-[44px] font-semibold leading-[0.88] tracking-[-0.08em] text-black">
          {isSaved ? "No saved listings yet." : "No matching listings found."}
        </h3>

        <p className="mt-4 text-[14px] leading-relaxed text-black/42">
          {isSaved
            ? "Save places and events from the discovery feed, then come back here to view them."
            : "Try another area or search term to discover more plans."}
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1d1e20] px-6 py-4 text-[13px] font-semibold text-white"
        >
          Discover listings
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
