import { listings } from "@/data/listings";
import type { Listing } from "@/types/listing";

export function getListingByIdOrSlug(listingId: string) {
  return listings.find(
    (listing) => listing.id === listingId || listing.slug === listingId,
  );
}

export function getSimilarListings(listing: Listing) {
  return listings
    .filter((item) => item.id !== listing.id)
    .filter((item) => {
      const sameArea = item.area === listing.area;
      const sameCategory = item.category === listing.category;
      const sharedMood = item.moods.some((mood) =>
        listing.moods.includes(mood),
      );

      return sameArea || sameCategory || sharedMood;
    })
    .slice(0, 3);
}
