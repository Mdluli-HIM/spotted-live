"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Heart,
  MapPin,
  Share2,
  Star,
} from "lucide-react";

import { useSavedListings } from "@/hooks/use-saved-listings";
import { BrandWordmark } from "@/components/brand/brand-wordmark";
import type { Listing } from "@/types/listing";

type ListingDetailExperienceProps = {
  listing: Listing;
  similarListings: Listing[];
};

export function ListingDetailExperience({
  listing,
  similarListings,
}: ListingDetailExperienceProps) {
  const { isListingSaved, toggleSavedListing } = useSavedListings();
  const saved = isListingSaved(listing.id);
  const [copied, setCopied] = useState(false);

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

  return (
    <main className="min-h-dvh w-full overflow-hidden bg-[#f8f8f8] lg:bg-[#f8f8f8]">
      <section className="lg:grid lg:min-h-dvh lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative h-[430px] overflow-hidden lg:h-auto lg:min-h-dvh">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

          <div className="absolute left-5 right-5 top-6 flex items-center justify-between lg:left-8 lg:ght-8 lg:top-8">
            <Link
              href="/"
              className="flex size-12 items-center justify-center rounded-full bg-white text-black shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleSavedListing(listing.id)}
                className={`flex size-12 items-center justify-center rounded-full shadow-[0_14px_34px_rgba(0,0,0,0.12)] ${
                  saved ? "bg-[#1d1e20] text-white" : "bg-white text-black"
                }`}
              >
                <Heart size={19} fill={saved ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={shareListing}
                className="flex size-12 items-center justify-center rounded-full bg-white text-black shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
              >
                {copied ? <Copy size={18} /> : <Share2 size={18} />}
              </button>
            </div>
          </div>

          <div className="absolute bottom-8 left-5 right-5 text-white lg:bottom-10 lg:left-10 lg:right-10">
            <p className="flex items-center gap-2 text-[12px] font-medium text-white/75 lg:text-[13px]">
              <MapPin size={15} />
              {listing.location}
            </p>

            <h1 className="mt-3 max-w-[700px] text-[52px] font-semibold leading-[0.84] tracking-[-0.09em] lg:text-[92px]">
              {listing.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-4 py-2.5 text-[11px] font-semibold text-white backdrop-blur-xl">
                {listing.type}
              </span>

              <span className="rounded-full bg-white/15 px-4 py-2.5 text-[11px] font-semibold text-white backdrop-blur-xl">
                {listing.category}
              </span>

              {listing.isHappeningToday && (
                <span className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-[11px] font-semibold text-black">
                  Happening today
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="-mt-9 rounded-t-[38px] bg-[#f8f8f8] px-5 pb-28 pt-6 lg:mt-0 lg:min-h-dvh lg:overflow-y-auto lg:rounded-none lg:px-10 lg:py-8">
          <div className="mx-auto h-1 w-12 rounded-full bg-black/10 lg:hidden" />

          <header className="hidden items-center justify-between lg:flex">
            <BrandWordmark />

            <Link
              href="/"
              className="rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)]"
            >
              Back home
            </Link>
          </header>

          <section className="mt-7 lg:mt-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
              Listing overview
            </p>

            <h2 className="mt-4 text-[38px] font-semibold leading-[0.9] tracking-[-0.08em] text-black lg:text-[58px]">
              A local plan worth sharing.
            </h2>

            <p className="mt-5 text-[14px] leading-relaxed text-black/55 lg:max-w-[560px] lg:text-[15px]">
              {listing.description}
            </p>
          </section>

          <section className="mt-7 grid grid-cols-2 gap-3">
            <InfoCard label="Price" value={listing.priceLabel} />
            <InfoCard label="Area" value={listing.area} />
            <InfoCard label="Starts" value={listing.startsAt ?? "Open today"} />
            <InfoCard label="Rating" value={listing.rating.toFixed(1)} />
          </section>

          <section className="mt-8 rounded-[30px] bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
                  Hosted by
                </p>

                <h3 className="mt-2 text-[25px] font-semibold leading-none tracking-[-0.06em] text-black">
                  {listing.owner.name}
                </h3>

                <p className="mt-2 text-[12px] font-medium text-black/35">
                  {listing.owner.type}
                </p>
              </div>

              {listing.owner.verified && (
                <span className="flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-4 py-2.5 text-[11px] font-semibold text-[var(--accent-strong)]">
                  <CheckCircle2 size={13} />
                  Verified
                </span>
              )}
            </div>
          </section>

          <section className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
              Moods
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {listing.moods.map((mood) => (
                <span
                  key={mood}
                  className="rounded-full bg-white px-4 py-2.5 text-[11px] font-semibold text-black/45"
                >
                  {mood}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-9">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
                  Similar nearby
                </p>

                <h3 className="mt-2 text-[26px] font-semibold leading-none tracking-[-0.06em] text-black">
                  More plans to explore
                </h3>
              </div>

              <span className="text-[12px] font-semibold text-black/35">
                {similarListings.length} found
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {similarListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/listings/${item.slug}`}
                  className="flex items-center gap-4 rounded-[24px] bg-white p-3 shadow-[0_14px_34px_rgba(0,0,0,0.04)] transition-transform hover:scale-[1.01]"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-[18px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold tracking-[-0.04em] text-black">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] font-medium text-black/35">
                      {item.area} · {item.priceLabel}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-black/55">
                      <Star size={12} fill="currentColor" />
                      {item.rating.toFixed(1)}
                    </p>
                  </div>

                  <span className="flex size-10 items-center justify-center rounded-full bg-[#f4f4f2] text-black">
                    <ArrowRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+20px)] left-5 right-5 z-40 flex gap-3 lg:hidden">
        <button
          type="button"
          onClick={shareListing}
          className="flex size-14 items-center justify-center rounded-full bg-white text-black shadow-[0_14px_34px_rgba(0,0,0,0.14)]"
        >
          {copied ? <Copy size={18} /> : <Share2 size={18} />}
        </button>

        <button className="flex flex-1 items-center justify-center rounded-full bg-[#1d1e20] px-5 py-4 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)]">
          View details
        </button>
      </div>
    </main>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/25">
        {label}
      </p>

      <p className="mt-2 text-[14px] font-semibold leading-tight text-black">
        {value}
      </p>
    </div>
  );
}
