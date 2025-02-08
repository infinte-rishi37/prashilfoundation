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

      // Check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select()
        .eq('id', user.id)
        .single();

      // Redirect based on user role
      if (adminUser) {
        return NextResponse.redirect(`${requestUrl.origin}/admin`);
      } else {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
      }
    }
  }

  // Handle error cases
  return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=auth`);
}