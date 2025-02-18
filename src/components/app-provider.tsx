
'use client'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshTokenComponent from './refresh-token'
import { createContext, useContext, useEffect, useState } from 'react'
import { decodedToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: false,
        }
    }
})

const AppContext = createContext({
    isAuth: false,
    role: undefined as RoleType | undefined,
    setRole: (role?: RoleType | undefined) => { },
 

})
// sử dụng useAppContext bất cứ đâu => để lấy trạng thái state chung  của app 
export const useAppContext = () => {
    return useContext(AppContext)
}
export default function AppProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<RoleType | undefined>()

    const setRole = (role: RoleType | undefined) => {
        if (role) {
            setRoleState(role)
        } else {
            removeTokensFromLocalStorage()
        }
    }
    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            // decode and set role for entire app 
            const decoded = decodedToken(accessToken)
            setRoleState(decoded.role)
        }
    }, [])
    const isAuth = Boolean(role)
    return (
        <AppContext value={{ role, setRole, isAuth }} >
            <QueryClientProvider client={queryClient}>
                {children}
                <RefreshTokenComponent />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext>

    )
}
