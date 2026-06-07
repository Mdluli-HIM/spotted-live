"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { locationFilters, moodFilters } from "@/data/listings";
import type { ListingType } from "@/types/listing";

export function CreateListingExperience() {
  const [listingType, setListingType] = useState<ListingType>("place");
  const [title, setTitle] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [area, setArea] = useState(locationFilters[0] ?? "Braamfontein");
  const [location, setLocation] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Food"]);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");

  function toggleMood(mood: string) {
    setSelectedMoods((current) =>
      current.includes(mood)
        ? current.filter((item) => item !== mood)
        : [...current, mood],
    );
  }

  function submitListing() {
    setError("");

    if (
      title.trim().length < 3 ||
      ownerName.trim().length < 2 ||
      location.trim().length < 5 ||
      priceLabel.trim().length < 2 ||
      description.trim().length < 20
    ) {
      setError(
        "Please complete the listing name, owner name, location, price and description.",
      );
      return;
    }

    const draftListing = {
      id: `draft-${Date.now()}`,
      type: listingType,
      title: title.trim(),
      ownerName: ownerName.trim(),
      area,
      location: location.trim(),
      priceLabel: priceLabel.trim(),
      description: description.trim(),
      moods: selectedMoods,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const currentDrafts = JSON.parse(
      window.localStorage.getItem("spotted.ownerDraftListings") ?? "[]",
    );

    window.localStorage.setItem(
      "spotted.ownerDraftListings",
      JSON.stringify([draftListing, ...currentDrafts]),
    );

    setPublished(true);
  }

  if (published) {
    return (
      <main className="flex min-h-dvh w-full items-center justify-center bg-[#f8f8f8] px-5">
        <section className="w-full max-w-[620px] rounded-[38px] bg-white p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--accent)]">
            <Check size={22} />
          </span>

          <h1 className="mt-7 text-[48px] font-semibold leading-[0.88] tracking-[-0.08em] text-black">
            Listing saved as pending.
          </h1>

          <p className="mx-auto mt-5 max-w-[420px] text-[14px] leading-relaxed text-black/45">
            For now this has been saved locally. When we connect the API, this
            will be submitted to the backend for review and approval.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/owner/dashboard"
              className="rounded-full bg-[#1d1e20] px-6 py-4 text-[13px] font-semibold text-white"
            >
              View dashboard
            </Link>

            <Link
              href="/"
              className="rounded-full bg-[#f4f4f2] px-6 py-4 text-[13px] font-semibold text-black"
            >
              Back to discover
            </Link>

            <Link
              href="/for-owners"
              className="rounded-full bg-[#f4f4f2] px-6 py-4 text-[13px] font-semibold text-black"
            >
              Owner page
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full overflow-hidden bg-[#f8f8f8]">
      <section className="grid min-h-dvh gap-10 px-5 py-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-8">
        <div>
          <header className="flex items-center justify-between">
            <BrandWordmark />

            <Link
              href="/for-owners"
              className="flex size-11 items-center justify-center rounded-full bg-white shadow-[0_14px_34px_rgba(0,0,0,0.05)]"
            >
              <ArrowLeft size={18} />
            </Link>
          </header>

          <section className="pt-10 lg:pt-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/25">
              Create listing
            </p>

            <h1 className="mt-4 max-w-[620px] text-[54px] font-medium leading-[0.84] tracking-[-0.09em] text-black lg:text-[86px]">
              Add what people can do.
            </h1>

            <p className="mt-5 max-w-[460px] text-[14px] leading-relaxed text-black/45">
              Create a place, event or experience. This frontend MVP stores it
              locally until we connect the API.
            </p>
          </section>
        </div>

        <section className="space-y-4 pb-10">
          <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
              Listing type
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Place", value: "place" as const },
                { label: "Event", value: "event" as const },
                { label: "Experience", value: "experience" as const },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setListingType(item.value)}
                  className={`rounded-[22px] px-4 py-5 text-left text-[12px] font-semibold ${
                    listingType === item.value
                      ? "bg-[#1d1e20] text-white"
                      : "bg-[#f4f4f2] text-black/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <FormField
            label="Listing name"
            value={title}
            onChange={setTitle}
            placeholder="Example: Sunday Rooftop Brunch"
          />

          <FormField
            label="Owner or business name"
            value={ownerName}
            onChange={setOwnerName}
            placeholder="Example: Braam Social Club"
          />

          <div className="rounded-[26px] bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
              Area
            </label>

            <select
              value={area}
              onChange={(event) => setArea(event.target.value)}
              className="mt-3 w-full bg-transparent text-[16px] font-semibold text-black outline-none"
            >
              {locationFilters.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <FormField
            label="Exact location"
            value={location}
            onChange={setLocation}
            placeholder="Street name, venue address or landmark"
          />

          <FormField
            label="Price"
            value={priceLabel}
            onChange={setPriceLabel}
            placeholder="Example: From R80"
          />

          <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what people can expect..."
              rows={5}
              className="mt-3 w-full resize-none bg-transparent text-[15px] leading-relaxed text-black outline-none placeholder:text-black/25"
            />
          </div>

          <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
              Moods
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {moodFilters
                .filter((mood) => mood !== "All")
                .map((mood) => {
                  const selected = selectedMoods.includes(mood);

                  return (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => toggleMood(mood)}
                      className={`rounded-full px-4 py-2.5 text-[11px] font-semibold ${
                        selected
                          ? "bg-[var(--accent)] text-black"
                          : "bg-[#f4f4f2] text-black/45"
                      }`}
                    >
                      {mood}
                    </button>
                  );
                })}
            </div>
          </div>

          {error && (
            <p className="rounded-full bg-[#f7ece7] px-5 py-3 text-[12px] font-semibold text-[#9c4b36]">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={submitListing}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#1d1e20] px-6 py-4 text-[14px] font-semibold text-white"
          >
            Submit listing for approval
            <ArrowRight size={16} />
          </button>
        </section>
      </section>
    </main>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-[26px] bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.04)]">
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/25">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full bg-transparent text-[16px] font-semibold text-black outline-none placeholder:text-black/22"
      />
    </div>
  );
}
