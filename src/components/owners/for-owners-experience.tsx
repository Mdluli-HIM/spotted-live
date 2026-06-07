import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Plus,
  Store,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand/brand-wordmark";

const benefits = [
  {
    title: "List your place",
    description:
      "Create a public profile for your restaurant, café, venue, lounge, store or creative space.",
    icon: Store,
  },
  {
    title: "Post events",
    description:
      "Publish markets, student nights, live shows, brunches, pop-ups and weekend plans.",
    icon: CalendarDays,
  },
  {
    title: "Track interest",
    description:
      "Understand views, saves and shares so you know what people are responding to.",
    icon: ChartNoAxesColumnIncreasing,
  },
];

export function ForOwnersExperience() {
  return (
    <main className="min-h-dvh w-full overflow-hidden bg-[#f8f8f8]">
      <section className="min-h-dvh px-5 py-6 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between">
          <BrandWordmark />

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)] sm:inline-flex"
            >
              Back home
            </Link>

            <Link
              href="/owner/create-listing"
              className="rounded-full bg-[#1d1e20] px-5 py-3 text-[12px] font-semibold text-white"
            >
              Start listing
            </Link>
            
            <Link
              href="/owner/dashboard"
              className="hidden rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)] sm:inline-flex"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-10 pt-12 lg:min-h-[calc(100dvh-96px)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:pt-0">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
              For owners and hosts
            </p>

            <h1 className="mt-5 max-w-[760px] text-[58px] font-medium leading-[0.84] tracking-[-0.09em] text-black sm:text-[78px] lg:text-[104px]">
              Publish what people can do at your place.
            </h1>

            <p className="mt-7 max-w-[520px] text-[15px] leading-relaxed text-black/48">
              SPOTTED helps restaurants, cafés, venues, event hosts and
              experience creators reach people searching for plans nearby.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/owner/create-listing"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1d1e20] px-7 py-4 text-[13px] font-semibold text-white"
              >
                Create your first listing
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-[13px] font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.05)]"
              >
                Explore SPOTTED
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="rounded-[34px] bg-white p-6 shadow-[0_18px_44px_rgba(0,0,0,0.05)]"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#f4f4f2]">
                    <Icon size={21} />
                  </span>

                  <h2 className="mt-7 text-[36px] font-semibold leading-[0.9] tracking-[-0.075em] text-black">
                    {benefit.title}
                  </h2>

                  <p className="mt-4 max-w-[460px] text-[14px] leading-relaxed text-black/45">
                    {benefit.description}
                  </p>
                </article>
              );
            })}

            <article className="rounded-[34px] bg-[#1d1e20] p-6 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Coming with the API
              </p>

              <h2 className="mt-5 text-[40px] font-semibold leading-[0.88] tracking-[-0.08em]">
                Owner dashboard, approval and analytics.
              </h2>

              <p className="mt-4 max-w-[440px] text-[14px] leading-relaxed text-white/45">
                Once the backend is connected, owners will manage listings,
                submit events for approval and track views, saves and shares.
              </p>

              <Link
                href="/owner/create-listing"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-[13px] font-semibold text-black"
              >
                Start listing
                <Plus size={15} />
              </Link>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
