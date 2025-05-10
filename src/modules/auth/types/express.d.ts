import { UserPayload } from '../modules/auth/types/user-payload';

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}
