import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Check if user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('id', user.id)
        .single();

      // If user doesn't exist, create a new user record
      if (!existingUser) {
        await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            username: user.email?.split('@')[0] || `user_${Math.random().toString(36).slice(2, 7)}`,
          });
      }

      // Redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }
  }

  // Handle error cases by redirecting to dashboard anyway since the session might already exist
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}