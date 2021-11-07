import { UnauthorizedException } from '@nestjs/common';

export function checkAuth(authHeader: string) {
  if (authHeader == undefined) {
    throw new UnauthorizedException();
  }
  const tokenMatches = authHeader.match(/Bearer ([a-zA-Z0-9.\-_]+)/);
  if (tokenMatches == undefined) {
    throw new UnauthorizedException();
  }
  return tokenMatches[1];
}
