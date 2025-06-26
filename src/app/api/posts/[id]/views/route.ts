// src/app/api/posts/[id]/views/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { incrementPostViews } from '../../../../../../lib/database';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const newViews = incrementPostViews(id);
    
    return NextResponse.json({ views: newViews });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
