"use client";

import { useEffect, useMemo, useState } from "react";

import type { Listing, ListingCategory, ListingMood, ListingType } from "@/types/listing";

export type OwnerListingStatus = "pending" | "approved" | "rejected";

export type OwnerDraftListing = {
  id: string;
  type: ListingType;
  title: string;
  ownerName: string;
  area: string;
  location: string;
  priceLabel: string;
  description: string;
  moods: string[];
  status: OwnerListingStatus;
  createdAt: string;
};

export const OWNER_DRAFTS_STORAGE_KEY = "spotted.ownerDraftListings";

function isOwnerDraftListing(value: unknown): value is OwnerDraftListing {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<OwnerDraftListing>;

  return (
    typeof item.id === "string" &&
    typeof item.type === "string" &&
    typeof item.title === "string" &&
    typeof item.ownerName === "string" &&
    typeof item.area === "string" &&
    typeof item.location === "string" &&
    typeof item.priceLabel === "string" &&
    typeof item.description === "string" &&
    Array.isArray(item.moods) &&
    typeof item.status === "string" &&
    typeof item.createdAt === "string"
  );
}

function readOwnerDraftListings(): OwnerDraftListing[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(OWNER_DRAFTS_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isOwnerDraftListing);
  } catch {
    window.localStorage.removeItem(OWNER_DRAFTS_STORAGE_KEY);
    return [];
  }
}

function saveOwnerDraftListings(listings: OwnerDraftListing[]) {
  window.localStorage.setItem(
    OWNER_DRAFTS_STORAGE_KEY,
    JSON.stringify(listings),
  );
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function mapDraftToListing(draft: OwnerDraftListing): Listing {
  const category: ListingCategory =
    draft.type === "event"
      ? "Event"
      : draft.type === "experience"
        ? "Experience"
        : "Restaurant";

  return {
    id: draft.id,
    slug: makeSlug(draft.title) || draft.id,
    type: draft.type,
    title: draft.title,
    area: draft.area,
    location: draft.location,
    description: draft.description,
    category,
    moods: draft.moods as ListingMood[],
    priceLabel: draft.priceLabel,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85",
    ],
    owner: {
      name: draft.ownerName,
      type: draft.type === "event" ? "Host" : "Business",
      verified: false,
    },
    rating: 0,
    saves: 0,
    shares: 0,
    isFeatured: false,
    isHappeningToday: draft.type === "event",
  };
}

export function useLocalOwnerListings() {
  const [draftListings, setDraftListings] = useState<OwnerDraftListing[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDraftListings(readOwnerDraftListings());
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateListingStatus(id: string, status: OwnerListingStatus) {
    setDraftListings((current) => {
      const updated = current.map((listing) =>
        listing.id === id ? { ...listing, status } : listing,
      );

      saveOwnerDraftListings(updated);
      return updated;
    });
  }

  function clearListings() {
    window.localStorage.removeItem(OWNER_DRAFTS_STORAGE_KEY);
    setDraftListings([]);
  }

  const approvedListings = useMemo(
    () =>
      draftListings
        .filter((listing) => listing.status === "approved")
        .map(mapDraftToListing),
    [draftListings],
  );

  return {
    loaded,
    draftListings,
    approvedListings,
    updateListingStatus,
    clearListings,
  };
}
