import { sign, verify } from 'jsonwebtoken';

export function generateToken(userdata: string | object, expiresIn: string | undefined = '5s') {
  return sign(userdata, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
}

export function verifyToken(token: string, ignoreExpired = false) {
  try {
    const data = verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: ignoreExpired,
    });
    return { data, expired: ignoreExpired ? true : false };
  } catch (err: any) {
    return { data: null, expired: err.message.includes('jwt expired') };
  }
}
