import dishAPIRequest from "@/apiRequests/dish";
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDishList = () => useQuery({
    queryKey: ['dishes'],
    queryFn: dishAPIRequest.list,
})


export const useGetDish = ({ id, enabled }: { id: number, enabled: boolean }) => {
    return useQuery({
        queryKey: [`dishes`, id],
        queryFn: () => dishAPIRequest.getDish(id),
        enabled: enabled
    })
}

export const useAddDish = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dishAPIRequest.addDish,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: [`dishes`]
        })
    })
}

export const useUpdateDish = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & UpdateDishBodyType) => dishAPIRequest.updateDish(id, body),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: [`dishes`]
        })
    })
}
export const useDeleteDish = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dishAPIRequest.deleteDish,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: [`dishes`]
        })
    })
}