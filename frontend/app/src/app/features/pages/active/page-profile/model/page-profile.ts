import { HttpEntity } from '../../../../../shared/loadStateFunction';

export interface UserProfile {
  userId?: string;
  email: string;
  name: string | null;
  image: string | null;
  role?: string;
}

export interface UserProfileResponse {
  user: UserProfile;
}

export interface UpdateProfilePayload {
  email?: string;
  name?: string;
  password?: string;
  image?: string;
}

export interface UpdateProfileResponse {
  user: {
    updates: UserProfile;
  };
}

export interface UserProfilePageData {
  page: HttpEntity<UserProfile | null>;
}
