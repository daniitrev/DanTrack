export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}
export interface LoginDto {
  email?: string;
  username?: string;
  password: string;
}

export interface UpdateDto{
  email?: string;
  name?: string;
  password?: string;
  image?: string;
}
