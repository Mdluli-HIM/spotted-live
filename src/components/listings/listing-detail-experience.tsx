"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Heart,
  ImageIcon,
  MapPin,
  Share2,
  ShieldCheck,
  Star,
  Store,
  Utensils,
  Wifi,
  X,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { useSavedListings } from "@/hooks/use-saved-listings";
import type { Listing } from "@/types/listing";

type ListingDetailExperienceProps = {
  listing: Listing;
  similarListings: Listing[];
};

export function ListingDetailExperience({
  listing,
}: ListingDetailExperienceProps) {
  const mobileGalleryRef = useRef<HTMLDivElement | null>(null);

  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const { isListingSaved, toggleSavedListing } = useSavedListings();

  const saved = isListingSaved(listing.id);

  const galleryImages =
    listing.images && listing.images.length > 0
      ? listing.images
      : [listing.image];

  const highlights = [
    {
      title: "Good for the mood",
      description: listing.moods.slice(0, 3).join(", "),
      icon: Star,
    },

    {
      title: "Spot",
      description: `${listing.area} · ${listing.location}`,
      icon: Store,
    },
    {
      title: "Easy to plan and share",
      description: `${listing.saves} saves · ${listing.shares} shares`,
      icon: Share2,
    },
  ];

  const offers = [
    { label: "Food and drinks", icon: Utensils },
    { label: "Good atmosphere", icon: Star },
    { label: "Shareable plan", icon: Share2 },
    { label: "Easy to find", icon: MapPin },
    { label: "Good for groups", icon: Store },
    { label: "Wifi / connected space", icon: Wifi },
  ];

  async function shareListing() {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/listings/${listing.slug}`
        : `/listings/${listing.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${listing.title} — SPOTTED`,
          text: listing.description,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function handleGalleryScroll() {
    const gallery = mobileGalleryRef.current;

    if (!gallery) {
      return;
    }

    const index = Math.round(gallery.scrollLeft / gallery.clientWidth);
    setActiveImageIndex(index);
  }

  return (
    <main className="min-h-dvh w-full bg-white text-black lg:bg-[#f8f8f8]">
      <section className="mx-auto w-full max-w-[1180px] pb-28 lg:px-8 lg:pb-20">
        <header className="sticky top-0 z-40 hidden items-center justify-between bg-[#f8f8f8]/92 py-5 backdrop-blur-xl lg:flex">
          <BrandWordmark />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={shareListing}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.04)]"
            >
              {copied ? <Copy size={15} /> : <Share2 size={15} />}
              {copied ? "Copied" : "Share"}
            </button>

            <button
              type="button"
              onClick={() => toggleSavedListing(listing.id)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.04)]"
            >
              <Heart size={15} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </header>

        {/* DESKTOP TITLE */}
        <section className="hidden pt-6 lg:block">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-black/55 shadow-[0_14px_34px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft size={14} />
            Back to discover
          </Link>

          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-[13px] font-medium text-black/45">
                {listing.type} in {listing.area}
              </p>

              <h1 className="mt-3 max-w-[820px] text-[72px] font-semibold leading-[0.86] tracking-[-0.09em] text-black">
                {listing.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] font-semibold text-black/55">
                <span className="flex items-center gap-1.5">
                  <Star size={14} fill="currentColor" />
                  {listing.rating.toFixed(1)}
                </span>

                <span>·</span>

                <span>{listing.saves} saves</span>

                <span>·</span>

                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {listing.location}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
            >
              <ImageIcon size={15} />
              Show all photos
            </button>
          </div>
        </section>

        {/* DESKTOP IMAGE GRID */}
        <section className="hidden pt-8 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveImageIndex(0);
              setGalleryOpen(true);
            }}
            className="group relative h-[470px] overflow-hidden rounded-l-[34px] bg-black"
          >
            <Image
              src={galleryImages[0]}
              alt={listing.title}
              fill
              priority
              sizes="700px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </button>

          <div className="grid h-[470px] grid-cols-2 gap-2 overflow-hidden rounded-r-[34px]">
            {(galleryImages.length > 1
              ? galleryImages.slice(1, 5)
              : galleryImages
            ).map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => {
                  setActiveImageIndex(index + 1);
                  setGalleryOpen(true);
                }}
                className="group relative overflow-hidden bg-black"
              >
                <Image
                  src={image}
                  alt={`${listing.title} photo ${index + 2}`}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

                {index === 3 && galleryImages.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[13px] font-semibold text-white">
                    +{galleryImages.length - 5} more
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* MOBILE HERO */}
        <section className="relative h-[360px] overflow-hidden bg-black lg:hidden">
          <div
            ref={mobileGalleryRef}
            onScroll={handleGalleryScroll}
            className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
          >
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="relative h-full w-full shrink-0 snap-center"
              >
                <Image
                  src={image}
                  alt={`${listing.title} photo ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />

          <div className="absolute left-5 right-5 top-7 flex items-center justify-between">
            <Link
              href="/"
              className="flex size-11 items-center justify-center rounded-full bg-white text-black shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleSavedListing(listing.id)}
                className={`flex size-11 items-center justify-center rounded-full shadow-[0_14px_34px_rgba(0,0,0,0.12)] ${
                  saved ? "bg-[#1d1e20] text-white" : "bg-white text-black"
                }`}
              >
                <Heart size={18} fill={saved ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={shareListing}
                className="flex size-11 items-center justify-center rounded-full bg-white text-black shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
              >
                {copied ? <Copy size={17} /> : <Share2 size={17} />}
              </button>
            </div>
          </div>

          {galleryImages.length > 1 && (
            <span className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-2 text-[11px] font-semibold text-white backdrop-blur-xl">
              {activeImageIndex + 1}/{galleryImages.length}
            </span>
          )}
        </section>

        {/* MOBILE TITLE CARD */}
        <section className="rounded-t-[28px] bg-white px-5 pb-2 pt-6 lg:hidden">
          <h1 className="max-w-[330px] text-[33px] font-semibold leading-[0.95] tracking-[-0.07em] text-black">
            {listing.title}
          </h1>

          <p className="mt-2 text-[13px] leading-relaxed text-black/50">
            {listing.category} in {listing.area}
          </p>

          <div className="mt-5 grid grid-cols-3 divide-x divide-black/10 rounded-[24px] border border-black/10 py-4 text-center">
            <div>
              <p className="text-[16px] font-semibold text-black">
                {listing.rating.toFixed(1)}
              </p>
              <p className="mt-1 text-[10px] font-medium text-black/40">
                Rating
              </p>
            </div>

            <div>
              <p className="text-[16px] font-semibold text-black">
                {listing.saves}
              </p>
              <p className="mt-1 text-[10px] font-medium text-black/40">
                Saves
              </p>
            </div>

            <div>
              <p className="text-[16px] font-semibold text-black">
                {listing.shares}
              </p>
              <p className="mt-1 text-[10px] font-medium text-black/40">
                Shares
              </p>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="grid gap-10 px-5 pt-5 lg:grid-cols-[1fr_360px] lg:px-0 lg:pt-10">
          <div>
            <section className="border-b border-black/10 py-6 lg:pb-8 lg:pt-0">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f4f4f2] lg:bg-white lg:shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
                  <Store size={18} />
                </div>

                <div>
                  <h2 className="text-[21px] font-semibold tracking-[-0.055em] text-black">
                    Spot: {listing.area}
                  </h2>

                  <p className="mt-1 text-[13px] leading-relaxed text-black/45">
                    {listing.location}
                  </p>
                </div>

                {listing.owner.verified && (
                  <span className="ml-auto hidden items-center gap-1 rounded-full bg-[var(--accent-soft)] px-4 py-2.5 text-[11px] font-semibold text-[var(--accent-strong)] sm:flex">
                    <CheckCircle2 size={13} />
                    Verified
                  </span>
                )}
              </div>
            </section>

            <section className="border-b border-black/10 py-7">
              <div className="grid gap-5">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f4f4f2] lg:bg-white lg:shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
                        <Icon size={17} />
                      </span>

                      <div>
                        <h3 className="text-[15px] font-semibold tracking-[-0.035em] text-black">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-[13px] leading-relaxed text-black/45">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="border-b border-black/10 py-7">
              <h2 className="text-[25px] font-semibold leading-[0.95] tracking-[-0.065em] text-black">
                About this place
              </h2>

              <p className="mt-5 max-w-[720px] text-[15px] leading-relaxed text-black/62">
                {listing.description}
              </p>

              <p className="mt-5 max-w-[720px] text-[15px] leading-relaxed text-black/62">
                This listing is designed to help people quickly understand
                whether this is the right place for their plan. Use it for
                checking the mood, location, owner details, timing and whether
                you may need to reserve before going.
              </p>
            </section>

            <section className="border-b border-black/10 py-7">
              <h2 className="text-[25px] font-semibold leading-[0.95] tracking-[-0.065em] text-black">
                What this place offers
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {offers.map((offer) => {
                  const Icon = offer.icon;

                  return (
                    <div key={offer.label} className="flex items-center gap-4">
                      <Icon size={19} className="text-black/70" />

                      <span className="text-[14px] font-medium text-black/70">
                        {offer.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-[16px] bg-[#f4f4f2] px-5 py-4 text-[13px] font-semibold text-black"
              >
                Show all details
              </button>
            </section>

            <section className="border-b border-black/10 py-7">
              <h2 className="text-[25px] font-semibold leading-[0.95] tracking-[-0.065em] text-black">
                Reviews and interest
              </h2>

              <div className="mt-6 rounded-[28px] bg-[#f4f4f2] p-6 text-center">
                <div className="flex items-center justify-center gap-4">
                  <Star size={34} fill="currentColor" />
                  <p className="text-[58px] font-semibold leading-none tracking-[-0.08em]">
                    {listing.rating.toFixed(1)}
                  </p>
                  <Star size={34} fill="currentColor" />
                </div>

                <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.055em]">
                  Popular with SPOTTED users
                </h3>

                <p className="mx-auto mt-3 max-w-[360px] text-[13px] leading-relaxed text-black/45">
                  People are saving and sharing this place as a possible plan
                  for {listing.moods.slice(0, 2).join(" and ").toLowerCase()}.
                </p>
              </div>
            </section>

            <section className="border-b border-black/10 py-7">
              <h2 className="text-[25px] font-semibold leading-[0.95] tracking-[-0.065em] text-black">
                Where you’ll be
              </h2>

              <p className="mt-4 text-[14px] font-medium text-black/60">
                {listing.location}
              </p>

              <div className="mt-5 flex h-[260px] items-center justify-center rounded-[24px] bg-[#dfeee6] text-center">
                <div>
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#1d1e20] text-white">
                    <MapPin size={20} />
                  </span>

                  <p className="mt-4 text-[24px] font-semibold tracking-[-0.065em] text-black">
                    {listing.area}
                  </p>

                  <p className="mt-2 text-[12px] font-medium text-black/45">
                    Map preview will connect to the backend later.
                  </p>
                </div>
              </div>
            </section>

            <section className="py-7">
              <h2 className="text-[25px] font-semibold leading-[0.95] tracking-[-0.065em] text-black">
                Things to know
              </h2>

              <div className="mt-5 grid gap-3">
                <ThingToKnow
                  icon={CalendarDays}
                  title="Timing"
                  description={
                    listing.startsAt ??
                    "Open today or available during listed hours."
                  }
                />

                <ThingToKnow
                  icon={Clock}
                  title="Before you go"
                  description="Check availability, opening times and whether reservations are required."
                />

                <ThingToKnow
                  icon={ShieldCheck}
                  title="Reservation"
                  description="Some places may require booking. This will be handled by the SPOTTED booking system."
                />
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[34px] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.09)]">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[12px] font-medium text-black/40">
                    Reservation
                  </p>

                  <h3 className="mt-2 text-[30px] font-semibold leading-[0.9] tracking-[-0.07em] text-black">
                    Request a spot
                  </h3>
                </div>

                <p className="flex items-center gap-1 text-[13px] font-semibold text-black">
                  <Star size={14} fill="currentColor" />
                  {listing.rating.toFixed(1)}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-[22px] border border-black/10">
                <DetailBox label="Area" value={listing.area} />
                <DetailBox
                  label="Starts"
                  value={listing.startsAt ?? "Open today"}
                />
              </div>

              <Link
                href={`/book/${listing.slug}`}
                className="mt-5 flex w-full items-center justify-center rounded-full bg-[#1d1e20] px-5 py-4 text-[13px] font-semibold text-white"
              >
                Reserve
              </Link>

              <button
                type="button"
                onClick={() => toggleSavedListing(listing.id)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#f4f4f2] px-5 py-4 text-[13px] font-semibold text-black"
              >
                <Heart size={16} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save for later"}
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-black/35">
                This sends a reservation request. The booking system will be
                connected when we build the API.
              </p>
            </div>
          </aside>
        </section>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white px-5 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold text-black">
              Request a spot
            </p>

            <p className="mt-0.5 text-[11px] text-black/45">
              {listing.startsAt ?? "Open today"}
            </p>
          </div>

          <Link
            href={`/book/${listing.slug}`}
            className="rounded-full bg-[#1d1e20] px-8 py-4 text-[13px] font-semibold text-white"
          >
            Reserve
          </Link>
        </div>
      </div>

      <GalleryModal
        open={galleryOpen}
        images={galleryImages}
        listingTitle={listing.title}
        activeImageIndex={activeImageIndex}
        onClose={() => setGalleryOpen(false)}
        onChangeImage={setActiveImageIndex}
      />
    </main>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-black/10 p-4 odd:border-r">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/25">
        {label}
      </p>

      <p className="mt-2 text-[13px] font-semibold leading-tight text-black">
        {value}
      </p>
    </div>
  );
}

function ThingToKnow({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[22px] bg-[#f4f4f2] p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
        <Icon size={16} />
      </span>

      <div>
        <h3 className="text-[14px] font-semibold tracking-[-0.03em] text-black">
          {title}
        </h3>

        <p className="mt-1 text-[12px] leading-relaxed text-black/45">
          {description}
        </p>
      </div>
    </div>
  );
}

function GalleryModal({
  open,
  images,
  listingTitle,
  activeImageIndex,
  onClose,
  onChangeImage,
}: {
  open: boolean;
  images: string[];
  listingTitle: string;
  activeImageIndex: number;
  onClose: () => void;
  onChangeImage: (index: number) => void;
}) {
  if (!open) {
    return null;
  }

  const activeImage = images[activeImageIndex] ?? images[0];

  function goNext() {
    onChangeImage(
      activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1,
    );
  }

  function goPrevious() {
    onChangeImage(
      activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1,
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-[#111111] text-white">
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 lg:px-8">
        <button
          type="button"
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-full bg-white text-black"
        >
          <X size={18} />
        </button>

        <p className="text-[12px] font-semibold text-white/60">
          {activeImageIndex + 1} / {images.length}
        </p>
      </header>

      <div className="relative flex h-full items-center justify-center px-4 py-20 lg:px-24">
        <button
          type="button"
          onClick={goPrevious}
          className="absolute left-5 z-20 hidden size-12 items-center justify-center rounded-full bg-white text-black lg:flex"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="relative h-full max-h-[780px] w-full max-w-[1120px] overflow-hidden rounded-[24px]">
          <Image
            src={activeImage}
            alt={listingTitle}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-5 z-20 hidden size-12 items-center justify-center rounded-full bg-white text-black lg:flex"
        >
          <ArrowLeft size={18} className="rotate-180" />
        </button>
      </div>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 px-5">
        {images.map((image, index) => (
          <button
            key={`${image}-modal-dot-${index}`}
            type="button"
            onClick={() => onChangeImage(index)}
            className={`h-1.5 rounded-full transition-all ${
              activeImageIndex === index ? "w-7 bg-white" : "w-1.5 bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
