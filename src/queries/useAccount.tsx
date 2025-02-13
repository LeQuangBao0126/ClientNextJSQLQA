import accountAPIRequest from "@/apiRequests/account";
import authAPIRequests from "@/apiRequests/auth";
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
 
import {  useMutation, useQuery } from "@tanstack/react-query";


export const useAccountMe  =( onSuccess?:( data :AccountResType )=>void  )  => {
    return useQuery  ({
        queryKey : ['account-profile'],
        queryFn :   accountAPIRequest.me 
    })
}
export const  useUpdateMeMutation = (  ) => { 
    return useMutation({
        mutationFn: (body : UpdateMeBodyType) => accountAPIRequest.updateMe(body)
    })
}