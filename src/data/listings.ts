import type { Listing } from "@/types/listing";

export const locationFilters = [
  "Braamfontein",
  "Rosebank",
  "Melville",
  "Maboneng",
  "Auckland Park",
  "Sandton",
];

export const moodFilters = [
  "All",
  "Going out",
  "Food",
  "Date night",
  "Chilled",
  "Creative",
  "Outdoors",
  "Study",
  "Affordable",
];

export const listings: Listing[] = [
  {
    id: "braam-night-market",
    slug: "braam-night-market",
    type: "event",
    title: "Braam Night Market",
    area: "Braamfontein",
    location: "Juta Street, Braamfontein",
    description:
      "Food stalls, music, student energy and a late-night market built for weekend plans.",
    category: "Market",
    moods: ["Going out", "Food", "Group friendly"],
    priceLabel: "From R80",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=85",
    ],
    owner: {
      name: "Braam Social Club",
      type: "Host",
      verified: true,
    },
    rating: 8.9,
    saves: 248,
    shares: 91,
    isFeatured: true,
    isHappeningToday: true,
    startsAt: "Tonight · 18:00",
    endsAt: "Late",
  },
  {
    id: "olive-oak-date-night",
    slug: "olive-oak-date-night",
    type: "place",
    title: "Olive & Oak",
    area: "Rosebank",
    location: "Keyes Avenue, Rosebank",
    description:
      "A warm restaurant listing for calm date nights, good lighting and easy conversation.",
    category: "Restaurant",
    moods: ["Date night", "Food", "Chilled"],
    priceLabel: "R250 avg",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=85",
    ],
    owner: {
      name: "Olive & Oak",
      type: "Business",
      verified: true,
    },
    rating: 9.2,
    saves: 184,
    shares: 67,
    isFeatured: true,
  },
  {
    id: "common-room-study-cafe",
    slug: "common-room-study-cafe",
    type: "place",
    title: "Common Room Café",
    area: "Auckland Park",
    location: "Kingsway Avenue, Auckland Park",
    description:
      "Coffee, Wi-Fi and quiet corners for students who need somewhere productive.",
    category: "Cafe",
    moods: ["Study", "Chilled", "Affordable"],
    priceLabel: "R70 avg",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85",
    ],
    owner: {
      name: "Common Room",
      type: "Business",
      verified: true,
    },
    rating: 8.6,
    saves: 112,
    shares: 31,
  },
  {
    id: "maboneng-art-walk",
    slug: "maboneng-art-walk",
    type: "experience",
    title: "Maboneng Art Walk",
    area: "Maboneng",
    location: "Fox Street, Maboneng",
    description:
      "A guided creative walk through galleries, street art, food stops and photo corners.",
    category: "Art",
    moods: ["Creative", "Date night", "Chilled"],
    priceLabel: "R150",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=85",
    ],
    owner: {
      name: "City Culture Walks",
      type: "Host",
      verified: false,
    },
    rating: 8.8,
    saves: 96,
    shares: 42,
    startsAt: "Saturday · 12:00",
    endsAt: "15:00",
  },
];
