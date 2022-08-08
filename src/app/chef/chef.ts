
export class ChefRegistrationDetail {
  email: string;
  profileName: string;
  profilePicture: string;
  aboutMe: string;
  cuisines: string[];
  sellPlan: string;
  referralCode?: string;
}

export type ChefDetailStatus = 'INITIAL' | 'LOADED' | 'FAILED' | 'UPDATINGPICTURE' | 'UPDATINGPICTURESUCCESS' | 'UPDATINGPICTUREFAILED';

export class ChefDetail {
  status: ChefDetailStatus;
  id: number;
  userId: number;
  profileName: string;
  profilePicture: string;
  aboutMe: string;
  cuisines: string[];
  sellPlan: string;
  activeOffers: number;
  mealsServed: number;
  rating: number;
  totalReviews: number;
  referralCode?: string;
  registeredAt: string;
}

export class UploadAvatarResponse {
  success: boolean;
  url: string;
}

export class UpdateChefProfileRequest {
  email: string;
  aboutMe?: string;
  cuisines?: string[];
}

export class ChefActivateWalletRequest {
  email?: string;
  // legalFirstName: string;
  // legalLastName: string;
  // billingAddressCity: string;
  // billingAddressPostcode: string;
  // billingAddressLine: string;
  // birthday: string;
  // accountNumber: string;
}

export class ChefWalletStripeDashboardLoginResponse {
  loginLinkUrl: string;
}

