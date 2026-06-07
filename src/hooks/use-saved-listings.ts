"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "spotted.savedListingIds";

function readSavedListingIds() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item) => typeof item === "string")
      : [];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveSavedListingIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useSavedListings() {
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSavedListingIds(readSavedListingIds());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function toggleSavedListing(listingId: string) {
    setSavedListingIds((current) => {
      const updated = current.includes(listingId)
        ? current.filter((id) => id !== listingId)
        : [...current, listingId];

      saveSavedListingIds(updated);
      return updated;
    });
  }

  function isListingSaved(listingId: string) {
    return savedListingIds.includes(listingId);
  }

  return {
    savedListingIds,
    toggleSavedListing,
    isListingSaved,
  };
}
