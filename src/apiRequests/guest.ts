import http from "@/lib/http";
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";
import { GuestCreateOrdersBodyType, GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";

const prefix = '/guest'
const guestAPIRequests = {
    refreshTokenRequest: null as Promise<{ status: number, payload: RefreshTokenResType }> | null,

    sLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>(`${prefix}/auth/login`, body), // login toi server backend
    login: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/api/guest/auth/login', body, { baseUrl: '' }), // route handle nextjs server 
    sLogout: (body: LogoutBodyType & { accessToken: string }) => http.post<MessageResType>(`${prefix}/auth/logout`, {
        refreshToken: body.refreshToken
    }, { headers: { Authorization: `Bearer ${body.accessToken}` } }),

    logoutss: () => http.post('/api/guest/auth/logout', null, { baseUrl: '' }),

    sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>(`${prefix}/auth/refresh-token`, body),   // server backend 

    async refreshToken() {
        try {
            if (this.refreshTokenRequest) {
                return this.refreshTokenRequest
            }
            this.refreshTokenRequest = http.post<RefreshTokenResType>(`api/guest/auth/refresh-token`, null, { baseUrl: '' })
            const result = await this.refreshTokenRequest
            this.refreshTokenRequest = null   
            return result
        } catch (error) {
                throw error
        }
    },

    order: (body :GuestCreateOrdersBodyType ) => http.post<GuestCreateOrdersResType>(`${prefix}/orders`,  body  ),
    getOrderList :() => http.get<GuestGetOrdersResType>(`${prefix}/orders`),
}


export default guestAPIRequests