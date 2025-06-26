// lib/auth.ts
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'fallback-secret');

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return false;
    }

    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error('Authentication required');
  }
}
