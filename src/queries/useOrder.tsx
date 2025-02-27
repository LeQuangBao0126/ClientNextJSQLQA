/// Order nay dành cho admin 

import orderAPIRequest from "@/apiRequests/order";
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderMutation = ( )=> useMutation( { 
    mutationFn:( {orderId ,  ...body} :  UpdateOrderBodyType &{orderId:number})=>  orderAPIRequest.updateOrder(orderId, body)
})

export const useGetOrderListQuery = ( )=> useQuery({
    queryKey:['orders-list'],
    queryFn:  orderAPIRequest.getOrderList
})