import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * Purge du cache à la publication WordPress.
 * Usage : POST /api/revalidate?secret=TON_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { message: 'Revalidation failed', error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
