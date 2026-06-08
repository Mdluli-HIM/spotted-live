"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Star, Users, X } from "lucide-react";

import type { Listing } from "@/types/listing";

type BookingReviewExperienceProps = {
  listing: Listing;
};

export function BookingReviewExperience({
  listing,
}: BookingReviewExperienceProps) {
  return (
    <main className="min-h-dvh bg-white text-black">
      <section className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col px-5 py-5">
        <header className="flex items-center justify-between">
          <Link
            href={`/listings/${listing.slug}`}
            className="flex size-11 items-center justify-center rounded-full bg-[#f4f4f2]"
          >
            <ArrowLeft size={18} />
          </Link>

          <Link
            href={`/listings/${listing.slug}`}
            className="flex size-11 items-center justify-center rounded-full bg-[#f4f4f2]"
          >
            <X size={18} />
          </Link>
        </header>

        <section className="pt-8">
          <h1 className="text-[32px] font-semibold leading-[0.95] tracking-[-0.065em]">
            Review and continue
          </h1>

          <div className="mt-6 rounded-[24px] border border-black/10 p-4">
            <div className="flex gap-4">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-[18px]">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[17px] font-semibold leading-tight tracking-[-0.04em]">
                  {listing.title}
                </h2>

                <p className="mt-1 text-[12px] text-black/45">
                  Spot: {listing.area}
                </p>

                <p className="mt-2 flex items-center gap-1 text-[12px] font-semibold">
                  <Star size={13} fill="currentColor" />
                  {listing.rating.toFixed(1)}
                </p>
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
                title="Guests"
                value="1 person"
                action="Change"
              />

              <ReviewRow
                icon={MapPin}
                title="Location"
                value={listing.location}
                action="View"
              />
            </div>

            <div className="mt-5 rounded-[18px] bg-[#f4f4f2] p-4">
              <p className="text-[1px] font-semibold">Reservation note</p>

              <p className="mt-2 text-[12px] leading-relaxed text-black/50">
                This is the frontend booking preview. When we connect the API,
                this step will create a reservation request, store the guest
                details, notify the place owner and track the request status.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-auto border-t border-black/10 pt-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold">Reservation request</p>

              <p className="mt-1 text-[11px] text-black/45">
                No payment required
              </p>
            </div>

            <button
              type="button"
              className="rounded-full bg-[#1d1e20] px-8 py-4 text-[13px] font-semibold text-white"
            >
              Continue
            </button>
          </div>
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
