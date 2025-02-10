import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import path from 'path'



const privatePaths = [ '/manage']
const isAuthPaths= ['/login'  ]

export function middleware(request: NextRequest) {
    const {pathname } =request.nextUrl
    
    const isAuth = Boolean( request.cookies.get('accessToken')?.value )
    // chua dang nhap thi ko cho vao private path 
    if(privatePaths.some(path => pathname.startsWith(path)) && !isAuth) { 
        return NextResponse.redirect('/login')
    } 
    // dnagnhap roi thi se ko cho vao login nữa
    if(isAuthPaths.some(path => pathname.startsWith(path)) && isAuth) { 
        return NextResponse.redirect ( new URL('/')) 
    } 
    return NextResponse.next()
}

export const config = {
    matcher:  [    '/manage/:path*' ]
  }