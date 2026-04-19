export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  accessToken: string;
  expiresAtUtc: string;
  user: AuthUser;
};
