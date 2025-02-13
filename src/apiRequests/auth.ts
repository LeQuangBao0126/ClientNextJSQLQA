import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";
import { LoginBodyType, LoginResType, LogoutBodyType } from "@/schemaValidations/auth.schema";

const authAPIRequests = {
    sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body), // login toi server backend
    login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, { baseUrl: '' }), // route handle nextjs server 
    sLogout: (body: LogoutBodyType & { accessToken: string }) => http.post('/auth/logout', {
        refreshToken: body.refreshToken
    }, {  headers: { Authorization: `Bearer ${body.accessToken}` } }),
    logoutss: () => http.post('/api/auth/logout', null, { baseUrl: '' }), // route handle nextjs server
}


export default authAPIRequests