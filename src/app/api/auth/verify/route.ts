// src/app/api/auth/verify/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'fallback-secret');

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await jwtVerify(token, secret);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
