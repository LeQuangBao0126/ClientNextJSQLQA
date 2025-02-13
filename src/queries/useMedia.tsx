import mediaAPIRequest from "@/apiRequests/media";
import { useMutation } from "@tanstack/react-query";

export const  useUploadMediaMutation  = ( ) =>  useMutation({
    mutationFn: (formData: FormData) => mediaAPIRequest.upload(formData), 
})
