import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const cookies = request.cookies.getAll();

    return NextResponse.json({
      hasSession: !!session,
      session: session ? {
        userId: session.user.id,
        email: session.user.email,
        sessionId: session.session.id,
      } : null,
      cookies: cookies.map(c => ({
        name: c.name,
        hasValue: !!c.value,
        valueLength: c.value?.length || 0,
      })),
      headers: {
        cookie: request.headers.get('cookie'),
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      hasSession: false,
    }, { status: 500 });
  }
}
