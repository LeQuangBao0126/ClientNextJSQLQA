import { cookies } from "next/headers";
import authAPIRequests from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils";

export async function POST(request: Request) {
    const cookieStore = await cookies()
    try {
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value 

        cookieStore.delete('accessToken')
        cookieStore.delete('refreshToken')

        const result = await authAPIRequests.sLogout({
            accessToken : accessToken as string ,
            refreshToken: refreshToken as string ,
        })

       
        return Response.json(result.payload)
    } catch (error) {
        console.log(error)
        if (error instanceof HttpError) {
            return Response.json({ message: 'Logout that bai' })
        } else {
            return Response.json({ message: 'Something went wrong in server' })
        }
    }
}