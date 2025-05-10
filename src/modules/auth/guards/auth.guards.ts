// src/modules/auth/guards/auth.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('Missing token');

    let token = authHeader;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT secret not set');

      const decoded = jwt.verify(token, secret) as {
        _id: string;
        email_id: string;
        email: string;
      };

      // Gán thông tin giống Go: _id, email_id, email
      (request as any).user = {
        _id: decoded._id,
        email_id: decoded.email_id,
        email: decoded.email,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
