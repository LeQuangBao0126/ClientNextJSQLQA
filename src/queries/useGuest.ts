 
import guestAPIRequests from "@/apiRequests/guest";
import { useMutation } from "@tanstack/react-query";

export const  useGuestLoginMutation  = () =>  useMutation({
    mutationFn: guestAPIRequests.login , 
})
 
export const  useGuestLogoutMutation  = () =>  useMutation({
    mutationFn: guestAPIRequests.logoutss , 
})

 