
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "@/hooks/use-toast"
import jwt from 'jsonwebtoken'
import authAPIRequests from "@/apiRequests/auth"


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const isBrowser = typeof window !== 'undefined'

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
    return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
    error,
    setError,
    duration
}: {
    error: any
    setError?: UseFormSetError<any>
    duration?: number
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((item) => {
            setError(item.field, {
                type: 'server',
                message: item.message
            })
        })
    } else {
        toast({
            title: 'Lỗi',
            description: error?.payload?.message ?? 'Lỗi không xác định',
            variant: 'destructive',
            duration: duration ?? 5000
        })
    }
}

export const getAccessTokenFromLocalStorage = () => {
    return localStorage.getItem('accessToken')
}
export const getRefreshTokenFromLocalStorage = () => {
    return localStorage.getItem('refreshToken')
}
export const setAccessTokenToLocalStorage = (token: string) => {
    localStorage.setItem('accessToken', token)
}
export const setRefreshTokenToLocalStorage = (token: string) => {
    localStorage.setItem('refreshToken', token)
}
export const removeTokensFromLocalStorage = () => {
    isBrowser && localStorage.removeItem('accessToken')
    isBrowser && localStorage.removeItem('refreshToken')
}

export const checkAndRefreshToken = async (params?: {
    onError?: () => void,
    onSuccess?: () => void
}
) => {
 
    const accessToken = getAccessTokenFromLocalStorage() as string
    const refreshToken = getRefreshTokenFromLocalStorage()

    if (!accessToken || !refreshToken) return

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number, iat: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number, iat: number }
    // thời điểm hết hạn của token là s 
    // new Date().getTime() là epochtime là ms 
    const now = Math.round(new Date().getTime() / 1000)

    // refresh hết hạn thì cho lout out ko xử lý . accesstoken hết hạn thì xử lý 
    // thời gian còn lại accessToken = exp  -  now 
    // thời gian hết hạn accessToken = exp -iat 
    if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        // Gọi api refreshToken 
        try {
            console.log("start refresh ")
            const { payload } = await authAPIRequests.refreshToken()
            setAccessTokenToLocalStorage(payload.data.accessToken)
            setRefreshTokenToLocalStorage(payload.data.refreshToken)

            params?.onSuccess && params.onSuccess()

            return 
        } catch (error) {
            //clearInterval(interval)
            params?.onError && params.onError()
        }
    }
} 