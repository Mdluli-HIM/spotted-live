"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  Eye,
  MapPin,
  ShieldCheck,
  Store,
  Trash2,
  X,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { useLocalOwnerListings } from "@/hooks/use-local-owner-listings";

export function AdminModerationExperience() {
  const {
    loaded,
    draftListings,
    updateListingStatus,
    clearListings,
  } = useLocalOwnerListings();

  const pendingListings = draftListings.filter(
    (listing) => listing.status === "pending",
  );

  const approvedListings = draftListings.filter(
    (listing) => listing.status === "approved",
  );

  const rejectedListings = draftListings.filter(
    (listing) => listing.status === "rejected",
  );

  return (
    <main className="min-h-dvh w-full overflow-hidden bg-[#f8f8f8]">
      <section className="min-h-dvh px-5 py-6 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between">
          <BrandWordmark />

          <div className="flex items-center gap-2">
            <Link
              href="/owner/dashboard"
              className="hidden rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)] sm:inline-flex"
            >
              Owner dashboard
            </Link>

            <Link
              href="/"
              className="rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
            >
              Discover
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

          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
                Admin moderation
              </p>

              <h1 className="mt-5 max-w-[760px] text-[58px] font-medium leading-[0.84] tracking-[-0.09em] text-black sm:text-[78px] lg:text-[96px]">
                Review owner-submitted listings.
              </h1>

              <p className="mt-7 max-w-[520px] text-[15px] leading-relaxed text-black/48">
                This admin preview lets us approve or reject owner listings
                before they appear publicly in the discovery feed.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <ModerationMetric
                icon={Clock}
                label="Pending"
                value={`${pendingListings.length}`}
              />

              <ModerationMetric
                icon={ShieldCheck}
                label="Approved"
                value={`${approvedListings.length}`}
              />

              <ModerationMetric
                icon={X}
                label="Rejected"
                value={`${rejectedListings.length}`}
              />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="rounded-[36px] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
                  Queue
                </p>

                <h2 className="mt-2 text-[38px] font-semibold leading-[0.9] tracking-[-0.075em] text-black">
                  Pending review
                </h2>
              </div>

              {draftListings.length > 0 && (
                <button
                  type="button"
                  onClick={clearListings}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f4f4f2] px-5 py-3 text-[12px] font-semibold text-black/45"
                >
                  <Trash2 size={14} />
                  Clear demo data
                </button>
              )}
            </div>

            <div className="mt-7">
              {!loaded ? (
                <EmptyModerationState title="Loading submissions..." />
              ) : pendingListings.length > 0 ? (
                <div className="grid gap-3">
                  {pendingListings.map((listing) => (
                    <ModerationCard
                      key={listing.id}
                      listing={listing}
                      onApprove={() =>
                        updateListingStatus(listing.id, "approved")
                      }
                      onReject={() =>
                        updateListingStatus(listing.id, "rejected")
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyModerationState title="No pending listings." />
              )}
            </div>
          </div>

          <aside className="rounded-[36px] bg-[#1d1e20] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              How to test
            </p>

            <h2 className="mt-5 text-[42px] font-semibold leading-[0.86] tracking-[-0.08em]">
              Create, approve, then discover.
            </h2>

            <div className="mt-7 space-y-3">
              <StepItem title="Create a listing as an owner." />
              <StepItem title="Approve it in this moderation page." />
              <StepItem title="Go back to Discover." />
              <StepItem title="Approved listing appears publicly." />
            </div>

            <Link
              href="/owner/create-listing"
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-[13px] font-semibold text-black"
            >
              Create test listing
            </Link>
          </aside>
        </section>
      </section>
    </main>
  );
}

function ModerationMetric({
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

type ModerationCardProps = {
  listing: {
    id: string;
    type: string;
    title: string;
    ownerName: string;
    area: string;
    location: string;
    priceLabel: string;
    description: string;
    moods: string[];
    createdAt: string;
  };
  onApprove: () => void;
  onReject: () => void;
};

function ModerationCard({
  listing,
  onApprove,
  onReject,
}: ModerationCardProps) {
  const createdDate = new Date(listing.createdAt).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-[28px] bg-[#f4f4f2] p-4">
      <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#1d1e20] px-3 py-2 text-[10px] font-semibold capitalize text-white">
              {listing.type}
            </span>

            <span className="rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-black/45">
              {createdDate}
            </span>
          </div>

          <h3 className="mt-4 text-[30px] font-semibold leading-[0.9] tracking-[-0.07em] text-black">
            {listing.title}
          </h3>

          <p className="mt-2 max-w-[680px] text-[13px] leading-relaxed text-black/45">
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

        <div className="space-y-3">
          <InfoLine icon={Store} label={listing.ownerName} />
          <InfoLine
            icon={MapPin}
            label={`${listing.area} · ${listing.location}`}
          />
          <InfoLine icon={Eye} label={listing.priceLabel} />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onReject}
              className="flex flex-1 item-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black"
            >
              <X size={14} />
              Reject
            </button>

            <button
              type="button"
              onClick={onApprove}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
            >
              <Check size={14} />
              Approve
            </button>
          </div>
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

function EmptyModerationState({ title }: { title: string }) {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-[30px] bg-[#f4f4f2] px-6 text-center">
      <div className="max-w-[420px]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white">
          <ShieldCheck size={19} />
        </span>

        <h3 className="mt-6 text-[42px] font-semibold leading-[0.88] tracking-[-0.08em] text-black">
          {title}
        </h3>

        <p className="mt-4 text-[13px] leading-relaxed text-black/42">
          New owner submissions will appear here for approval.
        </p>

        <Link
          href="/owner/create-listing"
          className="mt-7 inline-flex items-center rounded-full bg-[#1d1e20] px-6 py-4 text-[13px] font-semibold text-white"
        >
          Create test listing
        </Link>
      </div>
    </div>
  );
}

function StepItem({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between rounded-[22px] bg-white/8 px-4 py-4">
      <span className="text-[13px] font-semibold text-white/72">{title}</span>
      <span className="size-2 rounded-full bg-[var(--accent)]" />
    </div>
  );
}
