// src/app/api/auth/login/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'fallback-secret');

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: '잘못된 비밀번호입니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json({ message: '로그인 성공' });
    
    // HttpOnly 쿠키로 토큰 설정
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24시간
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
