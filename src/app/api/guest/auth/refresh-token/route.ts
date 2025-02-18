import { cookies } from "next/headers"
import jwt from 'jsonwebtoken'
import guestAPIRequests from "@/apiRequests/guest"

export async function POST(request: Request) {
     
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refreshToken")?.value

    if(!refreshToken) { 
        return Response.json({
            message :'Không tìm thấy refresh token',
            status : 401 
        })
    }

    try {
        const { payload } = await guestAPIRequests.sRefreshToken( { refreshToken  })
        
        const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }
        const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number }

        cookieStore.set('accessToken', payload.data.accessToken, {
            path: '/',
            sameSite: 'lax',
            httpOnly: true,
            secure: true,
            expires: decodedAccessToken.exp * 1000
        })
        cookieStore.set('refreshToken', payload.data.refreshToken, {
            path: '/',
            sameSite: 'lax',
            httpOnly: true,
            secure: true,
            expires: decodedRefreshToken.exp * 1000
        })
        // api tu backend tra ve gi . thi route handler tra ve client nhu v luon
        return Response.json(payload)
    } catch (error : any ) {
        return Response.json({ message: 'Something went wrong in server when refresh token ' , status:401 })
    }
}