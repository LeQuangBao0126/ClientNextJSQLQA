
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "@/hooks/use-toast"
import jwt from 'jsonwebtoken'
import authAPIRequests from "@/apiRequests/auth"
import { DishStatus, OrderStatus, TableStatus } from "@/constants/type"
import envConfig from "@/config"
import { TokenPayload } from "@/types/jwt.types"
import guestAPIRequests from "@/apiRequests/guest"
import { RefreshTokenResType } from "@/schemaValidations/auth.schema"


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

    const decodedAccessToken = decodedToken(accessToken)
    const decodedRefreshToken = decodedToken(refreshToken)
    // thời điểm hết hạn của token là s 
    // new Date().getTime() là epochtime là ms 
    const now = Math.round(new Date().getTime() / 1000)

    // refresh hết hạn thì cho lout out ko xử lý . accesstoken hết hạn thì xử lý 
    // thời gian còn lại accessToken = exp  -  now 
    // thời gian hết hạn accessToken = exp -iat 
    if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        // Gọi api refreshToken 
        try {
            const role = decodedRefreshToken.role

            const res =  role==="Guest" ? await guestAPIRequests.refreshToken() : await authAPIRequests.refreshToken()
           
            setAccessTokenToLocalStorage(res.payload.data.accessToken)
            setRefreshTokenToLocalStorage(res.payload.data.refreshToken)

            params?.onSuccess && params.onSuccess()

            return
        } catch (error) {
            //clearInterval(interval)
            params?.onError && params.onError()
            throw error
        }
    }
}


export const formatCurrency = (number: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
    switch (status) {
        case DishStatus.Available:
            return 'Có sẵn'
        case DishStatus.Unavailable:
            return 'Không có sẵn'
        default:
            return 'Ẩn'
    }
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
    switch (status) {
        case OrderStatus.Delivered:
            return 'Đã phục vụ'
        case OrderStatus.Paid:
            return 'Đã thanh toán'
        case OrderStatus.Pending:
            return 'Chờ xử lý'
        case OrderStatus.Processing:
            return 'Đang nấu'
        default:
            return 'Từ chối'
    }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
    switch (status) {
        case TableStatus.Available:
            return 'Có sẵn'
        case TableStatus.Reserved:
            return 'Đã đặt'
        default:
            return 'Ẩn'
    }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
    return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export const decodedToken = (token: string) => {
    return jwt.decode(token) as TokenPayload
}