"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bookmark,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Grid2X2,
  Heart,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { listings, locationFilters, moodFilters } from "@/data/listings";
import type { Listing } from "@/types/listing";

export function HomeExperience() {
  const [activeArea, setActiveArea] = useState("Braamfontein");
  const [activeMood, setActiveMood] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const areaMatch = listing.area === activeArea;
      const moodMatch =
        activeMood === "All" ||
        listing.moods.some((mood) => mood === activeMood);

      return areaMatch || moodMatch;
    });
  }, [activeArea, activeMood]);

  const visibleListings =
    filteredListings.length > 0 ? filteredListings : listings;

  const activeListing =
    visibleListings[activeIndex] ?? visibleListings[0] ?? listings[0];

  function nextListing() {
    setActiveIndex((current) =>
      current === visibleListings.length - 1 ? 0 : current + 1,
    );
  }

  function previousListing() {
    setActiveIndex((current) =>
      current === 0 ? visibleListings.length - 1 : current - 1,
    );
  }

  if (!activeListing) {
    return null;
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-[#d9d9dc] px-4 py-8 sm:px-8 lg:px-12">
      <section className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-[1280px] items-center justify-center">
        <div className="flex w-full items-center justify-center gap-8 lg:gap-12">
          <PhoneFrame className="z-20 rotate-[-2deg]">
            <DiscoverScreen
              activeArea={activeArea}
              activeMood={activeMood}
              activeListing={activeListing}
              visibleListings={visibleListings}
              onAreaChange={(area) => {
                setActiveArea(area);
                setActiveIndex(0);
              }}
              onMoodChange={(mood) => {
                setActiveMood(mood);
                setActiveIndex(0);
              }}
              onNext={nextListing}
            />
          </PhoneFrame>

          <PhoneFrame className="hidden z-10 translate-y-4 rotate-[1deg] md:block">
            <DetailScreen
              listing={activeListing}
              onPrevious={previousListing}
              onNext={nextListing}
            />
          </PhoneFrame>

          <PhoneFrame className="hidden z-0 rotate-[2deg] xl:block">
            <PlanScreen listing={activeListing} />
          </PhoneFrame>
        </div>
      </section>
    </main>
  );
}

type PhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
};

function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div
      className={`relative h-[760px] w-full max-w-[382px] overflow-hidden rounded-[54px] border-[10px] border-black bg-[#f8f8f8] shadow-[0_35px_90px_rgba(0,0,0,0.24)] ${className}`}
    >
      <div className="pointer-events-none absolute left-1/2 top-3 z-50 h-[30px] w-[118px] -translate-x-1/2 rounded-full bg-black" />
      {children}
    </div>
  );
}

type DiscoverScreenProps = {
  activeArea: string;
  activeMood: string;
  activeListing: Listing;
  visibleListings: Listing[];
  onAreaChange: (area: string) => void;
  onMoodChange: (mood: string) => void;
  onNext: () => void;
};

function DiscoverScreen({
  activeArea,
  activeMood,
  activeListing,
  visibleListings,
  onAreaChange,
  onMoodChange,
  onNext,
}: DiscoverScreenProps) {
  return (
    <div className="relative flex h-full flex-col bg-[#f8f8f8] px-5 pb-5 pt-16">
      <header className="flex items-center justify-between">
        <div>
          <BrandWordmark compact />

          <p className="mt-2 text-[12px] font-medium text-black/45">
            Find what to do nearby
          </p>
        </div>

        <div className="relative size-11 overflow-hidden rounded-full bg-black">
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
            alt="User avatar"
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      </header>

      <div className="mt-7 flex items-center gap-3">
        <div className="flex h-14 flex-1 items-center gap-3 rounded-full bg-white px-5 shadow-[0_14px_30px_rgba(0,0,0,0.04)]">
          <Search size={20} className="text-black" />

          <span className="text-[14px] font-medium text-black/45">
            Search places, events...
          </span>
        </div>

        <button className="flex size-14 items-center justify-center rounded-full bg-[#1d1e20] text-white">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <section className="mt-7">
        <div className="flex items-end justify-between">
          <h1 className="text-[21px] font-semibold tracking-[-0.045em] text-black">
            Select your next plan
          </h1>

          <span className="text-[11px] font-semibold text-black/35">
            {visibleListings.length} found
          </span>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {locationFilters.map((area) => {
            const active = activeArea === area;

            return (
              <button
                key={area}
                type="button"
                onClick={() => onAreaChange(area)}
                className={`shrink-0 rounded-full px-5 py-3 text-[12px] font-semibold transition-colors ${
                  active ? "bg-[#1d1e20] text-white" : "bg-white text-black/50"
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {moodFilters.slice(0, 7).map((mood) => {
            const active = activeMood === mood;

            return (
              <button
                key={mood}
                type="button"
                onClick={() => onMoodChange(mood)}
                className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${
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

      <section className="relative mt-6 flex-1">
        <div className="absolute left-4 right-4 top-4 h-[360px] rounded-[34px] bg-[#d9e7cb]" />
        <div className="absolute left-2 right-2 top-2 h-[360px] rounded-[34px] bg-[#e9c6a7]" />

        <motion.article
          key={activeListing.id}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[34px] bg-black shadow-[0_24px_55px_rgba(0,0,0,0.22)]"
        >
          <div className="relative h-[360px]">
            <Image
              src={activeListing.image}
              alt={activeListing.title}
              fill
              priority
              sizes="360px"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/12 to-transparent" />

            <button className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl">
              <Heart size={18} />
            </button>

            <div className="absolute bottom-5 left-5 right-5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/16 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xl">
                  {activeListing.type}
                </span>

                {activeListing.isHappeningToday && (
                  <span className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-[11px] font-semibold text-black">
                    Today
                  </span>
                )}
              </div>

              <p className="mt-4 text-[13px] font-medium text-white/75">
                {activeListing.area}
              </p>

              <h2 className="mt-1 text-[30px] font-semibold leading-[0.95] tracking-[-0.065em] text-white">
                {activeListing.title}
              </h2>

              <div className="mt-3 flex items-center gap-3 text-[12px] font-medium text-white/80">
                <span className="flex items-center gap-1">
                  <Star size={13} fill="currentColor" />
                  {activeListing.rating.toFixed(1)}
                </span>

                <span>{activeListing.saves} saves</span>
              </div>

              <div className="mt-5 flex items-center rounded-full bg-[#1d1e20]/92 p-1 pl-6 text-white backdrop-blur-xl">
                <span className="flex-1 text-[13px] font-semibold">
                  See more
                </span>

                <button
                  type="button"
                  onClick={onNext}
                  className="flex size-12 items-center justify-center rounded-full bg-white text-black"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </section>

      <BottomNavigation />
    </div>
  );
}

type DetailScreenProps = {
  listing: Listing;
  onPrevious: () => void;
  onNext: () => void;
};

function DetailScreen({ listing, onPrevious, onNext }: DetailScreenProps) {
  return (
    <div className="relative h-full overflow-hidden bg-[#f8f8f8] pb-5">
      <div className="relative h-[255px]">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="360px"
          className="object-cover"
        />

        <div className="absolute left-5 top-16 flex size-11 items-center justify-center rounded-full bg-white text-black">
          <ArrowLeft size={18} />
        </div>

        <div className="absolute right-5 top-16 flex size-11 items-center justify-center rounded-full bg-white text-black">
          <Heart size={18} />
        </div>
      </div>

      <section className="-mt-7 rounded-t-[34px] bg-[#f8f8f8] px-5 pb-5 pt-8">
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-black/10" />

        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="text-[25px] font-semibold leading-none tracking-[-0.055em] text-black">
              {listing.title}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-black/55">
              <span className="flex size-5 items-center justify-center rounded-full bg-[var(--accent)]">
                <MapPin size={12} />
              </span>
              {listing.area}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-[12px] font-semibold">
              <Star size={13} />
              {listing.rating.toFixed(1)}
            </span>

            <p className="mt-2 text-[12px] font-semibold underline">
              {listing.shares} shares
            </p>
          </div>
        </div>

        <p className="mt-5 text-[14px] leading-relaxed text-black/65">
          {listing.description.length > 118
            ? `${listing.description.slice(0, 118)}...`
            : listing.description}
        </p>

        <button className="mt-2 text-[13px] font-semibold underline">
          Read more
        </button>

        <div className="mt-8 flex items-center justify-between">
          <h3 className="text-[20px] font-semibold tracking-[-0.045em]">
            Upcoming nearby
          </h3>

          <button className="text-[12px] font-semibold underline">
            See all
          </button>
        </div>

        <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
          {listings.slice(0, 3).map((item) => (
            <MiniListingCard key={item.id} listing={item} />
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onPrevious}
            className="flex size-12 items-center justify-center rounded-full bg-white text-black"
          >
            <ArrowLeft size={17} />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="flex flex-1 items-center justify-center gap-3 rounded-full bg-[#1d1e20] px-5 py-4 text-[13px] font-semibold text-white"
          >
            Next plan
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

type PlanScreenProps = {
  listing: Listing;
};

function PlanScreen({ listing }: PlanScreenProps) {
  const scheduleItems = [
    {
      title: "Arrive and check the vibe",
      label: "First stop",
      image: listing.image,
      open: true,
    },
    {
      title: "Food, music or main activity",
      label: "Main plan",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      open: false,
    },
    {
      title: "Share the plan with friends",
      label: "Before you go",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
      open: false,
    },
  ];

  return (
    <div className="relative flex h-full flex-col bg-[#f8f8f8] px-5 pb-5 pt-16">
      <header className="flex items-center justify-between">
        <button className="flex size-11 items-center justify-center rounded-full bg-white">
          <ArrowLeft size={18} />
        </button>

        <div className="text-center">
          <h1 className="text-[20px] font-semibold tracking-[-0.045em]">
            {listing.area}
          </h1>

          <p className="mt-1 text-[11px] font-medium text-black/40">
            Plans near you
          </p>
        </div>

        <button className="flex size-11 items-center justify-center rounded-full bg-white">
          <Heart size={18} />
        </button>
      </header>

      <section className="mt-8 flex-1">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {["Plan", "Details", "Owner", "Booking"].map((item, index) => (
            <button
              key={item}
              className={`shrink-0 rounded-full px-5 py-3 text-[12px] font-semibold ${
                index === 0
                  ? "bg-[#1d1e20] text-white"
                  : "bg-white text-black/45"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <h2 className="mt-7 text-[19px] font-semibold tracking-[-0.045em]">
          {listing.type === "event"
            ? "Tonight’s local plan"
            : "Suggested visit plan"}
        </h2>

        <div className="mt-4 space-y-3">
          {scheduleItems.map((item) => (
            <div
              key={item.title}
              className={`rounded-[22px] border border-black/5 bg-white p-3 ${
                item.open ? "shadow-[0_16px_35px_rgba(0,0,0,0.05)]" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-[15px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-black/35">
                    {item.label}
                  </p>

                  <h3 className="mt-1 text-[13px] font-semibold leading-snug text-black">
                    {item.title}
                  </h3>

                  {item.open && (
                    <div className="mt-4 space-y-2 text-[12px] leading-snug text-black/65">
                      <p>Check location, price and opening time.</p>
                      <p>Save it or share the listing with your group.</p>
                    </div>
                  )}
                </div>

                {item.open ? (
                  <ChevronUp size={17} />
                ) : (
                  <ChevronDown size={17} />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button className="mt-4 flex w-full items-center justify-center rounded-full bg-[#1d1e20] px-5 py-4 text-[14px] font-semibold text-white">
        View listing
      </button>
    </div>
  );
}

type MiniListingCardProps = {
  listing: Listing;
};

function MiniListingCard({ listing }: MiniListingCardProps) {
  return (
    <article className="w-[210px] shrink-0 overflow-hidden rounded-[24px] bg-white p-2">
      <div className="relative h-[130px] overflow-hidden rounded-[20px]">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="210px"
          className="object-cover"
        />

        <button className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-black">
          <Heart size={16} />
        </button>
      </div>

      <div className="px-1 pb-2 pt-3">
        <p className="text-[14px] font-semibold tracking-[-0.035em]">
          {listing.title}
        </p>

        <p className="mt-1 text-[11px] text-black/40">
          {listing.priceLabel} · {listing.area}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] font-semibold">
            <Star size={12} />
            {listing.rating.toFixed(1)}
          </span>

          {listing.owner.verified && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--accent-strong)]">
              <BadgeCheck size={12} />
              Verified
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function BottomNavigation() {
  const items = [
    { label: "Home", icon: Home, active: true },
    { label: "Events", icon: CalendarDays, active: false },
    { label: "Saved", icon: Heart, active: false },
    { label: "More", icon: Grid2X2, active: false },
  ];

  return (
    <nav className="absolute bottom-5 left-1/2 z-30 flex h-[64px] w-[286px] -translate-x-1/2 items-center justify-between rounded-full bg-[#1d1e20] px-3 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            className={`flex size-12 items-center justify-center rounded-full ${
              item.active
                ? "bg-white text-black"
                : "bg-transparent text-white/75"
            }`}
          >
            <Icon size={20} />
          </button>
        );
      })}

      <button type="button" aria-label="Saved plans" className="hidden">
        <Bookmark size={20} />
      </button>
    </nav>
  );
}
