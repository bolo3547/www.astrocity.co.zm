import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const TOKEN_NAME = 'auth-token';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export async function createToken(payload: AuthPayload): Promise<string> {
  return new SignJWT(payload as unknown as JoseJWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });

  return { 
    success: true, 
    user: { id: user.id, email: user.email, name: user.name, role: user.role } 
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getSession(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}
