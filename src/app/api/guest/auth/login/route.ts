
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { HttpError } from "@/lib/http";
import { GuestLoginBodyType } from "@/schemaValidations/guest.schema";
import guestAPIRequests from "@/apiRequests/guest";

export async function POST(request: Request) {
    const body = (await request.json()) as GuestLoginBodyType
    const cookieStore = await cookies()
    try {
        const {payload} = await guestAPIRequests.sLogin(body)
        const { accessToken, refreshToken }   =payload.data
        const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
        const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }
        cookieStore.set('accessToken', accessToken, {
            path: '/',
            sameSite:'lax',
            httpOnly: true,
            secure: true,
            expires: decodedAccessToken.exp * 1000
        })
        cookieStore.set('refreshToken', refreshToken, {
            path: '/',
            sameSite:'lax',
            httpOnly: true,
            secure: true,
            expires: decodedRefreshToken.exp * 1000
        })
        // api tu backend tra ve gi . thi route handler tra ve client nhu v luon
        return Response.json(payload)
    } catch (error) {
       if(error instanceof HttpError){
           return Response.json(error.payload) 
       }  else {
        return Response.json({message :'Something went wrong in server' })
       }
    }
}