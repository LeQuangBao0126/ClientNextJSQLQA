import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'




const privatePaths = [ '/manage']
const isAuthPaths= ['/login'  ]

export function middleware(request: NextRequest) {
    const {pathname } =request.nextUrl
    
    const accessToken = Boolean( request.cookies.get('accessToken')?.value )
    const refreshToken = Boolean( request.cookies.get('refreshToken')?.value )

    //chua đang nhập mà vào private path => login 
    if(privatePaths.some(path => pathname.startsWith(path)) && !refreshToken ){
        return NextResponse.redirect( new URL('/login',request.url) )
    }

    // dang nhap roi thi se ko cho vao login nữa
    if(isAuthPaths.some(path => pathname.startsWith(path)) && refreshToken) { 
        return NextResponse.redirect ( new URL('/' , request.url )) 
    } 
    // đăng nhập rồi nhưng access token hết hạn => logout 
    if(privatePaths.some(path => pathname.startsWith(path)) && !accessToken) {  // accesstoken het han 
        const url =new URL('/logout' ,request.url)
        url.searchParams.set('refreshToken', request.cookies.get('refreshToken')?.value ?? "")
        return NextResponse.redirect(url )
    } 
  
    return NextResponse.next()
}

export const config = {
    matcher:  [ '/manage/:path*' ,'/login']
  }