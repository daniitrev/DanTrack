export interface UserModel {
  email: string;
  username?: string;
}

export type AuthResponse = {
  user: UserModel;
};
