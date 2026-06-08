import { notFound } from "next/navigation";

import { BookingReviewExperience } from "@/components/bookings/booking-review-experience";
import { listings } from "@/data/listings";

type BookingPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export function generateStaticParams() {
  return listings.map((listing) => ({
    listingId: listing.slug,
  }));
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { listingId } = await params;

  const listing = listings.find(
    (item) => item.slug === listingId || item.id === listingId,
  );

  if (!listing) {
    notFound();
  }

  return <BookingReviewExperience listing={listing} />;
}
