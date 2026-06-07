"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Eye,
  MapPin,
  Plus,
  Share2,
  Sparkles,
  Store,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { useLocalOwnerListings } from "@/hooks/use-local-owner-listings";
import type { OwnerDraftListing } from "@/hooks/use-local-owner-listings";

export function OwnerDashboardExperience() {
  const { draftListings, clearListings } = useLocalOwnerListings();

  const stats = useMemo(() => {
    return {
      total: draftListings.length,
      pending: draftListings.filter((listing) => listing.status === "pending")
        .length,
      views: draftListings.length * 284,
      shares: draftListings.length * 37,
    };
  }, [draftListings]);

  return (
    <main className="min-h-dvh w-full overflow-hidden bg-[#f8f8f8]">
      <section className="min-h-dvh px-5 py-6 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between">
          <BrandWordmark />

          <div className="flex items-center gap-2">
            <Link
              href="/admin/moderation"
              className="hidden rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)] sm:inline-flex"
            >
              Admin review
            </Link>

            <Link
              href="/for-owners"
              className="hidden rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)] sm:inline-flex"
            >
              For owners
            </Link>

            <Link
              href="/owner/create-listing"
              className="rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
            >
              New listing
            </Link>
          </div>
        </header>

        <section className="pt-10 lg:pt-14">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-black/55 shadow-[0_14px_34px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft size={14} />
            Back to discover
          </Link>

          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                Owner dashboard
              </p>

              <h1 className="mt-5 max-w-[760px] text-[58px] font-medium leading-[0.84] tracking-[-0.09em] text-black sm:text-[78px] lg:text-[96px]">
                Manage what you want people to discover.
              </h1>

              <p className="mt-7 max-w-[520px] text-[15px] leading-relaxed text-black/48">
                This dashboard shows listings created in the frontend MVP. Once
                the API is connected, owners will manage real places, events,
                approvals and analytics here.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <DashboardMetric
                icon={Store}
                label="Listings"
                value={`${stats.total}`}
              />

              <DashboardMetric
                icon={Sparkles}
                label="Pending"
                value={`${stats.pending}`}
              />

              <DashboardMetric icon={Eye} label="Views" value={`${stats.views}`} />

              <DashboardMetric
                icon={Share2}
                label="Shares"
                value={`${stats.shares}`}
              />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="rounded-[36px] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
                  Your listings
                </p>

                <h2 className="mt-2 text-[38px] font-semibold leading-[0.9] tracking-[-0.075em] text-black">
                  Pending submissions
                </h2>
              </div>

              <div className="flex gap-2">
                {draftListings.length > 0 && (
                  <button
                    type="button"
                    onClick={clearListings}
                    className="rounded-full bg-[#f4f4f2] px-5 py-3 text-[12px] font-semibold text-black/45"
                  >
                    Clear demo data
                  </button>
                )}

                <Link
                  href="/owner/create-listing"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
                >
                  Add listing
                  <Plus size={14} />
                </Link>
              </div>
            </div>

            <div className="mt-7">
              {draftListings.length > 0 ? (
                <div className="grid gap-3">
                  {draftListings.map((listing) => (
                    <DraftListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <EmptyDashboardState />
              )}
            </div>
          </div>

          <aside className="rounded-[36px] bg-[#1d1e20] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              MVP note
            </p>

            <h2 className="mt-5 text-[42px] font-semibold leading-[0.86] tracking-[-0.08em]">
              Next this becomes a real owner portal.
            </h2>

            <p className="mt-5 text-[14px] leading-relaxed text-white/45">
              The API will store listings, approval status, images, events,
              owners and analytics permanently instead of using local storage.
            </p>

            <div className="mt-7 space-y-3">
              <RoadmapItem title="Owner accounts" />
              <RoadmapItem title="Admin approval" />
              <RoadmapItem title="Listing analytics" />
              <RoadmapItem title="Image uploads" />
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function DashboardMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-[28px] bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.05)]">
      <span className="flex size-11 items-center justify-center rounded-full bg-[#f4f4f2]">
        <Icon size={17} />
      </span>

      <p className="mt-5 text-[34px] font-semibold leading-none tracking-[-0.07em] text-black">
        {value}
      </p>

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/28">
        {label}
      </p>
    </article>
  );
}

function DraftListingCard({ listing }: { listing: OwnerDraftListing }) {
  const createdDate = new Date(listing.createdAt).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-[28px] bg-[#f4f4f2] p-4 transition-transform hover:scale-[1.005]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#1d1e20] px-3 py-2 text-[10px] font-semibold capitalize text-white">
              {listing.type}
            </span>

            <span className="rounded-full bg-white px-3 py-2 text-[10px] font-semibold capitalize text-black/45">
              {listing.status}
            </span>

            <span className="rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-black/45">
              {createdDate}
            </span>
          </div>

          <h3 className="mt-4 text-[28px] font-semibold leading-[0.9] tracking-[-0.07em] text-black">
            {listing.title}
          </h3>

          <p className="mt-2 max-w-[620px] text-[13px] leading-relaxed text-black/45">
            {listing.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {listing.moods.map((mood) => (
              <span
                key={mood}
                className="rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-black/45"
              >
                {mood}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 space-y-3 lg:w-[230px]">
          <InfoLine icon={Store} label={listing.ownerName} />
          <InfoLine
            icon={MapPin}
            label={`${listing.area} · ${listing.location}`}
          />
         <InfoLine icon={CalendarDays} label={listing.priceLabel} />

          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black">
            Preview listing
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function InfoLine({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <p className="flex items-start gap-2 text-[12px] font-medium leading-snug text-black/45">
      <Icon size={14} className="mt-0.5 shrink-0" />
      {label}
    </p>
  );
}

function EmptyDashboardState() {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-[30px] bg-[#f4f4f2] px-6 text-center">
      <div className="max-w-[420px]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white">
          <Store size={19} />
        </span>

        <h3 className="mt-6 text-[42px] font-semibold leading-[0.88] tracking-[-0.08em] text-black">
          No listings created yet.
        </h3>

        <p className="mt-4 text-[13px] leading-relaxed text-black/42">
          Create your first place, event or experience and it will appear here
          as a pending listing.
        </p>

        <Link
          href="/owner/create-listing"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1d1e20] px-6 py-4 text-[13px] font-semibold text-white"
        >
          Create listing
          <Plus size={15} />
        </Link>
      </div>
    </div>
  );
}

function RoadmapItem({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between rounded-[22px] bg-white/8 px-4 py-4">
      <span className="text-[13px] font-semibold text-white/72">{title}</span>
      <span className="size-2 rounded-full bg-[var(--accent)]" />
    </div>
  );
}
