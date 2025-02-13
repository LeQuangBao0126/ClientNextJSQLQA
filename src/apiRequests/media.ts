import http from "@/lib/http"
import { UploadImageResType } from "@/schemaValidations/media.schema"

const mediaAPIRequest = {
    upload : ( formData : FormData  )=> http.post<UploadImageResType>('/media/upload' ,  formData    ),  
}


export default mediaAPIRequest