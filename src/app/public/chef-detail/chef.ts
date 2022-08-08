import { PublicOfferInfo } from "../results-page/+state/result.reducer";

export class PublicChefDetail {
  id: number;
  profileName: string;
  profilePicture: string;
  aboutMe: string;
  cuisines: string[];
  activeOffers: number;
  mealsServed: number;
  rating: number;
  totalReviews: number;
  offers: PublicOfferInfo[];
}

export class PublicChefSuggestionInfo {
  chefId: number;
  chefProfileName: string;
}