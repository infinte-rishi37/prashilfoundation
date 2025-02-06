import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs';
import {NextResponse, NextRequest} from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({req, res});
    const {
        data: { session }
    } = await supabase.auth.getSession();
    
    if (!session) {
        return NextResponse.rewrite(new URL('/auth/sign-in'));
    }  

    console.log(session);

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next
         * - static (static files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next|static|favicon.ico).*)",
    ],
}