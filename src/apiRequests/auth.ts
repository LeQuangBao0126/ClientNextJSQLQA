import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authAPIRequests = {
    sLogin :(body : LoginBodyType) => http.post<LoginResType>('/auth/login',  body), // login toi server backend
    login:(body : LoginBodyType) => http.post<LoginResType>('/api/auth/login',   body , { baseUrl:''}), // route handle nextjs server 
}


export  default authAPIRequests