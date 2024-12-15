export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  status?: string;
  password: string;
}
