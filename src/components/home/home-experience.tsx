"use client";

import Image from "next/image";
import { useMemo, useState, type ElementType } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Grid2X2,
  Heart,
  Home,
  MapPin,
  Menu,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  Star,
  Store,
  X,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { listings, locationFilters, moodFilters } from "@/data/listings";
import type { Listing } from "@/types/listing";

type AppTab = "discover" | "events" | "saved" | "owners";

export function HomeExperience() {
  const [activeTab, setActiveTab] = useState<AppTab>("discover");
  const [activeArea, setActiveArea] = useState("Braamfontein");
  const [activeMood, setActiveMood] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const filteredListings = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesTab =
        activeTab === "events"
          ? listing.type === "event"
          : activeTab === "saved"
            ? savedIds.includes(listing.id)
            : true;

      const matchesArea = listing.area === activeArea;

      const matchesMood =
        activeMood === "All" ||
        listing.moods.some((mood) => mood === activeMood);

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

      if (activeTab === "owners") {
        return false;
      }

      return matchesTab && matchesSearch && (matchesArea || matchesMood);
    });
  }, [activeArea, activeMood, activeTab, savedIds, searchQuery]);

  function toggleSaved(listingId: string) {
    setSavedIds((current) =>
      current.includes(listingId)
        ? current.filter((id) => id !== listingId)
        : [...current, listingId],
    );
  }

  if (selectedListing) {
    return (
      <>
        <div className="lg:hidden">
          <AppSurface>
            <ListingDetailScreen
              listing={selectedListing}
              saved={savedIds.includes(selectedListing.id)}
              onBack={() => setSelectedListing(null)}
              onToggleSaved={() => toggleSaved(selectedListing.id)}
            />
          </AppSurface>
        </div>

        <DesktopDetailExperience
          listing={selectedListing}
          saved={savedIds.includes(selectedListing.id)}
          onBack={() => setSelectedListing(null)}
          onToggleSaved={() => toggleSaved(selectedListing.id)}
        />
      </>
    );
  }

  return (
    <>
      <div className="lg:hidden">
        <AppSurface>
          {activeTab === "owners" ? (
            <OwnersScreen />
          ) : (
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
              onSelectListing={setSelectedListing}
              onToggleSaved={toggleSaved}
            />
          )}

          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </AppSurface>
      </div>

      <DesktopHomeExperience
        activeTab={activeTab}
        activeArea={activeArea}
        activeMood={activeMood}
        searchQuery={searchQuery}
        listings={filteredListings}
        savedIds={savedIds}
        onTabChange={setActiveTab}
        onSearchChange={setSearchQuery}
        onAreaChange={setActiveArea}
        onMoodChange={setActiveMood}
        onSelectListing={setSelectedListing}
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
  onTabChange: (tab: AppTab) => void;
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
  onTabChange,
  onSearchChange,
  onAreaChange,
  onMoodChange,
  onSelectListing,
  onToggleSaved,
}: DesktopHomeExperienceProps) {
  const featuredListing = visibleListings[0] ?? listings[0];
  const sideListings = visibleListings.slice(1, 4);

  const title =
    activeTab === "events"
      ? "Events happening around you."
      : activeTab === "saved"
        ? "Your saved plans."
        : "Find places, events and things to do.";

  return (
    <main className="hidden min-h-dvh w-full overflow-hidden bg-[#f8f8f8] lg:block">
      <section className="min-h-dvh w-full overflow-hidden bg-[#f8f8f8] px-8 py-6 xl:px-10">
        <header className="flex items-center justify-between">
          <BrandWordmark />

          <nav className="flex items-center rounded-full bg-white p-1 shadow-[0_14px_34px_rgba(0,0,0,0.05)]">
            {[
              { label: "Discover", value: "discover" as const },
              { label: "Events", value: "events" as const },
              { label: "Saved", value: "saved" as const },
              { label: "For owners", value: "owners" as const },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onTabChange(item.value)}
                className={`rounded-full px-5 py-3 text-[12px] font-semibold transition-colors ${
                  activeTab === item.value
                    ? "bg-[#1d1e20] text-white"
                    : "text-black/45 hover:text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => onTabChange("owners")}
            className="rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
          >
            List your place
          </button>
        </header>

        {activeTab === "owners" ? (
          <DesktopOwnersExperience />
        ) : (
          <div className="grid min-h-[calc(100dvh-170px)] grid-cols-[0.82fr_1.18fr] gap-8 pt-12 xl:grid-cols-[0.72fr_1.28fr]">
            <aside className="flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                  SPOTTED live
                </p>

                <h1 className="mt-5 max-w-[560px] text-[76px] font-medium leading-[0.86] tracking-[-0.09em] text-black xl:text-[92px]">
                  {title}
                </h1>

                <p className="mt-7 max-w-[430px] text-[15px] leading-relaxed text-black/45">
                  Search a location and discover restaurants, cafés, events,
                  markets, venues and experiences listed by local owners and
                  hosts.
                </p>

                <div className="mt-9 flex max-w-[520px] items-center gap-3 rounded-full bg-white px-5 py-4 shadow-[0_18px_42px_rgba(0,0,,0.06)]">
                  <Search size={19} />

                  <input
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search places, events, moods..."
                    className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-black outline-none placeholder:text-black/30"
                  />

                  <button className="flex size-11 items-center justify-center rounded-full bg-[#1d1e20] text-white">
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

                    <button className="text-[12px] font-semibold text-black/35">
                      View all
                    </button>
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

                    <button
                      type="button"
                      onClick={() => onTabChange("owners")}
                      className="mt-7 rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black"
                    >
                      Start listing
                    </button>
                  </div>

                  <div className="absolute -bottom-16 -right-16 size-56 rounded-full bg-white/10" />
                </div>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

function DesktopDetailExperience({
  listing,
  saved,
  onBack,
  onToggleSaved,
}: ListingDetailScreenProps) {
  return (
    <main className="hidden min-h-dvh w-full overflow-hidden bg-[#f8f8f8] lg:block">
      <section className="grid min-h-dvh w-full grid-cols-[1fr_0.75fr] overflow-hidden bg-[#f8f8f8] p-8 xl:p-10">
        <div className="relative overflow-hidden rounded-[38px] bg-black">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            priority
            sizes="800px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/8 to-transparent" />

          <button
            type="button"
            onClick={onBack}
            className="absolute left-6 top-6 flex size-12 items-center justify-center rounded-full bg-white text-black"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="flex items-center gap-2 text-[13px] text-white/70">
              <MapPin size={15} />
              {listing.location}
            </p>

            <h1 className="mt-3 max-w-[680px] text-[82px] font-semibold leading-[0.82] tracking-[-0.09em]">
              {listing.title}
            </h1>
          </div>
        </div>

        <aside className="px-8 py-4">
          <div className="flex items-center justify-between">
            <BrandWordmark />

            <button
              type="button"
              onClick={onToggleSaved}
              className={`flex size-12 items-center justify-center rounded-full ${
                saved ? "bg-[#1d1e20] text-white" : "bg-white text-black"
              }`}
            >
              <Heart size={18} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
              Listing details
            </p>

            <h2 className="mt-4 text-[54px] font-semibold leading-[0.88] tracking-[-0.08em] text-black">
              A plan worth sharing.
            </h2>

            <p className="mt-6 text-[15px] leading-relaxed text-black/50">
              {listing.description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <InfoCard label="Price" value={listing.priceLabel} />
            <InfoCard label="Area" value={listing.area} />
            <InfoCard label="Starts" value={listing.startsAt ?? "Open today"} />
            <InfoCard label="Rating" value={listing.rating.toFixed(1)} />
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
              Hosted by
            </p>

            <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.055em] text-black">
              {listing.owner.name}
            </h3>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="flex size-14 items-center justify-center rounded-full bg-white text-black">
              <Share2 size={18} />
            </button>

            <button className="flex flex-1 items-center justify-center rounded-full bg-[#1d1e20] px-6 py-4 text-[14px] font-semibold text-white">
              View details
            </button>
          </div>
        </aside>
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

function DesktopOwnersExperience() {
  return (
    <div className="grid min-h-[calc(100dvh-170px)] grid-cols-[0.9fr_1.1fr] gap-10 pt-16">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/3">
          For owners and hosts
        </p>

        <h1 className="mt-5 max-w-[620px] text-[88px] font-medium leading-[0.84] tracking-[-0.09em] text-black">
          Publish what people can do at your place.
        </h1>

        <p className="mt-7 max-w-[480px] text-[15px] leading-relaxed text-black/45">
          Restaurants, cafés, lounges, galleries, event hosts and experience
          creators can list venues, post events and reach people nearby.
        </p>

        <button className="mt-9 rounded-full bg-[#1d1e20] px-7 py-4 text-[13px] font-semibold text-white">
          Start listing
        </button>
      </section>

      <section className="grid gap-4">
        <DesktopOwnerPanel
          icon={Store}
          title="List a place"
          description="Create a public profile for your venue, store, café or restaurant."
        />

        <DesktopOwnerPanel
          icon={CalendarDays}
          title="Post events"
          description="Add student nights, markets, live shows, poups and weekend activities."
        />

        <DesktopOwnerPanel
          icon={Plus}
          title="Create experiences"
          description="Package guided activities, group plans, date ideas or local things to do."
        />
      </section>
    </div>
  );
}

function DesktopOwnerPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <article className="flex items-center gap-6 rounded-[34px] bg-white p-7">
      <span className="flex size-16 items-center justify-center rounded-full bg-[#f4f4f2]">
        <Icon size={22} />
      </span>

      <div>
        <h2 className="text-[30px] font-semibold leading-none tracking-[-0.065em] text-black">
          {title}
        </h2>

        <p className="mt-3 max-w-[440px] text-[14px] leading-relaxed text-black/42">
          {description}
        </p>
      </div>
    </article>
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
              onClick={() => onSearchChange("")}
              className="flex size-8 items-center justify-center rounded-full bg-[#f4f4f2]"
            >
              <X size={14} />
            </button>
          ) : (
            <button className="flex size-8 items-center justify-center rounded-full bg-[#1d1e20] text-white">
              <SlidersHorizontal size={14} />
            </button>
          )}
        </div>
      </header>

      <section className="mt-6">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1">
          {locationFilters.map((area) => {
            const active = activeArea === area;

            return (
              <button
                key={area}
                type="button"
                onClick={() => onAreaChange(area)}
                className={`shrink-0 rounded-full px-5 py-3 text-[12px] font-semibold transition-colors ${
                  active ? "bg-[#1d1e20] text-white" : "bg-white text-black/45"
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
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
                    : "bg-white text-black/45"
                }`}
              >
                {mood}
              </button>
            );
          })}
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

        <button className="text-[12px] font-semibold text-black/35">
          View all
        </button>
      </section>

      <section className="no-scrollbar mt-4 flex-1 space-y-4 overflow-y-auto px-5 pb-32">
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

type ListingCardProps = {
  listing: Listing;
  saved: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
};

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

type ListingDetailScreenProps = {
  listing: Listing;
  saved: boolean;
  onBack: () => void;
  onToggleSaved: () => void;
};

function ListingDetailScreen({
  listing,
  saved,
  onBack,
  onToggleSaved,
}: ListingDetailScreenProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f8f8f8]">
      <section className="relative h-[380px]">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          priority
          sizes="430px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/8 to-black/20" />

        <div className="absolute left-5 right-5 top-7 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex size-12 items-center justify-center rounded-full bg-white text-black"
          >
            <ArrowLeft size={19} />
          </button>

          <button
            type="button"
            onClick={onToggleSaved}
            className={`flex size-12 items-center justify-center rounded-full ${
              saved ? "bg-[#1d1e20] text-white" : "bg-white text-black"
            }`}
          >
            <Heart size={19} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="absolute bottom-8 left-5 right-5 text-white">
          <p className="flex items-center gap-2 text-[12px] font-medium text-white/75">
            <MapPin size={14} />
            {listing.location}
          </p>

          <h1 className="mt-2 max-w-[320px] text-[42px] font-semibold leading-[0.9] tracking-[-0.08em]">
            {listing.title}
          </h1>
        </div>
      </section>

      <section className="-mt-8 rounded-t-[36px] bg-[#f8f8f8] px-5 pb-28 pt-6">
        <div className="mx-auto h-1 w-12 rounded-full bg-black/10" />

        <div className="mt-6 flex items-center gap-2">
          <span className="rounded-full bg-[#1d1e20] px-4 py-2.5 text-[11px] font-semibold text-white">
            {listing.type}
          </span>

          <span className="rounded-full bg-white px-4 py-2.5 text-[11px] font-semibold text-black/50">
            {listing.category}
          </span>

          {listing.owner.verified && (
            <span className="flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-4 py-2.5 text-[11px] font-semibold text-[var(--accent-strong)]">
              <CheckCircle2 size={13} />
              Verified
            </span>
          )}
        </div>

        <div className="mt-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
              Hosted by
            </p>

            <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.045em] text-black">
              {listing.owner.name}
            </h2>
          </div>

          <div className="text-right">
            <p className="flex items-center gap-1 text-[13px] font-semibold text-black">
              <Star size={14} fill="currentColor" />
              {listing.rating.toFixed(1)}
            </p>

            <p className="mt-1 text-[11px] font-medium text-black/35">
              {listing.saves} saves
            </p>
          </div>
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-black/58">
          {listing.description}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <InfoCard label="Price" value={listing.priceLabel} />
          <InfoCard label="Area" value={listing.area} />
          <InfoCard label="Starts" value={listing.startsAt ?? "Open today"} />
          <InfoCard label="Shares" value={`${listing.shares}`} />
        </div>
      </section>

      <div className="absolute bottom-5 left-5 right-5 flex gap-3">
        <button className="flex size-14 items-center justify-center rounded-full bg-white text-black shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
          <Share2 size={18} />
        </button>

        <button className="flex flex-1 items-center justify-center rounded-full bg-[#1d1e20] px-5 py-4 text-[14px] font-semibold text-white">
          View details
        </button>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/25">
        {label}
      </p>

      <p className="mt-2 text-[14px] font-semibold leading-tight text-black">
        {value}
      </p>
    </div>
  );
}

function OwnersScreen() {
  return (
    <div className="flex min-h-dvh flex-col px-5 pb-24 pt-7">
      <header className="flex items-center justify-between">
        <BrandWordmark compact />

        <button className="flex size-11 items-center justify-center rounded-full bg-white shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
          <Menu size={18} />
        </button>
      </header>

      <section className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
          For owners
        </p>

        <h1 className="mt-4 max-w-[330px] text-[44px] font-medium leading-[0.9] tracking-[-0.08em] text-black">
          List your place or post an event.
        </h1>

        <p className="mt-4 max-w-[300px] text-[13px] leading-relaxed text-black/45">
          Restaurants, cafés, venues and hosts can publish what is happening so
          people nearby can discover and share it.
        </p>
      </section>

      <section className="mt-9 space-y-3">
        <OwnerOption
          icon={Store}
          title="List your place"
          description="Create a profile for a restaurant, café, venue or store."
        />

        <OwnerOption
          icon={CalendarDays}
          title="Post an event"
          description="Promote student nights, markets, shows and activities."
        />

        <OwnerOption
          icon={Plus}
          title="Create an experience"
          description="Package things to do, group plans or hosted activities."
        />
      </section>

      <button className="mt-auto flex w-full items-center justify-center rounded-full bg-[#1d1e20] px-5 py-4 text-[14px] font-semibold text-white">
        Start listing
      </button>
    </div>
  );
}

function OwnerOption({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <article className="flex items-center gap-4 rounded-[26px] bg-white p-4">
      <span className="flex size-12 shrink-0 items-center justify-cente rounded-full bg-[#f4f4f2]">
        <Icon size={18} />
      </span>

      <div>
        <h2 className="text-[15px] font-semibold tracking-[-0.035em] text-black">
          {title}
        </h2>

        <p className="mt-1 text-[12px] leading-relaxed text-black/40">
          {description}
        </p>
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

function BottomNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}) {
  const items = [
    { label: "Discover", value: "discover" as const, icon: Home },
    { label: "Events", value: "events" as const, icon: CalendarDays },
    { label: "Saved", value: "saved" as const, icon: Heart },
    { label: "Owners", value: "owners" as const, icon: Grid2X2 },
  ];

  return (
    <nav className="fixed bottom-[calc(env(safe-area-inset-bottom)+20px)] left-1/2 z-50 flex h-[66px] w-[calc(100%-40px)] max-w-[330px] -translate-x-1/2 items-center justify-between rounded-full bg-[#1d1e20] px-3 shadow-[0_18px_40px_rgba(0,0,0,0.26)] lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.value;

        return (
          <button
            key={item.value}
            type="button"
            aria-label={item.label}
            onClick={() => onTabChange(item.value)}
            className={`flex size-12 items-center justify-center rounded-full transition-colors ${
              active ? "bg-white text-black" : "text-white/70"
            }`}
          >
            <Icon
              size={20}
              fill={active && item.value === "saved" ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </nav>
  );
}
