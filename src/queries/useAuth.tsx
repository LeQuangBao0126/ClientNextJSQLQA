import authAPIRequests from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const  useLoginMutation  = () =>  useMutation({
    mutationFn: authAPIRequests.login , 
})
 
export const  useLogoutMutation  = () =>  useMutation({
    mutationFn: authAPIRequests.logoutss , 
})

 