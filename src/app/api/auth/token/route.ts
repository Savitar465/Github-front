import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'github_clone_token';

// POST - Guardar token en cookie
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Decodificar el token para obtener la expiración
    let maxAge = 60 * 60 * 24; // Default: 24 horas
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        maxAge = payload.exp - Math.floor(Date.now() / 1000);
      }
    } catch {
      // Usar default si no se puede decodificar
    }

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Auth API] Error setting token cookie:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// DELETE - Eliminar token cookie
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE_NAME);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Auth API] Error deleting token cookie:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
