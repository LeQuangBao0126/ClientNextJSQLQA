import authAPIRequests from "@/apiRequests/auth";
 
import {  useQuery } from "@tanstack/react-query";


export const useAccountProfile =() => {
    return useQuery  ({
        queryKey : ['account-profile'],
        queryFn : authAPIRequests.me
    })
}