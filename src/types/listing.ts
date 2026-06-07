export type ListingType = "place" | "event" | "experience";

export type ListingCategory =
  | "Restaurant"
  | "Cafe"
  | "Nightlife"
  | "Market"
  | "Art"
  | "Outdoor"
  | "Study"
  | "Event"
  | "Experience";

export type ListingMood =
  | "Going out"
  | "Food"
  | "Date night"
  | "Chilled"
  | "Creative"
  | "Outdoors"
  | "Study"
  | "Group friendly"
  | "Affordable";

export type ListingOwner = {
  name: string;
  type: "Business" | "Host" | "Venue";
  verified: boolean;
};

export type Listing = {
  id: string;
  slug: string;
  type: ListingType;
  title: string;
  area: string;
  location: string;
  description: string;
  category: ListingCategory;
  moods: ListingMood[];
  priceLabel: string;
  image: string;
  images: string[];
  owner: ListingOwner;
  rating: number;
  saves: number;
  shares: number;
  isFeatured?: boolean;
  isHappeningToday?: boolean;
  startsAt?: string;
  endsAt?: string;
};
