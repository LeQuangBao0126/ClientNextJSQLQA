import http from "@/lib/http"
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema"

const accountAPIRequest = {
    me: () => http.get<AccountResType>('/accounts/me'),
    sMe: (accessToken: string) => http.get<AccountResType>('/accounts/me', { headers: { Authorization: `Bearer ${accessToken}` } }),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body), // route handle nextjs server
}


export default accountAPIRequest