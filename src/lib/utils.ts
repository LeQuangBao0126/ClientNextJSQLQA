
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "@/hooks/use-toast"
import jwt from 'jsonwebtoken'
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type"
import envConfig from "@/config"
import { TokenPayload } from "@/types/jwt.types"
import guestAPIRequests from "@/apiRequests/guest"
import { format } from 'date-fns'
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'
import authAPIRequests from "@/apiRequests/auth"
import { redirect } from "next/navigation"
 
 

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
    isBrowser && localStorage.setItem('accessToken', token)
}
export const setRefreshTokenToLocalStorage = (token: string) => {
    isBrowser && localStorage.setItem('refreshToken', token)
}
export const removeTokensFromLocalStorage = () => {
    isBrowser && localStorage.removeItem('accessToken')
    isBrowser && localStorage.removeItem('refreshToken')
}

export const checkAndRefreshToken = async (param?: {
    onError?: () => void
    onSuccess?: () => void
    force?: boolean
}) => {
    console.log("check refresh >>> ")
    // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
    // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
    // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
    const accessToken = getAccessTokenFromLocalStorage()
    const refreshToken = getRefreshTokenFromLocalStorage()
    // Chưa đăng nhập thì cũng không cho chạy
    if (!accessToken || !refreshToken) return
    const decodedAccessToken = decodedToken(accessToken)
    const decodedRefreshToken = decodedToken(refreshToken)
    // Thời điểm hết hạn của token là tính theo epoch time (s)
    // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
    const now =  (new Date().getTime() / 1000 ) -1 
    // trường hợp refresh token hết hạn thì cho logout
    if (decodedRefreshToken.exp <= now) {
        console.log("Refresh token đã hết hạn")
        removeTokensFromLocalStorage()
        redirect("/login")
    }
    // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
    // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
    // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
    // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
    if (
        param?.force ||
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
    ) {
        // Gọi API refresh token
        try {
            const role = decodedRefreshToken.role
          
            const res =  role === Role.Guest ? await guestAPIRequests.refreshToken() : await authAPIRequests.refreshToken()


            setAccessTokenToLocalStorage(res.payload.data.accessToken)
            setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
            param?.onSuccess && param.onSuccess()
        } catch (error) {
            param?.onError && param.onError()
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


export function removeAccents(str: string) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
    return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
    return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
    return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const OrderStatusIcon = {
    [OrderStatus.Pending]: Loader,
    [OrderStatus.Processing]: CookingPot,
    [OrderStatus.Rejected]: BookX,
    [OrderStatus.Delivered]: Truck,
    [OrderStatus.Paid]: HandCoins
}


