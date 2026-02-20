import type { PublicUser } from './user.js';

export interface Review {
  id: number;
  routeId: number;
  authorId: number;
  rating: number;
  title: string | null;
  body: string;
  climbDate: string | null;
  conditions: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewWithAuthor extends Review {
  author: PublicUser;
}

export interface Tip {
  id: number;
  routeId: number;
  authorId: number;
  content: string;
  category: string;
  createdAt: string;
  author: PublicUser;
}

export interface GearLink {
  id: number;
  gearId: number;
  retailer: string;
  productName: string;
  url: string;
  price: number | null;
  createdAt: string;
}

export interface GearRecommendation {
  id: number;
  routeId: number;
  authorId: number;
  itemName: string;
  category: string;
  isEssential: boolean;
  notes: string | null;
  weight: string | null;
  priceRange: string | null;
  specificProduct: string | null;
  createdAt: string;
  author: PublicUser;
  links: GearLink[];
}

export interface ClimbLog {
  id: number;
  userId: number;
  peakId: number;
  routeId: number | null;
  date: string;
  notes: string | null;
  conditions: string | null;
  success: boolean;
  duration: number | null;
  photos: string[] | null;
  rating: number | null;
  isPublic: boolean;
  elevationGain: number | null;
  createdAt: string;
  peakName: string;
  peakElevation: number;
  routeName: string | null;
}
