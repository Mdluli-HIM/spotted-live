"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Grid2X2,
  Heart,
  Home,
  Menu,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { listings, locationFilters, moodFilters } from "@/data/listings";
import { useLocalOwnerListings } from "@/hooks/use-local-owner-listings";
import { useSavedListings } from "@/hooks/use-saved-listings";
import type { Listing } from "@/types/listing";

type AppTab = "discover" | "events" | "saved" | "owners";

export function HomeExperience() {
  const router = useRouter();

  const activeTab: AppTab = "discover";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeArea, setActiveArea] = useState("Braamfontein");
  const [activeMood, setActiveMood] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { approvedListings } = useLocalOwnerListings();
  const { savedListingIds: savedIds, toggleSavedListing } = useSavedListings();

  const publicListings = useMemo(
    () => [...approvedListings, ...listings],
    [approvedListings],
  );

  const filteredListings = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return publicListings.filter((listing) => {
      const matchesArea = listing.area === activeArea;

      const matchesMood =
        activeMood === "All" ||
        listing.moods.some(
          (mood) => mood.toLowerCase() === activeMood.toLowerCase(),
        );

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

      return matchesSearch && matchesArea && matchesMood;
    });
  }, [activeArea, activeMood, publicListings, searchQuery]);

  function toggleSaved(listingId: string) {
    toggleSavedListing(listingId);
  }

  function openListing(listing: Listing) {
    router.push(`/listings/${listing.slug}`);
  }

  return (
    <>
      <div className="lg:hidden">
        <AppSurface>
          <DiscoverScreen
            activeTab={activeTab}
            activeArea={activeArea}
            activeMood={activeMood}
            searchQuery={searchQuery}
            listings={filteredListings}
            savedIds={savedIds}
            onSearchChange={setSearchQuery}
            onAreaChange={setActiveArea}
            onMoodChange={setActiveMood}
            onSelectListing={openListing}
            onToggleSaved={toggleSaved}
            onOpenMenu={() => setMobileMenuOpen(true)}
          />
        </AppSurface>

        <BottomNavigation activeTab={activeTab} />

        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <DesktopHomeExperience
        activeTab={activeTab}
        activeArea={activeArea}
        activeMood={activeMood}
        searchQuery={searchQuery}
        listings={filteredListings}
        savedIds={savedIds}
        onSearchChange={setSearchQuery}
        onAreaChange={setActiveArea}
        onMoodChange={setActiveMood}
        onSelectListing={openListing}
        onToggleSaved={toggleSaved}
      />
    </>
  );
}

type AppSurfaceProps = {
  children: React.ReactNode;
};

function AppSurface({ children }: AppSurfaceProps) {
  return (
    <main className="min-h-dvh w-full bg-[#f8f8f8]">
      <section className="relative mx-auto min-h-dvh w-full overflow-hidden bg-[#f8f8f8]">
        {children}
      </section>
    </main>
  );
}

/* DESKTOP */

type DesktopHomeExperienceProps = {
  activeTab: AppTab;
  activeArea: string;
  activeMood: string;
  searchQuery: string;
  listings: Listing[];
  savedIds: string[];
  onSearchChange: (query: string) => void;
  onAreaChange: (area: string) => void;
  onMoodChange: (mood: string) => void;
  onSelectListing: (listing: Listing) => void;
  onToggleSaved: (listingId: string) => void;
};

function DesktopHomeExperience({
  activeTab,
  activeArea,
  activeMood,
  searchQuery,
  listings: visibleListings,
  savedIds,
  onSearchChange,
  onAreaChange,
  onMoodChange,
  onSelectListing,
  onToggleSaved,
}: DesktopHomeExperienceProps) {
  const featuredListing = visibleListings[0] ?? listings[0];
  const sideListings = visibleListings.slice(1, 4);

  return (
    <main className="hidden min-h-dvh w-full overflow-hidden bg-[#f8f8f8] lg:block">
      <section className="min-h-dvh w-full overflow-hidden bg-[#f8f8f8] px-8 py-6 xl:px-10">
        <header className="flex items-center justify-between">
          <BrandWordmark />

          <nav className="flex items-center rounded-full bg-white p-1 shadow-[0_14px_34px_rgba(0,0,0,0.05)]">
            {[
              { label: "Discover", value: "discover" as const, href: "/" },
              { label: "Events", value: "events" as const, href: "/events" },
              { label: "Saved", value: "saved" as const, href: "/saved" },
              {
                label: "For owners",
                value: "owners" as const,
                href: "/for-owners",
              },
            ].map((item) => (
              <Link
                key={item.value}
                href={item.href}
                className={`rounded-full px-5 py-3 text-[12px] font-semibold transition-colors ${
                  activeTab === item.value
                    ? "bg-[#1d1e20] text-white"
                    : "text-black/45 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/for-owners"
            className="rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
          >
            List your place
          </Link>
        </header>

        <div className="grid min-h-[calc(100dvh-120px)] grid-cols-[0.82fr_1.18fr] gap-8 pt-10 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                SPOTTED live
              </p>

              <h1 className="mt-5 max-w-[560px] text-[76px] font-medium leading-[0.86] tracking-[-0.09em] text-black xl:text-[92px]">
                Find places, events and things to do.
              </h1>

              <p className="mt-7 max-w-[430px] text-[15px] leading-relaxed text-black/45">
                Search a location and discover restaurants, cafés, events,
                markets, venues and experiences listed by local owners and
                hosts.
              </p>

              <div className="mt-9 flex max-w-[520px] items-center gap-3 rounded-full bg-white px-5 py-4 shadow-[0_18px_42px_rgba(0,0,0,0.06)]">
                <Search size={19} />

                <input
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search places, events, moods..."
                  className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-black outline-none placeholder:text-black/30"
                />

                <button
                  type="button"
                  className="flex size-11 items-center justify-center rounded-full bg-[#1d1e20] text-white"
                >
                  <SlidersHorizontal size={16} />
                </button>
              </div>

              <div className="mt-7">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
                  Popular areas
                </p>

                <div className="flex flex-wrap gap-2">
                  {locationFilters.map((area) => {
                    const active = activeArea === area;

                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => onAreaChange(area)}
                        className={`rounded-full px-5 py-3 text-[12px] font-semibold transition-colors ${
                          active
                            ? "bg-[#1d1e20] text-white"
                            : "bg-white text-black/45"
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
                  Mood
                </p>

                <div className="flex flex-wrap gap-2">
                  {moodFilters.map((mood) => {
                    const active = activeMood === mood;

                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => onMoodChange(mood)}
                        className={`rounded-full px-4 py-2.5 text-[11px] font-semibold transition-colors ${
                          active
                            ? "bg-[var(--accent)] text-black"
                            : "bg-white text-black/45"
                        }`}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <DesktopMetric label="Listings" value="120+" />
              <DesktopMetric label="Areas" value="8" />
              <DesktopMetric label="Hosts" value="35+" />
            </div>
          </aside>

          <section className="grid grid-cols-[1.1fr_0.9fr] gap-5">
            {featuredListing && (
              <DesktopFeatureCard
                listing={featuredListing}
                saved={savedIds.includes(featuredListing.id)}
                onOpen={() => onSelectListing(featuredListing)}
                onToggleSaved={() => onToggleSaved(featuredListing.id)}
              />
            )}

            <div className="flex flex-col gap-5">
              <div className="rounded-[34px] bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
                      Nearby
                    </p>

                    <h2 className="mt-1 text-[28px] font-semibold leading-none tracking-[-0.065em] text-black">
                      {visibleListings.length} plans found
                    </h2>
                  </div>

                  <Link
                    href="/places"
                    className="text-[12px] font-semibold text-black/35"
                  >
                    View all
                  </Link>
                </div>

                <div className="mt-5 space-y-3">
                  {sideListings.length > 0 ? (
                    sideListings.map((listing) => (
                      <DesktopSmallCard
                        key={listing.id}
                        listing={listing}
                        onOpen={() => onSelectListing(listing)}
                      />
                    ))
                  ) : (
                    <div className="rounded-[24px] bg-[#f4f4f2] p-6 text-center text-[13px] font-medium text-black/35">
                      No more listings found.
                    </div>
                  )}
                </div>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-[34px] bg-[#1d1e20] p-6 text-white">
                <div className="relative z-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    For owners
                  </p>

                  <h2 className="mt-4 max-w-[300px] text-[38px] font-semibold leading-[0.9] tracking-[-0.075em]">
                    Turn your venue into a discoverable plan.
                  </h2>

                  <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-white/45">
                    List a place, post events and let people nearby find what
                    you are hosting.
                  </p>

                  <Link
                    href="/for-owners"
                    className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black"
                  >
                    Start listing
                  </Link>
                </div>

                <div className="absolute -bottom-16 -right-16 size-56 rounded-full bg-white/10" />
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function DesktopMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[26px] bg-white p-5">
      <p className="text-[30px] font-semibold leading-none tracking-[-0.06em] text-black">
        {value}
      </p>

      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/28">
        {label}
      </p>
    </div>
  );
}

type ListingCardProps = {
  listing: Listing;
  saved: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
};

function DesktopFeatureCard({
  listing,
  saved,
  onOpen,
  onToggleSaved,
}: ListingCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[38px] bg-black shadow-[0_25px_70px_rgba(0,0,0,0.18)]">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onOpen();
          }
        }}
        className="relative block h-full min-h-[620px] w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          priority
          sizes="650px"
          className="object-cover transition-transform duration-700 hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-transparent" />

        <div className="absolute left-6 top-6 rounded-full bg-white px-4 py-2.5 text-[11px] font-semibold text-black">
          Featured in {listing.area}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleSaved();
          }}
          className={`absolute right-6 top-6 z-20 flex size-12 items-center justify-center rounded-full ${
            saved ? "bg-[#1d1e20] text-white" : "bg-white text-black"
          }`}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-7 left-7 right-7 text-white">
          <p className="text-[13px] font-medium text-white/65">
            {listing.category} · {listing.priceLabel}
          </p>

          <h2 className="mt-2 max-w-[520px] text-[64px] font-semibold leading-[0.86] tracking-[-0.085em]">
            {listing.title}
          </h2>

          <p className="mt-5 max-w-[430px] text-[14px] leading-relaxed text-white/62">
            {listing.description}
          </p>

          <div className="mt-7 flex items-center justify-between">
            <div className="flex items-center gap-5 text-[13px] font-semibold text-white/80">
              <span className="flex items-center gap-1">
                <Star size={14} fill="currentColor" />
                {listing.rating.toFixed(1)}
              </span>

              <span>{listing.saves} saves</span>

              <span>{listing.shares} shares</span>
            </div>

            <span className="flex size-14 items-center justify-center rounded-full bg-white text-black">
              <ArrowRight size={20} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function DesktopSmallCard({
  listing,
  onOpen,
}: {
  listing: Listing;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-[24px] bg-[#f4f4f2] p-3 text-left transition-transform hover:scale-[1.01]"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-[18px]">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold tracking-[-0.035em] text-black">
          {listing.title}
        </p>

        <p className="mt-1 text-[11px] font-medium text-black/35">
          {listing.area} · {listing.priceLabel}
        </p>

        <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-black/55">
          <Star size={12} fill="currentColor" />
          {listing.rating.toFixed(1)}
        </p>
      </div>

      <span className="flex size-10 items-center justify-center rounded-full bg-white text-black">
        <ArrowRight size={15} />
      </span>
    </button>
  );
}

/* MOBILE */

type DiscoverScreenProps = {
  activeTab: AppTab;
  activeArea: string;
  activeMood: string;
  searchQuery: string;
  listings: Listing[];
  savedIds: string[];
  onSearchChange: (query: string) => void;
  onAreaChange: (area: string) => void;
  onMoodChange: (mood: string) => void;
  onSelectListing: (listing: Listing) => void;
  onToggleSaved: (listingId: string) => void;
  onOpenMenu: () => void;
};

function DiscoverScreen({
  activeTab,
  activeArea,
  activeMood,
  searchQuery,
  listings: visibleListings,
  savedIds,
  onSearchChange,
  onAreaChange,
  onMoodChange,
  onSelectListing,
  onToggleSaved,
  onOpenMenu,
}: DiscoverScreenProps) {
  const title =
    activeTab === "events"
      ? "Events happening near you"
      : activeTab === "saved"
        ? "Your saved plans"
        : "Explore nearby plans";

  return (
    <div className="flex min-h-dvh flex-col pb-24">
      <header className="px-5 pt-7">
        <div className="flex items-start justify-between">
          <div>
            <BrandWordmark compact />

            <h1 className="mt-6 max-w-[310px] text-[39px] font-medium leading-[0.94] tracking-[-0.08em] text-black">
              Find places, events and things to do.
            </h1>

            <p className="mt-3 max-w-[285px] text-[12px] leading-relaxed text-black/45">
              Search your location and discover owner-listed places, events and
              experiences nearby.
            </p>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={onOpenMenu}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
          >
            <Menu size={18} />
          </button>
        </div>

        <div className="mt-7 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.05)]">
          <Search size={18} className="text-black/70" />

          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search places, events..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-black outline-none placeholder:text-black/30"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                onAreaChange("Braamfontein");
                onMoodChange("All");
              }}
              className="flex size-8 items-center justify-center rounded-full bg-[#1d1e20] text-white"
            >
              <SlidersHorizontal size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full bg-[#1d1e20] text-white"
            >
              <SlidersHorizontal size={14} />
            </button>
          )}
        </div>
      </header>

      <section className="mt-6 space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/25">
              Area
            </p>

            <button
              type="button"
              onClick={() => {
                onAreaChange("Braamfontein");
                onMoodChange("All");
              }}
              className="text-[11px] font-semibold text-black/35"
            >
              Reset
            </button>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1">
            {locationFilters.map((area) => {
              const active = activeArea === area;

              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => onAreaChange(area)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-[11px] font-semibold transition-colors ${
                    active
                      ? "bg-[#1d1e20] text-white"
                      : "bg-white text-black/40"
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/25">
              Mood
            </p>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1">
            {moodFilters.map((mood) => {
              const active = activeMood === mood;

              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => onMoodChange(mood)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-[11px] font-semibold transition-colors ${
                    active
                      ? "bg-[var(--accent)] text-black"
                      : "bg-white text-black/40"
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-7 flex items-center justify-between px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/28">
            {visibleListings.length} plans
          </p>

          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.05em] text-black">
            {title}
          </h2>
        </div>

        <Link
          href="/places"
          className="text-[12px] font-semibold text-black/35"
        >
          View all
        </Link>
      </section>

      <section className="no-scrollbar mt-4 flex-1 space-y-4 overflow-y-auto px-5 pb-40">
        {visibleListings.length > 0 ? (
          visibleListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              saved={savedIds.includes(listing.id)}
              onOpen={() => onSelectListing(listing)}
              onToggleSaved={() => onToggleSaved(listing.id)}
            />
          ))
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </section>
    </div>
  );
}

function ListingCard({
  listing,
  saved,
  onOpen,
  onToggleSaved,
}: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-[32px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onOpen();
          }
        }}
        className="group relative block h-[310px] w-full cursor-pointer overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="430px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />

        <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-black">
          {listing.area}
        </div>

        <button
          type="button"
          aria-label={saved ? "Remove saved listing" : "Save listing"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSaved();
          }}
          className={`absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full ${
            saved ? "bg-[#1d1e20] text-white" : "bg-white text-black"
          }`}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[11px] font-medium text-white/70">
            {listing.category}
          </p>

          <h3 className="mt-1 max-w-[260px] text-[31px] font-semibold leading-[0.92] tracking-[-0.07em] text-white">
            {listing.title}
          </h3>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[12px] font-semibold text-white/80">
              <span className="flex items-center gap-1">
                <Star size={13} fill="currentColor" />
                {listing.rating.toFixed(1)}
              </span>

              <span>{listing.priceLabel}</span>
            </div>

            <span className="flex size-12 items-center justify-center rounded-full bg-white text-black">
              <ArrowRight size={18} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ activeTab }: { activeTab: AppTab }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-[32px] bg-white px-6 text-center">
      <div>
        <p className="text-[12px] font-semibold text-black/30">
          {activeTab === "saved"
            ? "No saved plans yet."
            : "No matching plans found."}
        </p>

        <p className="mt-2 text-[12px] leading-relaxed text-black/35">
          Try another area, mood or search term.
        </p>
      </div>
    </div>
  );
}

function BottomNavigation({ activeTab }: { activeTab: AppTab }) {
  const items = [
    { label: "Discover", value: "discover" as const, href: "/", icon: Home },
    {
      label: "Events",
      value: "events" as const,
      href: "/events",
      icon: CalendarDays,
    },
    { label: "Saved", value: "saved" as const, href: "/saved", icon: Heart },
    {
      label: "Owners",
      value: "owners" as const,
      href: "/for-owners",
      icon: Grid2X2,
    },
  ];

  return (
    <nav
      onClick={(event) => event.stopPropagation()}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+20px)] left-1/2 z-[999] flex h-[66px] w-[calc(100%-40px)] max-w-[330px] -translate-x-1/2 items-center justify-between rounded-full bg-[#1d1e20] px-3 shadow-[0_18px_40px_rgba(0,0,0,0.26)] lg:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.value;

        return (
          <Link
            key={item.value}
            href={item.href}
            aria-label={item.label}
            onClick={(event) => event.stopPropagation()}
            className={`flex size-12 items-center justify-center rounded-full transition-colors ${
              active ? "bg-white text-black" : "text-white/70"
            }`}
          >
            <Icon
              size={20}
              fill={active && item.value === "saved" ? "currentColor" : "none"}
            />
          </Link>
        );
      })}
    </nav>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) {
    return null;
  }

  const links = [
    { label: "Discover", href: "/" },
    { label: "Places", href: "/places" },
    { label: "Events", href: "/events" },
    { label: "Saved", href: "/saved" },
    { label: "For owners", href: "/for-owners" },
    { label: "Owner dashboard", href: "/owner/dashboard" },
    { label: "Admin review", href: "/admin/moderation" },
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-black/25 px-4 py-4 backdrop-blur-sm lg:hidden">
      <div className="ml-auto max-w-[360px] overflow-hidden rounded-[34px] bg-[#f8f8f8] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between">
          <BrandWordmark compact />

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full bg-white text-black shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-8 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between rounded-[22px] bg-white px-5 py-4 text-[15px] font-semibold tracking-[-0.035em] text-black shadow-[0_10px_25px_rgba(0,0,0,0.035)]"
            >
              {link.label}

              <ArrowRight size={16} />
            </Link>
          ))}
        </div>

        <Link
          href="/owner/create-listing"
          onClick={onClose}
          className="mt-5 flex w-full items-center justify-center rounded-full bg-[#1d1e20] px-5 py-4 text-[13px] font-semibold text-white"
        >
          Create listing
        </Link>
      </div>
    </div>
  );
}
