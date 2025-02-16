import tableAPIRequest from "@/apiRequests/table"
import { UpdateTableBodyType } from "@/schemaValidations/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetTableListQuery = () => useQuery({
    queryKey: ['tables'],
    queryFn: tableAPIRequest.list,
})


export const useGetTableQuery = ({ id, enabled }: { id: number, enabled: boolean }) => {
    return useQuery({
        queryKey: [`tables`, id],
        queryFn: () => tableAPIRequest.getTable(id),
        enabled: enabled
    })
}

export const useAddTable = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: tableAPIRequest.addTable,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: [`tables`],
            exact: true 
        })
    })
}

export const useUpdateTable = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & UpdateTableBodyType) => tableAPIRequest.updateTable(id, body),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: [`tables`]
        })
    })
}
export const useDeleteTable = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: tableAPIRequest.deleteTable,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: [`tables`]
        })
    })
}