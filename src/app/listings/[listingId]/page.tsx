import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingDetailExperience } from "@/components/listings/listing-detail-experience";
import { listings } from "@/data/listings";
import { getListingByIdOrSlug, getSimilarListings } from "@/lib/listings";

type ListingPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export function generateStaticParams() {
  return listings.map((listing) => ({
    listingId: listing.slug,
  }));
}

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { listingId } = await params;
  const listing = getListingByIdOrSlug(listingId);

  if (!listing) {
    return {
      title: "Listing not found — SPOTTED",
    };
  }

  return {
    title: `${listing.title} — SPOTTED`,
    description: listing.description,
    openGraph: {
      title: `${listing.title} — SPOTTED`,
      description: listing.description,
      images: [
        {
          url: listing.image,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.title} — SPOTTED`,
      description: listing.description,
      images: [listing.image],
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { listingId } = await params;
  const listing = getListingByIdOrSlug(listingId);

  if (!listing) {
    notFound();
  }

  const similarListings = getSimilarListings(listing);

  return (
    <ListingDetailExperience
      listing={listing}
      similarListings={similarListings}
    />
  );
}
