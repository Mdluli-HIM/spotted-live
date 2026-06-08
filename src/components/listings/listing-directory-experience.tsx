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
      "Explore markets, student nights, live shows, pop-ups and weekend events listed by local places and owners.",
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
    <main className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-[#f8f8f8] text-black">
      <section className="mx-auto w-full max-w-[1180px] overflow-x-hidden px-4 pb-[calc(env(safe-area-inset-bottom)+150px)] pt-7 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        <header className="flex w-full min-w-0 items-center justify-between gap-4">
          <BrandWordmark />

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)] sm:inline-flex"
            >
              Discover
            </Link>

            <Link
              href="/for-owners"
              className="rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white sm:px-6"
            >
              For owners
            </Link>
          </div>
        </header>

        <section className="pt-12 sm:pt-14 lg:pt-16">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-black/55 shadow-[0_18px_44px_rgba(0,0,0,0.05)]"
          >
            <ArrowLeft size={16} />
            Back home
          </Link>

          <div className="grid w-full min-w-0 gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div className="w-full min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/28">
                {copy.eyebrow}
              </p>

              <h1 className="mt-6 max-w-full text-[clamp(54px,15vw,78px)] font-medium leading-[0.88] tracking-[-0.09em] text-black sm:text-[78px] lg:max-w-[760px] lg:text-[96px]">
                {copy.title}
              </h1>

              <p className="mt-7 max-w-[560px] text-[15px] leading-relaxed text-black/48 sm:text-[16px]">
                {copy.description}
              </p>
            </div>

            <SearchPanel
              searchQuery={searchQuery}
              activeArea={activeArea}
              areaOptions={areaOptions}
              onSearchChange={setSearchQuery}
              onAreaChange={setActiveArea}
            />
          </div>
        </section>

        <section className="mt-12 w-full min-w-0">
          <div className="mb-5 flex min-w-0 items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/25">
                Results
              </p>

              <h2 className="mt-2 text-[clamp(38px,10vw,56px)] font-semibold leading-[0.88] tracking-[-0.08em] text-black lg:text-[56px]">
                {visibleListings.length}{" "}
                {visibleListings.length === 1 ? "listing" : "listings"} found
              </h2>
            </div>
          </div>

          {visibleListings.length > 0 ? (
            <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

function SearchPanel({
  searchQuery,
  activeArea,
  areaOptions,
  onSearchChange,
  onAreaChange,
}: {
  searchQuery: string;
  activeArea: string;
  areaOptions: string[];
  onSearchChange: (query: string) => void;
  onAreaChange: (area: string) => void;
}) {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-[34px] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.055)] sm:p-5">
      <div className="flex w-full min-w-0 items-center gap-3 rounded-full bg-[#f4f4f2] px-4 py-4">
        <Search size={20} className="shrink-0 text-black/55" />

        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by place, area, mood..."
          className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-black outline-none placeholder:text-black/30"
        />

        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1d1e20] text-white">
          <SlidersHorizontal size={14} />
        </span>
      </div>

      <div className="no-scrollbar mt-4 flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1">
        {areaOptions.map((area) => {
          const active = activeArea === area;

          return (
            <button
              key={area}
              type="button"
              onClick={() => onAreaChange(area)}
              className={`shrink-0 rounded-full px-5 py-3 text-[13px] font-semibold transition-colors ${
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
    <article className="w-full min-w-0 overflow-hidden rounded-[34px] bg-white shadow-[0_18px_44px_rgba(0,0,0,0.05)]">
      <div className="relative h-[340px] overflow-hidden sm:h-[360px]">
        <Link href={`/listings/${listing.slug}`} className="group block h-full">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 380px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-black">
            {listing.area}
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="text-[11px] font-medium text-white/70">
              {listing.category} · {listing.startsAt ?? "Open today"}
            </p>

            <h3 className="mt-2 max-w-[300px] text-[34px] font-semibold leading-[0.9] tracking-[-0.075em]">
              {listing.title}
            </h3>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3 text-[12px] font-semibold text-white/80">
                <span className="flex items-center gap-1">
                  <Star size={13} fill="currentColor" />
                  {listing.rating.toFixed(1)}
                </span>

                <span className="truncate">Spot: {listing.area}</span>
              </div>

              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-black">
                <ArrowRight size={18} />
              </span>
            </div>
          </div>
        </Link>

        <button
          type="button"
          aria-label={saved ? "Remove saved listing" : "Save listing"}
          onClick={onToggleSaved}
          className={`absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full transition-colors ${
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
  const title =
    mode === "saved"
      ? "No saved listings yet."
      : mode === "events"
        ? "No events found."
        : "No places found.";

  const description =
    mode === "saved"
      ? "Tap the heart on places and events you want to revisit later."
      : "Try another area or search term to discover more spots.";

  return (
    <div className="w-full rounded-[36px] bg-white px-6 py-16 text-center shadow-[0_18px_44px_rgba(0,0,0,0.04)] sm:px-10 sm:py-20">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#f4f4f2]">
        <Heart size={30} />
      </div>

      <h3 className="mx-auto mt-8 max-w-[520px] text-[clamp(42px,11vw,64px)] font-semibold leading-[0.88] tracking-[-0.085em] text-black">
        {title}
      </h3>

      <p className="mx-auto mt-5 max-w-[420px] text-[14px] leading-relaxed text-black/45">
        {description}
      </p>

      {mode === "saved" && (
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1d1e20] px-6 py-4 text-[13px] font-semibold text-white"
        >
          Discover spots
        </Link>
      )}
    </div>
  );
}
