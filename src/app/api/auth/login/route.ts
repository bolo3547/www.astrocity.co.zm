import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const loginResult = await login(email, password);

    if (!loginResult.success) {
      return NextResponse.json(
        { error: loginResult.error },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user: loginResult.user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
