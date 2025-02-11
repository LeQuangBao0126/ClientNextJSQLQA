import { cookies } from "next/headers";
import authAPIRequests from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
    const cookieStore = await cookies()
    try {
        const result = await authAPIRequests.sLogout({
            accessToken: cookieStore.get('accessToken')?.value as string,
            refreshToken: cookieStore.get('refreshToken')?.value as string,
        })

        cookieStore.delete('accessToken')
        cookieStore.delete('refreshToken')
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