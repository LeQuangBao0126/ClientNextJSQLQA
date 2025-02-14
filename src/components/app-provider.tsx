
'use client'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshTokenComponent from './refresh-token'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'

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
    isAuth: false, setIsAuth: (isAuth: boolean) => { }
})
export const useAppContext = () => {
    return useContext(AppContext)
}
export default function AppProvider({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuthState] = useState(false)
    const setIsAuth = ( isAuthen : boolean) => {
        if (isAuthen) {
            setIsAuthState(true )
        } else {
            setIsAuthState(false )
            removeTokensFromLocalStorage()
        }
    }
    useEffect( () => { 
        const accessToken = getAccessTokenFromLocalStorage()
        if(accessToken){
            setIsAuth(true )
        }
    },[ ])
    return (
        <AppContext value={{ isAuth, setIsAuth }} >
            <QueryClientProvider client={queryClient}>
                {children}
                <RefreshTokenComponent />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext>

    )
}
