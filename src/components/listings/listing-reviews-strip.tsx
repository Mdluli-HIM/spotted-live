"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import type { ListingReview } from "@/types/listing";

type ListingReviewsStripProps = {
  reviews: ListingReview[];
};

export function ListingReviewsStrip({ reviews }: ListingReviewsStripProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function scrollReviews(direction: "left" | "right") {
    if (!scrollerRef.current) return;

    const amount = 280;

    scrollerRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  if (!reviews.length) {
    return null;
  }

  return (
    <section className="border-t border-black/8 pt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/28">
            Community reviews
          </p>

          <h2 className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.05em] text-black">
            What people are saying
          </h2>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollReviews("left")}
            className="flex size-11 items-center justify-center rounded-full bg-[#f3f3f1] text-black transition hover:bg-[#e9e9e6]"
            aria-label="Scroll reviews left"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => scrollReviews("right")}
            className="flex size-11 items-center justify-center rounded-full bg-[#1d1e20] text-white transition hover:opacity-90"
            aria-label="Scroll reviews right"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-2"
      >
        {reviews.map((review) => (
          <article
            key={review.id}
            className="min-w-[270px] max-w-[270px] shrink-0 rounded-[28px] bg-[#f4f4f2] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-start gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[14px] font-semibold text-black">
                  {review.name}
                </h3>

                <p className="mt-0.5 text-[11px] text-black/45">
                  {review.location}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-black/55">
                  <span className="flex items-center gap-1">
                    <Star
                      size={12}
                      fill="currentColor"
                      className="text-black"
                    />
                    {review.rating.toFixed(1)}
                  </span>

                  <span className="text-black/22">•</span>

                  <span>{review.timeAgo}</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-[1.6] text-black/68">
              {review.comment}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-black/32">
        Swipe on mobile or use the arrows to browse reviews.
      </p>
    </section>
  );
}
