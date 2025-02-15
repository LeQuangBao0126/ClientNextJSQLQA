import accountAPIRequest from "@/apiRequests/account";
import authAPIRequests from "@/apiRequests/auth";
import { AccountResType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useAccountMe = (onSuccess?: (data: AccountResType) => void) => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: accountAPIRequest.me
    })
}
export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: (body: UpdateMeBodyType) => accountAPIRequest.updateMe(body)
    })
}

export const useGetAccountList = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: accountAPIRequest.list
    })
}

export const useGetAccount = ({ id }: { id: number }) => {
    return useQuery({
        queryKey: [`account`, id],
        queryFn: () => accountAPIRequest.getEmployee(id)
    })
}
export const useAddAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountAPIRequest.addEmployee,
        onSuccess: () => queryClient.invalidateQueries({
            // add thanh cong thi invalidate để load lại danh sách
            queryKey: [`accounts `]
        })
    })
}

export const useUpdateAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        // kiểu id và 1 số field trong body 
        mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => {
            return accountAPIRequest.updateEmployee(id, body)
        },
        onSuccess: () => queryClient.invalidateQueries({
            // add thanh cong thi invalidate để load lại danh sách
            queryKey: [`accounts `]
        })
    })
}

export const useDeleteAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountAPIRequest.deleteEmployee,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: [`accounts `]
        })
    })
}


