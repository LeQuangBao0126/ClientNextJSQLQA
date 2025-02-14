import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";

const authAPIRequests = {
    refreshTokenRequest : null  as Promise<{status : number , payload :RefreshTokenResType  }>  | null , 

    sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body), // login toi server backend
    login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, { baseUrl: '' }), // route handle nextjs server 
    sLogout: (body: LogoutBodyType & { accessToken: string }) => http.post('/auth/logout', {
        refreshToken: body.refreshToken
    }, {  headers: { Authorization: `Bearer ${body.accessToken}` } }),
    logoutss: () => http.post('/api/auth/logout', null, { baseUrl: '' }), // route handle nextjs server
    sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),   // server backend 
    
    async refreshToken  (){
        if(this.refreshTokenRequest){
            return this.refreshTokenRequest
        }
        this.refreshTokenRequest = http.post<RefreshTokenResType>('api/auth/refresh-token' ,null , {baseUrl:''}) 
        const  result = await this.refreshTokenRequest
        this.refreshTokenRequest = null  // reset lại promisse này 
        return result
    }
}


export default authAPIRequests