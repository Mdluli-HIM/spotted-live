"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Users,
  X,
} from "lucide-react";

import type { Listing } from "@/types/listing";

type BookingReviewExperienceProps = {
  listing: Listing;
};

export function BookingReviewExperience({
  listing,
}: BookingReviewExperienceProps) {
  return (
    <main className="min-h-dvh bg-[#f8f8f8] text-black">
      <section className="mx-auto flex min-h-dvh w-full max-w-[500px] flex-col px-5 py-5">
        <header className="flex items-center justify-between">
          <Link
            href={`/listings/${listing.slug}`}
            className="flex size-11 items-center justify-center rounded-full bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft size={18} />
          </Link>

          <Link
            href={`/listings/${listing.slug}`}
            className="flex size-11 items-center justify-center rounded-full bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
          >
            <X size={18} />
          </Link>
        </header>

        <section className="pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
            Reservation request
          </p>

          <h1 className="mt-4 text-[48px] font-semibold leading-[0.86] tracking-[-0.085em]">
            Request your spot.
          </h1>

          <p className="mt-4 max-w-[380px] text-[13px] leading-relaxed text-black/45">
            This is a clean frontend preview of the booking flow. Later the API
            will store the request, notify the place owner and track the status.
          </p>

          <div className="mt-7 overflow-hidden rounded-[34px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="relative h-[210px]">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                priority
                sizes="500px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-[11px] font-medium text-white/70">
                  Spot: {listing.area}
                </p>

                <h2 className="mt-2 max-w-[340px] text-[34px] font-semibold leading-[0.9] tracking-[-0.075em]">
                  {listing.title}
                </h2>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 divide-x divide-black/10 rounded-[24px] bg-[#f4f4f2] py-4 text-center">
                <div>
                  <p className="text-[16px] font-semibold">
                    {listing.rating.toFixed(1)}
                  </p>
                  <p className="mt-1 text-[10px] text-black/40">Rating</p>
                </div>

                <div>
                  <p className="text-[16px] font-semibold">{listing.saves}</p>
                  <p className="mt-1 text-[10px] text-black/40">Saves</p>
                </div>

                <div>
                  <p className="text-[16px] font-semibold">{listing.shares}</p>
                  <p className="mt-1 text-[10px] text-black/40">Shares</p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-black/10">
                <ReviewRow
                  icon={CalendarDays}
                  title="Date / time"
                  value={listing.startsAt ?? "Open today"}
                  action="Change"
                />

                <ReviewRow
                  icon={Users}
                  title="People"
                  value="1 person"
                  action="Edit"
                />

                <ReviewRow
                  icon={MapPin}
                  title="Spot"
                  value={`${listing.area} · ${listing.location}`}
                  action="View"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[30px] bg-[#1d1e20] p-5 text-white">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                <MessageCircle size={17} />
              </span>

              <div>
                <h3 className="text-[18px] font-semibold tracking-[-0.045em]">
                  What happens next?
                </h3>

                <p className="mt-2 text-[13px] leading-relaxed text-white/45">
                  We will use this screen later to send a real reservation
                  request to the place owner. For now, it shows the structure of
                  the booking flow.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <StepItem title="Confirm request details" />
              <StepItem title="Send request to owner" />
              <StepItem title="Track request status" />
            </div>
          </div>
        </section>

        <section className="mt-auto pt-5">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1d1e20] px-8 py-4 text-[13px] font-semibold text-white"
          >
            Continue request
            <CheckCircle2 size={16} />
          </button>

          <p className="mt-3 text-center text-[11px] leading-relaxed text-black/35">
            No payment required. This is a reservation request preview.
          </p>
        </section>
      </section>
    </main>
  );
}

function ReviewRow({
  icon: Icon,
  title,
  value,
  action,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  action: string;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f4f4f2]">
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold">{title}</p>
        <p className="mt-1 truncate text-[12px] text-black/45">{value}</p>
      </div>

      <button
        type="button"
        className="rounded-full bg-[#f4f4f2] px-4 py-2 text-[11px] font-semibold"
      >
        {action}
      </button>
    </div>
  );
}

function StepItem({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-white/8 px-4 py-3">
      <span className="text-[12px] font-semibold text-white/65">{title}</span>
      <span className="size-2 rounded-full bg-[var(--accent)]" />
    </div>
  );
}
