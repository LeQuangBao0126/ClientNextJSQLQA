import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodedToken } from './lib/utils'
import { Role } from './constants/type'




const managePath = ['/manage'] //Owner , Employee
const guestPaths = ['/guest']   // Guest
const privatePaths = [...managePath, ...guestPaths]
const isAuthPaths = ['/login']


export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value


    //1. Chua đang nhập mà vào private path => login 
    if (managePath.some(path => pathname.startsWith(path)) && !refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    //2 . Đã đăng nhập 
    if (refreshToken) {
        // Cố vào login sẽ vào trang chủ 
        if (isAuthPaths.some(path => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        // đăng nhập rồi nhưng access token hết hạn => logout 
        if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken) {  // accesstoken het han 
            const url = new URL('/refresh-token', request.url)
            url.searchParams.set('refreshToken', request.cookies.get('refreshToken')?.value ?? "")
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
        }
        // 2.3 vào ko đúng role ,redirect về trang chủ 
        const role = decodedToken(refreshToken).role
        if (role === Role.Guest && managePath.some(path => pathname.startsWith(path)) ||
            role !== Role.Guest && guestPaths.some(path => pathname.startsWith(path))
        ) {
            return NextResponse.redirect(new URL("/", request.url))
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/manage/:path*', '/guest/:path*', '/login']
}