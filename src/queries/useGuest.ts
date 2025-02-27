 
import guestAPIRequests from "@/apiRequests/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const  useGuestLoginMutation  = () =>  useMutation({
    mutationFn: guestAPIRequests.login , 
})
 
export const  useGuestLogoutMutation  = () =>  useMutation({
    mutationFn: guestAPIRequests.logoutss , 
})

export const useGuestOrderMutation = () => useMutation({
    mutationFn: guestAPIRequests.order , 
})

export const useGuestGetOrderListQuery = ( )=> useQuery({
    queryKey:['orders'],
    queryFn: guestAPIRequests.getOrderList
})