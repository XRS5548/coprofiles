// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register'];
const managerRoutes = ['/manager'];
const userRoutes = ['/dashboard', '/projects', '/internships', '/applications'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // Verify token
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        
        const roleType = payload.roleType as string;
        
        // Check manager routes
        if (managerRoutes.some(route => pathname.startsWith(route))) {
            if (roleType !== 'manager') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
        
        // Check user routes
        if (userRoutes.some(route => pathname.startsWith(route))) {
            if (roleType !== 'user' && roleType !== 'manager') {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
        
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/manager/:path*',
        '/projects/:path*',
        '/internships/:path*',
        '/applications/:path*',
        '/api/user/:path*',
        '/api/manager/:path*',
    ],
};